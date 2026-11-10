<script setup lang="ts">
import type { KeyTextField, LinkField } from "@prismicio/client";

defineProps<{
  heading?: KeyTextField | string;
  cta?: LinkField;
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-8 w-full max-w-[747px] mx-auto text-center">
    <h2
      v-if="heading"
      class="font-abc font-bold uppercase text-alborota-black text-[clamp(1.75rem,5vw,2.5rem)] leading-tight"
    >
      {{ heading }}
    </h2>

    <PrismicLink
      v-if="cta?.link_type && cta.link_type !== 'Any'"
      :field="cta"
      class="inline-flex items-center justify-center border border-alborota-black min-w-[154px] px-6 py-1 font-abc font-bold uppercase text-[0.9375rem] text-alborota-black transition-colors hover:bg-alborota-black hover:text-alborota-cream"
    />
  </div>
</template>
