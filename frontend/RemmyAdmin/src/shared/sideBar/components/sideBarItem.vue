<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  label: string
  icon?: Component
  to?: string
  onClick?: () => void
  action?: 'link' | 'button'
}

const props = withDefaults(defineProps<Props>(), {
  action: 'link'
})

const route = useRoute()
const isActive = computed(() => {
  if (!props.to) return false
  return route.path === props.to || route.path.startsWith(props.to + '/')
})

const baseClasses = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-brand-600 hover:text-white transition-colors text-sm font-medium w-full'
const activeClasses = 'bg-brand-700 text-white font-semibold'
const inactiveClasses = 'text-white/80'
</script>

<template>
  <div class="w-full">
    <!-- Link Item -->
    <router-link
      v-if="action === 'link'"
      :to="to || '#'"
      :class="[baseClasses, isActive ? activeClasses : inactiveClasses]"
    >
      <component v-if="icon" :is="icon" class="w-5 h-5 flex-shrink-0" />
      <span class="truncate">{{ label }}</span>
    </router-link>

    <!-- Button Item -->
    <button
      v-else-if="action === 'button'"
      :class="[baseClasses, inactiveClasses]"
      @click="onClick"
    >
      <component v-if="icon" :is="icon" class="w-5 h-5 flex-shrink-0" />
      <span class="truncate">{{ label }}</span>
    </button>
  </div>
</template>
