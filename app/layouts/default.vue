<script setup>
const route = useRoute();
</script>

<template>
  <Header />
  <main :class="{ 'pt-[4.5rem] pb-28': route.path !== '/' }">
    <slot />
  </main>
  <Footer v-if="route.path !== '/'" />
</template>
