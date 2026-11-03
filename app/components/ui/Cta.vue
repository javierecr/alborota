<script setup lang="ts">
import { computed } from 'vue';

// Figma "CTA Tienda". `small` is the product-page variant; `highlighted` is the
// wider paper-chip version used elsewhere in the shop.
const props = withDefaults(
  defineProps<{
    variant?: 'small' | 'highlighted';
    as?: 'button' | 'link';
    to?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
  }>(),
  { variant: 'small', as: 'button', type: 'button', disabled: false },
);

const component = computed(() => (props.as === 'link' ? resolveComponent('NuxtLink') : 'button'));

const variantClass = computed(() =>
  props.variant === 'highlighted'
    ? 'chip-paper bg-alborota-stone min-w-[154px] px-[24px] py-[4px] text-[15px] leading-[18px]'
    : 'border border-black px-[12px] py-[4px] text-[13px] leading-[13px] hover:bg-alborota-black hover:text-alborota-cream',
);
</script>

<template>
  <component
    :is="component"
    v-bind="as === 'link' ? { to } : { type, disabled }"
    class="inline-flex items-center justify-center font-abc font-bold uppercase text-alborota-black no-underline transition-colors hover:no-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-alborota-black"
    :class="variantClass"
  >
    <slot />
  </component>
</template>
