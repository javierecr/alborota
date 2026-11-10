import { z } from 'zod';

const schema = z.object({
  first: z.preprocess((v) => (v === undefined ? 3 : Number(v)), z.number().min(1).max(10)).default(3),
  intent: z.enum(['RELATED', 'COMPLEMENTARY']).default('RELATED'),
});

const VARIANT_FIELDS = `#graphql
  fragment VariantFields on ProductVariant {
    id title sku availableForSale quantityAvailable
    price { amount currencyCode }
    compareAtPrice { amount currencyCode }
    selectedOptions { name value }
    image { url altText }
  }
`;

/**
 * Unlike every other products query here, `productRecommendations` returns a
 * plain list — not a connection. There is no `nodes` wrapper and no `first`
 * argument: Shopify decides how many to return (up to ~10), so the cap is
 * applied after the fact. The product selection matches GetProducts in
 * server/api/products.ts so the result stays assignable to `Product`.
 */
const recommendationsQuery = `#graphql
  ${VARIANT_FIELDS}
  query GetProductRecommendations($handle: String!, $intent: ProductRecommendationIntent) {
    productRecommendations(productHandle: $handle, intent: $intent) {
      id title handle description
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      featuredImage { url altText }
      images(first: 5) { nodes { url altText } }
      variants(first: 10) { nodes { ...VariantFields } }
      collections(first: 3) { nodes { handle } }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle');

  if (!handle) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el handle del producto' });
  }

  const { first, intent } = await getValidatedQuery(event, schema.parse);
  const storefront = useStorefront();

  const result = await storefront.request(recommendationsQuery, {
    variables: { handle, intent },
  });

  // An empty list is a valid answer, not a 404: Shopify's recommendation engine
  // needs order history, so a young store can legitimately return nothing. The
  // caller hides the row instead of erroring.
  const nodes = result.data?.productRecommendations ?? [];

  return { nodes: nodes.slice(0, first) };
});
