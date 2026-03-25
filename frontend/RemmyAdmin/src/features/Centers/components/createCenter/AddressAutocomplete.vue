<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ city?: string }>()

const emit = defineEmits<{
  'address-selected': [payload: {
    formatted_address: string
    latitude: number
    longitude: number
    mapbox_place_id: string
    road_name: string
    road_num: number | null
  }]
}>()

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    house_number?: string
    postcode?: string
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

const query = ref('')
const placeholder = computed(() =>
  props.city ? `Buscar calle en ${props.city}...` : 'Buscar dirección...'
)
const suggestions = ref<NominatimResult[]>([])
const loading = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value || query.value.length < 3) {
    suggestions.value = []
    return
  }
  debounceTimer = setTimeout(search, 400)
}

async function search() {
  loading.value = true
  try {
    const base = 'https://nominatim.openstreetmap.org/search'
    const common = 'format=json&limit=5&countrycodes=es&addressdetails=1'
    // Si hay ciudad la añadimos a la query free-text → más tolerante con acentos y variantes
    const q = props.city ? `${query.value}, ${props.city}` : query.value
    const params = `q=${encodeURIComponent(q)}&${common}`
    const res = await fetch(`${base}?${params}`, { headers: { 'Accept-Language': 'es' } })
    if (!res.ok) throw new Error(`Nominatim error: ${res.status}`)
    suggestions.value = await res.json()
  } catch (e) {
    console.error('[AddressAutocomplete]', e)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

function formatSuggestion(r: NominatimResult): string {
  const a = r.address
  const street = a.road && a.house_number
    ? `${a.road} ${a.house_number}`
    : a.road ?? ''
  const city = a.city ?? a.town ?? a.village ?? ''
  const parts = [street, a.postcode, city, a.state].filter(Boolean)
  return parts.length ? parts.join(', ') : r.display_name
}

function select(result: NominatimResult) {
  const formatted = formatSuggestion(result)
  query.value = formatted
  suggestions.value = []
  emit('address-selected', {
    formatted_address: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    mapbox_place_id: '',
    road_name: result.address.road ?? '',
    road_num: parseInt(result.address.house_number ?? '') || null
  })
}

function onBlur() {
  setTimeout(() => { suggestions.value = [] }, 150)
}
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      @input="onInput"
      @blur="onBlur"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
    />
    <span
      v-if="loading"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint pointer-events-none"
    >
      Buscando...
    </span>
    <ul
      v-if="suggestions.length"
      class="absolute z-50 bg-white border border-line rounded-md w-full mt-1 shadow-panel max-h-52 overflow-y-auto list-none p-0"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="s.place_id ?? i"
        @mousedown.prevent="select(s)"
        class="px-3 py-2 cursor-pointer text-sm text-ink border-b border-line/60 last:border-b-0 hover:bg-brand-50 transition-colors"
      >
        {{ formatSuggestion(s) }}
      </li>
    </ul>
  </div>
</template>
