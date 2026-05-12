<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-800">
          Selamat datang, {{ auth.user?.nama }}
        </h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Temukan UMKM Jawa Timur yang potensial untuk investasi Anda
        </p>
      </div>
      <RouterLink to="/dashboard/investor/direktori" class="btn-primary whitespace-nowrap">
        <span class="material-symbols-rounded" style="font-size:18px">search</span>
        Cari UMKM
      </RouterLink>
    </div>

    <!-- Verifikasi banner jika belum verified -->
    <div v-if="!isVerified"
         class="flex items-start gap-3 p-4 rounded-xl border border-warning-500 bg-warning-50">
      <span class="material-symbols-rounded text-warning-500 mt-0.5" style="font-size:20px">
        warning
      </span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-warning-800">Identitas belum terverifikasi</p>
        <p class="text-xs text-warning-800 opacity-75 mt-0.5">
          Verifikasi KTP untuk mengakses kontak UMKM dan fitur lengkap platform.
        </p>
      </div>
      <RouterLink to="/dashboard/investor/verifikasi" class="btn-secondary text-xs px-3 py-1.5 whitespace-nowrap">
        Verifikasi Sekarang
      </RouterLink>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="m in metrics" :key="m.label">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-rounded" :style="{ fontSize:'20px', color: m.color }">
            {{ m.icon }}
          </span>
          <span class="text-xs text-gray-400">{{ m.label }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ m.value }}</div>
        <div v-if="m.sub" class="text-xs text-gray-400 mt-1">{{ m.sub }}</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Watchlist -->
      <div class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Watchlist Utama</h3>
          <RouterLink to="/dashboard/investor/watchlist"
                      class="text-xs text-brand-600 hover:underline">
            Lihat semua
          </RouterLink>
        </div>

        <!-- Table header -->
        <div class="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
          <span class="col-span-4">Nama UMKM</span>
          <span class="col-span-2 text-center">Sektor</span>
          <span class="col-span-2 text-center">Score</span>
          <span class="col-span-2 text-center">Status</span>
          <span class="col-span-2 text-center">Aksi</span>
        </div>

        <div v-for="umkm in watchlistPreview" :key="umkm.id"
             class="grid grid-cols-12 gap-2 px-3 py-3 items-center hover:bg-gray-50 rounded-lg transition-colors">
          <div class="col-span-4 flex items-center gap-2 min-w-0">
            <div :style="{
              width:'32px', height:'32px', borderRadius:'8px', flexShrink:0,
              background: umkm.warna, color:'white',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:'11px'
            }">{{ umkm.logo }}</div>
            <span class="text-sm font-medium text-gray-800 truncate">{{ umkm.nama }}</span>
          </div>
          <span class="col-span-2 text-center">
            <span class="badge-info text-xs">{{ umkm.sektor }}</span>
          </span>
          <span class="col-span-2 text-center">
            <span :class="[
              'text-sm font-bold',
              umkm.readinessScore >= 80 ? 'text-success-500' :
              umkm.readinessScore >= 60 ? 'text-warning-500' : 'text-danger-500'
            ]">{{ umkm.readinessScore }}</span>
          </span>
          <span class="col-span-2 text-center">
            <span :class="umkm.status === 'verified' ? 'badge-verified' : 'badge-pending'">
              {{ umkm.status === 'verified' ? 'Verified' : 'Pending' }}
            </span>
          </span>
          <div class="col-span-2 flex justify-center">
            <RouterLink :to="'/dashboard/investor/umkm/' + umkm.id"
                        class="text-xs text-brand-600 hover:underline font-medium">
              Lihat
            </RouterLink>
          </div>
        </div>

        <div v-if="watchlistPreview.length === 0"
             class="text-center py-8 text-gray-400 text-sm">
          <span class="material-symbols-rounded block mb-2 text-gray-200" style="font-size:40px">
            bookmarks
          </span>
          Belum ada UMKM di watchlist
        </div>
      </div>

      <!-- Kunjungan Terakhir -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Kunjungan Terakhir</h3>
          <RouterLink to="/dashboard/investor/riwayat"
                      class="text-xs text-brand-600 hover:underline">
            Semua
          </RouterLink>
        </div>
        <div class="space-y-3">
          <RouterLink
            v-for="item in recentVisits"
            :key="item.id"
            :to="'/dashboard/investor/umkm/' + item.id"
            class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors block"
          >
            <div :style="{
              width:'36px', height:'36px', borderRadius:'8px', flexShrink:0,
              background: item.warna, color:'white',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:'12px'
            }">{{ item.logo }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ item.nama }}</p>
              <p class="text-xs text-gray-400">{{ item.waktu }}</p>
            </div>
            <span class="material-symbols-rounded text-gray-300" style="font-size:16px">
              chevron_right
            </span>
          </RouterLink>
        </div>
      </div>

    </div>

    <!-- Rekomendasi UMKM -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-gray-800">Rekomendasi untuk Anda</h3>
          <p class="text-xs text-gray-400 mt-0.5">UMKM dengan readiness score tertinggi di Jawa Timur</p>
        </div>
        <RouterLink to="/dashboard/investor/direktori" class="btn-secondary text-xs px-3 py-1.5">
          Lihat Semua
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="umkm in recommendations"
          :key="umkm.id"
          :to="'/dashboard/investor/umkm/' + umkm.id"
          class="block border border-gray-100 rounded-xl p-4 hover:border-brand-200 hover:shadow-md transition-all"
        >
          <div class="flex items-center gap-3 mb-3">
            <div :style="{
              width:'40px', height:'40px', borderRadius:'10px',
              background: umkm.warna, color:'white',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:'13px', flexShrink:0
            }">{{ umkm.logo }}</div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-800 text-sm truncate">{{ umkm.nama }}</p>
              <p class="text-xs text-gray-400">{{ umkm.kota }}</p>
            </div>
          </div>
          <!-- Score bar -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-400">Readiness Score</span>
              <span :class="[
                'font-bold',
                umkm.readinessScore >= 80 ? 'text-success-500' : 'text-warning-500'
              ]">{{ umkm.readinessScore }}/100</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div :style="{
                width: umkm.readinessScore + '%',
                background: umkm.readinessScore >= 80 ? '#1D9E75' : '#EF9F27'
              }" class="h-full rounded-full transition-all" />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="badge-info">{{ umkm.sektor }}</span>
            <span :class="umkm.status === 'verified' ? 'badge-verified' : 'badge-pending'">
              {{ umkm.status === 'verified' ? 'Verified' : 'Pending' }}
            </span>
          </div>
        </RouterLink>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.store.js'
import { umkmMock } from '../../../data/umkm.mock.js'

const auth       = useAuthStore()
const isVerified = ref(false) // mock: belum verified

const metrics = [
  { icon: 'storefront',      label: 'Total UMKM Dilihat',   value: '24',     color: '#185FA5', sub: '3 minggu terakhir' },
  { icon: 'bookmarks',       label: 'Watchlist Aktif',       value: '8',      color: '#1D9E75', sub: null },
  { icon: 'mark_chat_read',  label: 'Percakapan Aktif',      value: '3',      color: '#185FA5', sub: 'via WhatsApp' },
  { icon: 'pending_actions', label: 'Menunggu Verifikasi',   value: '1',      color: '#EF9F27', sub: 'KTP/NIK' },
]

const watchlistPreview = umkmMock.slice(0, 4)
const recentVisits     = [
  { ...umkmMock[0], waktu: '30 menit lalu' },
  { ...umkmMock[2], waktu: '2 jam lalu' },
  { ...umkmMock[1], waktu: '1 hari lalu' },
]
const recommendations = [...umkmMock].sort((a, b) => b.readinessScore - a.readinessScore).slice(0, 3)
</script>