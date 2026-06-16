<script setup>
const route = useRoute();
// TODO: fetch header singleton from Prismic
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
    <NuxtLink to="/" aria-label="Inicio">
      <!-- Logo here -->
    </NuxtLink>
    <nav aria-label="Navegación principal" class="flex items-center gap-4">
      <NuxtLink active-class="underline" to="/tienda">Tienda</NuxtLink>
      <NuxtLink active-class="underline" to="/galeria">Galería</NuxtLink>
      <NuxtLink active-class="underline" to="/nosotros">Nosotros</NuxtLink>
      <NuxtLink active-class="underline" to="/cotizar">Cotizar</NuxtLink>
    </nav>
  </header>
</template>
