<script setup>
import Cart from '~/assets/icons/cart.svg';
import Search from '~/assets/icons/search.svg';
import User from '~/assets/icons/user.svg';

const prismic = usePrismic();

const { data, error } = await useAsyncData('$header', async () => {
  const doc = await prismic.client.getSingle('header');
  return { doc };
});

if (error.value) {
  throw createError({ statusCode: 404, message: 'Página no encontrada' });
}

const doc = computed(() => data.value?.doc);

const { itemCount, isCartOpen, openCart, closeCart } = useCart();
const toggleCart = () => (isCartOpen.value ? closeCart() : openCart());
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-2 bg-alborota-cream">
    <NuxtLink to="/" aria-label="Inicio">
      <PrismicImage class="w-auto h-[4.5rem]"  :field="doc?.data.logo" />
    </NuxtLink>
    <nav aria-label="Navegación principal" class="flex items-center gap-16">
      <PrismicLink v-for="link in doc?.data.navigation" :key="link.id" class="font-abc font-bold uppercase hover:underline" active-class="underline" :field="link.link">
        {{ link.label }}
      </PrismicLink>
    </nav>
    <div class="flex items-center gap-9">
      <button class="hover:scale-[1.1] transform-origin-center transition-transform duration-300">
        <Search class="w-auto h-4.5" />
      </button>
      <button class="hover:scale-[1.1] transform-origin-center transition-transform duration-300">
        <User class="w-auto h-4" />
      </button>
      <!-- data-cart-trigger keeps CartPopup's outside-click handler from closing
           on the same press that this button toggles on. -->
      <button
        type="button"
        data-cart-trigger
        :aria-label="`Carrito (${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'})`"
        aria-controls="cart-popup"
        :aria-expanded="isCartOpen"
        class="relative inline-flex hover:scale-[1.1] transform-origin-center transition-transform duration-300"
        @click="toggleCart"
      >
        <Cart class="w-auto h-4" />
        <span class="absolute left-[55%] top-[64%] whitespace-nowrap font-stevie-book text-[0.6875rem] leading-[14px]">( {{ itemCount }} )</span>
      </button>
    </div>
  </header>
</template>
