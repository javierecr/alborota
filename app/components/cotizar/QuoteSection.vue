<script setup lang="ts">
import type { ImageField, KeyTextField } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { computed } from 'vue';

// Figma node 2015:284. A static section rather than a slice: /cotizar is this
// one thing, so there is nothing for an author to reorder. The two pieces they
// do control — the heading and the photo — come in as props from the Cotizar
// document, following the same prop-passing convention as components/featured/.
const props = defineProps<{
  title?: KeyTextField;
  image?: ImageField;
}>();

const heading = computed(() => props.title || 'Cotiza tu proyecto / pieza');
const hasImage = computed(() => !!props.image && isFilled.image(props.image));
</script>

<template>
  <section
    class="flex w-full flex-col items-center gap-[48px] py-[56px] lg:gap-[80px] lg:py-[80px] container mx-auto"
  >
    <h1
      class="w-full px-6 text-center font-abc text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold uppercase leading-[1.27] text-alborota-black"
    >
      {{ heading }}
    </h1>

    <div
      class="flex w-full flex-col items-center justify-center gap-[40px] px-6 lg:flex-row lg:px-[56px]"
    >
      <!-- 673/761 is the crop drawn in Figma; the photo fills it rather than
           dictating the column width, so both columns stay equal. -->
      <PrismicImage
        v-if="hasImage"
        :field="props.image!"
        class="aspect-[673/761] w-full min-w-0 flex-1 object-cover"
      />

      <div class="w-full min-w-0 flex-1">
        <CotizarQuoteForm />
      </div>
    </div>
  </section>
</template>
