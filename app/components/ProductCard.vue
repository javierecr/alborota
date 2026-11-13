<script setup lang="ts">
import type { Product, Variant } from '~/types/product';

const emit = defineEmits(['add-to-cart']);

const props = withDefaults(
  defineProps<{
    product: Product;
    hasAvailableVariant: boolean;
    addingToCart: string | null;
    addedToCart?: string | null;
    firstAvailableVariant: Variant | null;
    collectionHandle?: string | null;
  }>(),
  {
    collectionHandle: null,
    addedToCart: null,
  },
);

const { formatMoney, shopifyImageUrl } = useFormatMoney();

const productLink = computed(() =>
  productPath(props.product, props.collectionHandle),
);

const formatPrice = (product: Product) => {
  const variant = props.firstAvailableVariant;

  if (variant?.price) {
    return formatMoney(variant.price.amount, variant.price.currencyCode);
  }

  if (product.priceRange?.minVariantPrice) {
    return formatMoney(
      product.priceRange.minVariantPrice.amount,
      product.priceRange.minVariantPrice.currencyCode,
    );
  }

  return '—';
};

const hasVariedPricing = computed(() => {
  const range = props.product.priceRange;
  if (!range?.maxVariantPrice) return false;
  return (
    Number(range.minVariantPrice.amount) !==
    Number(range.maxVariantPrice.amount)
  );
});

const compareAtPrice = computed(() => {
  const variant = props.firstAvailableVariant;
  if (!variant?.compareAtPrice) return null;
  const regular = Number(variant.compareAtPrice.amount);
  const current = Number(variant.price?.amount ?? 0);
  if (regular <= current) return null;
  return formatMoney(
    variant.compareAtPrice.amount,
    variant.compareAtPrice.currencyCode,
  );
});

const hasMultipleVariants = computed(
  () => (props.product.variants?.nodes?.length ?? 0) > 1,
);
</script>

<template>
  <article class="group flex flex-col gap-3">
    <NuxtLink
      :to="productLink"
      class="relative overflow-hidden bg-gray-100 aspect-square"
    >
      <img
        v-if="product.featuredImage"
        :src="shopifyImageUrl(product.featuredImage.url, 500)"
        :alt="product.featuredImage.altText || product.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-400">
        Sin imagen
      </div>
    </NuxtLink>

    <div class="flex flex-col gap-2">
      <NuxtLink :to="productLink" class="text-sm font-medium line-clamp-2 hover:underline">
        {{ product.title }}
      </NuxtLink>

      <div class="flex justify-between items-start gap-2">
        <div class="flex flex-col gap-1">
          <p v-if="compareAtPrice" class="text-xs line-through opacity-50">
            {{ compareAtPrice }}
          </p>
          <p class="text-sm font-semibold">
            <span v-if="hasVariedPricing">Desde </span>{{ formatPrice(product) }}
          </p>
        </div>

        <span
          v-if="!hasAvailableVariant"
          class="text-xs font-medium px-2 py-1 border border-gray-400 rounded opacity-60 whitespace-nowrap"
        >
          Agotado
        </span>
        <NuxtLink
          v-else-if="hasMultipleVariants"
          :to="productLink"
          class="text-xs font-medium px-2 py-1 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition whitespace-nowrap"
        >
          Ver opciones
        </NuxtLink>
        <button
          v-else
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded border transition-colors"
          :class="
            addedToCart === product.id
              ? 'bg-gray-800 border-gray-800'
              : 'border-gray-800 hover:bg-gray-800 hover:text-white'
          "
          :disabled="addingToCart === product.id"
          :aria-label="
            addingToCart === product.id
              ? 'Agregando...'
              : addedToCart === product.id
                ? 'Agregado'
                : 'Agregar al carrito'
          "
          @click="emit('add-to-cart')"
        >
          <svg
            v-if="addingToCart === product.id"
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <svg
            v-else-if="addedToCart === product.id"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
