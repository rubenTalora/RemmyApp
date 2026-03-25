<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const props = defineProps<{
  latitude: number | null
  longitude: number | null
}>()

const emit = defineEmits<{
  'pin-moved': [payload: { lat: number; lng: number }]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  if (props.latitude != null && props.longitude != null) {
    nextTick(() => initMap(props.latitude!, props.longitude!))
  }
})

watch(
  () => [props.latitude, props.longitude] as [number | null, number | null],
  ([lat, lng]) => {
    if (lat == null || lng == null) return
    nextTick(() => {
      if (!map) {
        initMap(lat, lng)
      } else {
        marker?.setLatLng([lat, lng])
        map.setView([lat, lng], 15)
      }
    })
  }
)

function initMap(lat: number, lng: number) {
  if (!mapContainer.value) return
  if (map) { map.remove(); map = null; marker = null }

  map = L.map(mapContainer.value).setView([lat, lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  marker = L.marker([lat, lng], { draggable: true }).addTo(map)
  marker.on('dragend', () => {
    const pos = marker!.getLatLng()
    emit('pin-moved', { lat: pos.lat, lng: pos.lng })
  })
}

onUnmounted(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div
    ref="mapContainer"
    v-show="latitude != null && longitude != null"
    class="rounded-md overflow-hidden border border-slate-200"
    style="height: 320px; width: 100%; z-index: 0;"
  />
  <div
    v-show="latitude == null || longitude == null"
    class="rounded-md border-2 border-dashed border-slate-200 bg-surface-muted flex items-center justify-center text-sm text-ink-faint"
    style="height: 320px; width: 100%;"
  >
    Busca una dirección para ver el mapa
  </div>
</template>
