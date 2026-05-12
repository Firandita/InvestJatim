<template>
  <header class="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 sticky top-0 z-20">

    <!-- Hamburger (mobile only) -->
    <button
      class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
      @click="ui.openMobileMenu()"
    >
      <span class="material-symbols-rounded">menu</span>
    </button>

    <!-- Logo mobile -->
    <RouterLink to="/" class="lg:hidden flex items-center gap-1.5">
      <div class="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
        <span class="material-symbols-rounded text-white" style="font-size:15px">trending_up</span>
      </div>
      <span class="font-bold text-brand-800 text-sm">InvestJatim</span>
    </RouterLink>

    <!-- Page title (desktop) -->
    <div class="hidden lg:block">
      <h1 class="text-base font-semibold text-gray-800">{{ pageTitle }}</h1>
    </div>

    <div class="flex-1" />

    <!-- Notifikasi -->
    <button class="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
      <span class="material-symbols-rounded">notifications</span>
      <span class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
    </button>

    <!-- Avatar -->
    <div class="flex items-center gap-2 cursor-pointer">
      <BaseAvatar :name="auth.user?.nama || 'User'" size="sm" />
      <span class="hidden md:block text-sm font-medium text-gray-700">
        {{ auth.user?.nama || 'Pengguna' }}
      </span>
    </div>

  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.store.js'
import { useUiStore }   from '../../../stores/ui.store.js'
import BaseAvatar from '../../shared/BaseAvatar.vue'

const auth  = useAuthStore()
const ui    = useUiStore()
const route = useRoute()

const titleMap = {
  'umkm-overview':  'Ringkasan',
  'umkm-profil':    'Profil Bisnis',
  'umkm-keuangan':  'Data Keuangan',
  'umkm-media':     'Foto & Media',
  'umkm-legalitas': 'Legalitas',
  'umkm-inbox':     'Investor Masuk',
  'umkm-preview':   'Preview Publik',
  'inv-overview':   'Overview Investor',
  'inv-directory':  'Direktori UMKM',
  'inv-watchlist':  'Watchlist',
  'inv-history':    'Riwayat Kunjungan',
  'inv-verify':     'Verifikasi Identitas',
  'admin-overview': 'Overview Platform',
  'admin-verify':   'Antrian Verifikasi',
  'admin-users':    'Manajemen Pengguna',
  'gov-overview':   'Statistik Jawa Timur',
  'gov-heatmap':    'Peta Sebaran UMKM',
  'mentor-overview':'Dashboard Mentor',
}

const pageTitle = computed(() => titleMap[route.name] || 'Dashboard')
</script>