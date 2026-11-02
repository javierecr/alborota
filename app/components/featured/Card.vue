<script setup lang="ts">
/**
 * Shared frame for the featured cards.
 *
 * Layout: a fixed-height image area (object-cover fills it) above a body slot.
 * Expand behaviour: at rest every card is equal width (`md:flex-1`); hovering a
 * card grows it to flex-grow 2 while its siblings stay at 1, producing the
 * 2/4 · 1/4 · 1/4 split. Because the image height is fixed and uses
 * object-cover, widening the card simply reveals a wider crop — no asset swap.
 */
</script>

<template>
  <article
    class="group flex flex-col gap-4 md:flex-1 md:basis-0 md:min-w-0 md:grow md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.4,0,0.2,1)] md:hover:grow-[2]"
  >
    <div
      class="relative w-full overflow-hidden bg-alborota-beige h-[clamp(280px,32vw,420px)]"
    >
      <slot name="image" />
    </div>

    <div class="flex-1">
      <slot />
    </div>
  </article>
</template>
