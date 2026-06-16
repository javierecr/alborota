<script setup lang="ts">
import type { Product } from '~/types/product';

const route = useRoute();
const { addToCart } = useCart();
const { formatMoney } = useFormatMoney();

const { data, error } = await useAsyncData(`product-${route.params.uid}`, async () => {
  const product = await $fetch<Product>(`/api/products/${route.params.uid}`);
  return { product };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Producto no encontrado' });
}

const product = computed(() => data.value?.product);
const selectedVariant = ref(product.value?.variants?.nodes[0]);

useSeoMeta({
  title: () => product.value?.seo?.title ?? `${product.value?.title} | Alborota`,
  description: () => product.value?.seo?.description ?? product.value?.description ?? '',
  ogImage: () => product.value?.featuredImage?.url ?? '',
});
</script>

<template>
  <article class="px-6 py-12">
    <h1>{{ product?.title }}</h1>
    <!-- TODO: image gallery, variant selector, add-to-cart -->
  </article>
</template>
