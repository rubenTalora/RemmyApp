<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCentersStore } from '@/features/Centers/stores/centers'
import type { Center } from '@/features/Centers/entities/centers'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Tag,
  Info,
  Pencil,
  Mail,
  Share2,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const centersStore = useCentersStore()

const isLoading = ref(false)
const centerData = ref<Center | null>(null)
const notFound = ref(false)

const characteristicNames: Record<string, string> = {
  accesibilidad: 'Accesibilidad',
  wifi: 'Wi-Fi Gratis',
  comida: 'Comida',
  duchase: 'Duchas',
  camas: 'Camas',
  medico: 'Asistencia Médica',
  psicologia: 'Apoyo Psicológico',
  legal: 'Asesoría Legal',
  educacion: 'Educación',
  cuidado_ninos: 'Cuidado de Niños',
  actividades: 'Actividades',
  transporte: 'Transporte',
}

const socialNames: Record<string, string> = {
  instagram: 'Instagram',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
}

const handleBackClick = () => {
  router.push({ name: 'GestionPanel' })
}

const handleEditClick = () => {
  router.push({ name: 'EditCenter', params: { id: route.params.id } })
}

const getCharacteristicName = (id: string) => characteristicNames[id] || id
const getSocialName = (id: string) => socialNames[id] || id

const phoneList = computed(() => centerData.value?.phones?.map(p => p.phone) ?? [])

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) { notFound.value = true; return }

  const cached = centersStore.getCenterById(id)
  if (cached) {
    centerData.value = cached
  } else {
    isLoading.value = true
    const fetched = await centersStore.fetchById(id)
    isLoading.value = false
    if (!fetched) {
      notFound.value = true
      return
    }
    centerData.value = fetched
  }
})
</script>

<template>
  <div class="p-6 md:p-8 max-w-5xl mx-auto">

    <!-- Back Navigation -->
    <button
      class="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors mb-6"
      @click="handleBackClick"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver a Centros
    </button>

    <!-- Not Found -->
    <div v-if="notFound" class="flex flex-col items-center justify-center py-20 text-ink-muted">
      <p class="text-lg font-medium">Centro no encontrado.</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-ink-muted">
      <div class="w-9 h-9 rounded-full border-4 border-line border-t-brand-500 animate-spin"></div>
      <p class="text-sm">Cargando información del centro...</p>
    </div>

    <!-- Center Detail -->
    <div v-else-if="centerData" class="flex flex-col gap-4">

      <!-- Page Header Card -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold text-ink leading-tight">{{ centerData.name }}</h1>
            <span
              v-if="centerData.center_type"
              class="inline-flex self-start bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {{ centerData.center_type.name }}
            </span>
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-btn transition-colors flex-shrink-0"
            @click="handleEditClick"
          >
            <Pencil class="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <Info class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Descripción</h2>
        </div>
        <p v-if="centerData.description" class="text-sm text-ink-muted leading-relaxed">
          {{ centerData.description }}
        </p>
        <p v-else class="text-sm text-slate-400 italic">Sin descripción registrada.</p>
      </div>

      <!-- Address -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <MapPin class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Dirección</h2>
        </div>
        <template v-if="centerData.address">
          <div class="flex flex-col gap-3">
            <div v-if="centerData.address.formatted_address" class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-ink-muted uppercase tracking-wide">Dirección completa</span>
              <span class="text-sm text-ink font-medium">{{ centerData.address.formatted_address }}</span>
            </div>
            <div v-if="centerData.address.city" class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-ink-muted uppercase tracking-wide">Ciudad</span>
              <span class="text-sm text-ink font-medium">{{ centerData.address.city }}</span>
            </div>
            <div v-if="centerData.address.postal_code" class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-ink-muted uppercase tracking-wide">Código Postal</span>
              <span class="text-sm text-ink font-medium">{{ centerData.address.postal_code }}</span>
            </div>
          </div>
          <p v-if="!centerData.address.formatted_address && !centerData.address.city && !centerData.address.postal_code" class="text-sm text-slate-400 italic">
            Sin dirección registrada.
          </p>
        </template>
        <p v-else class="text-sm text-slate-400 italic">Sin dirección registrada.</p>
      </div>

      <!-- Phones -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <Phone class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Teléfonos</h2>
        </div>
        <div v-if="phoneList.length > 0" class="flex flex-col gap-2">
          <a
            v-for="(phone, index) in phoneList"
            :key="index"
            :href="`tel:${phone}`"
            class="flex items-center gap-3 px-3 py-2 bg-surface-muted rounded-lg text-sm text-ink hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <Phone class="w-4 h-4 text-ink-faint flex-shrink-0" />
            {{ phone }}
          </a>
        </div>
        <p v-else class="text-sm text-slate-400 italic">Sin teléfonos registrados.</p>
      </div>

      <!-- Email / Web -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <Globe class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Email / Web</h2>
        </div>
        <div class="flex flex-col gap-2">
          <a
            v-if="centerData.email"
            :href="`mailto:${centerData.email}`"
            class="flex items-center gap-3 px-3 py-2 bg-surface-muted rounded-lg text-sm text-ink hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <Mail class="w-4 h-4 text-ink-faint flex-shrink-0" />
            {{ centerData.email }}
          </a>
          <a
            v-if="centerData.website"
            :href="centerData.website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-2 bg-surface-muted rounded-lg text-sm text-ink hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <Globe class="w-4 h-4 text-ink-faint flex-shrink-0" />
            {{ centerData.website }}
          </a>
          <p v-if="!centerData.email && !centerData.website" class="text-sm text-slate-400 italic">
            Sin correo ni web registrados.
          </p>
        </div>
      </div>

      <!-- Characteristics -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <Tag class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Características</h2>
        </div>
        <div v-if="centerData.characteristics && centerData.characteristics.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="charId in centerData.characteristics"
            :key="charId"
            class="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-0.5 text-sm font-medium"
          >
            {{ getCharacteristicName(charId) }}
          </span>
        </div>
        <p v-else class="text-sm text-slate-400 italic">Sin características registradas.</p>
      </div>

      <!-- Social Media -->
      <div
        v-if="centerData.social && Object.keys(centerData.social).length > 0"
        class="bg-white rounded-card shadow-card border border-slate-100 p-5"
      >
        <div class="flex items-center gap-2 mb-3">
          <Share2 class="w-5 h-5 text-brand-500 flex-shrink-0" />
          <h2 class="text-base font-semibold text-ink">Redes Sociales</h2>
        </div>
        <div class="flex flex-col gap-2">
          <a
            v-for="(url, platform) in centerData.social"
            :key="platform"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-2 bg-surface-muted rounded-lg text-sm text-ink hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <Globe class="w-4 h-4 text-ink-faint flex-shrink-0" />
            <span class="font-medium">{{ getSocialName(String(platform)) }}</span>
            <span class="text-ink-muted truncate">{{ url }}</span>
          </a>
        </div>
      </div>

      <!-- Metadata -->
      <div class="bg-white rounded-card shadow-card border border-slate-100 p-5">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-ink-muted uppercase tracking-wide">Creado</span>
            <span class="text-sm text-ink font-medium">{{ formatDate(centerData.created_at) }}</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-semibold text-ink-muted uppercase tracking-wide">Actualizado</span>
            <span class="text-sm text-ink font-medium">{{ formatDate(centerData.updated_at) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
