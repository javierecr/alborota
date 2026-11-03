<script setup lang="ts">
import Zoom from '~/assets/icons/zoom.svg';

// Figma "Xoom Button". Rendered as a <span> when it sits inside a larger
// button (the media tile is itself the control), so no interactive element is
// ever nested inside another.
withDefaults(defineProps<{ tag?: 'button' | 'span'; label?: string }>(), {
  tag: 'button',
  label: 'Ampliar imagen',
});

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <!-- text-alborota-ink sets currentColor, which the magnifier is drawn with. -->
  <component
    :is="tag"
    v-bind="tag === 'button'
      ? { type: 'button', 'aria-label': label }
      : { 'aria-hidden': 'true' }"
    class="absolute bottom-[12px] right-[12px] flex size-[44.8px] items-center justify-center rounded-full bg-[#fcfcfc] text-alborota-ink shadow-[0px_0px_0px_1px_rgba(66,67,66,0.12)] transition-transform duration-200 group-hover:scale-105"
    :class="tag === 'span' ? 'pointer-events-none' : ''"
    @click="tag === 'button' ? emit('click') : undefined"
  >
    <Zoom class="icon-raw !size-[13.6px]" />
  </component>
</template>
