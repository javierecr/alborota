<script setup>
import { isFilled } from '@prismicio/client';

const prismic = usePrismic();
const { data, error } = await useAsyncData('$footer', async () => {
  const doc = await prismic.client.getSingle('footer');
  return { doc };
});
if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}
const doc = computed(() => data.value?.doc);

const backgroundStyle = computed(() => {
  const image = doc.value?.data.bg_image;
  return isFilled.image(image) ? { backgroundImage: `url(${image.url})` } : {};
});
</script>

<template>
  <footer
    class="bg-alborota-grass bg-cover bg-center px-6 py-6 md:px-[30px] md:py-[24px]"
    :style="backgroundStyle"
  >
    <div
      class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between container mx-auto"
    >
      <div
        v-for="(block, index) in doc?.data.blocks"
        :key="index"
        class="flex w-[120px] flex-col gap-[18px]"
      >
        <h2
          class="chip-paper self-start px-3 pt-2 pb-1 font-stevie text-[0.625rem] uppercase leading-4 text-black"
        >
          {{ block.title }}
        </h2>
        <div
          class="chip-paper-wide self-end pl-2 pr-[10px] pt-[7px] pb-[3px] font-stevie text-[0.625rem] leading-4 text-black"
        >
          <PrismicRichText :field="block.content" />
        </div>
      </div>

      <div
        class="flex flex-col items-start gap-[18px] md:flex-row md:items-center"
      >
        <PrismicLink
          v-for="(link, index) in doc?.data.links"
          :key="index"
          :field="link.link"
          class="chip-paper px-3 pt-2 pb-1 font-stevie text-[0.625rem] uppercase leading-4 text-black no-underline"
        >
          {{ link.label }}
        </PrismicLink>
      </div>
    </div>
  </footer>
</template>
