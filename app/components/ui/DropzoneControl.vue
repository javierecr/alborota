<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import Close from '~/assets/icons/close.svg';
import imageGalleryUrl from '~/assets/icons/image-gallery.png';
import paperClipUrl from '~/assets/icons/paper-clip.png';

// Drag-and-drop image picker for the quote form. Holds File objects only —
// uploading them is the caller's job (see useCloudinaryUpload), because
// Formspark rejects submissions carrying file bodies and stores links instead.
//
// Belongs in a <UiFieldShell as="fieldset">: a composite widget needs a
// <legend> for its accessible name.
const props = withDefaults(
  defineProps<{
    modelValue: File[];
    id: string;
    accept?: string;
    maxFiles?: number;
    maxSizeMb?: number;
    invalid?: boolean;
    describedby?: string;
  }>(),
  { accept: 'image/*', maxFiles: 5, maxSizeMb: 10 },
);

const emit = defineEmits<{
  'update:modelValue': [File[]];
  blur: [];
  /** A human-readable Spanish reason, or '' when the last batch was clean. */
  reject: [string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);

// --- previews ---------------------------------------------------------------
// Object URLs are leaked memory until revoked, so they are tracked against the
// File they came from and released the moment that File leaves the model.

const previews = ref<{ file: File; url: string }[]>([]);

watch(
  () => props.modelValue,
  (files) => {
    if (import.meta.server) return;

    const next = files.map(
      (file) => previews.value.find((p) => p.file === file) ?? { file, url: URL.createObjectURL(file) },
    );

    for (const previous of previews.value) {
      if (!next.some((p) => p.url === previous.url)) URL.revokeObjectURL(previous.url);
    }

    previews.value = next;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  for (const preview of previews.value) URL.revokeObjectURL(preview.url);
});

// --- adding and removing ----------------------------------------------------

const isSameFile = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

const addFiles = (incoming: FileList | File[] | null | undefined) => {
  if (!incoming) return;

  const accepted = [...props.modelValue];
  let rejection = '';

  for (const file of Array.from(incoming)) {
    if (!file.type.startsWith('image/')) {
      rejection ||= `«${file.name}» no es una imagen.`;
      continue;
    }
    if (file.size > props.maxSizeMb * 1024 * 1024) {
      rejection ||= `«${file.name}» pesa más de ${props.maxSizeMb} MB.`;
      continue;
    }
    // Dropping the same file twice is a slip, not an error worth reporting.
    if (accepted.some((existing) => isSameFile(existing, file))) continue;
    if (accepted.length >= props.maxFiles) {
      rejection ||= `Máximo ${props.maxFiles} imágenes.`;
      break;
    }
    accepted.push(file);
  }

  emit('reject', rejection);
  if (accepted.length !== props.modelValue.length) emit('update:modelValue', accepted);
};

const removeAt = (index: number) => {
  const next = props.modelValue.filter((_, i) => i !== index);
  emit('reject', '');
  emit('update:modelValue', next);
};

const openPicker = () => inputRef.value?.click();

const onPicked = (event: Event) => {
  const input = event.target as HTMLInputElement;
  addFiles(input.files);
  // Clearing lets the same file be re-picked after a removal; otherwise the
  // input holds the old value and fires no change event.
  input.value = '';
};

// --- drag state -------------------------------------------------------------
// dragleave fires when the pointer crosses into a *child*, so a depth counter
// is needed or the highlight flickers over the thumbnails.

const dragDepth = ref(0);
const dragging = computed(() => dragDepth.value > 0);

const onDragEnter = () => { dragDepth.value += 1; };
const onDragLeave = () => { dragDepth.value = Math.max(0, dragDepth.value - 1); };
const onDrop = (event: DragEvent) => {
  dragDepth.value = 0;
  addFiles(event.dataTransfer?.files);
};

const onFocusout = (event: FocusEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) emit('blur');
};

const borderClass = computed(() => {
  if (props.invalid) return 'border-alborota-danger';
  return dragging.value ? 'border-alborota-black' : 'border-alborota-ink';
});

const hintClass = 'font-stevie text-[13px] leading-[24px] text-alborota-ink/50';
</script>

<template>
  <div
    ref="rootRef"
    class="relative flex h-[253px] w-full flex-col border transition-colors"
    :class="[borderClass, dragging ? 'bg-alborota-paper' : '']"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @focusout="onFocusout"
  >
    <input
      :id="id"
      ref="inputRef"
      type="file"
      multiple
      class="hidden"
      :accept="accept"
      :aria-describedby="describedby"
      @change="onPicked"
    />

    <!-- Empty state: the whole box is the trigger, so it is one large target
         and reachable by keyboard without a separate control. -->
    <button
      v-if="!previews.length"
      type="button"
      class="flex size-full items-center justify-center gap-[6px] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-alborota-ink"
      :aria-describedby="describedby"
      @click="openPicker"
    >
      <span :class="hintClass">Adjunta</span>
      <img :src="paperClipUrl" alt="" class="size-[13px] opacity-40" />
      <span :class="hintClass">o Arrastra</span>
      <img :src="imageGalleryUrl" alt="" class="size-[15px] opacity-50" />
    </button>

    <template v-else>
      <ul class="grid flex-1 auto-rows-min grid-cols-3 gap-[8px] overflow-y-auto p-[13px]">
        <li v-for="(preview, index) in previews" :key="preview.url" class="relative aspect-square">
          <img :src="preview.url" :alt="preview.file.name" class="size-full object-cover" />
          <button
            type="button"
            :aria-label="`Quitar ${preview.file.name}`"
            class="absolute right-[4px] top-[4px] flex size-[20px] items-center justify-center bg-alborota-cream/90 transition-colors hover:bg-alborota-cream focus-visible:outline focus-visible:outline-1 focus-visible:outline-alborota-ink"
            @click="removeAt(index)"
          >
            <Close class="icon-raw !size-[8px]" aria-hidden="true" />
          </button>
        </li>
      </ul>

      <button
        v-if="previews.length < maxFiles"
        type="button"
        class="shrink-0 border-t border-alborota-ink/[0.12] py-[8px] text-center font-stevie text-[13px] leading-[24px] text-alborota-ink/50 transition-colors hover:text-alborota-ink focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-alborota-ink"
        @click="openPicker"
      >
        Agregar más
      </button>
    </template>
  </div>
</template>
