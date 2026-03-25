import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Center, CreateCenterPayload, UpdateCenterPayload } from '@/features/Centers/entities/centers'
import { supabase } from '@/lib/supabase'

export const useCentersStore = defineStore('centers', () => {
  const centers = ref<Center[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCenterById = computed(() =>
    (id: number) => centers.value.find(c => c.id === id) ?? null
  )

  async function fetchCenters() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('CENTERS')
      .select('*, center_type:CENTER_TYPES(*), address:ADDRESSES(*), phones:PHONES(*)')
    loading.value = false
    if (err) { error.value = err.message; return }
    centers.value = (data ?? []) as Center[]
  }

  async function fetchById(id: number): Promise<Center | null> {
    const { data, error: err } = await supabase
      .from('CENTERS')
      .select('*, center_type:CENTER_TYPES(*), address:ADDRESSES(*), phones:PHONES(*)')
      .eq('id', id)
      .single()
    if (err) return null
    return data as Center
  }

  async function createCenter(payload: CreateCenterPayload): Promise<Center> {
    const { data, error: err } = await supabase
      .from('CENTERS')
      .insert(payload)
      .select()
      .single()
    if (err) throw new Error(err.message)
    const center = data as Center
    centers.value.push(center)
    return center
  }

  async function updateCenter(id: number, payload: UpdateCenterPayload): Promise<Center> {
    const { data, error: err } = await supabase
      .from('CENTERS')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw new Error(err.message)
    const updated = data as Center
    const idx = centers.value.findIndex(c => c.id === id)
    if (idx !== -1) centers.value[idx] = updated
    return updated
  }

  async function deleteCenter(id: number) {
    const { error: err } = await supabase
      .from('CENTERS')
      .delete()
      .eq('id', id)
    if (err) throw new Error(err.message)
    centers.value = centers.value.filter(c => c.id !== id)
  }

  return { centers, loading, error, getCenterById, fetchCenters, fetchById, createCenter, updateCenter, deleteCenter }
})
