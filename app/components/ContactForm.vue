<script setup>
const config = useRuntimeConfig();
const formsparkId = config.public.formspark?.formId;
const formAction = `https://submit-form.com/${formsparkId}`;

const form = reactive({ name: '', email: '', message: '' });
const submitted = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  try {
    await $fetch(formAction, {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    submitted.value = true;
  } catch {
    error.value = 'Algo salió mal. Por favor intenta de nuevo.';
  }
}
</script>

<template>
  <div v-if="submitted">
    <p>¡Gracias! Nos pondremos en contacto pronto.</p>
  </div>
  <form v-else @submit.prevent="handleSubmit" novalidate>
    <div>
      <label for="name">Nombre</label>
      <input id="name" v-model="form.name" type="text" required autocomplete="name" />
    </div>
    <div>
      <label for="email">Correo electrónico</label>
      <input id="email" v-model="form.email" type="email" required autocomplete="email" />
    </div>
    <div>
      <label for="message">Mensaje</label>
      <textarea id="message" v-model="form.message" required rows="5" />
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <button type="submit">Enviar</button>
  </form>
</template>
