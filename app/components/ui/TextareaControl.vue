<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    id: string;
    rows?: number;
    maxlength?: number;
    placeholder?: string;
    invalid?: boolean;
    describedby?: string;
  }>(),
  { rows: 4, maxlength: 500 },
);

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

const length = computed(() => props.modelValue?.length ?? 0);
</script>

<template>
  <div class="flex flex-col gap-[4px]">
    <textarea
      :id="id"
      :value="modelValue"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      class="w-full resize-none border bg-transparent p-[13px] font-stevie-book text-[13px] leading-[22px] text-alborota-ink outline-none placeholder:text-alborota-ink/40 focus-visible:border-alborota-ink"
      :class="invalid ? 'border-alborota-danger' : 'border-alborota-ink/[0.12]'"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="emit('blur')"
    />
    <span class="self-end font-stevie text-[11px] leading-[16px] text-alborota-ink/60" aria-hidden="true">
      {{ length }}/{{ maxlength }}
    </span>
  </div>
</template>
