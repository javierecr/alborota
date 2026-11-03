<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from '~/types/product';

const props = defineProps<{ product: Product }>();

const images = computed(() => {
  const nodes = props.product.images?.nodes ?? [];
  if (nodes.length) return nodes;
  return props.product.featuredImage ? [props.product.featuredImage] : [];
});

type TrackHandle = { activeIndex: number; scrollTo: (index: number, behavior?: ScrollBehavior) => void };
const track = ref<TrackHandle | null>(null);

const zoomIndex = ref<number | null>(null);
</script>

<template>
  <section class="flex flex-col gap-[24px] bg-alborota-cream px-[16px] py-[40px] md:gap-[93px] md:px-[56px] md:py-[80px]">
    <!--
      On mobile the order is carousel → dots → title → form, so the title is
      `order-3`; at `md` every `order` resets and the grid takes over.
    -->
    <h1
      class="order-3 w-full text-center font-abc text-[28px] font-bold uppercase leading-[34px] text-alborota-black md:order-none md:text-[44px] md:leading-[56px]"
    >
      {{ product.title }}
    </h1>

    <!--
      `contents` below md so the track, dots and form are flex children of the
      section alongside the title. At md this becomes the real grid and the
      track collapses into it (`desktop-contents`), so one set of markup serves
      both breakpoints.
    -->
    <div class="contents md:grid md:auto-rows-[min-content] md:grid-cols-2 md:items-start md:gap-x-[24px] md:gap-y-[32px]">
      <ProductMediaTrack
        v-if="images.length"
        ref="track"
        desktop-contents
        class="order-1 md:order-none"
      >
        <!-- Mobile: one slide per viewport. Desktop: a plain grid cell. -->
        <div
          v-for="(image, index) in images"
          :key="image.id ?? index"
          class="w-full shrink-0 basis-full snap-start md:basis-auto"
        >
          <ProductMediaGridItem
            :image="image"
            :index="index"
            :total="images.length"
            :product-title="product.title"
            :priority="index === 0"
            @zoom="zoomIndex = $event"
          />
        </div>
      </ProductMediaTrack>

      <ProductMediaDots
        class="order-2 md:hidden"
        :total="images.length"
        :active-index="track?.activeIndex ?? 0"
        @select="track?.scrollTo($event)"
      />

      <!--
        Explicitly placed, so grid auto-placement flows the images around it:
        row 1 is img1 | form, row 2 is img2 | img3, and any further images
        continue downwards two-up.
      -->
      <ProductForm
        :product="product"
        class="order-4 md:order-none md:col-start-2 md:row-start-1"
        :class="images.length ? '' : 'md:col-span-2 md:col-start-1'"
      />
    </div>

    <ProductMediaLightbox
      v-if="zoomIndex !== null"
      :images="images"
      :start-index="zoomIndex"
      :product-title="product.title"
      @close="zoomIndex = null"
    />
  </section>
</template>
