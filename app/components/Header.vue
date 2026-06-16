<script setup>

import Cart from '~/assets/icons/cart.svg';
import Search from '~/assets/icons/search.svg';
import User from '~/assets/icons/user.svg';

const route = useRoute();
// TODO: fetch header singleton from Prismic
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-2">
    <NuxtLink to="/" aria-label="Inicio">
      <img src="assets/img/logo.png" alt="Alborota" class="w-auto h-[4.5rem]" />
    </NuxtLink>
    <nav aria-label="Navegación principal" class="flex items-center gap-16">
      <NuxtLink class="font-abc uppercase hover:underline" active-class="underline" to="/tienda">Tienda</NuxtLink>
      <NuxtLink class="font-abc uppercase hover:underline" active-class="underline" to="/galeria">Galería</NuxtLink>
      <NuxtLink class="font-abc uppercase hover:underline" active-class="underline" to="/nosotros">Nosotros</NuxtLink>
      <NuxtLink class="font-abc uppercase hover:underline" active-class="underline" to="/cotizar">Cotizar</NuxtLink>
    </nav>
    <div class="flex items-center gap-9">
      <button class="hover:scale-[1.1] transform-origin-center transition-transform duration-300">
        <User class="w-auto h-4" />
      </button>
      <button class="hover:scale-[1.1] transform-origin-center transition-transform duration-300">
        <Search class="w-auto h-4.5" />
      </button>
      <button class="hover:scale-[1.1] transform-origin-center transition-transform duration-300">
        <Cart class="w-auto h-4" />
      </button>
    </div>
  </header>
</template>
