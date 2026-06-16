import { z } from 'zod';

const schema = z.object({
  first: z.preprocess((v) => Number(v), z.number().min(1).max(250)),
  collectionId: z.string().optional(),
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

const allProductsQuery = `#graphql
  ${VARIANT_FIELDS}
  query GetProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
        featuredImage { url altText }
        images(first: 5) { nodes { url altText } }
        variants(first: 10) { nodes { ...VariantFields } }
      }
    }
  }
`;

const collectionQuery = `#graphql
  ${VARIANT_FIELDS}
  query GetCollectionProducts($id: ID!, $first: Int!) {
    collection(id: $id) {
      id handle title
      products(first: $first) {
        nodes {
          id title handle description
          priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          images(first: 5) { nodes { url altText } }
          variants(first: 10) { nodes { ...VariantFields } }
        }
      }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const storefront = useStorefront();
  const { first, collectionId } = await getValidatedQuery(event, schema.parse);

  if (collectionId) {
    const id = collectionId.startsWith('gid://') ? collectionId : `gid://shopify/Collection/${collectionId}`;
    const result = await storefront.request(collectionQuery, { variables: { id, first } });
    return result.data?.collection ?? null;
  }

  const result = await storefront.request(allProductsQuery, { variables: { first } });
  return result.data?.products ?? null;
});
