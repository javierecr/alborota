<script setup>
import { components } from '~/slices';

definePageMeta({ layout: false });
</script>

<template>
  <SliceSimulator :components="components" />
</template>
