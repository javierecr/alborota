<script setup lang="ts">
import { computed } from 'vue';
import Close from '~/assets/icons/close.svg';
import Minus from '~/assets/icons/minus.svg';
import Plus from '~/assets/icons/plus.svg';
import type { CartItem } from '~/composables/useCart';
import { useFormatMoney } from '~/composables/useFormatMoney';

// Figma "Cart Line Item" (node 2017:591).
const props = defineProps<{ item: CartItem }>();

const emit = defineEmits<{ 'update:quantity': [number]; remove: [] }>();

const { formatMoney, shopifyImageUrl } = useFormatMoney();

const MAX_QUANTITY = 99; // Matches UiStepperControl's ceiling.

// Shopify gives single-variant products the placeholder title "Default Title",
// which would read as a meaningless category line in the design's subtitle slot.
const subtitle = computed(() => {
  const title = props.item.variantTitle?.trim();
  return !title || title === 'Default Title' ? '' : title;
});

// Lines that differ only by attributes (see `lineKey`) would otherwise look
// identical. Delivery date/place are short enough to show inline; the free-text
// "Mensaje Personalizado" is left out so it can't blow up the row height.
const SHOWN_ATTRIBUTES = ['Fecha de entrega', 'Lugar de entrega'];
const attributes = computed(() =>
  (props.item.attributes ?? []).filter(
    (a) => SHOWN_ATTRIBUTES.includes(a.key) && a.value?.trim(),
  ),
);

const linePrice = computed(() =>
  formatMoney(
    parseFloat(props.item.price.amount) * props.item.quantity,
    props.item.price.currencyCode,
    { withCode: false },
  ),
);

const atMin = computed(() => props.item.quantity <= 1);
const atMax = computed(() => props.item.quantity >= MAX_QUANTITY);

const step = (delta: number) => {
  const next = props.item.quantity + delta;
  if (next < 1 || next > MAX_QUANTITY) return;
  emit('update:quantity', next);
};
</script>

<template>
  <li class="flex gap-[28px]">
    <img
      v-if="item.image?.url"
      :src="shopifyImageUrl(item.image.url, 320)"
      :alt="item.image.altText || item.title"
      loading="lazy"
      class="h-[129px] w-[104px] shrink-0 bg-alborota-paper object-cover"
    />
    <div v-else class="h-[129px] w-[104px] shrink-0 bg-alborota-paper" />

    <div class="flex min-w-0 flex-1 flex-col gap-[40px]">
      <div class="flex flex-col gap-[2px]">
        <div class="flex items-start justify-between gap-[12px]">
          <p
            class="[word-break:break-word] font-abc text-[15px] font-bold uppercase leading-[18px] text-alborota-ink"
          >
            {{ item.title }}
          </p>
          <!-- The design has no trash affordance, so removal lives here. -->
          <button
            type="button"
            :aria-label="`Quitar ${item.title} del carrito`"
            class="-m-[10px] shrink-0 p-[10px] text-alborota-ink/50 transition-colors hover:text-alborota-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink"
            @click="emit('remove')"
          >
            <Close class="icon-raw !size-[10px]" aria-hidden="true" />
          </button>
        </div>

        <p
          v-if="subtitle"
          class="font-stevie text-[12px] uppercase leading-[18.7px] text-black/50"
        >
          {{ subtitle }}
        </p>

        <p
          v-for="attribute in attributes"
          :key="attribute.key"
          class="[word-break:break-word] font-stevie text-[12px] leading-[18.7px] text-black/50"
        >
          {{ attribute.key }}: {{ attribute.value }}
        </p>
      </div>

      <div class="flex items-center justify-between gap-[12px]">
        <!-- Borderless stepper: UiStepperControl is a bordered 40px form field
             and doesn't fit here. The negative margins keep the design's 28px
             gaps while giving the 13px icons a ~33px touch target. -->
        <div class="flex items-center gap-[28px]">
          <button
            type="button"
            :disabled="atMin"
            :aria-label="`Disminuir cantidad de ${item.title}`"
            class="-m-[10px] flex items-center justify-center p-[10px] text-alborota-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink"
            @click="step(-1)"
          >
            <!-- minus.svg has preserveAspectRatio="none", so it stretches to the design's 13×1. -->
            <Minus class="icon-raw !h-[1px] !w-[13px]" aria-hidden="true" />
          </button>

          <span
            class="min-w-[12px] text-center font-stevie text-[12px] uppercase leading-[18.7px] tabular-nums text-black"
          >
            {{ item.quantity }}
          </span>

          <button
            type="button"
            :disabled="atMax"
            :aria-label="`Aumentar cantidad de ${item.title}`"
            class="-m-[10px] flex items-center justify-center p-[10px] text-alborota-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-alborota-ink"
            @click="step(1)"
          >
            <Plus class="icon-raw !size-[13px]" aria-hidden="true" />
          </button>
        </div>

        <span
          class="shrink-0 text-right font-stevie text-[12px] leading-[18.7px] text-black"
        >
          {{ linePrice }}
        </span>
      </div>
    </div>
  </li>
</template>
