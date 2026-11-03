import type { Product, ProductOption } from '~/types/product';

/** Shopify's option name for the colour palettes; rendered as swatches, not a select. */
export const PALETTE_OPTION_NAME = 'Paleta de Colores';

/**
 * Shopify gives single-variant products a dummy `Title / Default Title` option.
 * Rendering it would put a pointless "Title:" select on every simple product.
 */
export const visibleOptions = (product: Product | null | undefined): ProductOption[] =>
  (product?.options ?? []).filter((o) => !(o.name === 'Title' && o.values.length === 1));

/**
 * vee-validate parses `.` and `[]` in field paths, and Shopify option names are
 * merchant data ("Paleta de Colores"), so options are addressed by index.
 * Paths look like `options.opt0`.
 */
export const optionKey = (index: number): string => `opt${index}`;

export const optionFieldPath = (index: number): string => `options.${optionKey(index)}`;

/** Form shape for the option fields: { opt0: 'Chico', opt1: 'Paleta 1' }. */
export type OptionSelection = Record<string, string>;

/**
 * Initial selection: whatever the first purchasable variant has selected,
 * falling back to each option's first value.
 *
 * Kept as a pure function (rather than living in `useProductVariants`) because
 * the form needs it to build `initialValues` *before* there are any values for
 * `useProductVariants` to read.
 */
export const defaultOptionSelection = (product: Product | null | undefined): OptionSelection => {
  const variants = product?.variants?.nodes ?? [];
  const variant = variants.find((v) => v.availableForSale) ?? variants[0] ?? null;
  const out: OptionSelection = {};
  visibleOptions(product).forEach((option, index) => {
    const fromVariant = variant?.selectedOptions.find((o) => o.name === option.name)?.value;
    out[optionKey(index)] = fromVariant ?? option.values[0] ?? '';
  });
  return out;
};
