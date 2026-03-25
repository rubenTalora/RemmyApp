import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function usePostalCodeLookup(postalCode: Ref<string>) {
  const city = ref('')
  const province = ref('')
  const community = ref('')
  const cityId = ref<number | null>(null)
  const provinceId = ref<number | null>(null)
  const communityId = ref<number | null>(null)
  const loading = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout>

  watch(postalCode, (val) => {
    clearTimeout(debounceTimer)
    if (!val || val.length < 5) {
      city.value = ''
      province.value = ''
      community.value = ''
      cityId.value = null
      provinceId.value = null
      communityId.value = null
      return
    }
    debounceTimer = setTimeout(async () => {
      loading.value = true
      const { data } = await supabase
        .from('postal_code_lookup')
        .select('*')
        .eq('postal_code', val)
        .limit(1)
      loading.value = false
      const row = data?.[0]
      if (row) {
        city.value = row.city
        province.value = row.province
        community.value = row.community
        cityId.value = row.city_id
        provinceId.value = row.province_id
        communityId.value = row.community_id
      } else {
        city.value = ''
        province.value = ''
        community.value = ''
        cityId.value = null
        provinceId.value = null
        communityId.value = null
      }
    }, 300)
  })

  return { city, province, community, cityId, provinceId, communityId, loading }
}
