<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(
  getSliceComponentProps<Content.HeadingWithQuoteSlice>(),
);

type Tilt = NonNullable<
  Content.HeadingWithQuoteSliceDefaultPrimary['heading_tilt']
>;

/**
 * Full literal class strings — Tailwind purges on raw source text, so these
 * must never be built by concatenation.
 *
 * 2.66deg is the chip's rotation in the design (Figma node 2030:631).
 */
const TILT_CLASS: Record<Tilt, string> = {
  None: '',
  Left: '-rotate-[2.66deg]',
  Right: 'rotate-[2.66deg]',
};

/**
 * Heading and quote share one type ramp: 44px / 56px on the 1440 artboard,
 * i.e. 2.75rem at a 1.27 line-height, scaling down to 1.5rem on phones.
 */
const TYPE_CLASS =
  'font-abc font-bold text-alborota-black text-[clamp(1.5rem,3.1vw,2.75rem)] !leading-[1.27]';

const tiltClass = computed(
  () =>
    TILT_CLASS[props.slice.primary.heading_tilt ?? 'Left'] ?? TILT_CLASS.Left,
);

const hasHeading = computed(() =>
  isFilled.keyText(props.slice.primary.heading),
);
const hasQuote = computed(() => isFilled.richText(props.slice.primary.quote));
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      class="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-10 md:gap-[56px] md:p-[70px]"
    >
      <!--
        Tilted heading chip. The rotation sits on the chip itself while this
        wrapper stays square, so the rotated bounding box can't shift the
        column's own alignment.
      -->
      <div v-if="hasHeading" class="flex w-full justify-center">
        <h2
          class="border-[0.2px] border-alborota-black bg-alborota-beige/90 px-4 py-3 text-center md:pb-[17px] md:pl-[27px] md:pr-[17px] md:pt-[21px]"
          :class="[TYPE_CLASS, tiltClass]"
        >
          {{ slice.primary.heading }}
        </h2>
      </div>

      <div
        v-if="hasQuote"
        class="w-full max-w-[1300px] text-center [&_a]:underline"
        :class="TYPE_CLASS"
      >
        <PrismicRichText :field="slice.primary.quote" />
      </div>
    </div>
  </section>
</template>
