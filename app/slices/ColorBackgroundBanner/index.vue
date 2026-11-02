<script setup lang="ts">
import type { Content } from "@prismicio/client";
import greenBg from '~/assets/img/green_bg.png';

defineProps(getSliceComponentProps<Content.ColorBackgroundBannerSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  > 
  <div class="container mx-auto">
    <div class="w-full aspect-[1/2] md:aspect-[2/1] bg-fit md:bg-contain bg-center bg-no-repeat grid md:[grid-area:'content'] p-8" :style="{ backgroundImage: `url(${greenBg})` }">
      <div class="max-md:w-full md:h-[60%] aspect-[2/1] p-6 bg-alborota-cream self-center md:[grid-area:content] rotate-[-8deg]">
        <PrismicImage :field="slice.primary.image" class="w-full h-full object-cover" />
      </div>
      <div v-if="slice.variation === 'default'" class="flex flex-col justify-center md:[grid-area:content] gap-10 self-stretch md:w-[45%] md:justify-self-end p-6">
        <div  v-for="(item, index) in slice.primary.text_blocks" :key="index" class="p-4 bg-alborota-cream/95 text-base lg:text-xl !leading-[1.3] !tracking-[2%] font-stevie-book" :style="{
          transform: `translateX(${index * -10}%)`
        }">
          <PrismicRichText :field="item.text" />
        </div>
      </div>
    </div>
  </div>
  </section>
</template>
