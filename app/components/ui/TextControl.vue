<script setup lang="ts">
// Same 40px bordered box as UiSelectControl, so the personalizable fields read
// as one family with Tamaño and Cantidad.
withDefaults(
  defineProps<{
    modelValue: string;
    id: string;
    type?: 'text' | 'date';
    min?: string;
    placeholder?: string;
    maxlength?: number;
    invalid?: boolean;
    describedby?: string;
  }>(),
  { type: 'text' },
);

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();
</script>

<template>
  <input
    :id="id"
    :value="modelValue"
    :type="type"
    :min="min"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedby"
    class="h-[40px] w-full border bg-transparent px-[13px] font-stevie text-[13px] leading-[24px] text-alborota-ink outline-none placeholder:text-alborota-ink/40 focus-visible:border-alborota-ink"
    :class="invalid ? 'border-alborota-danger' : 'border-alborota-ink/[0.12]'"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @blur="emit('blur')"
  />
</template>
