<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(getSliceComponentProps<Content.CollageBannerSlice>());

type VerticalLayout = 'Spread' | 'Top' | 'Center' | 'Bottom';
type Position = 'Left' | 'Center' | 'Right';
type Tilt = 'None' | 'Left' | 'Right';

const WIDTHS = [640, 960, 1280, 1600, 2000];
const SIZES = '100vw';

// Full literal class strings: Tailwind purges on raw source text.
const mediaClass = computed(() => {
  switch (props.slice.primary.image_height) {
    case 'Screen':
      return 'h-[calc(100dvh-var(--header-height,88px))] min-h-[28rem]';
    case 'Auto':
      return 'min-h-[28rem]';
    default: // "1/0.35"
      return 'aspect-[1/0.35] min-h-[28rem]';
  }
});

const VERTICAL_CLASS: Record<VerticalLayout, string> = {
  Spread: 'justify-between',
  Top: 'justify-start',
  Center: 'justify-center',
  Bottom: 'justify-end',
};

const POSITION_CLASS: Record<Position, string> = {
  Left: 'self-start text-left',
  Center: 'self-center text-center',
  Right: 'self-end text-right',
};

const TILT_CLASS: Record<Tilt, string> = {
  None: '',
  Left: '-rotate-[3deg]',
  Right: 'rotate-[3deg]',
};

const verticalClass = computed(
  () =>
    VERTICAL_CLASS[
      (props.slice.primary.vertical_layout as VerticalLayout) ?? 'Spread'
    ] ?? VERTICAL_CLASS.Spread,
);

const hasMobileImage = computed(() =>
  isFilled.image(props.slice.primary.image_mobile),
);

const blocks = computed(() =>
  props.slice.primary.text_blocks
    .filter((b) => isFilled.richText(b.text))
    .map((b) => ({
      isHeading: b.kind === 'Heading',
      text: b.text,
      class: [
        POSITION_CLASS[(b.position as Position) ?? 'Left'] ??
          POSITION_CLASS.Left,
        TILT_CLASS[(b.tilt as Tilt) ?? 'None'] ?? '',
      ].join(' '),
    })),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      class="relative w-full overflow-hidden container my-20"
      :class="mediaClass"
    >
      <PrismicImage
        v-if="hasMobileImage"
        :field="slice.primary.image_mobile"
        :widths="[480, 640, 960]"
        sizes="100vw"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-center md:hidden"
      />
      <PrismicImage
        :field="slice.primary.image"
        :widths="WIDTHS"
        :sizes="SIZES"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-center"
        :class="hasMobileImage ? 'hidden md:block' : ''"
      />

      <div
        v-if="blocks.length"
        class="pointer-events-none absolute inset-0 flex flex-col gap-6 p-4 md:p-[clamp(2rem,6vw,5rem)]"
        :class="verticalClass"
      >
        <div
          v-for="(block, i) in blocks"
          :key="i"
          class="pointer-events-auto w-fit max-w-[90%] bg-alborota-paper/90 px-3 py-2.5 text-alborota-black md:max-w-[min(60%,40rem)]"
          :class="[
            block.class,
            block.isHeading
              ? 'font-abc font-bold uppercase leading-[1.15] text-[clamp(1.25rem,2.6vw,2.5rem)]'
              : 'font-stevie !leading-[1.4] text-[clamp(0.8125rem,1.15vw,1.125rem)] [&_a]:underline',
          ]"
        >
          <PrismicRichText :field="block.text" />
        </div>
      </div>
    </div>
  </section>
</template>
