// src/router/guards.js
import { useAuthStore } from '@/stores/auth.store.js'

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next({ name: 'login' })
    }

    next() // ← ini yang paling penting, tanpa ini semua route hang
  })
}

if (to.meta.role && auth.user?.role !== to.meta.role) {
  return next({ name: 'unauthorized' }) // atau redirect ke home
}

// Navigation guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.restoreSession()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'unauthorized' }
  }

  return true  // ← tambah ini
})