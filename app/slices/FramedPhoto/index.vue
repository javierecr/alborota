<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(getSliceComponentProps<Content.FramedPhotoSlice>());

type Primary = Content.FramedPhotoSliceDefaultPrimary;
type FrameColor = NonNullable<Primary['frame_color']>;
type Align = NonNullable<Primary['image_align']>;
type Ratio = NonNullable<Primary['image_ratio']>;
type Tilt = NonNullable<Primary['tilt']>;

const WIDTHS = [480, 640, 960, 1280, 1600];

/**
 * Full literal class strings — Tailwind purges on raw source text, so these
 * must never be built by concatenation.
 */
const FRAME_CLASS: Record<FrameColor, string> = {
  Olive: 'bg-alborota-olive',
  Pink: 'bg-alborota-pink',
  Orange: 'bg-alborota-orange',
  Grass: 'bg-alborota-grass',
  Cream: 'bg-alborota-cream',
  Beige: 'bg-alborota-beige',
};

/** 0.83deg is the frame's rotation in the design (Figma nodes 2030:520/521). */
const TILT_CLASS: Record<Tilt, string> = {
  None: '',
  Left: '-rotate-[0.83deg]',
  Right: 'rotate-[0.83deg]',
};

const RATIO_CLASS: Record<Ratio, string> = {
  '3/2': 'aspect-[3/2]',
  '2/1': 'aspect-[2/1]',
  '16/9': 'aspect-[16/9]',
  Auto: '',
};

/**
 * With a caption the row is a two-column grid, and `image_align` decides which
 * side the wide photo column lands on — hence two full column templates rather
 * than one template plus a reversal.
 */
const CAPTION_LAYOUT_CLASS: Record<Align, string> = {
  Left: 'md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center md:gap-[96px]',
  Right:
    'md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-center md:gap-[96px]',
};
const CAPTION_FRAME_CLASS: Record<Align, string> = {
  Left: 'md:order-1',
  Right: 'md:order-2',
};
const CAPTION_TEXT_CLASS: Record<Align, string> = {
  Left: 'md:order-2',
  Right: 'md:order-1',
};

/**
 * Without a caption the frame is 838 of the 1300px content box (64.5%) and
 * `image_align` pushes it to one side.
 */
const SOLO_FRAME_CLASS: Record<Align, string> = {
  Left: 'md:w-[64.5%] md:mr-auto',
  Right: 'md:w-[64.5%] md:ml-auto',
};

/**
 * `primary` is a union across the two variations, so narrow on `variation`
 * before reaching for the caption-only fields.
 */
const caption = computed(() => {
  const slice = props.slice;
  if (slice.variation !== 'default') return null;

  const { name, role } = slice.primary;
  if (!isFilled.keyText(name) && !isFilled.keyText(role)) return null;

  return { name, role };
});

const align = computed<Align>(() => props.slice.primary.image_align ?? 'Left');
const ratio = computed<Ratio>(() => props.slice.primary.image_ratio ?? '3/2');

const frameColorClass = computed(
  () =>
    FRAME_CLASS[props.slice.primary.frame_color ?? 'Pink'] ?? FRAME_CLASS.Pink,
);
const tiltClass = computed(
  () => TILT_CLASS[props.slice.primary.tilt ?? 'Left'] ?? TILT_CLASS.Left,
);

const layoutClass = computed(() =>
  caption.value
    ? (CAPTION_LAYOUT_CLASS[align.value] ?? CAPTION_LAYOUT_CLASS.Left)
    : '',
);
const frameWrapperClass = computed(() =>
  caption.value
    ? (CAPTION_FRAME_CLASS[align.value] ?? CAPTION_FRAME_CLASS.Left)
    : (SOLO_FRAME_CLASS[align.value] ?? SOLO_FRAME_CLASS.Left),
);
const captionWrapperClass = computed(
  () => CAPTION_TEXT_CLASS[align.value] ?? CAPTION_TEXT_CLASS.Right,
);

/** "Auto" lets the photo set its own height; the other ratios fill a sized box. */
const isAuto = computed(() => ratio.value === 'Auto');
const mediaClass = computed(() =>
  isAuto.value
    ? ['w-full']
    : ['w-full', 'overflow-hidden', RATIO_CLASS[ratio.value]],
);
const imageClass = computed(() =>
  isAuto.value ? 'h-auto w-full' : 'h-full w-full object-cover object-center',
);

const sizes = computed(() =>
  caption.value
    ? '(min-width: 768px) 56vw, 92vw'
    : '(min-width: 768px) 62vw, 92vw',
);

const hasImage = computed(() => isFilled.image(props.slice.primary.image));
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="mx-auto max-w-[1440px] px-4 py-10 md:px-[70px] md:py-[24px]">
      <div v-if="hasImage" class="flex flex-col gap-8" :class="layoutClass">
        <div :class="frameWrapperClass">
          <!-- Coloured picture frame: the photo sits inside its padding. -->
          <div class="p-3 md:p-[21px]" :class="[frameColorClass, tiltClass]">
            <div :class="mediaClass">
              <PrismicImage
                :field="slice.primary.image"
                :widths="WIDTHS"
                :sizes="sizes"
                loading="lazy"
                :class="imageClass"
              />
            </div>
          </div>
        </div>

        <div
          v-if="caption"
          class="flex items-center justify-center px-3 py-8 text-center font-abc font-bold text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.5]"
          :class="captionWrapperClass"
        >
          <div>
            <span v-if="caption.name" class="block text-alborota-black">
              {{ caption.name }}
            </span>
            <span v-if="caption.role" class="block text-alborota-black/50">
              {{ caption.role }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
