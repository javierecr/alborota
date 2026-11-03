import { computed, type ComputedRef, type Ref } from 'vue';
import { useFormatMoney } from '~/composables/useFormatMoney';
import {
  defaultOptionSelection,
  optionKey,
  visibleOptions,
  type OptionSelection,
} from '~/utils/productOptionMeta';
import type { Product, Variant } from '~/types/product';

/**
 * Matches the selected options to a Shopify variant and derives everything that
 * follows from it: price, availability per option value, the quantity ceiling
 * and the per-size dimensions hint.
 */
export const useProductVariants = (
  product: Ref<Product | null | undefined> | ComputedRef<Product | null | undefined>,
  selection: Ref<OptionSelection> | ComputedRef<OptionSelection>,
) => {
  const { formatMoney } = useFormatMoney();

  const options = computed(() => visibleOptions(product.value));
  const variants = computed(() => product.value?.variants?.nodes ?? []);

  /** Name → selected value, keyed the way Shopify's `selectedOptions` are. */
  const selectedByName = computed<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    options.value.forEach((option, index) => {
      const value = selection.value?.[optionKey(index)];
      if (value) out[option.name] = value;
    });
    return out;
  });

  /** The first variant whose every option matches the current selection. */
  const selectedVariant = computed<Variant | null>(() => {
    if (!variants.value.length) return null;
    // Single-variant products have nothing to pick, so the lone variant wins.
    if (!options.value.length) return variants.value[0] ?? null;
    return (
      variants.value.find((variant) =>
        variant.selectedOptions.every((option) => selectedByName.value[option.name] === option.value),
      ) ?? null
    );
  });

  /**
   * Whether a value is still reachable given the options chosen *before* it.
   * Narrowing only by prior options is what lets a shopper change an earlier
   * choice without getting stuck on an impossible combination.
   */
  const isOptionValueAvailable = (optionName: string, value: string, optionIndex: number): boolean => {
    const priorNames = new Set(options.value.slice(0, optionIndex).map((o) => o.name));
    return variants.value.some((variant) => {
      if (!variant.availableForSale) return false;
      return variant.selectedOptions.every((opt) => {
        if (opt.name === optionName) return opt.value === value;
        if (!priorNames.has(opt.name)) return true;
        const current = selectedByName.value[opt.name];
        return !current || current === opt.value;
      });
    });
  };

  const defaultSelection = computed<OptionSelection>(() => defaultOptionSelection(product.value));

  const formattedPrice = computed(() => {
    const price = selectedVariant.value?.price ?? product.value?.priceRange?.minVariantPrice;
    if (!price) return '';
    return formatMoney(price.amount, price.currencyCode, { withCode: false });
  });

  /**
   * Inventory is not tracked on this catalogue, so Shopify reports
   * `quantityAvailable: 0` alongside `availableForSale: true`. Trusting it
   * blindly would pin the stepper to zero on every product.
   */
  const maxQuantity = computed(() => {
    const available = selectedVariant.value?.quantityAvailable ?? 0;
    return available > 0 ? available : 99;
  });

  /** `custom.dimensiones` on the matched variant, e.g. "12cm x 24cm". */
  const dimensionsHint = computed(() => selectedVariant.value?.metafield?.value?.trim() ?? '');

  return {
    options,
    selectedByName,
    selectedVariant,
    defaultSelection,
    isOptionValueAvailable,
    formattedPrice,
    maxQuantity,
    dimensionsHint,
  };
};
