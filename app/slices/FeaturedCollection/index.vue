<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Product } from "~/types/product";

const props = defineProps(
  getSliceComponentProps<Content.FeaturedCollectionSlice>(),
);

const collectionId = computed(() => props.slice.primary.shopify_collection_id);

const { data } = await useAsyncData(
  `featured-collection-${props.slice.id}`,
  () =>
    collectionId.value
      ? $fetch("/api/products", {
          query: { collectionId: String(collectionId.value), first: 3 },
        })
      : Promise.resolve(null),
  { watch: [collectionId] },
);

const products = computed<Product[]>(
  () => (data.value as { products?: { nodes: Product[] } } | null)
    ?.products?.nodes ?? [],
);

const { hasAvailableVariant, addingToCart, addedToCart, addProductToCart } =
  useProductHelpers();
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container mx-auto px-6 py-20 flex flex-col items-center gap-12">
      <FeaturedSectionHeader :heading="slice.primary.heading" :cta="slice.primary.cta" />

      <FeaturedCardRow v-if="products.length" gap="gap-7">
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
    </div>
  </section>
</template>
