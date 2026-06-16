const productQuery = `#graphql
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id handle title description descriptionHtml
      featuredImage { url altText }
      images(first: 10) { nodes { id url altText } }
      options { id name values }
      variants(first: 50) {
        nodes {
          id title availableForSale sku quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText }
        }
      }
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      collections(first: 3) { nodes { handle title } }
      seo { title description }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle');
  if (!handle) throw createError({ statusCode: 400, statusMessage: 'Product handle required' });
  const storefront = useStorefront();
  const result = await storefront.request(productQuery, { variables: { handle } });
  if (!result.data?.product) throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  return result.data.product;
});
