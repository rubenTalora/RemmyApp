import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CenterType } from '@/features/Centers/entities/centers'
import { supabase } from '@/lib/supabase'

export const useCenterTypesStore = defineStore('centerTypes', () => {
  const centerTypes = ref<CenterType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCenterTypes() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.from('CENTER_TYPES').select('*')
    loading.value = false
    if (err) { error.value = err.message; return }
    centerTypes.value = data ?? []
  }

  return { centerTypes, loading, error, fetchCenterTypes }
})
