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
    /**
     * Keep the label in the accessibility tree but hide it visually, for designs
     * where the placeholder carries the field name (the quote form). `sr-only`
     * is absolutely positioned, so it drops out of flow and the flex gap below
     * still measures from the control, not from a zero-height label.
     */
    labelHidden?: boolean;
    /**
     * Take the error out of flow, hanging just below the control, so a message
     * appearing never pushes the fields underneath it down. The parent's gap has
     * to be at least the message's height (16px) plus its 2px offset.
     */
    floatingError?: boolean;
  }>(),
  { as: 'div', labelHidden: false, floatingError: false },
);

const uid = useId();
const errorId = computed(() => (props.error ? `${uid}-error` : undefined));

const labelClass = 'font-stevie text-[12.8px] leading-[24px] text-alborota-ink';
const errorClass = computed(() => [
  'font-stevie text-[11px] leading-[16px] text-alborota-danger',
  props.floatingError ? 'absolute left-0 top-full mt-[2px] w-full' : '',
]);
</script>

<template>
  <!--
    A fieldset is laid out separately rather than with `flex`: browsers treat
    <legend> as out-of-flow, so a flex fieldset drops the gap between the legend
    and the controls.
  -->
  <fieldset
    v-if="as === 'fieldset'"
    :class="['m-0 min-w-0 border-0 p-0', floatingError ? 'relative' : '']"
  >
    <legend :class="labelHidden ? 'sr-only' : [labelClass, 'mb-[8px] p-0']">{{ label }}</legend>

    <slot :error-id="errorId" />

    <p v-if="error" :id="errorId" role="alert" :class="[errorClass, floatingError ? '' : 'mt-[8px]']">{{ error }}</p>
  </fieldset>

  <div v-else :class="['flex min-w-0 flex-col gap-[8px]', floatingError ? 'relative' : '']">
    <label :for="controlId" :class="labelHidden ? 'sr-only' : labelClass">{{ label }}</label>

    <slot :error-id="errorId" />

    <p v-if="error" :id="errorId" role="alert" :class="errorClass">{{ error }}</p>
  </div>
</template>
