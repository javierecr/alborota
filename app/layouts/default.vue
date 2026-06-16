<script setup>
const route = useRoute();

onMounted(() => {
if (!import.meta.client) return;

const headerHeight = document.querySelector('header')?.clientHeight;

document.querySelector('body').style.setProperty('--header-height', `${headerHeight}px`);
});
</script>

<template>
  <Header />
  <div class="min-h-dvh grid grid-rows-[1fr_auto]" :style="{ paddingTop: `var(--header-height, 88px)` }">
    <main>
      <slot />
    </main>
    <Footer class="sticky" v-if="route.path !== '/'" />
  </div>
</template>
