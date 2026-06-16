<script setup>
const prismic = usePrismic();
const { components } = await import('~/slices');

const { data, error } = await useAsyncData('$home', async () => {
  const doc = await prismic.client.getSingle('home');
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
    <h1 class="sr-only">{{ doc?.data.page_title }}</h1>
    <SliceZone :slices="doc?.data.slices ?? []" :components="components" />
  </div>
</template>
