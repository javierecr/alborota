<script setup lang="ts">
const prismic = usePrismic();
const route = useRoute();

const { data, error } = await useAsyncData(`info-${route.params.uid}`, async () => {
  const doc = await prismic.client.getByUID('info', route.params.uid as string);
  return { doc };
});

if (error.value || !data.value?.doc) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}

const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc, { index: false });
</script>

<template>
  <article class="mx-auto max-w-3xl px-6 py-12">
    <h1 class="mb-8 text-3xl font-bold">{{ doc?.data.page_title }}</h1>
    <div
      class="space-y-4 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
    >
      <PrismicRichText :field="doc?.data.content" />
    </div>
  </article>
</template>
