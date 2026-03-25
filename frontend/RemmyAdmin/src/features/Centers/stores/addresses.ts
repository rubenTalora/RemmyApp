import { defineStore } from 'pinia'
import type { CreateAddressPayload } from '@/features/Centers/entities/centers'
import { supabase } from '@/lib/supabase'

export const useAddressesStore = defineStore('addresses', () => {
  async function upsertAddress(payload: CreateAddressPayload) {
    const { error } = await supabase.from('ADDRESSES').upsert(payload)
    if (error) throw new Error(error.message)
  }

  return { upsertAddress }
})
