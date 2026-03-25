<script setup lang="ts">
import Sidebar from '@/shared/sideBar/components/sideBar.vue'
</script>

<template>
  <div class="flex h-screen w-full">
    <Sidebar />
    <div class="app-main flex-1 overflow-y-auto overflow-x-hidden bg-surface-alt min-w-0">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar — Tailwind cannot generate these */
.app-main::-webkit-scrollbar {
  width: 8px;
}

.app-main::-webkit-scrollbar-track {
  background: transparent;
}

.app-main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.app-main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
