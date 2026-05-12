<template>
  <aside class="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">

    <!-- Logo -->
    <div class="px-5 py-4 border-b border-gray-100">
      <RouterLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
           <img src="../../../assets/images/logo-Investjatim.png" alt="InvestJatim" class="logo-img" />
        </div>
        <span class="font-bold text-brand-800 text-base">InvestJatim</span>
      </RouterLink>
    </div>

    <!-- Role badge -->
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="flex items-center gap-2.5">
        <BaseAvatar :name="auth.user?.nama || 'User'" size="sm" />
        <div class="min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ auth.user?.nama || 'Pengguna' }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ roleLabel }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="{ name: item.to }"
        class="sidebar-link group"
        :class="{ 'active': isActive(item.to) }"
      >
        <span class="material-symbols-rounded" style="font-size:20px">{{ item.icon }}</span>
        <span class="flex-1">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="w-2 h-2 rounded-full bg-danger-500"
        />
      </RouterLink>
    </nav>

    <!-- Logout -->
    <div class="px-3 py-4 border-t border-gray-100">
      <button @click="handleLogout" class="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
        <span class="material-symbols-rounded" style="font-size:20px">logout</span>
        <span>Keluar</span>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.store.js'
import BaseAvatar from '../../shared/BaseAvatar.vue'

const auth   = useAuthStore()
const route  = useRoute()
const router = useRouter()

const roleLabel = computed(() => {
  const map = { umkm: 'Pelaku UMKM', investor: 'Investor', admin: 'Administrator', pemerintah: 'Pemerintah / Dinas', mentor: 'Mentor' }
  return map[auth.role] || auth.role
})

const navConfig = {
  umkm: [
    { icon: 'dashboard',      label: 'Ringkasan',      to: 'umkm-overview' },
    { icon: 'storefront',     label: 'Profil Bisnis',  to: 'umkm-profil' },
    { icon: 'bar_chart',      label: 'Data Keuangan',  to: 'umkm-keuangan' },
    { icon: 'photo_library',  label: 'Foto & Media',   to: 'umkm-media' },
    { icon: 'verified',       label: 'Legalitas',      to: 'umkm-legalitas' },
    { icon: 'inbox',          label: 'Investor Masuk', to: 'umkm-inbox', badge: true },
    { icon: 'preview',        label: 'Preview Publik', to: 'umkm-preview' },
  ],
  investor: [
    { icon: 'dashboard',      label: 'Overview',       to: 'inv-overview' },
    { icon: 'search',         label: 'Direktori UMKM', to: 'inv-directory' },
    { icon: 'bookmarks',      label: 'Watchlist',      to: 'inv-watchlist' },
    { icon: 'history',        label: 'Riwayat',        to: 'inv-history' },
    { icon: 'badge',          label: 'Verifikasi KTP', to: 'inv-verify' },
  ],
  admin: [
    { icon: 'dashboard',      label: 'Overview',       to: 'admin-overview' },
    { icon: 'approval',       label: 'Antrian Verif.', to: 'admin-verify', badge: true },
    { icon: 'manage_accounts',label: 'Pengguna',       to: 'admin-users' },
    { icon: 'timeline',       label: 'Aktivitas',      to: 'admin-activity' },
  ],
  pemerintah: [
    { icon: 'dashboard',      label: 'Statistik',      to: 'gov-overview' },
    { icon: 'map',            label: 'Peta Sebaran',   to: 'gov-heatmap' },
    { icon: 'pie_chart',      label: 'Analisis Sektor',to: 'gov-sector' },
    { icon: 'summarize',      label: 'Ekspor Laporan', to: 'gov-report' },
  ],
  mentor: [
    { icon: 'dashboard',      label: 'Overview',       to: 'mentor-overview' },
    { icon: 'groups',         label: 'UMKM Binaan',    to: 'mentor-overview' },
    // { icon: 'rate_review',    label: 'Beri Feedback',  to: 'mentor-feedback' },
    // { icon: 'checklist',      label: 'Checklist',      to: 'mentor-checklist' },
  ],
}

const navItems = computed(() => navConfig[auth.role] || [])
const isActive = (name) => route.name === name

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>