<template>
  <div class="w-full bg-surface rounded-xl shadow-sm border border-line overflow-hidden flex flex-col h-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center p-12 text-slate-500">
      <svg class="animate-spin w-6 h-6 mr-2 text-brand-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      Cargando centros...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center p-12 text-red-600">
      <span>Error al cargar los centros: {{ error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="centers.length === 0" class="flex items-center justify-center p-12 text-slate-400">
      No hay centros registrados todavía.
    </div>

    <!-- Table -->
    <template v-else>
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th class="py-4 px-6">Centro</th>
              <th class="py-4 px-6">Ubicación</th>
              <th class="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-800">
            <tr v-for="center in pagedCenters" :key="center.id" class="hover:bg-brand-50/50 transition-colors group">
              <td class="py-4 px-6">
                <span class="font-bold text-slate-900 text-[15px] block">{{ center.name }}</span>
              </td>
              <td class="py-4 px-6 text-slate-500 font-medium text-[14px]">
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {{ formatAddress(center.address) }}
                </div>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <!-- Edit -->
                  <button
                    class="inline-flex items-center justify-center p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all border border-transparent hover:border-brand-200"
                    @click="editCenter(center.id)"
                    aria-label="Editar centro"
                  >
                    <Pencil class="w-[18px] h-[18px]" />
                  </button>
                  <!-- Delete -->
                  <button
                    class="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                    @click="deleteCenter(center.id)"
                    aria-label="Eliminar centro"
                  >
                    <Trash2 class="w-[18px] h-[18px]" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="flex items-center justify-between px-6 py-[18px] bg-slate-50/50 border-t border-slate-200 mt-auto">
        <div class="text-[13px] text-slate-500">
          Mostrando <span class="font-bold text-slate-700">{{ showingEntries }}</span> centros
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[13px] font-medium rounded-lg text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:z-10 focus:ring-2 focus:ring-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Anterior
          </button>
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-[30px] h-[30px] flex items-center justify-center text-[13px] font-medium rounded-lg transition-all',
                currentPage === page
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 border border-brand-500'
                  : 'text-slate-600 border border-slate-200 bg-white hover:bg-slate-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3.5 py-1.5 text-[13px] font-medium rounded-lg text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:z-10 focus:ring-2 focus:ring-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, Pencil, Trash2 } from 'lucide-vue-next'
import type { Center } from '@/features/Centers/entities/centers'
import { useCentersStore } from '@/features/Centers/stores/centers'

const props = defineProps<{
  centers: Center[]
  loading: boolean
  error: string | null
}>()

const router = useRouter()
const centersStore = useCentersStore()

const currentPage = ref(1)
const rowsPerPage = 6

const totalPages = computed(() => Math.max(1, Math.ceil(props.centers.length / rowsPerPage)))

const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.min(Math.max(currentPage.value - 1, 1), total - 2)
  return [start, start + 1, start + 2]
})

const showingEntries = computed(() => {
  if (props.centers.length === 0) return '0'
  const startEntry = (currentPage.value - 1) * rowsPerPage + 1
  const endEntry = Math.min(currentPage.value * rowsPerPage, props.centers.length)
  return `${startEntry}-${endEntry} de ${props.centers.length}`
})

const pagedCenters = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return props.centers.slice(start, start + rowsPerPage)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function formatAddress(address: Center['address']): string {
  if (!address) return '—'
  const parts: string[] = []
  if (address.city) parts.push(address.city)
  const street = [address.road_name, address.road_num].filter(Boolean).join(' ')
  if (street) parts.push(street)
  return parts.join(' · ') || '—'
}

function editCenter(id: number) {
  router.push({ name: 'EditCenter', params: { id } })
}

async function deleteCenter(id: number) {
  if (!window.confirm('¿Estás seguro de que quieres eliminar este centro? Esta acción no se puede deshacer.')) return
  await centersStore.deleteCenter(id)
  // Reset to first page if current page becomes empty
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}
</script>
