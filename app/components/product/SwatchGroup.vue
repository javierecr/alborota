<script setup lang="ts">
export type Swatch = { value: string; colors: string[]; disabled?: boolean };

// Native radios, visually hidden rather than display:none, so the group keeps
// arrow-key navigation and focus for free. Colour alone can't convey the
// choice, so every swatch carries the option value as its accessible name.
defineProps<{
  modelValue: string;
  name: string;
  swatches: Swatch[];
}>();

const emit = defineEmits<{ 'update:modelValue': [string] }>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-[32px] gap-y-[12px]">
    <label
      v-for="swatch in swatches"
      :key="swatch.value"
      class="flex h-[39px] min-w-[96px] items-center justify-center gap-[8px] px-[8px] ring-1 transition-opacity"
      :class="[
        modelValue === swatch.value ? 'ring-alborota-ink' : 'ring-transparent',
        swatch.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-alborota-ink',
      ]"
    >
      <input
        type="radio"
        class="sr-only"
        :name="name"
        :value="swatch.value"
        :checked="modelValue === swatch.value"
        :disabled="swatch.disabled"
        :aria-label="swatch.value"
        @change="emit('update:modelValue', swatch.value)"
      />

      <!-- No metaobject for this value: fall back to the label so the control
           is never a row of blank space. -->
      <span v-if="!swatch.colors.length" class="font-stevie text-[0.8125rem] leading-[24px] text-alborota-ink">
        {{ swatch.value }}
      </span>
      <template v-else>
        <!-- The inset ring keeps near-white palette colours visible on cream. -->
        <span
          v-for="(color, i) in swatch.colors"
          :key="i"
          class="size-[22px] shrink-0 rounded-full ring-1 ring-inset ring-black/[0.06]"
          :style="{ backgroundColor: color }"
          aria-hidden="true"
        />
      </template>
    </label>
  </div>
</template>
