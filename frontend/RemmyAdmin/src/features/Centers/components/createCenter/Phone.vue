<script setup lang="ts">
import { ref } from 'vue'
import { Phone, X, AlertCircle, Plus } from 'lucide-vue-next'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const newPhone = ref('')
const phoneError = ref('')

// Inicia la array si no existe
if (!Array.isArray(props.form.phone)) {
  props.form.phone = []
}

const validatePhone = (phone: string): boolean => {
  // Acepta numeros con o sin codigo de pais
  const phoneRegex = /^(\+\d{1,3})?\s?(\d{1,4}[\s\-]?)*\d{1,4}$/
  return phoneRegex.test(phone.replace(/\s/g, '')) && phone.replace(/\D/g, '').length >= 9
}

const formatPhone = (phone: string): string => {
  // Mantiene el formato del usuario
  return phone.trim()
}

const addPhone = () => {
  const phone = newPhone.value.trim()

  if (!phone) {
    phoneError.value = 'Por favor, introduce un número de teléfono'
    return
  }

  if (!validatePhone(phone)) {
    phoneError.value = 'Por favor, introduce un teléfono válido (mínimo 9 dígitos)'
    return
  }

  if (props.form.phone.includes(phone)) {
    phoneError.value = 'Este teléfono ya ha sido añadido'
    return
  }

  props.form.phone.push(formatPhone(phone))
  newPhone.value = ''
  phoneError.value = ''
}

const removePhone = (index: number) => {
  props.form.phone.splice(index, 1)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addPhone()
  }
}
</script>

<template>
  <section class="bg-white rounded-card shadow-card border border-slate-100">
    <div class="px-6 py-4 border-b border-line bg-surface-muted flex items-center gap-2">
      <Phone class="w-5 h-5 text-brand-500" />
      <h2 class="text-base font-semibold text-ink">Números de Teléfono</h2>
    </div>

    <div class="p-6">
      <p class="text-sm text-ink-muted mb-4">Añade todos los números de teléfono de contacto del centro.</p>

      <!-- Phone Input -->
      <div class="mb-5">
        <div class="flex gap-2">
          <input
            v-model.trim="newPhone"
            type="tel"
            placeholder="+34 600 000 000"
            class="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
            @keypress="handleKeyPress"
          />
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-200 whitespace-nowrap"
            @click="addPhone"
          >
            <Plus class="w-4 h-4" />
            Añadir
          </button>
        </div>
        <div v-if="phoneError" class="flex items-center gap-1.5 mt-2 text-sm text-red-600">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ phoneError }}
        </div>
      </div>

      <!-- Phone List -->
      <div v-if="form.phone.length > 0">
        <p class="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
          {{ form.phone.length }} teléfono{{ form.phone.length !== 1 ? 's' : '' }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(phone, index) in form.phone"
            :key="index"
            class="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-0.5 text-sm"
          >
            {{ phone }}
            <button
              type="button"
              class="ml-0.5 hover:text-brand-900 transition-colors"
              @click="removePhone(index)"
              title="Eliminar"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6 bg-surface-muted rounded-lg">
        <p class="text-sm text-ink-muted">Aún no se ha añadido ningún número de teléfono</p>
      </div>
    </div>
  </section>
</template>
