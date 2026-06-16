import { z } from 'zod';

const schema = z.object({
  first: z.preprocess((v) => Number(v), z.number().min(1).max(250)).default(24),
});

const collectionByHandleQuery = `#graphql
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: $first) {
        nodes {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          featuredImage { url altText }
          images(first: 5) { nodes { url altText } }
          variants(first: 10) {
            nodes {
              id
              title
              sku
              availableForSale
              quantityAvailable
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
              image { url altText }
            }
          }
          collections(first: 3) { nodes { handle } }
        }
      }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle');
  if (!handle) throw createError({ statusCode: 400, statusMessage: 'Collection handle required' });

  const { first } = await getValidatedQuery(event, schema.parse);
  const storefront = useStorefront();

  const result = await storefront.request(collectionByHandleQuery, { variables: { handle, first } });
  if (!result.data?.collection) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' });
  }

  return result.data.collection;
});
