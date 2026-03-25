<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/util/baseButton.vue'
import { useAuthStore } from '@/features/Auth/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const loginForm = ref({
  email: '',
  password: ''
})
const rememberDevice = ref(false)

const handleSubmit = async () => {
  const success = await authStore.signIn(loginForm.value.email, loginForm.value.password)
  if (success) router.push({ name: 'GestionPanel' })
}
</script>

<template>
  <div class="w-full max-w-sm">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-ink mb-1">Bienvenido</h2>
      <p class="text-sm text-ink-muted">Introduce tu correo y contraseña para acceder al panel.</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
      <!-- Email -->
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-sm font-medium text-slate-700">Correo electrónico</label>
        <input
          id="email"
          v-model.trim="loginForm.email"
          type="email"
          autocomplete="email"
          required
          placeholder="nombre@organizacion.org"
          class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-ink bg-surface placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-sm font-medium text-slate-700">Contraseña</label>
        <input
          id="password"
          v-model="loginForm.password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
          class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-ink bg-surface placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
        />
        <!-- Error message -->
        <p v-if="authStore.error" class="text-red-500 text-xs mt-0.5">{{ authStore.error }}</p>
      </div>

      <!-- Remember device -->
      <div class="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          v-model="rememberDevice"
          class="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/20 cursor-pointer"
        />
        <label for="remember" class="text-sm text-ink-muted cursor-pointer select-none">
          Recordar dispositivo
        </label>
      </div>

      <!-- Submit -->
      <BaseButton
        variant="primary"
        :label="authStore.loading ? 'Iniciando sesión...' : 'Iniciar sesión'"
        :animationEnabled="false"
        :disabled="authStore.loading"
        class="w-full"
      />
    </form>

    <!-- Footer -->
    <div class="mt-8 pt-6 border-t border-line text-center">
      <p class="text-xs text-ink-faint">Acceso restringido al personal autorizado.</p>
      <p class="text-xs text-ink-faint mt-1">© 2025 Remmy.</p>
    </div>
  </div>
</template>
