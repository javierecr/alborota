<script setup lang="ts">
import { ref } from 'vue';
import { useSnapCarousel } from '~/composables/useSnapCarousel';

/**
 * A CSS scroll-snap rail that dissolves into the parent grid on desktop.
 *
 * With `desktopContents`, the element becomes `display: contents` at `md`, so
 * its children become direct grid items of the product grid — one set of
 * markup serves both the mobile carousel and the desktop gallery.
 *
 * It carries no ARIA role on purpose: `display: contents` can drop roles, so
 * the mobile affordance is the native scroll container plus <ProductMediaDots>.
 */
withDefaults(defineProps<{ desktopContents?: boolean }>(), { desktopContents: false });

const track = ref<HTMLElement | null>(null);
const { activeIndex, scrollTo } = useSnapCarousel(track);

defineExpose({ activeIndex, scrollTo });
</script>

<template>
  <div
    ref="track"
    class="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
    :class="desktopContents ? 'md:contents' : ''"
  >
    <slot />
  </div>
</template>
