<script setup lang="ts">
import { computed, useId } from 'vue';

// Owns the legend + error markup so every control in the product form looks and
// behaves the same. `as="fieldset"` is for grouped controls (the swatches),
// where a <legend> is the correct label element.
const props = withDefaults(
  defineProps<{
    label: string;
    error?: string;
    as?: 'div' | 'fieldset';
    /** The control's own id, so the <label> points at it. */
    controlId?: string;
  }>(),
  { as: 'div' },
);

const uid = useId();
const errorId = computed(() => (props.error ? `${uid}-error` : undefined));

const labelClass = 'font-stevie text-[12.8px] leading-[24px] text-alborota-ink';
const errorClass = 'font-stevie text-[11px] leading-[16px] text-alborota-danger';
</script>

<template>
  <!--
    A fieldset is laid out separately rather than with `flex`: browsers treat
    <legend> as out-of-flow, so a flex fieldset drops the gap between the legend
    and the controls.
  -->
  <fieldset v-if="as === 'fieldset'" class="m-0 min-w-0 border-0 p-0">
    <legend :class="[labelClass, 'mb-[8px] p-0']">{{ label }}</legend>

    <slot :error-id="errorId" />

    <p v-if="error" :id="errorId" role="alert" :class="[errorClass, 'mt-[8px]']">{{ error }}</p>
  </fieldset>

  <div v-else class="flex min-w-0 flex-col gap-[8px]">
    <label :for="controlId" :class="labelClass">{{ label }}</label>

    <slot :error-id="errorId" />

    <p v-if="error" :id="errorId" role="alert" :class="errorClass">{{ error }}</p>
  </div>
</template>
