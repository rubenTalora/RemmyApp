<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import GeneralInfo from '@/features/Centers/components/createCenter/GeneralInfo.vue'
import Email from '@/features/Centers/components/createCenter/Email.vue'
import Phone from '@/features/Centers/components/createCenter/Phone.vue'
import Characteristics from '@/features/Centers/components/createCenter/Characteristics.vue'
import Social from '@/features/Centers/components/createCenter/Social.vue'
import LocationMap from '@/features/Centers/components/createCenter/LocationMap.vue'
import AddressAutocomplete from '@/features/Centers/components/createCenter/AddressAutocomplete.vue'
import { useCentersStore } from '@/features/Centers/stores/centers'
import { useAddressesStore } from '@/features/Centers/stores/addresses'
import { usePhonesStore } from '@/features/Centers/stores/phones'
import { usePostalCodeLookup } from '@/features/Centers/composables/usePostalCodeLookup'

const route = useRoute()
const router = useRouter()
const centersStore = useCentersStore()
const addressesStore = useAddressesStore()
const phonesStore = usePhonesStore()

const editId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})

const isEditMode = computed(() => editId.value !== null)

function buildEmptyForm() {
  return {
    name: '',
    id_type: null as number | null,
    desc: '',
    email: [] as string[],
    phone: [] as string[],
    characteristics: [] as string[],
    social: {} as Record<string, string>,
    website: '',
    // address fields
    postal_code: '',
    formatted_address: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    mapbox_place_id: '',
    road_name: '',
    road_num: null as number | null,
  }
}

const centerForm = ref(buildEmptyForm())
const submitError = ref<string | null>(null)
const isSubmitting = ref(false)

const postalCodeRef = computed(() => centerForm.value.postal_code)
const { city, province, community, cityId, provinceId, communityId } = usePostalCodeLookup(postalCodeRef)

function handleAddressSelected(payload: {
  formatted_address: string
  latitude: number
  longitude: number
  mapbox_place_id: string
  road_name: string
  road_num: number | null
}) {
  centerForm.value.formatted_address = payload.formatted_address
  centerForm.value.latitude = payload.latitude
  centerForm.value.longitude = payload.longitude
  centerForm.value.mapbox_place_id = payload.mapbox_place_id
  centerForm.value.road_name = payload.road_name
  centerForm.value.road_num = payload.road_num
}

function handlePinMoved(payload: { lat: number; lng: number }) {
  centerForm.value.latitude = payload.lat
  centerForm.value.longitude = payload.lng
}

async function loadCenter(id: number) {
  let center = centersStore.getCenterById(id)
  if (!center) {
    center = await centersStore.fetchById(id)
  }
  if (!center) return

  centerForm.value.name = center.name
  centerForm.value.id_type = center.id_type ?? null
  centerForm.value.desc = center.description ?? ''
  centerForm.value.email = center.email ? [center.email] : []
  centerForm.value.website = center.website ?? ''
  centerForm.value.phone = center.phones?.map(p => p.phone) ?? []

  if (center.address) {
    centerForm.value.postal_code = center.address.postal_code?.toString() ?? ''
    centerForm.value.formatted_address = center.address.formatted_address ?? ''
    centerForm.value.city = center.address.city ?? ''
    centerForm.value.latitude = center.address.latitude
    centerForm.value.longitude = center.address.longitude
    centerForm.value.mapbox_place_id = center.address.mapbox_place_id ?? ''
    centerForm.value.road_name = center.address.road_name ?? ''
    centerForm.value.road_num = center.address.road_num
  }
}

onMounted(async () => {
  if (editId.value !== null) {
    await loadCenter(editId.value)
  }
})

watch(editId, async (id) => {
  centerForm.value = buildEmptyForm()
  submitError.value = null
  if (id !== null) {
    await loadCenter(id)
  }
})

async function handleSubmit() {
  submitError.value = null

  if (!centerForm.value.name.trim()) {
    submitError.value = 'El nombre del centro es obligatorio.'
    return
  }

  if (!centerForm.value.id_type) {
    submitError.value = 'El tipo de centro es obligatorio.'
    return
  }

  isSubmitting.value = true

  try {
    const centerPayload = {
      name: centerForm.value.name.trim(),
      description: centerForm.value.desc || null,
      id_type: centerForm.value.id_type,
      email: centerForm.value.email[0] ?? null,
      website: centerForm.value.website || null,
    }

    let centerId: number

    if (isEditMode.value && editId.value !== null) {
      const updated = await centersStore.updateCenter(editId.value, centerPayload)
      centerId = updated.id
    } else {
      const created = await centersStore.createCenter(centerPayload)
      centerId = created.id
    }

    // Upsert address if we have some address info
    if (
      centerForm.value.formatted_address ||
      centerForm.value.postal_code ||
      centerForm.value.latitude !== null
    ) {
      await addressesStore.upsertAddress({
        id: centerId,
        road_name: centerForm.value.road_name || null,
        road_num: centerForm.value.road_num,
        postal_code: centerForm.value.postal_code ? Number(centerForm.value.postal_code) : null,
        formatted_address: centerForm.value.formatted_address || null,
        city: city.value || centerForm.value.city || null,
        latitude: centerForm.value.latitude,
        longitude: centerForm.value.longitude,
        mapbox_place_id: centerForm.value.mapbox_place_id || null,
        id_local_zone: null,
      })
    }

    // Sync phones
    await phonesStore.syncPhones(centerId, centerForm.value.phone)

    router.push({ name: 'GestionPanel' })
  } catch (err: any) {
    submitError.value = err.message ?? 'Error al guardar el centro.'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  router.push({ name: 'GestionPanel' })
}
</script>

<template>
  <div class="p-6 md:p-8 max-w-5xl mx-auto">
    <!-- Breadcrumb / Back nav -->
    <div class="mb-6">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-600 transition-colors font-medium"
        @click="handleCancel"
      >
        <ArrowLeft class="w-4 h-4" />
        Gestión de Centros
      </button>
    </div>

    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-ink">
        {{ isEditMode ? 'Editar Centro' : 'Nuevo Centro' }}
      </h1>
      <p class="text-sm text-ink-muted mt-1">
        {{ isEditMode
          ? 'Modifica los datos del centro de asistencia humanitaria.'
          : 'Completa el siguiente formulario para crear un nuevo punto de asistencia humanitaria.'
        }}
      </p>
    </div>

    <!-- Form -->
    <form
      @submit.prevent="handleSubmit"
      @keydown.enter="(e) => { if ((e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault() }"
      class="flex flex-col gap-6"
    >
      <!-- General Information Section -->
      <GeneralInfo :form="centerForm" />

      <!-- Location Section -->
      <section class="bg-white rounded-card shadow-card border border-slate-100">
        <div class="px-6 py-4 border-b border-line bg-surface-muted">
          <h2 class="text-base font-semibold text-ink">Ubicación</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- Código Postal -->
            <div class="flex flex-col gap-1.5">
              <label for="postal-code" class="block text-sm font-medium text-slate-700">Código Postal</label>
              <input
                id="postal-code"
                v-model.trim="centerForm.postal_code"
                type="text"
                maxlength="5"
                placeholder="Ej. 46700"
                class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
              />
            </div>

            <!-- Ciudad (auto-fill desde CP) -->
            <div class="flex flex-col gap-1.5">
              <label for="city" class="block text-sm font-medium text-slate-700">Municipio</label>
              <input
                id="city"
                :value="city"
                type="text"
                readonly
                placeholder="Se completa con el CP"
                class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-surface-muted text-ink-faint cursor-default focus:outline-none transition-colors"
              />
            </div>

            <!-- Provincia (auto-fill desde CP) -->
            <div class="flex flex-col gap-1.5">
              <label for="province" class="block text-sm font-medium text-slate-700">Provincia</label>
              <input
                id="province"
                :value="province"
                type="text"
                readonly
                placeholder="Se completa con el CP"
                class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-surface-muted text-ink-faint cursor-default focus:outline-none transition-colors"
              />
            </div>

            <!-- Comunidad (auto-fill desde CP) -->
            <div class="flex flex-col gap-1.5">
              <label for="community" class="block text-sm font-medium text-slate-700">Comunidad Autónoma</label>
              <input
                id="community"
                :value="community"
                type="text"
                readonly
                placeholder="Se completa con el CP"
                class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-surface-muted text-ink-faint cursor-default focus:outline-none transition-colors"
              />
            </div>

            <!-- Búsqueda de dirección (geocodificación) -->
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <label class="block text-sm font-medium text-slate-700">Buscar Dirección en el Mapa</label>
              <AddressAutocomplete :city="city || undefined" @address-selected="handleAddressSelected" />
              <p class="text-xs text-ink-faint mt-0.5">Busca la dirección para ubicar el pin en el mapa automáticamente.</p>
            </div>

          </div>

          <!-- Mapa -->
          <div class="mt-5">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">
              Ubicación en el Mapa
              <span v-if="centerForm.latitude" class="font-normal text-ink-faint text-xs ml-2">
                ({{ centerForm.latitude?.toFixed(5) }}, {{ centerForm.longitude?.toFixed(5) }})
              </span>
            </label>
            <LocationMap
              :latitude="centerForm.latitude"
              :longitude="centerForm.longitude"
              @pin-moved="handlePinMoved"
            />
          </div>
        </div>
      </section>

      <!-- Email Section -->
      <Email :form="centerForm" />

      <!-- Phone Section -->
      <Phone :form="centerForm" />

      <!-- Characteristics Section -->
      <Characteristics :form="centerForm" />

      <!-- Social Media Section -->
      <Social :form="centerForm" />

      <!-- Error Message -->
      <div
        v-if="submitError"
        class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
      >
        {{ submitError }}
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-6 border-t border-line">
        <button
          type="button"
          class="px-5 py-2.5 rounded-btn text-sm font-semibold bg-white text-ink border border-line hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
          @click="handleCancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <Save class="w-4 h-4" />
          {{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Centro' : 'Guardar Centro') }}
        </button>
      </div>
    </form>
  </div>
</template>
