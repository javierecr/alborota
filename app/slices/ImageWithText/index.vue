<script setup lang="ts">
import type { Content } from '@prismicio/client';

defineProps(getSliceComponentProps<Content.ImageWithTextSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="py-10 md:py-20 px-4">
      <div
        class="container mx-auto grid md:grid-cols-[0.6fr_0.4fr] gap-4 items-end"
      >
        <div class="w-full aspect-[1/0.62] p-4 md:p-6 bg-alborota-pink">
          <PrismicImage
            class="w-full h-full object-cover"
            :field="slice.primary.image"
          />
        </div>
        <div class="flex flex-col gap-4 justify-start">
          <h2
            class="bg-alborota-cream p-3 border-[0.2px] border-alborota-black bg-alborota-beige/90text-[1.5rem] text-[1.75rem] lg:text-[2.75rem] !leading-[1.3] font-abc font-bold max-w-[12ch] origin-[left_top] md:origin-[left_bottom] md:translate-x-[-20%] rotate-[-10deg]"
          >
            {{ slice.primary.heading }}
          </h2>
          <div class="text-xl font-stevie-book">
            <PrismicRichText :field="slice.primary.text" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
