<script setup lang="ts">
/**
 * Row wrapper for the featured sections. Stacks vertically on mobile and lays
 * the cards out in an equal-width row on md+. The hover-expand behaviour itself
 * lives on each <FeaturedCard> root.
 */
withDefaults(
  defineProps<{
    /** Tailwind gap utility for the row, e.g. "gap-7" (28px) or "gap-[18px]". */
    gap?: string;
  }>(),
  { gap: "gap-7" },
);
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-stretch w-full" :class="gap">
    <slot />
  </div>
</template>
