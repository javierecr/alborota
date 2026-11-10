<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBodyScrollLock } from '~/composables/useBodyScrollLock';
import { useFormatMoney } from '~/composables/useFormatMoney';
import ArrowLeft from '~/assets/icons/arrow-left.svg';
import ArrowRight from '~/assets/icons/arrow-right.svg';
import Close from '~/assets/icons/close.svg';
import type { ProductImage } from '~/types/product';

const props = defineProps<{
  images: ProductImage[];
  startIndex: number;
  productTitle: string;
}>();

const emit = defineEmits<{ close: [] }>();

const { shopifyImageUrl } = useFormatMoney();

const dialog = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
type TrackHandle = { activeIndex: number; scrollTo: (index: number, behavior?: ScrollBehavior) => void };
const trackRef = ref<TrackHandle | null>(null);

const activeIndex = computed(() => trackRef.value?.activeIndex ?? props.startIndex);
const total = computed(() => props.images.length);

const go = (index: number) => {
  const next = Math.min(Math.max(index, 0), total.value - 1);
  trackRef.value?.scrollTo(next);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    return;
  }
  if (event.key === 'ArrowLeft') { event.preventDefault(); go(activeIndex.value - 1); return; }
  if (event.key === 'ArrowRight') { event.preventDefault(); go(activeIndex.value + 1); return; }
  if (event.key !== 'Tab') return;

  // Keep focus inside the dialog while it is open.
  const focusable = dialog.value?.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable?.length) return;
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

useBodyScrollLock();

let previouslyFocused: HTMLElement | null = null;

onMounted(async () => {
  previouslyFocused = document.activeElement as HTMLElement | null;
  await nextTick();
  trackRef.value?.scrollTo(props.startIndex, 'auto');
  closeButton.value?.focus();
});

onBeforeUnmount(() => {
  previouslyFocused?.focus?.();
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="`Imágenes de ${productTitle}`"
      tabindex="-1"
      class="fixed inset-0 z-[100] flex flex-col bg-alborota-cream"
      @keydown="onKeydown"
    >
      <div class="flex shrink-0 items-center justify-between px-[16px] py-[16px] md:px-[24px]">
        <span class="font-stevie text-[0.8125rem] leading-[24px] text-alborota-ink" aria-live="polite">
          {{ activeIndex + 1 }} / {{ total }}
        </span>
        <button
          ref="closeButton"
          type="button"
          aria-label="Cerrar"
          class="flex size-[44px] items-center justify-center rounded-full transition-colors hover:bg-alborota-ink/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-alborota-ink"
          @click="emit('close')"
        >
          <Close class="icon-raw !size-[14px]" aria-hidden="true" />
        </button>
      </div>

      <div class="relative flex min-h-0 flex-1 items-center">
        <!-- Same scroll-snap track as the page, so swipe, arrows and the
             keyboard all come from one implementation. -->
        <ProductMediaTrack ref="trackRef" class="h-full items-center">
          <div
            v-for="(image, index) in images"
            :key="image.id ?? index"
            class="flex h-full w-full shrink-0 basis-full snap-start items-center justify-center px-[16px] pb-[16px] md:px-[72px]"
          >
            <img
              :src="shopifyImageUrl(image.url, 2000)"
              :alt="image.altText || `${productTitle} — imagen ${index + 1}`"
              class="max-h-full max-w-full object-contain"
            />
          </div>
        </ProductMediaTrack>

        <template v-if="total > 1">
          <button
            type="button"
            aria-label="Imagen anterior"
            :disabled="activeIndex === 0"
            class="absolute left-[8px] flex size-[44px] items-center justify-center rounded-full bg-[#fcfcfc] shadow-[0px_0px_0px_1px_rgba(66,67,66,0.12)] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            @click="go(activeIndex - 1)"
          >
            <ArrowLeft class="icon-raw !h-[16px] !w-[10px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            :disabled="activeIndex === total - 1"
            class="absolute right-[8px] flex size-[44px] items-center justify-center rounded-full bg-[#fcfcfc] shadow-[0px_0px_0px_1px_rgba(66,67,66,0.12)] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            @click="go(activeIndex + 1)"
          >
            <ArrowRight class="icon-raw !h-[16px] !w-[10px]" aria-hidden="true" />
          </button>
        </template>
      </div>

      <ProductMediaDots
        class="shrink-0 py-[16px]"
        :total="total"
        :active-index="activeIndex"
        @select="go"
      />
    </div>
  </Teleport>
</template>
