<script setup lang="ts">
import type { Product, Variant } from '~/types/product';

const route = useRoute();
const { addToCart } = useCart();
const { formatMoney } = useFormatMoney();
const prismic = usePrismic();

const { data, pending, error } = await useAsyncData(`product-${route.params.handle}`, async () => {
  const product = await $fetch<Product>(`/api/products/${route.params.handle}`);
  return { product };
});

// Fetch Prismic product_page singleton for shipping/returns/free-shipping info
const { data: prismicData } = await useAsyncData('$product_page', () =>
  prismic.client.getSingle('product_page').catch(() => null),
);
const productPageDoc = computed(() => prismicData.value ?? null);

const product = computed(() => data.value?.product);
const selectedVariant = ref<Variant | null>(product.value?.variants?.nodes[0] ?? null);

const images = computed(() => product.value?.images?.nodes ?? []);

const selectedOptions = reactive<Record<string, string>>({});

watch(
  product,
  (value) => {
    if (!value) return;

    Object.keys(selectedOptions).forEach((key) => {
      delete selectedOptions[key];
    });

    const defaultVariant = value.variants?.nodes?.[0] ?? null;
    if (defaultVariant?.selectedOptions?.length) {
      defaultVariant.selectedOptions.forEach((option) => {
        selectedOptions[option.name] = option.value;
      });
    } else {
      value.options?.forEach((option) => {
        const firstValue = option.values?.[0];
        if (firstValue && !selectedOptions[option.name]) {
          selectedOptions[option.name] = firstValue;
        }
      });
    }
  },
  { immediate: true },
);

const selectedVariantComputed = computed(() => {
  if (!product.value?.variants?.nodes?.length) return null;

  return (
    product.value.variants.nodes.find((variant) =>
      variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
    ) ?? null
  );
});

watch(selectedVariantComputed, (value) => {
  selectedVariant.value = value;
});

const isOptionValueAvailable = (optionName: string, value: string, optionIndex: number): boolean => {
  const variants = product.value?.variants?.nodes ?? [];
  const priorNames = new Set((product.value?.options ?? []).slice(0, optionIndex).map((o) => o.name));

  return variants.some((variant) => {
    if (!variant.availableForSale) return false;
    return variant.selectedOptions.every((opt) => {
      if (opt.name === optionName) return opt.value === value;
      if (!priorNames.has(opt.name)) return true;
      const current = selectedOptions[opt.name];
      return !current || current === opt.value;
    });
  });
};

const formattedPrice = computed(() => {
  const variant = selectedVariant.value;
  if (variant?.price) {
    return formatMoney(variant.price.amount, variant.price.currencyCode);
  }

  if (!product.value?.priceRange?.minVariantPrice) {
    return '';
  }

  const { amount, currencyCode } = product.value.priceRange.minVariantPrice;
  return formatMoney(amount, currencyCode);
});

// Custom fields (message / delivery date / delivery place) for products tagged `personalizable`
const isPersonalizable = computed(() => product.value?.tags?.includes('personalizable') ?? false);
const customFields = reactive({ message: '', deliveryDate: '', deliveryPlace: '' });
const customFieldsTouched = ref(false);
const todayIso = new Date().toISOString().slice(0, 10);

const customFieldsValid = computed(
  () => !isPersonalizable.value || (!!customFields.deliveryDate && !!customFields.deliveryPlace.trim()),
);

const buildAttributes = () => {
  if (!isPersonalizable.value) return undefined;
  const attrs = [
    { key: 'Mensaje Personalizado', value: customFields.message.trim() },
    { key: 'Fecha de entrega', value: customFields.deliveryDate },
    { key: 'Lugar de entrega', value: customFields.deliveryPlace.trim() },
  ].filter((a) => a.value);
  return attrs.length ? attrs : undefined;
};

const quantity = ref(1);
const addingToCart = ref(false);
const addedToCartSuccess = ref(false);

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const addSelectedToCart = async () => {
  if (!product.value || !selectedVariant.value) {
    return;
  }

  customFieldsTouched.value = true;
  if (!customFieldsValid.value) return;

  try {
    addingToCart.value = true;

    addToCart({
      variantId: selectedVariant.value.id,
      productHandle: product.value.handle,
      title: product.value.title,
      variantTitle: selectedVariant.value.title,
      price: {
        amount: selectedVariant.value.price.amount,
        currencyCode: selectedVariant.value.price.currencyCode,
      },
      image: product.value.featuredImage ?? selectedVariant.value.image ?? null,
      quantity: quantity.value,
      attributes: buildAttributes(),
    });

    quantity.value = 1;
    customFields.message = '';
    customFields.deliveryDate = '';
    customFields.deliveryPlace = '';
    customFieldsTouched.value = false;

    await new Promise((resolve) => setTimeout(resolve, 350));
    addingToCart.value = false;
    addedToCartSuccess.value = true;

    setTimeout(() => {
      addedToCartSuccess.value = false;
    }, 2000);
  } catch (err) {
    addingToCart.value = false;
  }
};

const selectOption = (optionName: string, value: string) => {
  selectedOptions[optionName] = value;
};

useSeoMeta({
  title: () => product.value?.seo?.title ?? `${product.value?.title} | Alborota`,
  description: () => product.value?.seo?.description ?? product.value?.description ?? '',
  ogImage: () => product.value?.featuredImage?.url ?? '',
});
</script>

<template>
  <div v-if="pending" class="flex min-h-screen items-center justify-center p-8">
    <p>Cargando producto…</p>
  </div>

  <div v-else-if="error" class="flex min-h-screen items-center justify-center p-8">
    <div class="rounded border border-red-300 bg-red-50 px-6 py-8 text-red-700">
      <p>No pudimos encontrar este producto.</p>
    </div>
  </div>

  <article v-else-if="product" class="grid md:grid-cols-[1fr_1fr] gap-8 px-6 py-12 md:gap-12">
    <!-- Left Column: Images -->
    <div class="flex flex-col gap-4">
      <div v-for="(image, idx) in images" :key="idx" class="w-full bg-gray-100 aspect-square overflow-hidden">
        <img
          :src="image.url"
          :alt="image.altText || product.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Right Column: Product Info -->
    <div class="flex flex-col gap-8">
      <!-- Title & Price -->
      <div class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold">{{ product.title }}</h1>
        <p class="text-xl font-semibold">{{ formattedPrice }}</p>
      </div>

      <!-- Variant Selector -->
      <div v-if="product.options?.some((o) => o.values.length > 0)" class="flex flex-col gap-4">
        <div v-for="(option, optionIndex) in product.options" :key="option.id" class="flex flex-col gap-2">
          <label class="text-sm font-medium">{{ option.name }}</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="value in option.values"
              :key="value"
              type="button"
              class="px-4 py-2 border rounded text-sm transition"
              :class="
                selectedOptions[option.name] === value
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-800 hover:bg-gray-100'
              "
              :disabled="!isOptionValueAvailable(option.name, value, optionIndex)"
              @click="selectOption(option.name, value)"
            >
              {{ value }}
            </button>
          </div>
        </div>
      </div>

      <!-- Custom fields (personalizable products) -->
      <div v-if="isPersonalizable" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="custom-message" class="text-sm font-medium">Mensaje Personalizado (opcional)</label>
          <textarea
            id="custom-message"
            v-model="customFields.message"
            rows="3"
            maxlength="500"
            class="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="custom-date" class="text-sm font-medium">Fecha de entrega</label>
          <input
            id="custom-date"
            v-model="customFields.deliveryDate"
            type="date"
            :min="todayIso"
            required
            class="w-full border rounded px-3 py-2 text-sm"
          />
          <p v-if="customFieldsTouched && !customFields.deliveryDate" class="text-xs text-red-600">
            Elige una fecha de entrega.
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <label for="custom-place" class="text-sm font-medium">Lugar de entrega</label>
          <input
            id="custom-place"
            v-model="customFields.deliveryPlace"
            type="text"
            required
            class="w-full border rounded px-3 py-2 text-sm"
          />
          <p v-if="customFieldsTouched && !customFields.deliveryPlace.trim()" class="text-xs text-red-600">
            Indica el lugar de entrega.
          </p>
        </div>
      </div>

      <!-- Quantity & Add to Cart -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <div class="flex border rounded">
            <button
              type="button"
              class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
              :disabled="quantity <= 1"
              @click="decrementQuantity"
            >
              −
            </button>
            <span class="px-4 py-2 border-l border-r">{{ quantity }}</span>
            <button type="button" class="px-3 py-2 hover:bg-gray-100" @click="incrementQuantity">
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          class="w-full py-3 px-6 bg-gray-800 text-white font-medium rounded transition disabled:opacity-50"
          :disabled="!selectedVariant?.availableForSale || addingToCart || addedToCartSuccess"
          @click="addSelectedToCart"
        >
          <span v-if="addingToCart">Agregando…</span>
          <span v-else-if="addedToCartSuccess">✓ Agregado al carrito</span>
          <span v-else-if="!selectedVariant?.availableForSale">Agotado</span>
          <span v-else>Agregar al carrito</span>
        </button>
      </div>

      <!-- Free Shipping Text -->
      <div v-if="productPageDoc?.data?.free_shipping_text" class="text-sm text-gray-600 italic">
        {{ productPageDoc.data.free_shipping_text }}
      </div>

      <!-- Shipping & Returns -->
      <div v-if="productPageDoc?.data?.shipping || productPageDoc?.data?.returns" class="space-y-4 border-t pt-4">
        <div v-if="productPageDoc?.data?.shipping" class="text-sm text-gray-700">
          <h3 class="font-semibold mb-2">Envío</h3>
          <PrismicRichText :field="productPageDoc.data.shipping" class="prose prose-sm" />
        </div>

        <div v-if="productPageDoc?.data?.returns" class="text-sm text-gray-700">
          <h3 class="font-semibold mb-2">Devoluciones</h3>
          <PrismicRichText :field="productPageDoc.data.returns" class="prose prose-sm" />
        </div>
      </div>

      <!-- Description -->
      <div v-if="product.descriptionHtml || product.description" class="text-sm text-gray-700">
        <div v-if="product.descriptionHtml" v-html="product.descriptionHtml" class="prose prose-sm max-w-none" />
        <p v-else>{{ product.description }}</p>
      </div>
    </div>
  </article>
</template>
