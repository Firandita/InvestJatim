// src/composables/useAuth.js
// Ganti bagian ini dengan koneksi ke API / Pinia store nyata saat production
import { ref, computed } from 'vue'

// State di luar fungsi agar shared antar komponen (singleton)
const user = ref(
  JSON.parse(localStorage.getItem('ij_user') ?? 'null') ?? {
    name:   'Budi Santoso',
    role:   'umkm',         // 'umkm' | 'investor' | 'admin' | 'pemerintah' | 'mentor'
    avatar: null,
    email:  'budi@example.com',
  }
)
const badgeCount = ref(3)

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('ij_user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('ij_user')
  }

  return { user, badgeCount, isLoggedIn, setUser, logout }
}