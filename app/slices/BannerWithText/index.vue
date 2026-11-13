<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(
  getSliceComponentProps<Content.BannerWithTextSlice>(),
);

type TextPosition = NonNullable<
  Content.BannerWithTextSliceDefaultPrimary['text_position']
>;
type HorizontalAlign = 'Left' | 'Center' | 'Right';

/**
 * Height of everything inside the section that is NOT the photo: the page
 * gutter (top + bottom) plus the green frame's top + bottom padding.
 * Mobile: 12*2 + 12*2 = 48. Desktop: 24*2 + 32 + 27 = 107.
 * Declared on <section> and subtracted in the "Screen" height so the whole
 * banner — gutter, frame and all — fits exactly one viewport minus the header.
 *
 * NOTE: if the gutter or the frame padding below changes, update these numbers.
 */
const CHROME_VARS = '[--bwt-chrome:48px] md:[--bwt-chrome:107px]';

/**
 * Sizing of the box the photo lives in. Every class below is a full literal
 * string: Tailwind purges on raw source text, so an interpolated arbitrary
 * value would never be generated.
 */
const mediaClass = computed(() => {
  switch (props.slice.primary.image_height) {
    case 'Screen':
      return 'h-[calc(100dvh-var(--header-height,88px)-var(--bwt-chrome))] min-h-[340px]';
    case 'Auto':
      return '';
    default: // "1/0.6"
      return 'aspect-[1/0.6] min-h-[340px] max-h-[calc(100dvh-var(--header-height,88px)-var(--bwt-chrome))]';
  }
});

/** "Auto" lets the image set its own height; the other modes fill the sized box. */
const imageClass = computed(() =>
  props.slice.primary.image_height === 'Auto'
    ? 'w-full h-auto min-h-[340px] md:min-h-0 object-cover object-center'
    : 'absolute inset-0 w-full h-full object-cover object-center',
);

/**
 * Full literal class strings — Tailwind purges on raw source text, so these
 * must never be built by concatenation.
 */
const POSITION_CLASS: Record<TextPosition, string> = {
  'Left Top': 'justify-start items-start',
  'Center Top': 'justify-center items-start',
  'Right Top': 'justify-end items-start',
  'Left Center': 'justify-start items-center',
  'Center Center': 'justify-center items-center',
  'Right Center': 'justify-end items-center',
  'Left Bottom': 'justify-start items-end',
  'Center Bottom': 'justify-center items-end',
  'Right Bottom': 'justify-end items-end',
};

/** Cross-axis alignment inside the column — moves the hug-width CTA chip. */
const COLUMN_ALIGN_CLASS: Record<HorizontalAlign, string> = {
  Left: 'items-start',
  Center: 'items-center',
  Right: 'items-end',
};

const position = computed<TextPosition>(
  () => props.slice.primary.text_position ?? 'Left Bottom',
);
const overlayClass = computed(() => POSITION_CLASS[position.value]);
const columnAlignClass = computed(
  () =>
    COLUMN_ALIGN_CLASS[position.value.split(' ')[0] as HorizontalAlign] ??
    COLUMN_ALIGN_CLASS.Left,
);

const hasHeading = computed(() =>
  isFilled.keyText(props.slice.primary.heading),
);
const hasCta = computed(() => isFilled.link(props.slice.primary.cta));
const hasText = computed(() => isFilled.richText(props.slice.primary.text));
const hasOverlay = computed(
  () => hasHeading.value || hasCta.value || hasText.value,
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :class="CHROME_VARS"
  >
    <!-- page gutter -->
    <div class="container">
      <!-- green picture frame -->
      <div
        class="relative p-[12px] md:pt-[32px] md:pr-[35px] md:pb-[27px] md:pl-[34px]"
        :style="{
          backgroundColor:
            slice.primary.frame_color || 'rgb(var(--color-alborota-grass))',
        }"
      >
        <!-- photo -->
        <div class="relative w-full overflow-hidden" :class="mediaClass">
          <PrismicImage :field="slice.primary.image" :class="imageClass" />
        </div>

        <!--
          Overlay. An absolutely positioned element resolves its insets against
          the nearest positioned ancestor's PADDING box, so these are measured
          from the green frame's outer edge — 80px, as in the design.
        -->
        <div
          v-if="hasOverlay"
          class="pointer-events-none absolute inset-[16px] flex md:inset-[80px]"
          :class="overlayClass"
        >
          <div
            class="pointer-events-auto flex w-full max-w-[507px] flex-col gap-[14px] md:gap-[23px]"
            :class="columnAlignClass"
          >
            <h2
              v-if="hasHeading"
              class="w-full bg-alborota-paper/90 px-[16px] py-[6px] md:px-[24px] md:py-[8px] text-center font-abc font-bold uppercase leading-[1.2] text-alborota-black text-[clamp(1.375rem,2.8vw,2.5rem)]"
            >
              {{ slice.primary.heading }}
            </h2>

            <PrismicLink
              v-if="hasCta"
              :field="slice.primary.cta"
              class="inline-flex max-w-full items-center bg-alborota-stone px-[4px] py-[7px] font-abc font-bold uppercase leading-[18px] text-alborota-black text-[clamp(0.8125rem,1.05vw,0.9375rem)]"
            />

            <div
              v-if="hasText"
              class="w-full max-w-[457px] bg-alborota-paper/90 px-[12px] py-[10px] text-left font-stevie !leading-[1.4] text-alborota-black text-[clamp(0.8125rem,1vw,0.9375rem)] [&_a]:underline"
            >
              <PrismicRichText :field="slice.primary.text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
