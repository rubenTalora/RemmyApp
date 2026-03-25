import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/Auth/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // AUTH
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/Auth/views/loginView.vue'),
    },

    // SideBar
    {
      path: '/',
      component: () => import('@/app/layouts/appLayout.vue'),
      children: [
        {
          path: 'GestionPanel',
          name: 'GestionPanel',
          component: () => import('@/features/Centers/views/gestionPanelView.vue'),
        },
        {
          path: 'CreateCenter',
          name: 'CreateCenter',
          component: () => import('@/features/Centers/views/NewCenterView.vue'),
        },
        {
          path: 'center/:id',
          name: 'InfoCenter',
          component: () => import('@/features/Centers/views/infoCenterView.vue'),
        },
        {
          path: 'centers/:id/edit',
          name: 'EditCenter',
          component: () => import('@/features/Centers/views/NewCenterView.vue'),
        }
      ]
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.sessionReady

  const isProtected = to.matched.some(r => r.path === '/')
  if (isProtected && !authStore.user) return { name: 'login' }
  if (to.name === 'login' && authStore.user) return { name: 'GestionPanel' }
})

export default router
