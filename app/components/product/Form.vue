<script setup lang="ts">
import { computed, toRef, useId } from 'vue';
import { useProductForm } from '~/composables/useProductForm';
import { PALETTE_OPTION_NAME, optionFieldPath, optionKey } from '~/utils/productOptionMeta';
import { shopifyRichTextToHtml } from '~/utils/shopifyRichText';
import { metafieldValue, type Product } from '~/types/product';
import type { SelectOption } from '~/components/ui/SelectControl.vue';
import type { Swatch } from '~/components/product/SwatchGroup.vue';

const props = defineProps<{ product: Product }>();

const product = toRef(props, 'product');

const {
  options,
  values,
  fieldError,
  touch,
  setFieldValue,
  isPersonalizable,
  minDate,
  formError,
  onSubmit,
  submitLabel,
  submitDisabled,
  formattedPrice,
  isOptionValueAvailable,
  maxQuantity,
  dimensionsHint,
} = useProductForm(product);

const uid = useId();
const fieldId = (name: string) => `${uid}-${name}`;

// --- option fields ----------------------------------------------------------

const optionValue = (index: number) => values.options?.[optionKey(index)] ?? '';

const setOption = (index: number, value: string) => {
  touch(optionFieldPath(index));
  setFieldValue(optionFieldPath(index) as never, value as never);
};

const optionError = (index: number) => fieldError(optionFieldPath(index));

/** Options rendered as a select — everything except the colour palette. */
const selectOptions = computed(() =>
  options.value
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.name !== PALETTE_OPTION_NAME),
);

const paletteOption = computed(() =>
  options.value
    .map((option, index) => ({ option, index }))
    .find(({ option }) => option.name === PALETTE_OPTION_NAME) ?? null,
);

const selectChoices = (optionName: string, values_: string[], index: number): SelectOption[] =>
  values_.map((value) => ({
    value,
    // The dimensions hint belongs to the *selected* size, so only the current
    // value carries it; the rest would be showing someone else's measurements.
    hint: value === optionValue(index) ? dimensionsHint.value : undefined,
    disabled: !isOptionValueAvailable(optionName, value, index),
  }));

const paletteSwatches = computed<Swatch[]>(() => {
  const entry = paletteOption.value;
  if (!entry) return [];
  const palettes = product.value.palettes ?? [];
  return entry.option.values.map((value) => ({
    value,
    colors: palettes.find((p) => p.nombre === value)?.colors ?? [],
    disabled: !isOptionValueAvailable(entry.option.name, value, entry.index),
  }));
});

// --- copy -------------------------------------------------------------------

const detalles = computed(() => metafieldValue(product.value, 'detalles') || product.value.description || '');

const descripcionHtml = computed(() => {
  const fromMetafield = shopifyRichTextToHtml(metafieldValue(product.value, 'descripcion_producto'));
  return fromMetafield || product.value.descriptionHtml || '';
});

const produccionEnvioHtml = computed(() =>
  shopifyRichTextToHtml(metafieldValue(product.value, 'tiempos_produccion_envio')),
);
</script>

<template>
  <form class="flex flex-col gap-[40px]" novalidate @submit.prevent="onSubmit">
    <!-- Price + Agregar -->
    <div class="flex w-full flex-col gap-[16px]">
      <div class="flex w-full items-center justify-between gap-[16px]">
        <p class="font-abc text-[20px] font-bold leading-[30px] text-alborota-ink">{{ formattedPrice }}</p>
        <UiCta type="submit" :disabled="submitDisabled">
          <span aria-live="polite">{{ submitLabel }}</span>
        </UiCta>
      </div>
      <p v-if="formError" role="alert" class="font-stevie text-[11px] leading-[16px] text-alborota-danger">
        {{ formError }}
      </p>
    </div>

    <!-- Detalles -->
    <div v-if="detalles" class="flex w-full flex-col gap-[8px]">
      <p class="font-stevie text-[12.8px] leading-[24px] text-alborota-ink">Detalles:</p>
      <p class="whitespace-pre-line font-stevie-book text-[13.5px] leading-[22px] text-alborota-ink">
        {{ detalles }}
      </p>
    </div>

    <!-- Options (selects) + Cantidad -->
    <div class="flex w-full flex-col gap-[16px] md:flex-row md:gap-[4px]">
      <UiFieldShell
        v-for="{ option, index } in selectOptions"
        :key="option.id"
        class="flex-1"
        :label="`${option.name}:`"
        :control-id="fieldId(optionKey(index))"
        :error="optionError(index)"
      >
        <template #default="{ errorId }">
          <UiSelectControl
            :id="fieldId(optionKey(index))"
            :model-value="optionValue(index)"
            :options="selectChoices(option.name, option.values, index)"
            :invalid="!!optionError(index)"
            :describedby="errorId"
            @update:model-value="setOption(index, $event)"
            @blur="touch(optionFieldPath(index))"
          />
        </template>
      </UiFieldShell>

      <UiFieldShell
        class="flex-1"
        label="Cantidad:"
        :control-id="fieldId('quantity')"
        :error="fieldError('quantity')"
      >
        <template #default="{ errorId }">
          <UiStepperControl
            :id="fieldId('quantity')"
            :model-value="values.quantity ?? 1"
            :max="maxQuantity"
            :invalid="!!fieldError('quantity')"
            :describedby="errorId"
            @update:model-value="touch('quantity'); setFieldValue('quantity', $event)"
            @blur="touch('quantity')"
          />
        </template>
      </UiFieldShell>
    </div>

    <!-- Colores -->
    <UiFieldShell
      v-if="paletteOption"
      as="fieldset"
      label="Colores:"
      :error="optionError(paletteOption.index)"
    >
      <ProductSwatchGroup
        :model-value="optionValue(paletteOption.index)"
        :name="fieldId('palette')"
        :swatches="paletteSwatches"
        @update:model-value="setOption(paletteOption!.index, $event)"
      />
    </UiFieldShell>

    <!-- Personalizable fields -->
    <div v-if="isPersonalizable" class="flex w-full flex-col gap-[16px]">
      <UiFieldShell
        label="Mensaje Personalizado (opcional):"
        :control-id="fieldId('message')"
        :error="fieldError('message')"
      >
        <template #default="{ errorId }">
          <UiTextareaControl
            :id="fieldId('message')"
            :model-value="values.message ?? ''"
            :invalid="!!fieldError('message')"
            :describedby="errorId"
            placeholder="¿Qué te gustaría que dijera la tarjeta?"
            @update:model-value="setFieldValue('message', $event)"
            @blur="touch('message')"
          />
        </template>
      </UiFieldShell>

      <div class="flex flex-col gap-[16px] md:flex-row md:gap-[4px]">
        <UiFieldShell
          class="flex-1"
          label="Fecha de entrega:"
          :control-id="fieldId('deliveryDate')"
          :error="fieldError('deliveryDate')"
        >
          <template #default="{ errorId }">
            <UiTextControl
              :id="fieldId('deliveryDate')"
              type="date"
              :min="minDate"
              :model-value="values.deliveryDate ?? ''"
              :invalid="!!fieldError('deliveryDate')"
              :describedby="errorId"
              @update:model-value="setFieldValue('deliveryDate', $event)"
              @blur="touch('deliveryDate')"
            />
          </template>
        </UiFieldShell>

        <UiFieldShell
          class="flex-1"
          label="Lugar de entrega:"
          :control-id="fieldId('deliveryPlace')"
          :error="fieldError('deliveryPlace')"
        >
          <template #default="{ errorId }">
            <UiTextControl
              :id="fieldId('deliveryPlace')"
              :model-value="values.deliveryPlace ?? ''"
              :invalid="!!fieldError('deliveryPlace')"
              :describedby="errorId"
              placeholder="Calle, número, colonia y ciudad"
              @update:model-value="setFieldValue('deliveryPlace', $event)"
              @blur="touch('deliveryPlace')"
            />
          </template>
        </UiFieldShell>
      </div>
    </div>

    <!-- Accordions -->
    <div v-if="descripcionHtml || produccionEnvioHtml" class="flex w-full flex-col gap-[16px]">
      <UiDetails v-if="descripcionHtml" title="Descripción de Producto">
        <div class="product-rich-text" v-html="descripcionHtml" />
      </UiDetails>
      <UiDetails v-if="produccionEnvioHtml" title="Tiempos de Producción y envío">
        <div class="product-rich-text" v-html="produccionEnvioHtml" />
      </UiDetails>
    </div>
  </form>
</template>

<style scoped>
/* Shopify rich-text metafields render as raw HTML, so the spacing lives here
   rather than on classes we don't control. */
.product-rich-text :deep(p + p),
.product-rich-text :deep(ul),
.product-rich-text :deep(ol) {
  margin-top: 0.75rem;
}

.product-rich-text :deep(ul),
.product-rich-text :deep(ol) {
  padding-left: 1.25rem;
  list-style: revert;
}

.product-rich-text :deep(a) {
  text-decoration: underline;
}
</style>
