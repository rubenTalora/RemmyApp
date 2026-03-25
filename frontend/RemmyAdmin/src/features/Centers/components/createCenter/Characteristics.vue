<script setup lang="ts">
import {
  Accessibility,
  Wifi,
  UtensilsCrossed,
  Droplets,
  Bed,
  Stethoscope,
  Brain,
  Scale,
  BookOpen,
  Baby,
  Dumbbell,
  Bus,
  ListChecks,
} from 'lucide-vue-next'
import type { Component } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const characteristics: { id: string; name: string; icon: Component }[] = [
  { id: 'accesibilidad', name: 'Accesibilidad', icon: Accessibility },
  { id: 'wifi', name: 'Wi-Fi Gratis', icon: Wifi },
  { id: 'comida', name: 'Comida', icon: UtensilsCrossed },
  { id: 'duchase', name: 'Duchas', icon: Droplets },
  { id: 'camas', name: 'Camas', icon: Bed },
  { id: 'medico', name: 'Asistencia Médica', icon: Stethoscope },
  { id: 'psicologia', name: 'Apoyo Psicológico', icon: Brain },
  { id: 'legal', name: 'Asesoría Legal', icon: Scale },
  { id: 'educacion', name: 'Educación', icon: BookOpen },
  { id: 'cuidado_ninos', name: 'Cuidado de Niños', icon: Baby },
  { id: 'actividades', name: 'Actividades', icon: Dumbbell },
  { id: 'transporte', name: 'Transporte', icon: Bus },
]

// Initialize characteristics array if doesn't exist
if (!Array.isArray(props.form.characteristics)) {
  props.form.characteristics = []
}

const toggleCharacteristic = (characteristicId: string) => {
  const index = props.form.characteristics.indexOf(characteristicId)
  if (index > -1) {
    props.form.characteristics.splice(index, 1)
  } else {
    props.form.characteristics.push(characteristicId)
  }
}

const isSelected = (characteristicId: string) => {
  return props.form.characteristics.includes(characteristicId)
}

const getCharacteristicName = (id: string) => {
  return characteristics.find(c => c.id === id)?.name || id
}

const getCharacteristicIcon = (id: string): Component | null => {
  return characteristics.find(c => c.id === id)?.icon ?? null
}
</script>

<template>
  <section class="bg-white rounded-card shadow-card border border-slate-100">
    <div class="px-6 py-4 border-b border-line bg-surface-muted flex items-center gap-2">
      <ListChecks class="w-5 h-5 text-brand-500" />
      <h2 class="text-base font-semibold text-ink">Características del Centro</h2>
    </div>

    <div class="p-6">
      <p class="text-sm text-ink-muted mb-5">Selecciona las características y servicios que ofrece el centro.</p>

      <!-- Characteristics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-5">
        <button
          v-for="char in characteristics"
          :key="char.id"
          type="button"
          class="flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer select-none transition-all text-center"
          :class="isSelected(char.id)
            ? 'border-brand-500 bg-brand-50 shadow-[0_0_0_3px_theme(colors.brand.100)]'
            : 'border-line bg-surface hover:border-brand-300 hover:bg-brand-50'"
          @click="toggleCharacteristic(char.id)"
        >
          <component :is="char.icon" class="w-6 h-6" :class="isSelected(char.id) ? 'text-brand-600' : 'text-ink-muted'" />
          <span class="text-xs font-medium leading-tight" :class="isSelected(char.id) ? 'text-brand-700' : 'text-ink-muted'">
            {{ char.name }}
          </span>
        </button>
      </div>

      <!-- Selected Characteristics Summary -->
      <div v-if="form.characteristics.length > 0" class="pt-4 border-t border-line">
        <p class="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
          {{ form.characteristics.length }} característica{{ form.characteristics.length !== 1 ? 's' : '' }} seleccionada{{ form.characteristics.length !== 1 ? 's' : '' }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="charId in form.characteristics"
            :key="charId"
            class="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-0.5 text-sm"
          >
            <component :is="getCharacteristicIcon(charId)" class="w-3.5 h-3.5" />
            {{ getCharacteristicName(charId) }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6 bg-surface-muted rounded-lg">
        <p class="text-sm text-ink-muted">Selecciona las características que ofrece el centro</p>
      </div>
    </div>
  </section>
</template>
