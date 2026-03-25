<script setup lang="ts">
import { ref } from 'vue'
import { Instagram, Twitter, Facebook, Youtube, Linkedin, MessageCircle, Share2, X } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const socialPlatforms: { id: string; name: string; icon: Component; placeholder: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: '@username' },
  { id: 'x', name: 'X / Twitter', icon: Twitter, placeholder: '@username' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/...' },
]

const activeSocial = ref<string | null>(null)

// Initialize social object if doesn't exist
if (!props.form.social) {
  props.form.social = {}
}

const toggleSocial = (platformId: string) => {
  activeSocial.value = activeSocial.value === platformId ? null : platformId
  if (!props.form.social[platformId]) {
    props.form.social[platformId] = ''
  }
}

const removeSocial = (platformId: string) => {
  delete props.form.social[platformId]
  if (activeSocial.value === platformId) {
    activeSocial.value = null
  }
}

const isActive = (platformId: string) => {
  return props.form.social[platformId]
}

const getPlatformIcon = (platformId: string): Component | null => {
  return socialPlatforms.find(p => p.id === platformId)?.icon ?? null
}
</script>

<template>
  <section class="bg-white rounded-card shadow-card border border-slate-100">
    <div class="px-6 py-4 border-b border-line bg-surface-muted flex items-center gap-2">
      <Share2 class="w-5 h-5 text-brand-500" />
      <h2 class="text-base font-semibold text-ink">Redes Sociales</h2>
    </div>

    <div class="p-6">
      <p class="text-sm text-ink-muted mb-5">Selecciona y añade los perfiles de redes sociales del centro.</p>

      <!-- Social Platforms -->
      <div class="flex flex-wrap gap-3 mb-5">
        <button
          v-for="platform in socialPlatforms"
          :key="platform.id"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg transition-all text-sm font-medium"
          :class="isActive(platform.id)
            ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_theme(colors.brand.100)]'
            : 'border-line bg-surface text-ink-muted hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600'"
          @click="toggleSocial(platform.id)"
        >
          <component :is="platform.icon" class="w-4 h-4" />
          {{ platform.name }}
        </button>
      </div>

      <!-- Active Social Inputs -->
      <div v-if="Object.keys(form.social).length > 0" class="flex flex-col gap-4 pt-4 border-t border-line">
        <div
          v-for="(value, platformId) in form.social"
          :key="platformId"
          class="flex flex-col gap-1.5"
        >
          <div class="flex items-center justify-between">
            <label :for="`social-${platformId}`" class="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <component :is="getPlatformIcon(platformId.toString())" class="w-4 h-4 text-brand-500" />
              {{ socialPlatforms.find(p => p.id === platformId)?.name }}
            </label>
            <button
              type="button"
              class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              @click="removeSocial(platformId.toString())"
            >
              <X class="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>
          <input
            :id="`social-${platformId}`"
            v-model.trim="form.social[platformId]"
            type="text"
            :placeholder="socialPlatforms.find(p => p.id === platformId)?.placeholder"
            class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-colors"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6 bg-surface-muted rounded-lg">
        <p class="text-sm text-ink-muted">Aún no se ha añadido ninguna red social</p>
      </div>
    </div>
  </section>
</template>
