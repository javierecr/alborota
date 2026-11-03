<script setup>
onMounted(() => {
  if (!import.meta.client) return;
  const headerHeight = document.querySelector('header')?.clientHeight;
  document.querySelector('body').style.setProperty('--header-height', `${headerHeight}px`);
});
</script>

<template>
  <Header />
  <CartPopup />
  <div class="min-h-dvh grid grid-rows-[1fr_auto]" :style="{ paddingTop: `var(--header-height, 88px)` }">
    <main class="grid [&>*]:min-w-0">
      <slot />
    </main>
    <Footer />
  </div>
</template>
