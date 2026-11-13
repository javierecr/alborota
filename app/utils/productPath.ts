import type { Product } from '~/types/product';

/**
 * Product page URL. Uses the explicit collection when given, otherwise the
 * product's first collection, and falls back to the category-less route.
 */
export function productPath(
  product: Pick<Product, 'handle' | 'collections'>,
  collectionHandle?: string | null,
): string {
  const category = collectionHandle ?? product.collections?.nodes?.[0]?.handle;
  return category
    ? `/tienda/${category}/${product.handle}`
    : `/tienda/${product.handle}`;
}
