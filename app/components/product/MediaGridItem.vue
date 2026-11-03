<script setup lang="ts">
import { computed } from 'vue';
import { useFormatMoney } from '~/composables/useFormatMoney';
import type { ProductImage } from '~/types/product';

// The whole tile is one button, so the entire image is the hit area for zoom
// and there is a single thing to tab to per image.
const props = withDefaults(
  defineProps<{
    image: ProductImage;
    index: number;
    total: number;
    productTitle: string;
    priority?: boolean;
  }>(),
  { priority: false },
);

const emit = defineEmits<{ zoom: [index: number] }>();

const { shopifyImageUrl } = useFormatMoney();

const WIDTHS = [652, 978, 1304];
const src = computed(() => shopifyImageUrl(props.image.url, 1304));
const srcset = computed(() => WIDTHS.map((w) => `${shopifyImageUrl(props.image.url, w)} ${w}w`).join(', '));
const alt = computed(() => props.image.altText || props.productTitle);
</script>

<template>
  <button
    type="button"
    class="group relative block w-full overflow-hidden bg-alborota-beige"
    :aria-label="`Ampliar imagen ${index + 1} de ${total}`"
    @click="emit('zoom', index)"
  >
    <!--
      The Figma tile is 652x580 landscape while the photos are portrait, so this
      crops. Keep the ratio here only — it is the single place to change it.
    -->
    <span class="block aspect-[652/580] w-full">
      <img
        :src="src"
        :srcset="srcset"
        sizes="(min-width: 768px) 50vw, 100vw"
        :alt="alt"
        :width="image.width ?? undefined"
        :height="image.height ?? undefined"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        :decoding="priority ? 'sync' : 'async'"
        class="size-full object-cover"
      />
    </span>

    <ProductZoomButton tag="span" />
  </button>
</template>
