import type { SelectOption } from '~/components/ui/SelectControl.vue';

/**
 * Dropdown choices for the Cotizar form.
 *
 * Hardcoded rather than authored in Prismic: they change rarely and the form's
 * yup schema validates against them with `oneOf`, so the two have to move
 * together anyway.
 *
 * TODO: confirm both lists with the client before launch — these are seeded
 * from the catalogue and are a starting point, not a final taxonomy.
 */

export const PIECE_TYPES: SelectOption[] = [
  { value: 'Centro de mesa' },
  { value: 'Piñata' },
  { value: 'Topper de pastel' },
  { value: 'Flores de papel' },
  { value: 'Backdrop / Mural' },
  { value: 'Letrero / Letras' },
  { value: 'Instalación' },
  { value: 'Otro' },
];

export const STYLES: SelectOption[] = [
  { value: 'Clásico' },
  { value: 'Moderno' },
  { value: 'Minimalista' },
  { value: 'Colorido' },
  { value: 'Temático' },
  { value: 'Infantil' },
  { value: 'Otro' },
];

export const PIECE_TYPE_VALUES = PIECE_TYPES.map((option) => option.value);
export const STYLE_VALUES = STYLES.map((option) => option.value);
