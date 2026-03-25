<script setup lang="ts">
import { Users } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-surface-alt">
    <div class="max-w-[1400px] mx-auto px-8 py-8">

      <!-- Page Header -->
      <header class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
          <Users class="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-ink leading-tight">Gestión de Administradores</h1>
          <p class="text-sm text-ink-muted mt-0.5">Invite y gestione el acceso de los administradores del sistema.</p>
        </div>
      </header>

      <!-- Coming Soon -->
      <div class="bg-surface rounded-xl border border-line shadow-sm p-12 flex flex-col items-center justify-center gap-4 text-center">
        <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center">
          <Users class="w-7 h-7 text-brand-500" />
        </div>
        <h2 class="text-lg font-semibold text-ink">Próximamente</h2>
        <p class="text-sm text-ink-muted max-w-sm">
          La gestión de administradores estará disponible en una próxima versión.
        </p>
      </div>

    </div>
  </div>
</template>
