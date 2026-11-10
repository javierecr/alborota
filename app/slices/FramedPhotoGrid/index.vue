<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(
  getSliceComponentProps<Content.FramedPhotoGridSlice>(),
);

type FrameColor = NonNullable<
  Content.FramedPhotoGridSliceDefaultPrimary['frame_color']
>;
type Columns = NonNullable<
  Content.FramedPhotoGridSliceDefaultPrimary['columns']
>;

const WIDTHS = [480, 640, 960, 1280];

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

const COLUMNS_CLASS: Record<Columns, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
};

/** Rendered photo width per breakpoint, so Prismic's CDN serves a sane size. */
const SIZES: Record<Columns, string> = {
  '2': '(min-width: 768px) 44vw, 92vw',
  '3': '(min-width: 768px) 29vw, 92vw',
};

const columns = computed<Columns>(() => props.slice.primary.columns ?? '2');

const frameClass = computed(
  () =>
    FRAME_CLASS[props.slice.primary.frame_color ?? 'Olive'] ??
    FRAME_CLASS.Olive,
);
const columnsClass = computed(
  () => COLUMNS_CLASS[columns.value] ?? COLUMNS_CLASS['2'],
);
const sizes = computed(() => SIZES[columns.value] ?? SIZES['2']);

/** A row with no image has nothing to frame, so drop it. */
const photos = computed(() =>
  props.slice.primary.photos.filter((photo) => isFilled.image(photo.image)),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="mx-auto max-w-[1440px] px-4 py-10 md:p-[70px]">
      <div
        v-if="photos.length"
        class="grid gap-10 md:gap-[32px]"
        :class="columnsClass"
      >
        <figure
          v-for="(photo, i) in photos"
          :key="i"
          class="m-0 flex flex-col items-center gap-5 md:gap-[30px]"
        >
          <!-- Coloured picture frame: the photo sits inside its padding. -->
          <div
            class="w-full p-3 md:px-[28px] md:py-[20px]"
            :class="frameClass"
          >
            <div class="aspect-[576/364] w-full overflow-hidden">
              <PrismicImage
                :field="photo.image"
                :widths="WIDTHS"
                :sizes="sizes"
                loading="lazy"
                class="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <figcaption
            v-if="photo.name || photo.role"
            class="max-w-[248px] text-center font-abc font-bold text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.5]"
          >
            <span v-if="photo.name" class="block text-alborota-black">
              {{ photo.name }}
            </span>
            <span v-if="photo.role" class="block text-alborota-black/50">
              {{ photo.role }}
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
