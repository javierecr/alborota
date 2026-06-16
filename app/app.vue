<script setup>
const { restore } = useCart();
onMounted(() => restore());
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
