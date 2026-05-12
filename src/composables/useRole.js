import { ref, computed } from 'vue'

// Global state yang ditaruh di luar function agar nilainya presisten (singleton share-state)
const currentRole = ref(localStorage.getItem('user_role') || 'public')
const currentUser = ref(JSON.parse(localStorage.getItem('user_data')) || null)
const token = ref(localStorage.getItem('auth_token') || null)

export function useRole() {
  
  // Getter reaktif untuk mengecek status login
  const isAuthenticated = computed(() => !!token.value)
  
  // Geter untuk validasi role spesifik secara cepat
  const isUmkm = computed(() => currentRole.value === 'umkm')
  const isInvestor = computed(() => currentRole.value === 'investor')
  const isAdmin = computed(() => currentRole.value === 'admin')
  const isGovernment = computed(() => currentRole.value === 'government')
  const isMentor = computed(() => currentRole.value === 'mentor')

  /**
   * Fungsi simulasi login untuk menetapkan role dan user data
   * @param {Object} userData - { name, email, role, token }
   */
  const login = (userData) => {
    token.value = userData.token
    currentRole.value = userData.role
    currentUser.value = { name: userData.name, email: userData.email }

    localStorage.setItem('auth_token', userData.token)
    localStorage.setItem('user_role', userData.role)
    localStorage.setItem('user_data', JSON.stringify(currentUser.value))
  }

  /**
   * Fungsi untuk menghapus seluruh sesi login (Clear Session)
   */
  const logout = () => {
    token.value = null
    currentRole.value = 'public'
    currentUser.value = null

    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_data')
  }

  /**
   * Mengganti role secara dinamis (Sangat berguna untuk proses testing dashboard antar role)
   * @param {String} newRole 
   */
  const switchRoleTest = (newRole) => {
    const validRoles = ['public', 'umkm', 'investor', 'admin', 'government', 'mentor']
    if (validRoles.includes(newRole)) {
      currentRole.value = newRole
      localStorage.setItem('user_role', newRole)
    }
  }

  return {
    currentRole,
    currentUser,
    isAuthenticated,
    isUmkm,
    isInvestor,
    isAdmin,
    isGovernment,
    isMentor,
    login,
    logout,
    switchRoleTest
  }
}