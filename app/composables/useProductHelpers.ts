import { ref } from 'vue';
import { useCart } from '~/composables/useCart';
import type { Product, Variant } from '~/types/product';

const extractVariant = (
  product: Product,
  predicate?: (variant: Variant) => boolean
): Variant | null => {
  const variants = product.variants?.nodes ?? [];

  if (!variants.length) return null;

  if (predicate) {
    const match = variants.find(predicate);
    if (match) return match;
  }

  return variants[0] ?? null;
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useProductHelpers = () => {
  const { addToCart } = useCart();
  const addingToCart = ref<string | null>(null);
  const addedToCart = ref<string | null>(null);

  const hasAvailableVariant = (product: Product) => {
    return (
      product.variants?.nodes?.some((variant) => variant.availableForSale) ??
      false
    );
  };

  const findFirstAvailableVariant = (product: Product): Variant | null => {
    return extractVariant(product, (variant) => variant.availableForSale);
  };

  const addProductToCart = async (product: Product) => {
    const variant = findFirstAvailableVariant(product);
    if (!variant?.price) return;

    try {
      addingToCart.value = product.id;

      addToCart({
        variantId: variant.id,
        productHandle: product.handle,
        title: product.title,
        variantTitle: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
        },
        image: product.featuredImage ?? variant.image ?? null,
        quantity: 1,
      });

      await delay(350);
      addingToCart.value = null;
      addedToCart.value = product.id;

      await delay(1500);
      addedToCart.value = null;
    } catch {
      addingToCart.value = null;
      addedToCart.value = null;
    }
  };

  return {
    addingToCart,
    addedToCart,
    hasAvailableVariant,
    findFirstAvailableVariant,
    addProductToCart,
  };
};
