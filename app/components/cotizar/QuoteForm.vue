<script setup lang="ts">
import { useId } from 'vue';
import { useQuoteForm } from '~/composables/useQuoteForm';
import { PIECE_TYPES, STYLES } from '~/utils/quoteOptions';

// Figma "Quote Form" (node 2015:282). Composition only — the schema, uploads
// and submission live in useQuoteForm, mirroring how ProductForm sits over
// useProductForm.
//
// Most fields carry their name in the placeholder rather than a visible label,
// so their <label> is `label-hidden`: present for screen readers, absent on
// screen. The two composite widgets at the bottom do show labels, and use
// `as="fieldset"` because a <legend> is the only way to name a group of
// controls — <label for> binds to labelable elements only.
const {
  fields,
  fieldError,
  touch,
  setField,
  minDate,
  maxImages,
  maxInfoChars,
  imagesError,
  setImageRejection,
  honeypot,
  formError,
  submitted,
  onSubmit,
  submitLabel,
  submitDisabled,
} = useQuoteForm();

const uid = useId();
const fieldId = (name: string) => `${uid}-${name}`;
</script>

<template>
  <div
    v-if="submitted"
    class="flex w-full flex-col gap-[8px] border border-alborota-ink p-[24px]"
    role="status"
  >
    <p class="font-abc text-xl font-bold uppercase leading-[27px] text-alborota-black">
      ¡Gracias!
    </p>
    <p class="font-stevie text-[0.8125rem] leading-[24px] text-alborota-ink">
      Recibimos tu solicitud. Nos pondremos en contacto contigo muy pronto.
    </p>
  </div>

  <form v-else class="flex w-full flex-col gap-[24px]" novalidate @submit.prevent="onSubmit">
    <!-- Formspark's honeypot: a field no person sees, so anything in it is a bot. -->
    <input
      v-model="honeypot"
      type="text"
      name="_honeypot"
      tabindex="-1"
      autocomplete="off"
      class="sr-only"
      aria-hidden="true"
    />

    <UiFieldShell floating-error label="Nombre" label-hidden :control-id="fieldId('nombre')" :error="fieldError('nombre')">
      <template #default="{ errorId }">
        <UiTextControl
          :id="fieldId('nombre')"
          tone="solid"
          size="md"
          placeholder="Nombre"
          autocomplete="name"
          :model-value="fields.nombre"
          :invalid="!!fieldError('nombre')"
          :describedby="errorId"
          @update:model-value="setField('nombre', $event)"
          @blur="touch('nombre')"
        />
      </template>
    </UiFieldShell>

    <UiFieldShell floating-error label="Correo electrónico" label-hidden :control-id="fieldId('email')" :error="fieldError('email')">
      <template #default="{ errorId }">
        <UiTextControl
          :id="fieldId('email')"
          type="email"
          inputmode="email"
          tone="solid"
          size="md"
          placeholder="Correo electrónico"
          autocomplete="email"
          :model-value="fields.email"
          :invalid="!!fieldError('email')"
          :describedby="errorId"
          @update:model-value="setField('email', $event)"
          @blur="touch('email')"
        />
      </template>
    </UiFieldShell>

    <div class="flex flex-col gap-[20px] sm:flex-row">
      <UiFieldShell floating-error
        class="flex-1"
        label="Tipo de pieza"
        label-hidden
        :control-id="fieldId('tipoDePieza')"
        :error="fieldError('tipoDePieza')"
      >
        <template #default="{ errorId }">
          <UiSelectControl
            :id="fieldId('tipoDePieza')"
            tone="solid"
            size="md"
            placeholder="Tipo de Pieza"
            :options="PIECE_TYPES"
            :model-value="fields.tipoDePieza"
            :invalid="!!fieldError('tipoDePieza')"
            :describedby="errorId"
            @update:model-value="setField('tipoDePieza', $event)"
            @blur="touch('tipoDePieza')"
          />
        </template>
      </UiFieldShell>

      <UiFieldShell floating-error
        class="flex-1"
        label="Estilo"
        label-hidden
        :control-id="fieldId('estilo')"
        :error="fieldError('estilo')"
      >
        <template #default="{ errorId }">
          <UiSelectControl
            :id="fieldId('estilo')"
            tone="solid"
            size="md"
            placeholder="Estilo"
            :options="STYLES"
            :model-value="fields.estilo"
            :invalid="!!fieldError('estilo')"
            :describedby="errorId"
            @update:model-value="setField('estilo', $event)"
            @blur="touch('estilo')"
          />
        </template>
      </UiFieldShell>
    </div>

    <UiFieldShell floating-error
      label="Lugar de evento (entrega)"
      label-hidden
      :control-id="fieldId('lugarEvento')"
      :error="fieldError('lugarEvento')"
    >
      <template #default="{ errorId }">
        <UiTextControl
          :id="fieldId('lugarEvento')"
          tone="solid"
          size="md"
          placeholder="Lugar de evento (entrega)"
          :model-value="fields.lugarEvento"
          :invalid="!!fieldError('lugarEvento')"
          :describedby="errorId"
          @update:model-value="setField('lugarEvento', $event)"
          @blur="touch('lugarEvento')"
        />
      </template>
    </UiFieldShell>

    <div class="flex flex-col gap-[20px] sm:flex-row">
      <UiFieldShell floating-error
        class="flex-1"
        label="Información adicional"
        label-hidden
        :control-id="fieldId('infoAdicional')"
        :error="fieldError('infoAdicional')"
      >
        <template #default="{ errorId }">
          <!-- The wrapper owns the height so this box and "Cantidad" beside it
               stay the same size; `fill` makes the textarea take all of it. -->
          <div class="h-[100px]">
            <UiTextareaControl
              :id="fieldId('infoAdicional')"
              fill
              tone="solid"
              :show-count="false"
              :maxlength="maxInfoChars"
              placeholder="info adicional"
              :model-value="fields.infoAdicional"
              :invalid="!!fieldError('infoAdicional')"
              :describedby="errorId"
              @update:model-value="setField('infoAdicional', $event)"
              @blur="touch('infoAdicional')"
            />
          </div>
        </template>
      </UiFieldShell>

      <UiFieldShell floating-error
        class="flex-1"
        label="Cantidad"
        label-hidden
        :control-id="fieldId('cantidad')"
        :error="fieldError('cantidad')"
      >
        <template #default="{ errorId }">
          <UiTextControl
            :id="fieldId('cantidad')"
            inputmode="numeric"
            tone="solid"
            size="lg"
            placeholder="Cantidad (#)"
            autocomplete="off"
            :model-value="fields.cantidad"
            :invalid="!!fieldError('cantidad')"
            :describedby="errorId"
            @update:model-value="setField('cantidad', $event)"
            @blur="touch('cantidad')"
          />
        </template>
      </UiFieldShell>
    </div>

    <div class="flex flex-col gap-[20px] sm:flex-row sm:items-start">
      <UiFieldShell floating-error as="fieldset" class="flex-1" label="Imágenes de referencia" :error="imagesError">
        <template #default="{ errorId }">
          <UiDropzoneControl
            :id="fieldId('imagenes')"
            :max-files="maxImages"
            :model-value="fields.imagenes"
            :invalid="!!imagesError"
            :describedby="errorId"
            @update:model-value="setField('imagenes', $event)"
            @reject="setImageRejection"
            @blur="touch('imagenes')"
          />
        </template>
      </UiFieldShell>

      <UiFieldShell floating-error as="fieldset" class="flex-1" label="Fecha de entrega" :error="fieldError('fechaEntrega')">
        <template #default="{ errorId }">
          <UiCalendarControl
            :id="fieldId('fechaEntrega')"
            :min="minDate"
            :model-value="fields.fechaEntrega"
            :invalid="!!fieldError('fechaEntrega')"
            :describedby="errorId"
            @update:model-value="setField('fechaEntrega', $event)"
            @blur="touch('fechaEntrega')"
          />
        </template>
      </UiFieldShell>
    </div>

    <p v-if="formError" role="alert" class="font-stevie text-[0.6875rem] leading-[16px] text-alborota-danger">
      {{ formError }}
    </p>

    <UiCta variant="block" type="submit" :disabled="submitDisabled">
      <span aria-live="polite">{{ submitLabel }}</span>
    </UiCta>
  </form>
</template>
