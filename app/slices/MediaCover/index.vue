<script setup lang="ts">
import type { Content } from "@prismicio/client";

const props = defineProps(getSliceComponentProps<Content.MediaCoverSlice>());

const imageHeightClass = computed(() => {
  switch (props.slice.primary.height) {
    case "1/0.6":
      return "pb-[min(60%,calc(100dvh-var(--header-height,88px)))] h-0";
    case "Screen":
      return "h-[calc(100dvh-var(--header-height,88px))]";
    default:
      return "";
  }
});
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="w-full" :class="[imageHeightClass, {'relative overflow-hidden': props.slice.primary.height != 'Auto'}]">
      <PrismicImage class="w-full" :class="`${props.slice.primary.height == 'Auto' ? 'h-auto' : 'object-cover absolute inset-0 object-center'}`" :field="slice.primary.image" />
    </div>
  </section>
</template>
