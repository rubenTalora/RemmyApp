<script lang="ts" setup>
import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-vue-next'
import SidebarItem from './sideBarItem.vue'
import { useAuthStore } from '@/features/Auth/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleHelp() {
  console.log('Help clicked')
}

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>

<template>
  <nav class="flex flex-col w-[220px] h-screen bg-brand-500 border-r border-brand-600 flex-shrink-0">

    <!-- Wordmark -->
    <div class="flex items-center px-5 py-5 border-b border-brand-600">
      <span class="text-white font-bold text-xl tracking-tight">Remmy</span>
    </div>

    <!-- Main Nav -->
    <div class="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
      <SidebarItem
        label="Dashboard"
        :icon="LayoutDashboard"
        to="/Dashboard"
        action="link"
      />
      <SidebarItem
        label="Gestión de Centros"
        :icon="Building2"
        to="/GestionPanel"
        action="link"
      />
      <SidebarItem
        label="Reportes"
        :icon="BarChart2"
        to="/Reportes"
        action="link"
      />
      <SidebarItem
        label="Usuarios"
        :icon="Users"
        to="/Usuarios"
        action="link"
      />
      <SidebarItem
        label="Configuración"
        :icon="Settings"
        to="/settings"
        action="link"
      />
    </div>

    <!-- Footer Nav -->
    <div class="flex flex-col gap-1 px-3 py-4 border-t border-brand-600">
      <SidebarItem
        label="Ayuda"
        :icon="HelpCircle"
        action="button"
        :onClick="handleHelp"
      />
      <SidebarItem
        label="Cerrar Sesión"
        :icon="LogOut"
        action="button"
        :onClick="handleSignOut"
      />
    </div>
  </nav>
</template>
