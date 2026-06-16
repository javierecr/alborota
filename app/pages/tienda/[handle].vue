<script setup lang="ts">
import { computed } from 'vue';
import { useProductHelpers } from '~/composables/useProductHelpers';
import type { Product } from '~/types/product';

const route = useRoute();

const handle = computed(() => route.params.handle as string);

type CollectionPayload = {
  id: string;
  title: string;
  description?: string | null;
  image?: { url: string; altText?: string | null } | null;
  products?: {
    nodes?: Product[];
  };
} | null;

const { data, pending, error } = await useAsyncData(
  `collection-${handle.value}`,
  async () => {
    try {
      return await $fetch<CollectionPayload>(`/api/products/collection/${handle.value}`, {
        query: { first: 24 },
      });
    } catch (err) {
      // If collection not found, might be a product handle — try fetching as product
      const product = await $fetch<Product>(`/api/products/${handle.value}`).catch(() => null);
      if (product) {
        // Product found but collection API failed — redirect to canonical URL with category
        const category = product.collections?.nodes?.[0]?.handle ?? 'frontpage';
        await navigateTo(`/tienda/${category}/${handle.value}`, { replace: true });
        return null;
      }
      // Neither collection nor product found — re-throw error
      throw err;
    }
  },
  { server: true, watch: [handle] },
);

const {
  addingToCart,
  addedToCart,
  hasAvailableVariant,
  findFirstAvailableVariant,
  addProductToCart,
} = useProductHelpers();

const collection = computed(() => data.value ?? null);
const products = computed<Product[]>(() => collection.value?.products?.nodes ?? []);

useSeoMeta({
  title: () => `${collection.value?.title ?? 'Colección'} | Alborota`,
  description: () => collection.value?.description ?? '',
});
</script>

<template>
  <section class="px-6 py-12">
    <div v-if="pending" class="flex justify-center py-16">
      <span class="text-sm">Cargando productos…</span>
    </div>

    <div v-else-if="error" class="rounded border border-red-200 bg-red-50 px-4 py-6 text-red-700">
      <p>No pudimos cargar los productos. Por favor intenta más tarde.</p>
    </div>

    <template v-else>
      <div class="mb-10">
        <h1 class="font-abc text-4xl font-bold uppercase mb-2">{{ collection?.title }}</h1>
        <p v-if="products.length" class="text-gray-600">
          {{ products.length }} producto{{ products.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <div v-if="!products.length" class="flex justify-center py-16">
        <p class="text-sm">No hay productos en esta colección.</p>
      </div>

      <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :has-available-variant="hasAvailableVariant(product)"
          :adding-to-cart="addingToCart"
          :added-to-cart="addedToCart"
          :first-available-variant="findFirstAvailableVariant(product) ?? null"
          :collection-handle="handle"
          @add-to-cart="addProductToCart(product)"
        />
      </div>
    </template>
  </section>
</template>
