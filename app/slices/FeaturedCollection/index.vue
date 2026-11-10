<script setup lang="ts">
import type { Content } from '@prismicio/client';
import type { Product } from '~/types/product';

/** How many products the All Products variation pulls. Fixed by design — editors
 * choose the source and the order, not the count. */
const ALL_PRODUCTS_COUNT = 3;

const props = defineProps(
  getSliceComponentProps<Content.FeaturedCollectionSlice>(),
);

/**
 * `primary` is a union across the two variations, so the variation-specific
 * fields have to be read behind a `variation` narrow.
 */
const collectionId = computed(() =>
  props.slice.variation === 'default'
    ? props.slice.primary.shopify_collection_id
    : null,
);

const randomize = computed(() =>
  props.slice.variation === 'allProducts'
    ? props.slice.primary.randomize
    : false,
);

const { data } = await useAsyncData(
  `featured-collection-${props.slice.variation}-${props.slice.id}`,
  async () => {
    if (props.slice.variation === 'allProducts') {
      const res = await $fetch('/api/products', {
        query: { first: ALL_PRODUCTS_COUNT },
      });

      // No collectionId, so /api/products returns the bare products connection.
      const nodes = (res as { nodes?: Product[] } | null)?.nodes ?? [];

      // Shuffled here, not in a computed: this runs on the server and the order
      // is serialized into the payload, so the hydrated DOM matches the HTML.
      return randomize.value ? shuffle(nodes) : nodes;
    }

    if (!collectionId.value) return [];

    const res = await $fetch('/api/products', {
      query: { collectionId: String(collectionId.value), first: 3 },
    });

    // The collection branch returns the collection object, not the connection.
    return (
      (res as { products?: { nodes: Product[] } } | null)?.products?.nodes ?? []
    );
  },
  // `randomize` is watched so toggling it in the Page Builder / slice simulator
  // refetches and reshuffles instead of showing a stale order.
  { watch: [collectionId, randomize] },
);

const products = computed<Product[]>(() => data.value ?? []);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <FeaturedProductCollection
      :heading="slice.primary.heading"
      :cta="slice.primary.cta"
      :products="products"
      :layout="slice.variation === 'allProducts' ? 'grid' : 'row'"
    />
  </section>
</template>
