<template>
  <aside class="fixed left-0 top-0 h-full w-72 bg-white z-40 flex flex-col shadow-2xl">

    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <span class="material-icons text-white" style="font-size:18px">trending_up</span>
        </div>
        <span class="font-bold text-brand-800">InvestJatim</span>
      </div>
      <button @click="ui.closeMobileMenu()" class="p-1.5 rounded-lg hover:bg-gray-100">
        <span class="material-icons text-gray-500">close</span>
      </button>
    </div>

    <!-- User info -->
    <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5">
      <BaseAvatar :name="auth.user?.nama || 'User'" size="sm" />
      <div>
        <p class="text-sm font-medium text-gray-800">{{ auth.user?.nama || 'Pengguna' }}</p>
        <p class="text-xs text-gray-400 capitalize">{{ auth.role }}</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="{ name: item.to }"
        class="sidebar-link"
        :class="{ 'active': route.name === item.to }"
        @click="ui.closeMobileMenu()"
      >
        <span class="material-icons" style="font-size:20px">{{ item.icon }}</span>
        <span class="flex-1">{{ item.label }}</span>
        <span v-if="item.badge" class="w-2 h-2 rounded-full bg-danger-500" />
      </RouterLink>
    </nav>

    <!-- Logout -->
    <div class="px-3 py-4 border-t border-gray-100">
      <button @click="handleLogout" class="sidebar-link w-full text-red-500 hover:bg-red-50">
        <span class="material-icons" style="font-size:20px">logout</span>
        <span>Keluar</span>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.store.js'
import { useUiStore }   from '../../../stores/ui.store.js'
import BaseAvatar from '../../shared/BaseAvatar.vue'

const auth   = useAuthStore()
const ui     = useUiStore()
const route  = useRoute()
const router = useRouter()

const navConfig = {
  umkm:       [
    { icon: 'dashboard',      label: 'Ringkasan',      to: 'umkm-overview' },
    { icon: 'storefront',     label: 'Profil Bisnis',  to: 'umkm-profil' },
    { icon: 'bar_chart',      label: 'Data Keuangan',  to: 'umkm-keuangan' },
    { icon: 'photo_library',  label: 'Foto & Media',   to: 'umkm-media' },
    { icon: 'verified',       label: 'Legalitas',      to: 'umkm-legalitas' },
    { icon: 'inbox',          label: 'Investor Masuk', to: 'umkm-inbox', badge: true },
    { icon: 'preview',        label: 'Preview Publik', to: 'umkm-preview' },
  ],
  investor:   [
    { icon: 'dashboard', label: 'Overview', to: 'inv-overview' },
    { icon: 'search',    label: 'Direktori UMKM', to: 'inv-directory' },
    { icon: 'bookmarks', label: 'Watchlist', to: 'inv-watchlist' },
    { icon: 'history',   label: 'Riwayat', to: 'inv-history' },
    { icon: 'badge',     label: 'Verifikasi KTP', to: 'inv-verify' },
  ],
  admin:      [
    { icon: 'dashboard',       label: 'Overview',       to: 'admin-overview' },
    { icon: 'approval',        label: 'Antrian Verif.', to: 'admin-verify', badge: true },
    { icon: 'manage_accounts', label: 'Pengguna',       to: 'admin-users' },
    { icon: 'timeline',        label: 'Aktivitas',      to: 'admin-activity' },
  ],
  pemerintah: [
    { icon: 'dashboard', label: 'Statistik',       to: 'gov-overview' },
    { icon: 'map',       label: 'Peta Sebaran',    to: 'gov-heatmap' },
    { icon: 'pie_chart', label: 'Analisis Sektor', to: 'gov-sector' },
    { icon: 'summarize', label: 'Ekspor Laporan',  to: 'gov-report' },
  ],
  mentor:     [
    { icon: 'dashboard',   label: 'Overview',      to: 'mentor-overview' },
    { icon: 'groups',      label: 'UMKM Binaan',   to: 'mentor-overview' },
    { icon: 'rate_review', label: 'Beri Feedback', to: 'mentor-feedback' },
    { icon: 'checklist',   label: 'Checklist',     to: 'mentor-checklist' },
  ],
}

const navItems = computed(() => navConfig[auth.role] || [])

function handleLogout() {
  auth.logout()
  ui.closeMobileMenu()
  router.push({ name: 'login' })
}
</script>