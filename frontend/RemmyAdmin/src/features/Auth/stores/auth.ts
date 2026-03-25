import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  let _resolveReady!: () => void
  const sessionReady = new Promise<void>(resolve => { _resolveReady = resolve })

  async function init(): Promise<void> {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    loading.value = false
    _resolveReady()
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false
    if (authError) {
      error.value = authError.message
      return false
    }
    return true
  }

  async function signOut(): Promise<void> {
    error.value = null
    await supabase.auth.signOut()
  }

  return { user, loading, error, sessionReady, init, signIn, signOut }
})
