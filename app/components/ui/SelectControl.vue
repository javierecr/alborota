<script setup lang="ts">
import { computed } from 'vue';
import ChevronDown from '~/assets/icons/chevron-down.svg';

export type SelectOption = { value: string; label?: string; hint?: string; disabled?: boolean };

// A real <select> sits transparently over a painted row: the native control
// keeps keyboard support and the mobile picker, while the painted layer renders
// the right-hand dimension hint that a native <option> cannot show.
//
// `tone` and `size` mirror UiTextControl so the two stay on the same baseline;
// the defaults reproduce the product page exactly.
const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: SelectOption[];
    id: string;
    /** Shown in the painted row while nothing is selected. */
    placeholder?: string;
    invalid?: boolean;
    describedby?: string;
    tone?: 'subtle' | 'solid';
    size?: 'sm' | 'md';
  }>(),
  { tone: 'subtle', size: 'sm' },
);

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

const selected = computed(() => props.options.find((o) => o.value === props.modelValue));
const hasSelection = computed(() => !!props.modelValue && !!selected.value);
const selectedLabel = computed(() =>
  hasSelection.value
    ? (selected.value?.label ?? selected.value?.value ?? '')
    : (props.placeholder ?? ''),
);
const selectedHint = computed(() => (hasSelection.value ? (selected.value?.hint ?? '') : ''));

const borderClass = computed(() => {
  if (props.invalid) return 'border-alborota-danger';
  return props.tone === 'solid' ? 'border-alborota-ink' : 'border-alborota-ink/[0.12]';
});

const sizeClass = computed(() => (props.size === 'md' ? 'h-[47px]' : 'h-[40px]'));

// The unselected placeholder is dimmed to match the <input> placeholders beside it.
const labelToneClass = computed(() => {
  if (hasSelection.value) return 'text-alborota-ink';
  return props.tone === 'solid' ? 'text-alborota-ink/50' : 'text-alborota-ink/40';
});
</script>

<template>
  <!-- pr clears the chevron at right-[11.41px] so the hint never butts into it. -->
  <div
    class="relative flex items-center border pl-[13px] pr-[32px]"
    :class="[sizeClass, borderClass]"
  >
    <span class="truncate font-stevie text-[13px] leading-[24px]" :class="labelToneClass">
      {{ selectedLabel }}
    </span>

    <span v-if="selectedHint" class="ml-auto truncate pl-[12px] font-stevie text-[13px] leading-[24px] text-alborota-ink/60">
      {{ selectedHint }}
    </span>

    <ChevronDown class="icon-raw pointer-events-none absolute right-[11.41px] !h-[7px] !w-[10px]" aria-hidden="true" />

    <select
      :id="id"
      :value="modelValue"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      class="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="emit('blur')"
    >
      <!--
        Without an empty option the browser shows the first real one as selected
        while the model is still '', so the painted placeholder and the native
        picker would disagree. `disabled` keeps it unpickable once moved past.
      -->
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label ?? option.value }}{{ option.hint ? ` — ${option.hint}` : '' }}
      </option>
    </select>
  </div>
</template>
