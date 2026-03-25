<script setup lang="ts">
import { onMounted } from 'vue'
import { Plus, Building2 } from 'lucide-vue-next'
import BaseButton from '@/shared/util/baseButton.vue'
import CentersList from '@/features/Centers/components/gestionPanel/centersList.vue'
import { useRouter } from 'vue-router'
import { useCentersStore } from '@/features/Centers/stores/centers'

const router = useRouter()
const centersStore = useCentersStore()

const goToAddCenter = () => {
  router.push({ name: 'CreateCenter' })
}

onMounted(() => {
  centersStore.fetchCenters()
})
</script>

<template>
  <div class="min-h-screen bg-surface-alt">
    <div class="max-w-[1400px] mx-auto px-8 py-8">

      <!-- Page Header -->
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
            <Building2 class="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-ink leading-tight">Gestión de Centros</h1>
            <p class="text-sm text-ink-muted mt-0.5">Supervise y administre los recursos de la red de ayuda humanitaria.</p>
          </div>
        </div>
        <BaseButton variant="primary" @click="goToAddCenter" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Nuevo Centro
        </BaseButton>
      </header>

      <!-- Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        <!-- Main Column -->
        <main class="flex flex-col gap-4">

          <!-- Filters Card -->
          <section class="bg-surface rounded-xl border border-line shadow-sm p-4 flex items-end gap-4">
            <!-- Search -->
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-xs font-semibold text-ink-muted uppercase tracking-wider">Búsqueda</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/>
                </svg>
                <input
                  type="text"
                  placeholder="Nombre o encargado..."
                  class="w-full pl-9 pr-3 py-2 bg-surface-muted border border-transparent rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-surface transition"
                />
              </div>
            </div>

            <!-- Ciudad -->
            <div class="flex flex-col gap-1.5 min-w-[160px]">
              <label class="text-xs font-semibold text-ink-muted uppercase tracking-wider">Ciudad</label>
              <div class="relative">
                <select class="w-full px-3 py-2 bg-surface-muted border border-transparent rounded-lg text-sm text-ink appearance-none focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-surface transition pr-8">
                  <option>Todas las ciudades</option>
                </select>
                <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Tipo de Ayuda -->
            <div class="flex flex-col gap-1.5 min-w-[160px]">
              <label class="text-xs font-semibold text-ink-muted uppercase tracking-wider">Tipo de Ayuda</label>
              <div class="relative">
                <select class="w-full px-3 py-2 bg-surface-muted border border-transparent rounded-lg text-sm text-ink appearance-none focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-surface transition pr-8">
                  <option>Todos los tipos</option>
                </select>
                <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Filter button -->
            <button
              aria-label="Filtros avanzados"
              class="h-9 w-9 flex items-center justify-center bg-surface-muted border border-transparent rounded-lg text-ink-muted hover:bg-line hover:text-ink transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M3 6h18v2H3V6zm3 7h12v2H6v-2zm3 7h6v2H9v-2z" />
              </svg>
            </button>
          </section>

          <!-- Centers List -->
          <section>
            <CentersList
              :centers="centersStore.centers"
              :loading="centersStore.loading"
              :error="centersStore.error"
            />
          </section>
        </main>

        <!-- Sidebar Column -->
        <aside class="bg-surface rounded-xl border border-line shadow-sm overflow-hidden flex flex-col">
          <!-- Map Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-line">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <h2 class="text-sm font-bold text-ink">Vista Geográfica</h2>
            </div>
            <button class="text-sm text-brand-600 font-semibold hover:underline bg-none border-none cursor-pointer">Expandir</button>
          </div>

          <!-- Map Placeholder -->
          <div class="h-[220px] bg-line relative overflow-hidden">
            <div
              class="w-full h-full opacity-80"
              style="background-image: url('https://w7.pngwing.com/pngs/354/298/png-transparent-map-world-map-globe-simple-world-map-business-thumbnail.png'); background-size: cover; background-position: center; filter: sepia(0.2) hue-rotate(180deg) saturate(0.6) brightness(1.1);"
            >
              <div class="absolute top-[40%] right-[35%] w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-white shadow-md"></div>
              <div class="absolute top-[30%] left-[40%] w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-white shadow-md"></div>
              <div class="absolute top-[60%] left-[45%] w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-white shadow-md"></div>
            </div>
          </div>

          <!-- Stats -->
          <div class="p-5">
            <h3 class="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Estadísticas por región</h3>

            <div class="flex flex-col gap-4">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm font-semibold text-ink">Madrid Central</span>
                  <span class="text-sm text-ink-muted"><strong class="text-ink">12</strong> centros</span>
                </div>
                <div class="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" style="width: 60%;"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm font-semibold text-ink">Catalunya Sur</span>
                  <span class="text-sm text-ink-muted"><strong class="text-ink">8</strong> centros</span>
                </div>
                <div class="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" style="width: 40%;"></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>
