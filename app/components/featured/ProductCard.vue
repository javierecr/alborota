<script setup lang="ts">
import type { Product } from "~/types/product";

const props = defineProps<{
  product: Product;
  hasAvailableVariant: boolean;
  addingToCart: string | null;
  addedToCart?: string | null;
}>();

const emit = defineEmits<{ (e: "add-to-cart"): void }>();

const { formatMoney, shopifyImageUrl } = useFormatMoney();

const price = computed(() => {
  const range = props.product.priceRange;
  if (!range?.minVariantPrice) return "—";

  const min = formatMoney(
    range.minVariantPrice.amount,
    range.minVariantPrice.currencyCode,
  );

  const max = range.maxVariantPrice;
  const hasRange =
    max && Number(max.amount) !== Number(range.minVariantPrice.amount);

  return hasRange
    ? `${min} - ${formatMoney(max.amount, max.currencyCode)}`
    : min;
});

const isAdding = computed(() => props.addingToCart === props.product.id);
const isAdded = computed(() => props.addedToCart === props.product.id);
</script>

<template>
  <FeaturedCard>
    <template #image>
      <img
        v-if="product.featuredImage?.url"
        :src="shopifyImageUrl(product.featuredImage.url, 800)"
        :alt="product.featuredImage.altText || product.title"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </template>

    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-2 min-w-0">
        <p class="font-abc font-bold uppercase text-[0.9375rem] leading-[18px] text-[#383839]">
          {{ product.title }}
        </p>
        <p class="font-stevie text-[0.9375rem] leading-[18.7px] text-alborota-black">
          {{ price }}
        </p>
      </div>

      <button
        type="button"
        class="shrink-0 font-stevie uppercase text-[0.9375rem] leading-[18.7px] text-alborota-black underline underline-offset-2 transition-opacity disabled:no-underline disabled:opacity-50"
        :disabled="!hasAvailableVariant || isAdding"
        @click="emit('add-to-cart')"
      >
        <template v-if="!hasAvailableVariant">Agotado</template>
        <template v-else-if="isAdding">Agregando…</template>
        <template v-else-if="isAdded">Agregado</template>
        <template v-else>Agregar</template>
      </button>
    </div>
  </FeaturedCard>
</template>
