<script setup lang="ts">
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';

const props = defineProps(getSliceComponentProps<Content.ProcessStepsSlice>());

/**
 * Figma node 2016:354. On the 1440 artboard a step column is 314px wide
 * (22vw), two-up it is ~45vw, stacked it is the full content width.
 */
const WIDTHS = [320, 480, 640, 960];
const SIZES = '(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 92vw';

/**
 * Title ramp shared with HeadingWithQuote: 44px / 56px on the 1440 artboard,
 * i.e. 2.75rem at a 1.27 line-height, scaling down to 1.5rem on phones.
 */
const TITLE_CLASS =
  'font-abc font-bold uppercase text-alborota-black text-[clamp(1.5rem,3.1vw,2.75rem)] !leading-[1.27]';

/**
 * The step number and the step heading share one ramp: 25px / 43px
 * (Figma nodes 2015:286 and 2015:287).
 */
const STEP_HEADING_CLASS =
  'font-abc font-bold uppercase text-alborota-black text-[clamp(1.25rem,1.74vw,1.5625rem)] leading-[1.72]';

const hasTitle = computed(() => isFilled.keyText(props.slice.primary.heading));

/** A row with neither an image nor a heading has nothing to show, so drop it. */
const steps = computed(() =>
  props.slice.primary.steps.filter(
    (step) => isFilled.image(step.image) || isFilled.keyText(step.heading),
  ),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      class="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-10 md:gap-[80px] md:px-[56px] md:py-[80px]"
    >
      <h2 v-if="hasTitle" class="text-center" :class="TITLE_CLASS">
        {{ slice.primary.heading }}
      </h2>

      <!--
        An ordered process: the visible number is the item's position, so the
        markup is an <ol> and nothing in Prismic can desync the two.
      -->
      <ol
        v-if="steps.length"
        class="grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-2 md:gap-[24px] lg:grid-cols-4"
      >
        <li
          v-for="(step, i) in steps"
          :key="i"
          class="flex flex-col gap-6 md:gap-[34px]"
        >
          <!--
            1 / 1.3 box at the column's full width. The image is fitted inside
            it, so neither the transparent line drawings nor the photos are
            cropped and every column's number sits on the same baseline. The
            aspect box also reserves the space, so there is no layout shift.
          -->
          <div v-if="isFilled.image(step.image)" class="aspect-[1/1.3] w-full">
            <PrismicImage
              :field="step.image"
              :widths="WIDTHS"
              :sizes="SIZES"
              :loading="i < 2 ? 'eager' : 'lazy'"
              :fetchpriority="i < 2 ? 'high' : undefined"
              class="h-full w-full object-contain object-center"
            />
          </div>

          <div class="flex flex-col items-center gap-4 text-center">
            <span :class="STEP_HEADING_CLASS">{{ i + 1 }}</span>

            <div class="flex flex-col items-center gap-1">
              <h3 v-if="step.heading" :class="STEP_HEADING_CLASS">
                {{ step.heading }}
              </h3>
              <p
                v-if="step.text"
                class="font-stevie-book text-alborota-black text-[clamp(0.8125rem,0.94vw,0.84375rem)] leading-[1.63]"
              >
                {{ step.text }}
              </p>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
