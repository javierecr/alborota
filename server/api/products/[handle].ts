const productQuery = `#graphql
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id handle title description descriptionHtml tags
      featuredImage { url altText width height }
      images(first: 20) { nodes { id url altText width height } }
      options { id name values optionValues { id name } }
      variants(first: 100) {
        nodes {
          id title availableForSale sku quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
          metafield(namespace: "custom", key: "dimensiones") { value }
        }
      }
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      collections(first: 3) { nodes { handle title } }
      seo { title description }
      metafields(identifiers: [
        { namespace: "custom", key: "detalles" },
        { namespace: "custom", key: "descripcion_producto" },
        { namespace: "custom", key: "tiempos_produccion_envio" }
      ]) { key namespace value type }
    }
  }
`;

// Separate request: `metaobjects` needs the `unauthenticated_read_metaobjects`
// scope, and a token without it fails the WHOLE document. Asking for it on its
// own means a missing scope only costs us the swatch colours.
const palettesQuery = `#graphql
  query GetPalettes {
    metaobjects(type: "paleta", first: 25) {
      nodes { id handle fields { key value } }
    }
  }
`;

type MetaobjectNode = { handle: string; fields: { key: string; value: string }[] };

const toPalette = (node: MetaobjectNode) => {
  const field = (key: string) => node.fields.find((f) => f.key === key)?.value ?? '';
  return {
    nombre: field('nombre') || node.handle,
    colors: ['color_1', 'color_2', 'color_3'].map(field).filter(Boolean),
  };
};

export default defineEventHandler(async (event) => {
  const handle = getRouterParam(event, 'handle');
  if (!handle) throw createError({ statusCode: 400, statusMessage: 'Product handle required' });

  const storefront = useStorefront();

  const [productResult, palettesResult] = await Promise.all([
    storefront.request(productQuery, { variables: { handle } }),
    storefront.request(palettesQuery).catch(() => null),
  ]);

  if (!productResult.data?.product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }

  const nodes: MetaobjectNode[] = palettesResult?.data?.metaobjects?.nodes ?? [];
  const palettes = nodes.map(toPalette).filter((p) => p.colors.length > 0);

  return { ...productResult.data.product, palettes };
});
