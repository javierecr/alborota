<script setup lang="ts">
import ChevronAccordion from '~/assets/icons/chevron-accordion.svg';

// Native <details>: works without JS, renders correctly from the server, and
// gets aria-expanded plus keyboard toggling from the browser for free.
withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: false });
</script>

<template>
  <details class="group w-full border-y border-alborota-ink/[0.12] py-px" :open="open">
    <summary
      class="flex cursor-pointer list-none items-center justify-between py-[20px] pr-[20px] font-stevie-book text-[0.84375rem] leading-[22px] text-alborota-ink"
    >
      <span>{{ title }}</span>
      <span
        aria-hidden="true"
        class="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-alborota-ink/10 transition-transform duration-200 group-open:rotate-180"
      >
        <ChevronAccordion class="icon-raw !h-[6px] !w-[8px]" />
      </span>
    </summary>

    <div class="pb-[20px] font-stevie-book text-[0.84375rem] leading-[22px] text-alborota-ink">
      <slot />
    </div>
  </details>
</template>
