<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Minus from '~/assets/icons/minus.svg';
import Plus from '~/assets/icons/plus.svg';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    id: string;
    min?: number;
    max?: number;
    invalid?: boolean;
    describedby?: string;
  }>(),
  { min: 1, max: 99 },
);

const emit = defineEmits<{ 'update:modelValue': [number]; blur: [] }>();

const clamp = (n: number) => Math.min(Math.max(Math.round(n), props.min), props.max);

// Mirrors the prop while typing so a half-typed value isn't clamped mid-keystroke.
const draft = ref(String(props.modelValue));
watch(() => props.modelValue, (value) => { draft.value = String(value); });

const commit = (raw: string) => {
  const parsed = Number.parseInt(raw, 10);
  const next = Number.isNaN(parsed) ? props.min : clamp(parsed);
  draft.value = String(next);
  if (next !== props.modelValue) emit('update:modelValue', next);
};

const step = (delta: number) => {
  const next = clamp(props.modelValue + delta);
  if (next !== props.modelValue) emit('update:modelValue', next);
};

const atMin = computed(() => props.modelValue <= props.min);
const atMax = computed(() => props.modelValue >= props.max);
</script>

<template>
  <!-- h-[40px] matches UiSelectControl and UiTextControl so every single-line
       field in the form sits on the same baseline. The buttons stretch to fill
       it instead of setting their own vertical padding. -->
  <div
    class="flex h-[40px] items-stretch justify-between border p-px"
    :class="invalid ? 'border-alborota-danger' : 'border-black/[0.12]'"
  >
    <button
      type="button"
      aria-label="Disminuir cantidad"
      :disabled="atMin"
      class="flex shrink-0 items-center justify-center px-[24px] text-alborota-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      @click="step(-1)"
    >
      <!-- Minus is fill-drawn; icon-raw leaves its own fill alone. -->
      <Minus class="icon-raw !h-[2px] !w-[10px]" aria-hidden="true" />
    </button>

    <!-- type="text" + inputmode avoids the native number spinners, which would
         break the design's symmetry with the minus/plus buttons. -->
    <input
      :id="id"
      v-model="draft"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      class="w-full min-w-[24px] bg-transparent p-0 text-center font-sans text-base leading-[24px] text-alborota-ink outline-none"
      @change="commit(draft)"
      @blur="commit(draft); emit('blur')"
    />

    <button
      type="button"
      aria-label="Aumentar cantidad"
      :disabled="atMax"
      class="flex shrink-0 items-center justify-center px-[24px] text-alborota-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      @click="step(1)"
    >
      <Plus class="icon-raw !size-[10px]" aria-hidden="true" />
    </button>
  </div>
</template>
