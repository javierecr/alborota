<script setup>
// TODO: fetch footer singleton from Prismic
const prismic = usePrismic();
const { data, error } = await useAsyncData('$footer', async () => {
  const doc = await prismic.client.getSingle('footer');
  return { doc };
});
if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}
const doc = computed(() => data.value?.doc);
usePrismicMetadata(doc);

const backgroundImage = computed(() => doc.value?.data.bg_image.url);
</script>

<template>
  <footer class="px-6 py-6 bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Footer content -->
       <div class="grid md:flex justify-between gap-4">
         <div v-for="block in doc?.data.blocks" :key="block.id" class="text-xs !leading-[1.3] flex flex-col gap-3">
           <h2  class="bg-alborota-cream py-2 px-3 uppercase">{{ block.title }}</h2>
           <div class="bg-alborota-cream py-2 px-3">
             <PrismicRichText :field="block.content" />
           </div>
         </div>
       </div>
      <div class="flex max-md:flex-col md:justify-end items-start">
        <PrismicLink v-for="link in doc?.data.legal_links" :key="link.id" class="text-xs !leading-[1.3] flex flex-col gap-3 bg-alborota-cream py-2 px-3 uppercase" :field="link.link">
          {{ link.label }}
        </PrismicLink>
      </div>
    </div>
  </footer>
</template>
