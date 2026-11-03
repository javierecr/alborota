<script setup lang="ts">
import { computed } from 'vue';

// Same bordered box as UiSelectControl, so every single-line field in a form
// reads as one family.
//
// Two axes vary between the designs that use it:
//   tone — `subtle` is the product page's hairline rule, `solid` is the quote
//          form's full-weight #424342 border with a slightly stronger placeholder.
//   size — `sm` 40px (product page), `md` 47px (quote form), `lg` 100px (the
//          quote form's "Cantidad" box, which pairs with a 100px textarea).
//
// Defaults reproduce the product page exactly, so adding these changed nothing
// for existing call sites.
const props = withDefaults(
  defineProps<{
    modelValue: string;
    id: string;
    type?: 'text' | 'date' | 'email';
    min?: string;
    placeholder?: string;
    maxlength?: number;
    /** For numeric fields: pair `type="text"` with `inputmode="numeric"` rather
     *  than `type="number"`, matching UiStepperControl — it avoids the native
     *  spinners, which no design here wants. */
    inputmode?: 'text' | 'email' | 'numeric' | 'decimal' | 'tel';
    autocomplete?: string;
    invalid?: boolean;
    describedby?: string;
    tone?: 'subtle' | 'solid';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { type: 'text', tone: 'subtle', size: 'sm' },
);

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

const borderClass = computed(() => {
  if (props.invalid) return 'border-alborota-danger';
  return props.tone === 'solid' ? 'border-alborota-ink' : 'border-alborota-ink/[0.12]';
});

// Full class strings, never interpolated — Tailwind's scanner can't see
// constructed names and would purge them.
const sizeClass = computed(
  () => ({ sm: 'h-[40px]', md: 'h-[47px]', lg: 'h-[100px]' })[props.size],
);

const toneClass = computed(() =>
  props.tone === 'solid'
    ? 'pl-[13px] pr-[25px] placeholder:text-alborota-ink/50'
    : 'px-[13px] placeholder:text-alborota-ink/40',
);
</script>

<template>
  <input
    :id="id"
    :value="modelValue"
    :type="type"
    :min="min"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :inputmode="inputmode"
    :autocomplete="autocomplete"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedby"
    class="w-full border bg-transparent font-stevie text-[13px] leading-[24px] text-alborota-ink outline-none focus-visible:border-alborota-ink"
    :class="[sizeClass, toneClass, borderClass]"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @blur="emit('blur')"
  />
</template>
