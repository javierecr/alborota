#!/usr/bin/env node
// Seeds the Alborota catalog through the Shopify Admin GraphQL API.
//
// Usage:
//   node --env-file=.env scripts/seed-products.mjs --dry-run
//   node --env-file=.env scripts/seed-products.mjs
//
// Idempotent: products are looked up by handle and updated if they already exist.

const API_VERSION = '2026-04';
const DRY_RUN = process.argv.includes('--dry-run');
const PLACEHOLDER_PRICE = '1000.00';

const domain = process.env.SHOPIFY_DOMAIN || 'alborota-2.myshopify.com';
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!token && !DRY_RUN) {
  console.error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN (run with: node --env-file=.env scripts/seed-products.mjs)');
  process.exit(1);
}

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const SIZES = ['Chico', 'Mediano', 'Grande'];
const PALETTES = ['Paleta 1', 'Paleta 2', 'Paleta 3', 'Paleta 4', 'Paleta 5'];

// Products with size x palette variants. They are tagged `personalizable`,
// which makes the storefront show message / delivery date / delivery place fields.
const configurable = [
  { title: 'Ramo', prices: [2500, 3500, 4500] },
  { title: 'Florero', prices: [2500, 3500, 4500] },
  { title: 'Arreglo Sin Florero', prices: [3500, 4000, 4500] },
];

const simple = [
  'Máscara',
  'Capello con Bicho',
  'Cuadro Ramo',
  'Cuadro Bichos',
  'Pájaro Loco',
  'Alebrije',
  'Letrero Bebé Niño',
  'Letrero Bebé Niña',
  'Pastel de Cumpleaños',
];

const products = [
  ...configurable.map(({ title, prices }) => ({
    title,
    handle: slugify(title),
    tags: ['personalizable'],
    productOptions: [
      { name: 'Tamaño', position: 1, values: SIZES.map((name) => ({ name })) },
      { name: 'Paleta de Colores', position: 2, values: PALETTES.map((name) => ({ name })) },
    ],
    variants: SIZES.flatMap((size, i) =>
      PALETTES.map((palette) => ({
        optionValues: [
          { optionName: 'Tamaño', name: size },
          { optionName: 'Paleta de Colores', name: palette },
        ],
        price: prices[i].toFixed(2),
      })),
    ),
  })),
  ...simple.map((title) => ({
    title,
    handle: slugify(title),
    tags: [],
    productOptions: [{ name: 'Title', position: 1, values: [{ name: 'Default Title' }] }],
    variants: [{ optionValues: [{ optionName: 'Title', name: 'Default Title' }], price: PLACEHOLDER_PRICE }],
  })),
];

async function gql(query, variables) {
  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const findByHandle = `query($q: String!) { products(first: 1, query: $q) { nodes { id handle } } }`;

const productSet = `
  mutation ProductSet($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
    productSet(input: $input, identifier: $identifier, synchronous: true) {
      product { id handle title variantsCount { count } }
      userErrors { field message code }
    }
  }
`;

const publicationsQuery = `query { publications(first: 20) { nodes { id name } } }`;

const publish = `
  mutation Publish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`;

async function main() {
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Store: ${domain}, API ${API_VERSION}, ${products.length} products`);

  if (DRY_RUN) {
    for (const p of products) {
      console.log(`- ${p.title} (/${p.handle}) tags=[${p.tags}] variants=${p.variants.length} prices=${[...new Set(p.variants.map((v) => v.price))].join(', ')}`);
    }
    console.log('\nFirst payload:\n' + JSON.stringify(products[0], null, 2).slice(0, 1500));
    return;
  }

  // Publishing needs read_publications + write_publications; continue without it if the token lacks them.
  let publicationInputs = [];
  try {
    const { publications } = await gql(publicationsQuery);
    publicationInputs = publications.nodes.map((n) => ({ publicationId: n.id }));
    console.log(`Publications: ${publications.nodes.map((n) => n.name).join(', ') || '(none)'}`);
  } catch (err) {
    console.warn(`Skipping publishing (${err.message.slice(0, 120)}). Add read/write_publications scopes or publish from the admin.`);
  }

  let failures = 0;
  for (const p of products) {
    try {
      const existing = (await gql(findByHandle, { q: `handle:${p.handle}` })).products.nodes.find((n) => n.handle === p.handle);
      const data = await gql(productSet, {
        input: { ...p, status: 'ACTIVE' },
        identifier: existing ? { id: existing.id } : undefined,
      });
      const { product, userErrors } = data.productSet;
      if (userErrors.length || !product) throw new Error(userErrors.map((e) => e.message).join('; '));

      let published = 'no publications';
      if (publicationInputs.length) {
        const pub = await gql(publish, { id: product.id, input: publicationInputs });
        const errs = pub.publishablePublish.userErrors;
        published = errs.length ? `publish errors: ${errs.map((e) => e.message).join('; ')}` : 'published';
      }
      console.log(`${existing ? 'updated' : 'created'} ${product.title} (${product.variantsCount.count} variants) – ${published}`);
    } catch (err) {
      failures++;
      console.error(`FAILED ${p.title}: ${err.message}`);
    }
  }
  if (failures) process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
