import '@/assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/app/router/index'

import { useAuthStore } from '@/features/Auth/stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()
await authStore.init()

app.mount('#app')
