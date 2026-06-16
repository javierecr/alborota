<script setup lang="ts">
import type { Content } from "@prismicio/client";

defineProps(getSliceComponentProps<Content.BannerWithTextSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    Placeholder component for banner_with_text (variation:
    {{ slice.variation }}) slices.

    <br />
    <strong>You can edit this slice directly in your code editor.</strong>
    <!--
	💡 Use your own AI agent with the Prismic CLI
	📚 Docs: https://prismic.io/docs/ai#create-slices
-->
  </section>
</template>
