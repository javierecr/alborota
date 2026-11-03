<script setup lang="ts">
defineProps<{ total: number; activeIndex: number }>();

const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <div v-if="total > 1" class="flex items-center justify-center gap-[8px]">
    <button
      v-for="n in total"
      :key="n"
      type="button"
      :aria-label="`Ir a la imagen ${n}`"
      :aria-current="n - 1 === activeIndex ? 'true' : undefined"
      class="size-[7px] rounded-full transition-colors"
      :class="n - 1 === activeIndex ? 'bg-alborota-ink' : 'bg-alborota-ink/25'"
      @click="emit('select', n - 1)"
    />
    <span class="sr-only" aria-live="polite">Imagen {{ activeIndex + 1 }} de {{ total }}</span>
  </div>
</template>
