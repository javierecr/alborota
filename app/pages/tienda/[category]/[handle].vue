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

useSeoMeta({
  title: () => product.value?.seo?.title ?? `${product.value?.title ?? 'Producto'} | Alborota`,
  description: () => product.value?.seo?.description ?? product.value?.description ?? '',
  ogImage: () => product.value?.featuredImage?.url ?? '',
});
</script>

<template>
  <div v-if="pending" class="flex min-h-[60vh] items-center justify-center p-8">
    <p class="font-stevie text-[13px] text-alborota-ink">Cargando producto…</p>
  </div>

  <div v-else-if="error || !product" class="flex min-h-[60vh] items-center justify-center p-8">
    <div class="border border-alborota-ink/[0.12] px-6 py-8 text-center">
      <p class="font-stevie text-[13px] text-alborota-ink">No pudimos encontrar este producto.</p>
      <NuxtLink to="/tienda" class="mt-4 inline-block font-stevie text-[13px] underline">Volver a la tienda</NuxtLink>
    </div>
  </div>

  <ProductDetailsSection v-else :product="product" />
</template>
