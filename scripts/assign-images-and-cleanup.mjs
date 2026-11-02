#!/usr/bin/env node
// 1) Gives each Alborota product 3 random images taken from the other (sample) products.
// 2) Deletes every product that is not one of the Alborota products.
//
// Usage:
//   node --env-file=.env scripts/assign-images-and-cleanup.mjs --dry-run
//   node --env-file=.env scripts/assign-images-and-cleanup.mjs

const API_VERSION = '2026-04';
const DRY_RUN = process.argv.includes('--dry-run');
const IMAGES_PER_PRODUCT = 3;

// Allow-list: these are never deleted.
const KEEP = new Set([
  'ramo', 'florero', 'arreglo-sin-florero', 'mascara', 'capello-con-bicho', 'cuadro-ramo',
  'cuadro-bichos', 'pajaro-loco', 'alebrije', 'letrero-bebe-nino', 'letrero-bebe-nina', 'pastel-de-cumpleanos',
]);

const domain = process.env.SHOPIFY_DOMAIN || 'alborota-2.myshopify.com';
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
if (!token) {
  console.error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN (run with: node --env-file=.env ...)');
  process.exit(1);
}

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

const listQuery = `
  query($after: String) {
    products(first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id handle title
        media(first: 20) { nodes { status ... on MediaImage { image { url } } } }
      }
    }
  }
`;

async function listProducts() {
  const all = [];
  let after = null;
  for (;;) {
    const { products } = await gql(listQuery, { after });
    all.push(...products.nodes);
    if (!products.pageInfo.hasNextPage) return all;
    after = products.pageInfo.endCursor;
  }
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const updateMutation = `
  mutation($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
    productUpdate(product: $product, media: $media) {
      product { id }
      userErrors { field message }
    }
  }
`;

const mediaStatusQuery = `
  query($id: ID!) { product(id: $id) { media(first: 20) { nodes { status } } } }
`;

const deleteMutation = `
  mutation($input: ProductDeleteInput!) {
    productDelete(input: $input) { deletedProductId userErrors { field message } }
  }
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitReady(id, timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { product } = await gql(mediaStatusQuery, { id });
    const statuses = product.media.nodes.map((m) => m.status);
    if (statuses.some((s) => s === 'FAILED')) return false;
    if (statuses.length && statuses.every((s) => s === 'READY')) return true;
    await sleep(3000);
  }
  return false;
}

async function main() {
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Store: ${domain}`);
  const products = await listProducts();
  const mine = products.filter((p) => KEEP.has(p.handle));
  const samples = products.filter((p) => !KEEP.has(p.handle));
  console.log(`Alborota products: ${mine.length}/${KEEP.size}, others to delete: ${samples.length}`);
  if (mine.length !== KEEP.size) {
    console.error('Not all Alborota products were found; aborting.');
    process.exit(1);
  }

  const pool = [...new Set(samples.flatMap((p) => p.media.nodes.map((m) => m.image?.url).filter(Boolean)))];
  console.log(`Image pool from other products: ${pool.length} unique images`);

  const needImages = mine.filter((p) => p.media.nodes.length === 0);
  if (needImages.length && pool.length < IMAGES_PER_PRODUCT) {
    console.error('Not enough images in the pool; aborting before any change.');
    process.exit(1);
  }

  const assignments = needImages.map((p) => ({ product: p, urls: shuffle(pool).slice(0, IMAGES_PER_PRODUCT) }));

  for (const { product, urls } of assignments) {
    console.log(`${product.title}: ${DRY_RUN ? 'would attach' : 'attaching'} ${urls.length} images`);
    if (DRY_RUN) {
      urls.forEach((u) => console.log(`   ${u}`));
      continue;
    }
    const data = await gql(updateMutation, {
      product: { id: product.id },
      media: urls.map((originalSource) => ({ originalSource, mediaContentType: 'IMAGE', alt: product.title })),
    });
    const errs = data.productUpdate.userErrors;
    if (errs.length) throw new Error(`${product.title}: ${errs.map((e) => e.message).join('; ')}`);
  }

  if (DRY_RUN) {
    console.log('\nWould delete:');
    samples.forEach((p) => console.log(`- ${p.title} (${p.handle})`));
    return;
  }

  // Make sure every Alborota product has READY images before deleting the originals.
  for (const p of mine) {
    const ok = await waitReady(p.id);
    console.log(`${p.title}: media ${ok ? 'READY' : 'NOT READY'}`);
    if (!ok) {
      console.error('Some media are not ready; not deleting anything.');
      process.exit(1);
    }
  }

  for (const p of samples) {
    if (KEEP.has(p.handle)) continue; // belt and braces
    const data = await gql(deleteMutation, { input: { id: p.id } });
    const errs = data.productDelete.userErrors;
    console.log(errs.length ? `FAILED delete ${p.title}: ${errs.map((e) => e.message).join('; ')}` : `deleted ${p.title}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
