<script setup>
import Cart from '~/assets/icons/cart.svg';
import Close from '~/assets/icons/close.svg';
import Hamburger from '~/assets/icons/hamburger.svg';

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
const route = useRoute();
const headerRef = ref(null);
const isMenuOpen = ref(false);
const closeMenu = () => {
  isMenuOpen.value = false;
};
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) closeCart();
};
const toggleCart = () => {
  closeMenu();
  isCartOpen.value ? closeCart() : openCart();
};

// Page scroll is locked while the mobile menu is open.
useBodyScrollLock(() => isMenuOpen.value);

watch(() => route.fullPath, closeMenu);

// `pointerdown` in capture phase so the press that opened the menu can't close it
// and inner stopPropagation can't hide the press. Presses inside the header are
// left to their own handlers.
const onPointerDown = (event) => {
  if (headerRef.value?.contains(event.target)) return;
  closeMenu();
};
const onKeydown = (event) => {
  if (event.key === 'Escape') closeMenu();
};

let mql;
const onBreakpoint = (event) => {
  if (event.matches) closeMenu();
};

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return;
  const method = open ? 'addEventListener' : 'removeEventListener';
  document[method]('pointerdown', onPointerDown, true);
  document[method]('keydown', onKeydown);
});

onMounted(() => {
  // The menu is hidden from md up; close it so the scroll lock can't get stuck.
  mql = window.matchMedia('(min-width: 768px)');
  mql.addEventListener('change', onBreakpoint);
});
onBeforeUnmount(() => {
  mql?.removeEventListener('change', onBreakpoint);
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <header ref="headerRef" class="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center h-20 px-6 bg-alborota-cream md:flex md:justify-between md:gap-4 md:h-auto md:py-2">
    <button type="button" class="justify-self-start md:hidden" :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
      aria-controls="mobile-menu" :aria-expanded="isMenuOpen" @click="toggleMenu">
      <Close v-if="isMenuOpen" class="icon-raw !size-3" />
      <Hamburger v-else class="icon-raw !w-8 !h-[11px]" />
    </button>
    <NuxtLink to="/" aria-label="Inicio" @click="closeMenu">
      <PrismicImage class="w-auto h-14 md:h-[4.5rem]" :field="doc?.data.logo" />
    </NuxtLink>
    <nav aria-label="Navegación principal" class="hidden md:flex items-center gap-16">
      <PrismicLink v-for="link in doc?.data.navigation" :key="link.id" class="font-abc font-bold uppercase hover:underline" active-class="underline" :field="link.link">
        {{ link.label }}
      </PrismicLink>
    </nav>
    <div class="flex items-center justify-self-end">
      <!-- data-cart-trigger keeps CartPopup's outside-click handler from closing on the same press -->
      <button type="button" data-cart-trigger
        :aria-label="`Carrito (${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'})`"
        aria-controls="cart-popup" :aria-expanded="isCartOpen"
        class="relative inline-flex hover:scale-[1.1] transform-origin-center transition-transform duration-300"
        @click="toggleCart">
        <Cart class="w-auto h-4" />
        <span class="absolute left-[55%] top-[64%] whitespace-nowrap font-stevie-book text-[0.6875rem] leading-[14px]">( {{ itemCount }} )</span>
      </button>
    </div>
    <Transition enter-active-class="transition-opacity duration-200 motion-reduce:transition-none" leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      enter-from-class="opacity-0" leave-to-class="opacity-0">
      <nav v-show="isMenuOpen" id="mobile-menu" aria-label="Menú móvil"
        class="md:hidden absolute left-0 right-0 top-full flex flex-col gap-2 px-6 py-3 bg-alborota-cream">
        <PrismicLink v-for="link in doc?.data.navigation" :key="link.id" class="font-abc font-bold uppercase text-xs leading-[1.25]" active-class="underline" :field="link.link">
          {{ link.label }}
        </PrismicLink>
      </nav>
    </Transition>
  </header>
</template>
