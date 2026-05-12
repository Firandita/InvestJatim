<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-left-content">
        <div class="brand">
          <span class="material-symbols-rounded brand-icon">trending_up</span>
          <span class="brand-name">Invest<strong>Jatim</strong></span>
        </div>
        <h1 class="left-title">Platform Investasi UMKM Jawa Timur</h1>
        <p class="left-desc">Hubungkan bisnis potensial dengan investor yang tepat melalui dashboard data yang transparan dan terverifikasi.</p>
        <div class="left-stats">
          <div class="left-stat">
            <span class="left-stat-val">12.500+</span>
            <span class="left-stat-lbl">UMKM Terdaftar</span>
          </div>
          <div class="left-stat">
            <span class="left-stat-val">850+</span>
            <span class="left-stat-lbl">Investor Aktif</span>
          </div>
          <div class="left-stat">
            <span class="left-stat-val">Rp 150M+</span>
            <span class="left-stat-lbl">Dana Tersalur</span>
          </div>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <!-- Logo mobile only -->
        <div class="brand brand-mobile">
          <span class="material-symbols-rounded brand-icon">trending_up</span>
          <span class="brand-name">Invest<strong>Jatim</strong></span>
        </div>

        <h2 class="login-title">Masuk ke Akun</h2>
        <p class="login-sub">Pilih role kamu untuk melanjutkan</p>

        <!-- Role selector -->
        <div class="role-grid">
          <button
            v-for="r in roles"
            :key="r.value"
            @click="selectedRole = r.value"
            :class="['role-btn', selectedRole === r.value ? 'role-btn-active' : '']"
          >
            <span class="material-symbols-rounded role-icon">{{ r.icon }}</span>
            <span class="role-label">{{ r.label }}</span>
          </button>
        </div>

        <!-- Form -->
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="input-base" placeholder="email@contoh.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Kata Sandi</label>
          <input v-model="password" type="password" class="input-base" placeholder="••••••••" />
          <p class="form-hint">Demo: password bebas, pilih role lalu klik Masuk</p>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button @click="handleLogin" :disabled="loading" class="btn-primary login-btn">
          <span v-if="loading" class="material-symbols-rounded spin">refresh</span>
          <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
        </button>

        <p class="login-footer">
          Belum punya akun?
          <RouterLink to="/daftar" class="login-link">Daftar Sekarang</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store.js'

const auth   = useAuthStore()
const router = useRouter()

const selectedRole = ref('umkm')
const email        = ref('')
const password     = ref('')
const loading      = ref(false)
const error        = ref('')

const roles = [
  { value: 'umkm',       label: 'UMKM',        icon: 'storefront' },
  { value: 'investor',   label: 'Investor',     icon: 'account_balance' },
  { value: 'admin',      label: 'Admin',        icon: 'admin_panel_settings' },
  { value: 'pemerintah', label: 'Pemerintah',   icon: 'account_balance_wallet' },
  { value: 'mentor',     label: 'Mentor',       icon: 'school' },
]

const mockUsers = {
  umkm:       { nama: 'Batik Arjuna', email: 'umkm@demo.com' },
  investor:   { nama: 'Budi Santoso', email: 'investor@demo.com' },
  admin:      { nama: 'Admin InvestJatim', email: 'admin@demo.com' },
  pemerintah: { nama: 'Dinas Koperasi Jatim', email: 'dinas@demo.com' },
  mentor:     { nama: 'Mentor Andi', email: 'mentor@demo.com' },
}

async function handleLogin() {
  if (!selectedRole.value) { error.value = 'Pilih role terlebih dahulu'; return }
  loading.value = true
  error.value   = ''
  await new Promise(r => setTimeout(r, 800))
  const user = mockUsers[selectedRole.value]
  auth.login(user, selectedRole.value)
  router.push(auth.dashboardHome)
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
}

/* LEFT PANEL */
.login-left {
  flex: 1;
  background: linear-gradient(145deg, #4a7535 0%, #6A994E 60%, #7aaa5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.login-left-content {
  max-width: 400px;
  color: white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2.5rem;
}

.brand-icon {
  font-size: 1.75rem;
  color: rgba(255,255,255,0.8);
}

.brand-name {
  font-size: 1.25rem;
  color: white;
  letter-spacing: -0.01em;
}

.brand-name strong {
  color: #c8ddb8;
}

.left-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: white;
}

.left-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.65);
  margin-bottom: 2.5rem;
}

.left-stats {
  display: flex;
  gap: 2rem;
}

.left-stat {}
.left-stat-val {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
}
.left-stat-lbl {
  display: block;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.55);
  margin-top: 0.15rem;
}

/* RIGHT PANEL */
.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F7F7F5;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #ddeece;
  box-shadow: 0 4px 24px rgba(106,153,78,0.07);
  padding: 2.25rem;
  width: 100%;
  max-width: 400px;
}

.brand-mobile {
  display: none;
  margin-bottom: 1.5rem;
}

.brand-mobile .brand-icon { color: #6A994E; }
.brand-mobile .brand-name { color: #2E2E2E; }
.brand-mobile .brand-name strong { color: #6A994E; }

.login-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2E2E2E;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.login-sub {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 1.75rem;
}

/* Role Grid */
.role-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.4rem;
  border-radius: 0.75rem;
  border: 2px solid #e8e8e4;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.role-btn:hover {
  border-color: #6A994E;
  background: #EEF6E8;
}

.role-btn-active {
  border-color: #6A994E;
  background: #EEF6E8;
}

.role-icon {
  font-size: 1.3rem;
  color: #888;
}

.role-btn-active .role-icon {
  color: #6A994E;
}

.role-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #888;
  text-align: center;
}

.role-btn-active .role-label {
  color: #6A994E;
}

/* Form */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #2E2E2E;
  margin-bottom: 0.4rem;
}

.form-hint {
  font-size: 0.72rem;
  color: #aaa;
  margin-top: 0.35rem;
}

.error-msg {
  font-size: 0.82rem;
  color: #E76F51;
  margin-bottom: 0.75rem;
  background: #FEF2F2;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

.login-btn {
  width: 100%;
  justify-content: center;
  padding: 0.8rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.login-footer {
  text-align: center;
  font-size: 0.82rem;
  color: #aaa;
}

.login-link {
  color: #6A994E;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover { text-decoration: underline; }

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .login-left { display: none; }
  .login-right { width: 100%; background: #F7F7F5; }
  .brand-mobile { display: flex; }
  .role-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>