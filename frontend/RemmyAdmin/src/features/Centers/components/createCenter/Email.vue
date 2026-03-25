<script setup lang="ts">
import { ref } from 'vue'
import { Mail, X, AlertCircle, Plus } from 'lucide-vue-next'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const newEmail = ref('')
const emailError = ref('')

// Initialize email array if doesn't exist
if (!Array.isArray(props.form.email)) {
  props.form.email = []
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const addEmail = () => {
  const email = newEmail.value.trim()

  if (!email) {
    emailError.value = 'Por favor, introduce un correo electrónico'
    return
  }

  if (!validateEmail(email)) {
    emailError.value = 'Por favor, introduce un correo válido'
    return
  }

  if (props.form.email.includes(email)) {
    emailError.value = 'Este correo ya ha sido añadido'
    return
  }

  props.form.email.push(email)
  newEmail.value = ''
  emailError.value = ''
}

const removeEmail = (index: number) => {
  props.form.email.splice(index, 1)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addEmail()
  }
}
</script>

<template>
  <section class="bg-white rounded-card shadow-card border border-slate-100">
    <div class="px-6 py-4 border-b border-line bg-surface-muted flex items-center gap-2">
      <Mail class="w-5 h-5 text-brand-500" />
      <h2 class="text-base font-semibold text-ink">Correos Electrónicos</h2>
    </div>

    <div class="p-6">
      <p class="text-sm text-ink-muted mb-4">Añade todos los correos electrónicos de contacto del centro.</p>

      <!-- Email Input -->
      <div class="mb-5">
        <div class="flex gap-2">
          <input
            v-model.trim="newEmail"
            type="email"
            placeholder="ejemplo@correo.com"
            class="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
            @keypress="handleKeyPress"
          />
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-200 whitespace-nowrap"
            @click="addEmail"
          >
            <Plus class="w-4 h-4" />
            Añadir
          </button>
        </div>
        <div v-if="emailError" class="flex items-center gap-1.5 mt-2 text-sm text-red-600">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ emailError }}
        </div>
      </div>

      <!-- Email List -->
      <div v-if="form.email.length > 0">
        <p class="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
          {{ form.email.length }} correo{{ form.email.length !== 1 ? 's' : '' }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(email, index) in form.email"
            :key="index"
            class="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-0.5 text-sm"
          >
            {{ email }}
            <button
              type="button"
              class="ml-0.5 hover:text-brand-900 transition-colors"
              @click="removeEmail(index)"
              title="Eliminar"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6 bg-surface-muted rounded-lg">
        <p class="text-sm text-ink-muted">Aún no se ha añadido ningún correo electrónico</p>
      </div>
    </div>
  </section>
</template>
