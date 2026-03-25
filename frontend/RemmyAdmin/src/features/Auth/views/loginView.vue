<script setup lang="ts">
import LoginForm from "@/features/Auth/components/loginForm.vue";
</script>

<template>
  <div class="flex h-screen w-full">
    <!-- Left panel: brand identity -->
    <div class="flex-1 bg-brand-500 flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
      <!-- Decorative geometric background shapes -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5"></div>
        <div class="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/5"></div>
        <div class="absolute top-1/2 -translate-y-1/2 -left-8 w-48 h-48 rounded-full bg-white/[0.04]"></div>
        <div class="absolute top-8 right-8 w-32 h-32 bg-white/[0.04] rotate-45"></div>
        <div class="absolute bottom-16 left-12 w-16 h-16 bg-white/[0.06] rotate-12"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center text-center max-w-xs">
        <h1 class="text-5xl font-bold tracking-tight mb-2">Remmy</h1>
        <p class="text-xl font-medium text-white/90 mb-6">Gestión Humanitaria</p>
        <p class="text-white/70 text-sm leading-relaxed">
          Administra la red de centros de ayuda humanitaria de España de forma simple y eficiente.
        </p>
      </div>
    </div>

    <!-- Right panel: login form -->
    <div class="flex-1 bg-surface flex items-center justify-center p-12 sm:p-16">
      <LoginForm />
    </div>
  </div>
</template>
