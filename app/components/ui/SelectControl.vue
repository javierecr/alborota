<script setup lang="ts">
import { computed } from 'vue';
import ChevronDown from '~/assets/icons/chevron-down.svg';

export type SelectOption = { value: string; label?: string; hint?: string; disabled?: boolean };

// A real <select> sits transparently over a painted row: the native control
// keeps keyboard support and the mobile picker, while the painted layer renders
// the right-hand dimension hint that a native <option> cannot show.
const props = defineProps<{
  modelValue: string;
  options: SelectOption[];
  id: string;
  invalid?: boolean;
  describedby?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

const selected = computed(() => props.options.find((o) => o.value === props.modelValue));
const selectedLabel = computed(() => selected.value?.label ?? selected.value?.value ?? '');
const selectedHint = computed(() => selected.value?.hint ?? '');
</script>

<template>
  <!-- pr clears the chevron at right-[11.41px] so the hint never butts into it. -->
  <div
    class="relative flex h-[40px] items-center border pl-[13px] pr-[32px]"
    :class="invalid ? 'border-alborota-danger' : 'border-alborota-ink/[0.12]'"
  >
    <span class="truncate font-stevie text-[13px] leading-[24px] text-alborota-ink">{{ selectedLabel }}</span>

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
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label ?? option.value }}{{ option.hint ? ` — ${option.hint}` : '' }}
      </option>
    </select>
  </div>
</template>
