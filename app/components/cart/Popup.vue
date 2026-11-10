<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useBodyScrollLock } from '~/composables/useBodyScrollLock';
import { useFormatMoney } from '~/composables/useFormatMoney';
// Imported explicitly because it is only referenced from the template, where
// auto-import resolution is not guaranteed.
import Close from '~/assets/icons/close.svg';
import { lineKey, useCart } from '~/composables/useCart';

// Figma "Tienda - 8" (node 2017:451). Fixed 572×780 panel anchored under the
// header on desktop; a full-screen right-to-left sliding panel on mobile.
const {
  items,
  isEmpty,
  subtotal,
  isCartOpen,
  closeCart,
  updateQuantity,
  removeFromCart,
  createCheckout,
} = useCart();

const { formatMoney } = useFormatMoney();
const route = useRoute();
const viewport = useViewport();

// `isMobile` never drives markup that server-renders — only side effects, the
// Tab-trap branch, and `aria-modal` on an element that only exists client-side.
// nuxt-viewport has no configured fallback breakpoint, so its SSR guess is not
// reliable; every visual breakpoint rule below is plain CSS instead.
const isMobile = computed(() => viewport.isLessThan('md'));

const panel = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

// Mobile is genuinely modal (full screen, page locked); desktop deliberately is
// not, so the page behind keeps scrolling and stays reachable.
useBodyScrollLock(() => isCartOpen.value && isMobile.value);

const currencyCode = computed(
  () => items.value[0]?.price.currencyCode ?? 'MXN',
);
const formattedTotal = computed(() =>
  formatMoney(subtotal.value, currencyCode.value, { withCode: false }),
);

const isCheckingOut = ref(false);
const checkoutError = ref('');

const GENERIC_CHECKOUT_ERROR =
  'No pudimos iniciar el checkout. Intenta de nuevo.';

// /api/checkout answers 422 with Shopify's own userErrors message, e.g. "The
// merchandise with id … does not exist." Carts live in localStorage
// indefinitely, so a deleted or unavailable variant is a realistic failure —
// and "intenta de nuevo" would be wrong advice, since retrying can't fix it.
const checkoutErrorMessage = (error: unknown): string => {
  const data = (
    error as { data?: { statusMessage?: string; message?: string } }
  )?.data;
  const message = data?.statusMessage || data?.message;
  return message?.trim() ? message : GENERIC_CHECKOUT_ERROR;
};

const goToCheckout = async () => {
  if (isCheckingOut.value || isEmpty.value) return;
  isCheckingOut.value = true;
  checkoutError.value = '';
  try {
    window.location.href = await createCheckout();
    // Deliberately left true on success: we're navigating away, and this blocks
    // a double submit during the hand-off to Shopify.
  } catch (error) {
    checkoutError.value = checkoutErrorMessage(error);
    isCheckingOut.value = false;
  }
};

// `pointerdown` rather than `click`: the press that opened the popup has already
// completed by the time this listener exists, so it can't close what it just
// opened. Capture phase so an inner stopPropagation can't hide the press, and
// the header button is excluded so it keeps owning its own open/close toggle.
const onPointerDown = (event: PointerEvent) => {
  const target = event.target as Element | null;
  if (!target || panel.value?.contains(target)) return;
  if (target.closest('[data-cart-trigger]')) return;
  closeCart();
};

// On document, not the panel: the desktop popup is non-modal, so focus may well
// be out in the page when the user reaches for Escape.
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCart();
    return;
  }
  if (event.key !== 'Tab' || !isMobile.value) return;

  // Keep focus inside the panel while it is modal. Trapping on desktop, where
  // the page is visibly scrollable, would be confusing.
  const focusable = panel.value?.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable?.length) return;
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const removeListeners = () => {
  if (!import.meta.client) return;
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('keydown', onKeydown);
};

watch(isCartOpen, (open) => {
  if (!import.meta.client) return;
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement | null;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeydown);
    nextTick(() => closeButton.value?.focus());
  } else {
    removeListeners();
  }
});

// Runs after the leave transition, so focus lands once the panel is gone.
const restoreFocus = () => {
  previouslyFocused?.focus?.();
  previouslyFocused = null;
};

// Navigating away must never strand the scroll lock.
watch(
  () => route.fullPath,
  () => closeCart(),
);

onBeforeUnmount(removeListeners);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
      enter-from-class="translate-x-full md:translate-x-0 md:-translate-y-[8px] md:opacity-0"
      enter-to-class="translate-x-0 md:translate-y-0 md:opacity-100"
      leave-active-class="transition-[transform,opacity] duration-200 ease-in motion-reduce:transition-none"
      leave-from-class="translate-x-0 md:translate-y-0 md:opacity-100"
      leave-to-class="translate-x-full md:translate-x-0 md:-translate-y-[8px] md:opacity-0"
      @after-leave="restoreFocus"
    >
      <!-- `top-0 right-0 w-full` rather than `inset-0`: a bottom-0 would fight
           the dvh height. `bg-alborota-cream` is load-bearing, not decorative —
           without it the page shows through during the mobile slide. -->
      <div
        v-if="isCartOpen"
        id="cart-popup"
        ref="panel"
        role="dialog"
        :aria-modal="isMobile ? 'true' : undefined"
        aria-labelledby="cart-popup-title"
        tabindex="-1"
        class="fixed right-0 top-0 z-[100] flex h-[100dvh] w-full flex-col bg-alborota-cream px-[20px] pb-[calc(24px+env(safe-area-inset-bottom))] pt-[12px] will-change-transform md:top-[var(--header-height,88px)] md:h-[780px] md:max-h-[calc(100dvh-var(--header-height,88px)-16px)] md:w-[572px] md:border-b md:border-l md:border-black/[0.12] md:px-[32px] md:pb-[24px]"
      >
        <div class="flex shrink-0 items-center justify-between">
          <h2
            id="cart-popup-title"
            class="font-abc text-[1.5625rem] font-bold leading-[43px] text-alborota-black"
          >
            Carrito
          </h2>
          <button
            ref="closeButton"
            type="button"
            aria-label="Cerrar carrito"
            class="-m-[10px] p-[10px] text-alborota-black transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink"
            @click="closeCart"
          >
            <Close class="icon-raw !size-[15.5px]" aria-hidden="true" />
          </button>
        </div>

        <!-- min-h-0 is required for a scrolling child of a flex column;
             overscroll-contain stops chaining into the unlocked desktop page. -->
        <ul
          v-if="!isEmpty"
          class="mt-[48px] flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto overscroll-contain"
        >
          <CartLineItem
            v-for="item in items"
            :key="lineKey(item)"
            :item="item"
            @update:quantity="updateQuantity(lineKey(item), $event)"
            @remove="removeFromCart(lineKey(item))"
          />
        </ul>

        <div
          v-else
          class="mt-[48px] flex min-h-0 flex-1 flex-col items-center justify-center gap-[16px] text-center"
        >
          <p
            class="font-stevie text-xs uppercase leading-[18.7px] text-black/50"
          >
            Tu carrito está vacío
          </p>
          <NuxtLink
            to="/tienda"
            class="font-abc text-[0.8125rem] font-bold uppercase leading-[18px] text-alborota-black underline underline-offset-2"
          >
            Ir a la tienda
          </NuxtLink>
        </div>

        <div v-if="!isEmpty" class="flex shrink-0 flex-col gap-[10px]">
          <div
            class="flex flex-col gap-[2px] border-t border-black py-[12px] font-stevie text-xs leading-[18.7px] text-black"
          >
            <div class="flex items-center justify-between gap-[12px]">
              <span class="uppercase">Costo de envío:</span>
              <span class="text-right">Se calcula en el checkout</span>
            </div>
            <div class="flex items-center justify-between gap-[12px] uppercase">
              <span>Total:</span>
              <span aria-live="polite" class="text-right">{{
                formattedTotal
              }}</span>
            </div>
          </div>

          <button
            type="button"
            :disabled="isCheckingOut"
            class="w-full border border-black bg-white px-[24px] pb-[8px] pt-[12px] font-stevie text-xs uppercase leading-[18.7px] text-alborota-black transition-colors hover:bg-alborota-black hover:text-alborota-cream focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-alborota-black"
            @click="goToCheckout"
          >
            <span aria-live="polite">{{
              isCheckingOut ? 'Procesando…' : 'Checkout'
            }}</span>
          </button>

          <p
            v-if="checkoutError"
            role="alert"
            class="font-stevie text-[0.6875rem] leading-[16px] text-alborota-danger"
          >
            {{ checkoutError }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
