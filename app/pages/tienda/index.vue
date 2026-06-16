<script setup lang="ts">
import { useProductHelpers } from '~/composables/useProductHelpers';
import type { Product } from '~/types/product';

const prismic = usePrismic();
const { components } = await import('~/slices');

const { data, error } = await useAsyncData('$tienda', async () => {
  const doc = await prismic.client.getSingle('tienda');
  return { doc };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}

const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc);

// Fetch products
const { data: productsData, pending: productsPending, error: productsError } = await useAsyncData(
  '$products-tienda',
  () => $fetch('/api/products', { query: { first: 24 } }),
);

const {
  addingToCart,
  addedToCart,
  hasAvailableVariant,
  findFirstAvailableVariant,
  addProductToCart,
} = useProductHelpers();

const products = computed<Product[]>(() => {
  if (!productsData.value) return [];
  const asCollection = productsData.value as { products?: { nodes?: Product[] } };
  if (asCollection.products?.nodes) {
    return asCollection.products.nodes;
  }
  const asProducts = productsData.value as { nodes?: Product[] };
  return asProducts.nodes ?? [];
});
</script>

<template>
  <section class="px-6 py-12">
    <h1 class="font-abc text-4xl font-bold uppercase">{{ doc?.data.page_title }}</h1>
    <SliceZone :slices="doc?.data.slices ?? []" :components="components" />

    <!-- Products Section -->
    <div class="mt-12">
      <div v-if="productsPending" class="flex justify-center py-16">
        <span class="text-sm">Cargando productos…</span>
      </div>

      <div v-else-if="productsError" class="rounded border border-red-200 bg-red-50 px-4 py-6 text-red-700">
        <p>No pudimos cargar los productos. Por favor intenta más tarde.</p>
      </div>

      <div v-else-if="products.length > 0" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :has-available-variant="hasAvailableVariant(product)"
          :adding-to-cart="addingToCart"
          :added-to-cart="addedToCart"
          :first-available-variant="findFirstAvailableVariant(product) ?? null"
          @add-to-cart="addProductToCart(product)"
        />
      </div>
    </div>
  </section>
</template>
