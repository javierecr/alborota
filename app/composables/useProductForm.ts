import { computed, reactive, ref, watch, type ComputedRef, type Ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useCart, type CartAttribute } from '~/composables/useCart';
import { useProductVariants } from '~/composables/useProductVariants';
import {
  defaultOptionSelection,
  optionKey,
  visibleOptions,
  type OptionSelection,
} from '~/utils/productOptionMeta';
import type { Product } from '~/types/product';

export type ProductFormValues = {
  options: OptionSelection;
  quantity: number;
  message?: string;
  deliveryDate?: string;
  deliveryPlace?: string;
};

const SETTLE_MS = 350;
const SUCCESS_MS = 2000;

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * The product form: a yup schema derived from whatever options Shopify returns,
 * plus the three personalizable fields, wired to `useCart().addToCart`.
 *
 * Server-side input is still validated with zod in `server/api/**` — yup is the
 * client-side form contract only, and the two are deliberately separate.
 */
export const useProductForm = (product: Ref<Product | null | undefined> | ComputedRef<Product | null | undefined>) => {
  const { addToCart } = useCart();

  const options = computed(() => visibleOptions(product.value));
  const isPersonalizable = computed(() => product.value?.tags?.includes('personalizable') ?? false);
  const minDate = ref(todayIso());

  /**
   * The quantity ceiling comes from the matched variant, which comes from the
   * form's own values — so it is held in a ref the schema can read, and fed
   * from `useProductVariants` once the form exists.
   */
  const quantityMax = ref(99);

  const schema = computed(() => {
    const optionShape = Object.fromEntries(
      options.value.map((option, index) => [
        optionKey(index),
        yup.string().required(`Elige ${option.name.toLowerCase()}.`).oneOf(option.values, 'Opción no válida.'),
      ]),
    );

    const base = {
      options: yup.object(optionShape),
      quantity: yup
        .number()
        .typeError('Cantidad inválida.')
        .required('Indica una cantidad.')
        .integer('Usa un número entero.')
        .min(1, 'Mínimo 1.')
        .max(quantityMax.value, `Solo quedan ${quantityMax.value}.`),
    };

    if (!isPersonalizable.value) return yup.object(base);

    return yup.object({
      ...base,
      message: yup.string().max(500, 'Máximo 500 caracteres.'),
      // Validated as a string against today's ISO date: <input type="date">
      // emits YYYY-MM-DD, and yup.date() would reintroduce timezone drift.
      deliveryDate: yup
        .string()
        .required('Elige una fecha de entrega.')
        .test('not-past', 'La fecha debe ser hoy o posterior.', (value) => !!value && value >= minDate.value),
      deliveryPlace: yup.string().trim().required('Indica el lugar de entrega.').min(3, 'Muy corto.'),
    });
  });

  const initialValues = computed<ProductFormValues>(() => ({
    options: defaultOptionSelection(product.value),
    quantity: 1,
    message: '',
    deliveryDate: '',
    deliveryPlace: '',
  }));

  const { handleSubmit, values, errors, setFieldValue, resetForm, isSubmitting, submitCount } =
    useForm<ProductFormValues>({
      validationSchema: computed(() => toTypedSchema(schema.value)),
      // Snapshot, not the computed: the schema is dynamic, so vee-validate
      // types `initialValues` against the schema's own output rather than
      // ProductFormValues. Navigating to another product re-seeds the form
      // through the `resetForm` in the watch below.
      initialValues: initialValues.value,
    });

  /**
   * vee-validate keeps `errors` populated from the moment the schema runs, so a
   * freshly-loaded form would shout "Elige una fecha de entrega" at someone who
   * hasn't touched anything. Messages only surface once a field has been
   * blurred, or once the form has been submitted at least once.
   */
  const touched = reactive<Record<string, boolean>>({});
  const touch = (path: string) => { touched[path] = true; };
  const fieldError = (path: string): string | undefined =>
    submitCount.value > 0 || touched[path]
      ? (errors.value as Record<string, string | undefined>)[path]
      : undefined;

  const selection = computed<OptionSelection>(() => values.options ?? {});
  const variants = useProductVariants(product, selection);

  watch(variants.maxQuantity, (value) => { quantityMax.value = value; }, { immediate: true });

  // --- submission -----------------------------------------------------------

  const formError = ref('');
  const justAdded = ref(false);
  let successTimer: ReturnType<typeof setTimeout> | undefined;

  // Navigating between two product pages reuses this component, so start over.
  watch(
    () => product.value?.handle,
    () => {
      resetForm({ values: initialValues.value });
      Object.keys(touched).forEach((key) => { delete touched[key]; });
      formError.value = '';
      justAdded.value = false;
    },
  );

  const buildAttributes = (v: Partial<ProductFormValues>): CartAttribute[] | undefined => {
    if (!isPersonalizable.value) return undefined;
    // Empty optional fields are dropped so they don't split the cart line.
    const attrs = [
      { key: 'Mensaje Personalizado', value: (v.message ?? '').trim() },
      { key: 'Fecha de entrega', value: v.deliveryDate ?? '' },
      { key: 'Lugar de entrega', value: (v.deliveryPlace ?? '').trim() },
    ].filter((a) => a.value);
    return attrs.length ? attrs : undefined;
  };

  // The schema is built at runtime, so vee-validate can't infer the submitted
  // shape; it is ProductFormValues by construction.
  const onSubmit = handleSubmit(async (submitted) => {
    const v = submitted as Partial<ProductFormValues>;
    const currentProduct = product.value;
    const variant = variants.selectedVariant.value;
    formError.value = '';

    if (!currentProduct || !variant) {
      formError.value = 'Esta combinación no está disponible.';
      return;
    }
    if (!variant.availableForSale) {
      formError.value = 'Este producto está agotado.';
      return;
    }

    addToCart({
      variantId: variant.id,
      productHandle: currentProduct.handle,
      title: currentProduct.title,
      variantTitle: variant.title,
      price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode },
      image: currentProduct.featuredImage ?? variant.image ?? null,
      quantity: v.quantity ?? 1,
      attributes: buildAttributes(v),
    });

    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

    // Keep the chosen options, clear quantity and the personalizable fields.
    resetForm({ values: { ...initialValues.value, options: { ...v.options } } });
    Object.keys(touched).forEach((key) => { delete touched[key]; });

    justAdded.value = true;
    clearTimeout(successTimer);
    successTimer = setTimeout(() => { justAdded.value = false; }, SUCCESS_MS);
  });

  const isSoldOut = computed(() => variants.selectedVariant.value?.availableForSale === false);
  const hasNoVariant = computed(() => !variants.selectedVariant.value);

  const submitLabel = computed(() => {
    if (hasNoVariant.value) return 'No disponible';
    if (isSoldOut.value) return 'Agotado';
    if (isSubmitting.value) return 'Agregando…';
    if (justAdded.value) return 'Agregado';
    return 'Agregar';
  });

  const submitDisabled = computed(
    () => hasNoVariant.value || isSoldOut.value || isSubmitting.value || justAdded.value,
  );

  return {
    ...variants,
    values,
    errors,
    fieldError,
    touch,
    setFieldValue,
    isSubmitting,
    isPersonalizable,
    minDate,
    formError,
    onSubmit,
    submitLabel,
    submitDisabled,
  };
};
