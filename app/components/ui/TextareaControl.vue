<script setup lang="ts">
import { computed } from 'vue';

// `tone` mirrors UiTextControl. `showCount` is on by default for the product
// page's 500-character message; the quote form's design has no counter.
//
// `fill` swaps the row-based height for `h-full`, so the textarea can be sized
// by its wrapper — the quote form pairs it with a 100px input and both boxes
// must match exactly.
const props = withDefaults(
  defineProps<{
    modelValue: string;
    id: string;
    rows?: number;
    maxlength?: number;
    placeholder?: string;
    invalid?: boolean;
    describedby?: string;
    tone?: 'subtle' | 'solid';
    showCount?: boolean;
    fill?: boolean;
  }>(),
  { rows: 4, maxlength: 500, tone: 'subtle', showCount: true, fill: false },
);

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

const length = computed(() => props.modelValue?.length ?? 0);

const borderClass = computed(() => {
  if (props.invalid) return 'border-alborota-danger';
  return props.tone === 'solid' ? 'border-alborota-ink' : 'border-alborota-ink/[0.12]';
});

const toneClass = computed(() =>
  props.tone === 'solid'
    ? 'pl-[13px] pr-[25px] py-[11px] font-stevie placeholder:text-alborota-ink/50'
    : 'p-[13px] font-stevie-book placeholder:text-alborota-ink/40',
);
</script>

<template>
  <div class="flex flex-col gap-[4px]" :class="fill ? 'h-full' : ''">
    <textarea
      :id="id"
      :value="modelValue"
      :rows="fill ? undefined : rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      class="w-full resize-none border bg-transparent text-[0.8125rem] leading-[22px] text-alborota-ink outline-none focus-visible:border-alborota-ink"
      :class="[toneClass, borderClass, fill ? 'h-full' : '']"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="emit('blur')"
    />
    <span
      v-if="showCount"
      class="self-end font-stevie text-[0.6875rem] leading-[16px] text-alborota-ink/60"
      aria-hidden="true"
    >
      {{ length }}/{{ maxlength }}
    </span>
  </div>
</template>
