<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types/product';

const route = useRoute();

const handle = computed(() => route.params.handle as string);

const { data, pending, error } = await useAsyncData(
  () => `product-${handle.value}`,
  () => $fetch<Product>(`/api/products/${handle.value}`),
  { watch: [handle] },
);

const product = computed(() => data.value ?? null);

// Keyed off the route param rather than the loaded product, so it runs in
// parallel with the product request instead of waiting on it.
const { data: recommendedData } = await useAsyncData(
  () => `product-recommendations-${handle.value}`,
  () =>
    $fetch<{ nodes: Product[] }>(`/api/products/${handle.value}/recommendations`, {
      query: { first: 3 },
    }),
  { watch: [handle] },
);

const recommended = computed<Product[]>(() => recommendedData.value?.nodes ?? []);

useSeoMeta({
  title: () => product.value?.seo?.title ?? `${product.value?.title ?? 'Producto'} | Alborota`,
  description: () => product.value?.seo?.description ?? product.value?.description ?? '',
  ogImage: () => product.value?.featuredImage?.url ?? '',
});
</script>

<template>
  <div v-if="pending" class="flex min-h-[60vh] items-center justify-center p-8">
    <p class="font-stevie text-[0.8125rem] text-alborota-ink">Cargando producto…</p>
  </div>

  <div v-else-if="error || !product" class="flex min-h-[60vh] items-center justify-center p-8">
    <div class="border border-alborota-ink/[0.12] px-6 py-8 text-center">
      <p class="font-stevie text-[0.8125rem] text-alborota-ink">No pudimos encontrar este producto.</p>
      <NuxtLink to="/tienda" class="mt-4 inline-block font-stevie text-[0.8125rem] underline">Volver a la tienda</NuxtLink>
    </div>
  </div>

  <template v-else>
    <ProductDetailsSection :product="product" />

    <FeaturedProductCollection
      v-if="recommended.length"
      heading="También te puede gustar"
      :products="recommended"
    />
  </template>
</template>
