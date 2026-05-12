import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const role  = ref(null)
  const token = ref(localStorage.getItem('ij_token') || null)

  const isLoggedIn   = computed(() => !!token.value && !!user.value)
  const isUmkm       = computed(() => role.value === 'umkm')
  const isInvestor   = computed(() => role.value === 'investor')
  const isAdmin      = computed(() => role.value === 'admin')
  const isPemerintah = computed(() => role.value === 'pemerintah')
  const isMentor     = computed(() => role.value === 'mentor')

  const dashboardHome = computed(() => {
    const map = {
      umkm:       { name: 'umkm-overview' },
      investor:   { name: 'inv-overview' },
      admin:      { name: 'admin-overview' },
      pemerintah: { name: 'gov-overview' },
      mentor:     { name: 'mentor-overview' },
    }
    return map[role.value] || { name: 'home' }
  })

  function login(userData, userRole) {
    user.value  = userData
    role.value  = userRole
    token.value = 'mock-token-' + userRole
    localStorage.setItem('ij_token', token.value)
    localStorage.setItem('ij_role',  userRole)
    localStorage.setItem('ij_user',  JSON.stringify(userData))
  }

  function logout() {
    user.value  = null
    role.value  = null
    token.value = null
    localStorage.removeItem('ij_token')
    localStorage.removeItem('ij_role')
    localStorage.removeItem('ij_user')
  }

  function restoreSession() {
    const savedRole = localStorage.getItem('ij_role')
    const savedUser = localStorage.getItem('ij_user')
    if (token.value && savedRole && savedUser) {
      role.value = savedRole
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user, role, token,
    isLoggedIn, isUmkm, isInvestor, isAdmin, isPemerintah, isMentor,
    dashboardHome,
    login, logout, restoreSession,
  }
})