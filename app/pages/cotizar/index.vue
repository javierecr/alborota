<script setup>
const prismic = usePrismic();
const { components } = await import('~/slices');

const { data, error } = await useAsyncData('$cotizar', async () => {
  const doc = await prismic.client.getSingle('cotizar');
  return { doc };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}

const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc);
</script>

<template>
  <div>
    <!-- The section renders the page's visible <h1>, so there is no sr-only one here. -->
    <CotizarQuoteSection
      :title="doc?.data.quote_title"
      :image="doc?.data.quote_image"
    />
    <SliceZone :slices="doc?.data.slices ?? []" :components="components" />
  </div>
</template>
