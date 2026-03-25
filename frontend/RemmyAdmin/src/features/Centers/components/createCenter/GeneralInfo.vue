<script setup lang="ts">
import { onMounted } from 'vue'
import { Info } from 'lucide-vue-next'
import { useCenterTypesStore } from '@/features/Centers/stores/centerTypes'

defineProps({
  form: {
    type: Object,
    required: true
  }
})

const centerTypesStore = useCenterTypesStore()

onMounted(() => {
  if (centerTypesStore.centerTypes.length === 0) {
    centerTypesStore.fetchCenterTypes()
  }
})
</script>

<template>
  <section class="bg-white rounded-card shadow-card border border-slate-100">
    <div class="px-6 py-4 border-b border-line bg-surface-muted flex items-center gap-2">
      <Info class="w-5 h-5 text-brand-500" />
      <h2 class="text-base font-semibold text-ink">Información General</h2>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Center Name -->
        <div class="flex flex-col gap-1.5">
          <label for="name" class="block text-sm font-medium text-slate-700">Nombre del Centro</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            required
            placeholder="Ej. Comedor Social San José"
            class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
          />
        </div>

        <!-- Center Type -->
        <div class="flex flex-col gap-1.5">
          <label for="id_type" class="block text-sm font-medium text-slate-700">Tipo de Ayuda</label>
          <select
            v-model="form.id_type"
            id="id_type"
            class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors appearance-none bg-white"
          >
            <option :value="null">Seleccione el tipo</option>
            <option
              v-for="type in centerTypesStore.centerTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Description (Full Width) -->
        <div class="md:col-span-2 flex flex-col gap-1.5">
          <label for="desc" class="block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            id="desc"
            v-model.trim="form.desc"
            placeholder="Breve descripción de las actividades y servicios ofrecidos..."
            rows="4"
            class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  </section>
</template>
