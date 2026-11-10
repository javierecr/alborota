<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import ArrowLeft from '~/assets/icons/arrow-left.svg';
import ArrowRight from '~/assets/icons/arrow-right.svg';
import { fromLocalIso, toLocalIso } from '~/utils/localDate';

// An always-visible month grid, per the Cotizar design. Hand-rolled rather than
// pulled from a library: the design is a single-date month grid with bespoke
// square borders and Spanish single-letter weekday initials, so a datepicker
// dependency would be ~60kB of code to then override.
//
// Belongs in a <UiFieldShell as="fieldset">: a composite widget needs a <legend>
// for its accessible name, because <label for> only binds to labelable elements.
const props = defineProps<{
  /** 'YYYY-MM-DD', or '' for no selection. */
  modelValue: string;
  id: string;
  /** 'YYYY-MM-DD' — earlier days render disabled. */
  min?: string;
  invalid?: boolean;
  describedby?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [] }>();

// Dates travel as local 'YYYY-MM-DD' strings, matching the contract
// useProductForm settled on — see ~/utils/localDate for why not toISOString().
const toIso = toLocalIso;
const fromIso = fromLocalIso;

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/** Monday-first index: JS getDay() is 0=Sunday. */
const weekIndex = (date: Date) => (date.getDay() + 6) % 7;

// Single lowercase initials, as drawn. Intl's es-MX short names are "lun."-style
// and don't match, so these are literal.
const WEEKDAYS = ['l', 'm', 'm', 'j', 'v', 's', 'd'];

const monthFormatter = new Intl.DateTimeFormat('es-MX', { month: 'long' });
const fullDateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const cursor = ref(startOfMonth(fromIso(props.modelValue) ?? new Date()));

watch(
  () => props.modelValue,
  (value) => {
    const parsed = fromIso(value);
    if (parsed) cursor.value = startOfMonth(parsed);
  },
);

// Figma shows "Enero 2026"; Intl's es-MX long form is "enero de 2026".
const monthLabel = computed(() => {
  const month = monthFormatter.format(cursor.value);
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${cursor.value.getFullYear()}`;
});

/**
 * Always 42 cells (6 rows), so the box never changes height as months are
 * paged through — which is what the fixed-height design implies.
 */
const days = computed(() => {
  const first = cursor.value;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - weekIndex(first));

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = toIso(date);
    return {
      iso,
      day: date.getDate(),
      label: fullDateFormatter.format(date),
      outside: date.getMonth() !== first.getMonth(),
      disabled: !!props.min && iso < props.min,
      selected: iso === props.modelValue,
    };
  });
});

const canGoPrev = computed(() => {
  const minDate = props.min ? fromIso(props.min) : null;
  return !minDate || cursor.value > startOfMonth(minDate);
});

// --- roving tabindex --------------------------------------------------------
// One cell is tabbable at a time and the arrow keys move between them, per the
// WAI-ARIA grid pattern. 42 separate tab stops would be the alternative.

const rootRef = ref<HTMLElement | null>(null);
const focusedIso = ref('');

const inCursorMonth = (iso: string) => {
  const date = fromIso(iso);
  return !!date && date.getFullYear() === cursor.value.getFullYear() && date.getMonth() === cursor.value.getMonth();
};

const activeIso = computed(() => {
  if (focusedIso.value && inCursorMonth(focusedIso.value)) return focusedIso.value;
  if (props.modelValue && inCursorMonth(props.modelValue)) return props.modelValue;
  return toIso(cursor.value);
});

const focusCell = async (iso: string) => {
  focusedIso.value = iso;
  await nextTick();
  rootRef.value?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)?.focus();
};

const moveFocus = (deltaDays: number) => {
  const base = fromIso(activeIso.value);
  if (!base) return;
  const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + deltaDays);
  if (startOfMonth(next).getTime() !== cursor.value.getTime()) cursor.value = startOfMonth(next);
  focusCell(toIso(next));
};

const shiftMonth = (delta: number) => {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1);
};

const ARROW_DELTAS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

const onKeydown = (event: KeyboardEvent) => {
  const delta = ARROW_DELTAS[event.key];
  if (delta !== undefined) {
    event.preventDefault();
    moveFocus(delta);
    return;
  }

  const base = fromIso(activeIso.value);
  if (!base) return;

  if (event.key === 'Home') {
    event.preventDefault();
    moveFocus(-weekIndex(base));
  } else if (event.key === 'End') {
    event.preventDefault();
    moveFocus(6 - weekIndex(base));
  } else if (event.key === 'PageUp') {
    event.preventDefault();
    moveFocus(-28);
  } else if (event.key === 'PageDown') {
    event.preventDefault();
    moveFocus(28);
  }
};

const select = (iso: string, disabled: boolean) => {
  if (disabled) return;
  focusedIso.value = iso;
  emit('update:modelValue', iso);
};

// vee-validate's blur-to-touch needs one signal for the whole widget, not one
// per cell — otherwise paging months would mark the field touched.
const onFocusout = (event: FocusEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) emit('blur');
};

const borderClass = computed(() => (props.invalid ? 'border-alborota-danger' : 'border-alborota-black'));
const bodyBorderClass = computed(() => (props.invalid ? 'border-alborota-danger' : 'border-alborota-ink'));
</script>

<template>
  <div ref="rootRef" class="flex flex-col" @focusout="onFocusout">
    <!-- Header carries the top border; the body below supplies the other three. -->
    <div class="flex h-[29px] shrink-0 items-center justify-between border px-[15px]" :class="borderClass">
      <button
        type="button"
        aria-label="Mes anterior"
        :disabled="!canGoPrev"
        class="flex size-[16px] items-center justify-center transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        @click="shiftMonth(-1)"
      >
        <ArrowLeft class="icon-raw !h-[10px] !w-[6px]" aria-hidden="true" />
      </button>

      <span aria-live="polite" class="font-stevie text-[0.8125rem] leading-[24px] text-alborota-ink">
        {{ monthLabel }}
      </span>

      <button
        type="button"
        aria-label="Mes siguiente"
        class="flex size-[16px] items-center justify-center"
        @click="shiftMonth(1)"
      >
        <ArrowRight class="icon-raw !h-[10px] !w-[6px]" aria-hidden="true" />
      </button>
    </div>

    <div
      :id="id"
      role="grid"
      :aria-describedby="describedby"
      :aria-invalid="invalid || undefined"
      class="border-x border-b"
      :class="bodyBorderClass"
      @keydown="onKeydown"
    >
      <div role="row" class="grid grid-cols-7">
        <span
          v-for="(weekday, i) in WEEKDAYS"
          :key="i"
          role="columnheader"
          class="flex h-[32px] items-center justify-center font-stevie text-[0.8125rem] font-bold leading-[24px] text-alborota-ink"
        >
          {{ weekday }}
        </span>
      </div>

      <div role="row" class="grid grid-cols-7">
        <button
          v-for="cell in days"
          :key="cell.iso"
          type="button"
          role="gridcell"
          :data-iso="cell.iso"
          :tabindex="cell.iso === activeIso ? 0 : -1"
          :disabled="cell.disabled"
          :aria-label="cell.label"
          :aria-pressed="cell.selected"
          class="flex h-[32px] items-center justify-center font-stevie text-[0.8125rem] leading-[24px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-alborota-ink"
          :class="[
            cell.selected
              ? 'bg-alborota-black text-alborota-cream'
              : cell.outside || cell.disabled
                ? 'text-alborota-ink/30'
                : 'text-alborota-ink hover:bg-alborota-ink/10',
            cell.disabled ? 'cursor-not-allowed' : '',
          ]"
          @click="select(cell.iso, cell.disabled)"
        >
          {{ cell.day }}
        </button>
      </div>
    </div>
  </div>
</template>
