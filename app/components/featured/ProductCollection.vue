<script setup lang="ts">
/**
 * Shared product-row layout for the FeaturedCollection slice and the product
 * page's recommended row. Owns the cart wiring so no call site repeats it.
 *
 * Layouts:
 * - "row"  — the equal-width hover-expand row. Tuned for exactly 3 cards: each
 *            <FeaturedCard> sits at md:flex-1 and grows to flex-grow 2 on hover.
 * - "grid" — a wrapping grid for larger sets, where the row's 2/4 · 1/4 · 1/4
 *            split would collapse. Columns come from Tailwind breakpoints only,
 *            never from a JS viewport read, so SSR and hydration agree.
 *
 * The <section> element is deliberately NOT rendered here — the slice owns it so
 * it can carry its own data-slice-type / data-slice-variation attributes.
 */
import type { KeyTextField, LinkField } from "@prismicio/client";
import type { Product } from "~/types/product";

withDefaults(
  defineProps<{
    heading?: KeyTextField | string;
    cta?: LinkField;
    products: Product[];
    layout?: "row" | "grid";
  }>(),
  { layout: "row" },
);

const { hasAvailableVariant, addingToCart, addedToCart, addProductToCart } =
  useProductHelpers();
</script>

<template>
  <div class="container mx-auto px-6 py-20 flex flex-col items-center gap-12">
    <FeaturedSectionHeader :heading="heading" :cta="cta" />

    <FeaturedCardRow v-if="products.length && layout === 'row'" gap="gap-7">
      <FeaturedProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :has-available-variant="hasAvailableVariant(product)"
        :adding-to-cart="addingToCart"
        :added-to-cart="addedToCart"
        @add-to-cart="addProductToCart(product)"
      />
    </FeaturedCardRow>

    <div
      v-else-if="products.length"
      class="grid w-full gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      <FeaturedProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :has-available-variant="hasAvailableVariant(product)"
        :adding-to-cart="addingToCart"
        :added-to-cart="addedToCart"
        @add-to-cart="addProductToCart(product)"
      />
    </div>
  </div>
</template>
