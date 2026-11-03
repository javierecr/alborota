import { computed, reactive, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useCloudinaryUpload } from '~/composables/useCloudinaryUpload';
import { todayLocalIso } from '~/utils/localDate';
import { PIECE_TYPE_VALUES, STYLE_VALUES } from '~/utils/quoteOptions';

export type QuoteFormValues = {
  nombre: string;
  email: string;
  tipoDePieza: string;
  estilo: string;
  lugarEvento: string;
  infoAdicional: string;
  /** Kept as a string: the control is `type="text" inputmode="numeric"`, which
   *  avoids the native spinners no design here wants. Coerced at submit. */
  cantidad: string;
  /** 'YYYY-MM-DD'. */
  fechaEntrega: string;
  imagenes: File[];
};

const MAX_IMAGES = 5;
const MAX_INFO_CHARS = 1000;

const emptyValues = (): QuoteFormValues => ({
  nombre: '',
  email: '',
  tipoDePieza: '',
  estilo: '',
  lugarEvento: '',
  infoAdicional: '',
  cantidad: '',
  fechaEntrega: '',
  imagenes: [],
});

/**
 * The Cotizar quote form: a yup schema, Cloudinary uploads for the reference
 * images, and a Formspark submission.
 *
 * Mirrors useProductForm deliberately — same vee-validate setup, same
 * touched/fieldError discipline so messages only surface after a blur or a
 * submit attempt, same string-first treatment of dates. Server input is still
 * validated with zod in `server/api/**`; yup is the client contract only.
 */
export const useQuoteForm = () => {
  const { formspark } = useRuntimeConfig().public;
  const { uploadAll, uploading, isConfigured: canUploadImages } = useCloudinaryUpload();

  const minDate = ref(todayLocalIso());

  const schema = yup.object({
    nombre: yup.string().trim().required('Escribe tu nombre.'),
    email: yup.string().trim().required('Escribe tu correo.').email('Revisa el correo.'),
    // '' is whitelisted so `required` is what reports an untouched dropdown.
    // Without it `oneOf` fails first and an empty select reads "Opción no
    // válida.", which blames the visitor for not having chosen yet.
    tipoDePieza: yup
      .string()
      .required('Elige un tipo de pieza.')
      .oneOf(['', ...PIECE_TYPE_VALUES], 'Opción no válida.'),
    estilo: yup.string().required('Elige un estilo.').oneOf(['', ...STYLE_VALUES], 'Opción no válida.'),
    lugarEvento: yup.string().trim().required('Indica el lugar de entrega.').min(3, 'Muy corto.'),
    infoAdicional: yup.string().max(MAX_INFO_CHARS, `Máximo ${MAX_INFO_CHARS} caracteres.`),
    // Validated as a string for the same reason as deliveryDate in
    // useProductForm: yup.number() would coerce and desync the text control.
    cantidad: yup
      .string()
      .required('Indica una cantidad.')
      .matches(/^\d+$/, 'Usa solo números enteros.')
      .test('min', 'Mínimo 1.', (value) => Number(value) >= 1)
      .test('max', 'Máximo 999.', (value) => Number(value) <= 999),
    fechaEntrega: yup
      .string()
      .required('Elige una fecha de entrega.')
      .test('not-past', 'La fecha debe ser hoy o posterior.', (value) => !!value && value >= minDate.value),
    imagenes: yup
      .array()
      .of(yup.mixed<File>().required())
      .max(MAX_IMAGES, `Máximo ${MAX_IMAGES} imágenes.`),
  });

  const { handleSubmit, defineField, validateField, errors, resetForm, isSubmitting, submitCount } =
    useForm<QuoteFormValues>({
      validationSchema: toTypedSchema(schema),
      initialValues: emptyValues(),
    });

  /**
   * Every path is registered with `defineField`, and the form is driven through
   * the models it returns.
   *
   * This is load-bearing, not style. An earlier version drove the same schema
   * with bare `setFieldValue` calls on unregistered paths, and editing a field
   * *cleared* its error rather than recomputing it: typing an invalid "0" into
   * `cantidad` removed `errors.cantidad` entirely, even though the schema
   * rejects it, and the field only spoke again after a submit ran the whole
   * schema at once. Registering the fields fixes it. If you refactor this,
   * re-check that an invalid edit still reports before the first submit.
   */
  const [nombre] = defineField('nombre');
  const [email] = defineField('email');
  const [tipoDePieza] = defineField('tipoDePieza');
  const [estilo] = defineField('estilo');
  const [lugarEvento] = defineField('lugarEvento');
  const [infoAdicional] = defineField('infoAdicional');
  const [cantidad] = defineField('cantidad');
  const [fechaEntrega] = defineField('fechaEntrega');
  const [imagenes] = defineField('imagenes');

  // `reactive` unwraps the refs, so `fields.nombre` reads and writes the value.
  const fields = reactive({
    nombre,
    email,
    tipoDePieza,
    estilo,
    lugarEvento,
    infoAdicional,
    cantidad,
    fechaEntrega,
    imagenes,
  });

  /**
   * Which fields the visitor has engaged with. A message surfaces only once its
   * field has been edited or blurred, or once the form has been submitted at
   * least once — otherwise a freshly-loaded form shouts at someone who has not
   * touched anything yet.
   */
  const touched = reactive<Record<string, boolean>>({});

  /**
   * Marks a field engaged-with and evaluates it. The validate call is what makes
   * blur work: registered fields are not validated on mount, so without it,
   * leaving an untouched required field empty produces no message at all —
   * `errors` simply has no entry for that path yet.
   */
  const touch = (path: string) => {
    touched[path] = true;
    validateField(path as never);
  };

  const fieldError = (path: string): string | undefined =>
    submitCount.value > 0 || touched[path]
      ? (errors.value as Record<string, string | undefined>)[path]
      : undefined;

  /** Writing through here means a change also marks the field touched. */
  const setField = (name: keyof QuoteFormValues, value: unknown) => {
    (fields as Record<string, unknown>)[name] = value;
    touch(name);
  };

  // --- images -----------------------------------------------------------------
  // The drop zone rejects files for reasons the schema can't see (wrong type,
  // too large), so its message sits alongside the schema's own.

  const imageRejection = ref('');
  const setImageRejection = (message: string) => { imageRejection.value = message; };
  const imagesError = computed(() => fieldError('imagenes') || imageRejection.value || undefined);

  // --- submission -------------------------------------------------------------

  const formError = ref('');
  const submitted = ref(false);
  const honeypot = ref('');

  const clearTouched = () => {
    for (const key of Object.keys(touched)) delete touched[key];
  };

  const onSubmit = handleSubmit(async (submittedValues) => {
    const v = submittedValues as QuoteFormValues;
    formError.value = '';

    if (!formspark?.formId) {
      formError.value = 'El formulario no está configurado todavía. Escríbenos por correo mientras tanto.';
      return;
    }

    const files = v.imagenes ?? [];

    if (files.length && !canUploadImages.value) {
      formError.value =
        'La carga de imágenes no está disponible por ahora. Envía tu solicitud sin imágenes y te las pediremos por correo.';
      return;
    }

    let imageUrls: string[] = [];
    try {
      imageUrls = await uploadAll(files);
    } catch {
      formError.value = 'No pudimos subir las imágenes de referencia. Revisa tu conexión e inténtalo de nuevo.';
      return;
    }

    try {
      await $fetch(`https://submit-form.com/${formspark.formId}`, {
        method: 'POST',
        // Without `Accept: application/json` Formspark answers with a redirect
        // instead of JSON, and $fetch follows it.
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: {
          // Spanish keys so the Formspark dashboard reads like the form does.
          Nombre: v.nombre.trim(),
          'Correo electrónico': v.email.trim(),
          'Tipo de pieza': v.tipoDePieza,
          Estilo: v.estilo,
          'Lugar de evento (entrega)': v.lugarEvento.trim(),
          'Información adicional': v.infoAdicional?.trim() ?? '',
          Cantidad: Number(v.cantidad),
          'Fecha de entrega': v.fechaEntrega,
          'Imágenes de referencia': imageUrls,
          _email: { subject: `Nueva cotización — ${v.nombre.trim()}` },
          _honeypot: honeypot.value,
        },
      });
    } catch {
      formError.value = 'No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento.';
      return;
    }

    submitted.value = true;
    resetForm({ values: emptyValues() });
    clearTouched();
    imageRejection.value = '';
  });

  const submitLabel = computed(() => {
    if (uploading.value) return 'Subiendo imágenes…';
    if (isSubmitting.value) return 'Enviando…';
    return 'Solicitar cotización';
  });

  return {
    fields,
    fieldError,
    touch,
    setField,
    minDate,
    maxImages: MAX_IMAGES,
    maxInfoChars: MAX_INFO_CHARS,
    imagesError,
    setImageRejection,
    honeypot,
    formError,
    submitted,
    isSubmitting,
    onSubmit,
    submitLabel,
    submitDisabled: computed(() => isSubmitting.value),
  };
};
