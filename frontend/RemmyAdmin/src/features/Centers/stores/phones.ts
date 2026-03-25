import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const usePhonesStore = defineStore('phones', () => {
  async function syncPhones(centerId: number, phones: string[]) {
    const { error: delErr } = await supabase
      .from('PHONES')
      .delete()
      .eq('id_center', centerId)
    if (delErr) throw new Error(delErr.message)

    if (phones.length === 0) return

    const { error: insErr } = await supabase
      .from('PHONES')
      .insert(phones.map(phone => ({ phone, id_center: centerId })))
    if (insErr) throw new Error(insErr.message)
  }

  return { syncPhones }
})
