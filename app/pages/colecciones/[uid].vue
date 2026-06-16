<script setup lang="ts">
const prismic = usePrismic();
const route = useRoute();
const { components } = await import('~/slices');

const { data, error } = await useAsyncData(`$coleccion-${route.params.uid}`, async () => {
  const doc = await prismic.client.getByUID('coleccion', route.params.uid as string);
  return { doc };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Colección no encontrada' });
}

const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc);
</script>

<template>
  <section class="px-6 py-12">
    <h1 class="sr-only">{{ doc?.data.page_title }}</h1>
    <SliceZone :slices="doc?.data.slices ?? []" :components="components" />
    <!-- TODO: render filtered Shopify products here -->
  </section>
</template>
