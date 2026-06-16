<script setup lang="ts">
const prismic = usePrismic();
const route = useRoute();
const { components } = await import('~/slices');

const { data, error } = await useAsyncData(`$legal-${route.params.uid}`, async () => {
  const doc = await prismic.client.getByUID('legal_page', route.params.uid as string);
  return { doc };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}

const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc, { index: false });
</script>

<template>
  <article class="px-6 py-12 max-w-3xl mx-auto">
    <h1>{{ doc?.data.page_title }}</h1>
    <SliceZone :slices="doc?.data.slices ?? []" :components="components" />
  </article>
</template>
