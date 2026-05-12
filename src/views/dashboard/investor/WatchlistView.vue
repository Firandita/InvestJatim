<template>
  <div class="space-y-6">

    <div>
      <h1 class="text-xl font-bold text-gray-800">Watchlist Saya</h1>
      <p class="text-sm text-gray-400 mt-0.5">
        {{ watchlist.length }} UMKM yang Anda simpan untuk ditinjau lebih lanjut
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="umkm in watchlist"
        :key="umkm.id"
        :to="'/dashboard/investor/umkm/' + umkm.id"
        class="block bg-white border border-gray-100 rounded-2xl overflow-hidden
               hover:shadow-lg hover:border-brand-200 transition-all group"
      >
        <!-- Top bar warna -->
        <div :style="{ background: umkm.warna, height: '4px' }" />

        <div class="p-4">
          <!-- Header kartu -->
          <div class="flex items-center gap-3 mb-4">
            <div
              :style="{
                width: '44px', height: '44px', borderRadius: '10px',
                background: umkm.warna, color: 'white', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '13px'
              }"
            >{{ umkm.logo }}</div>

            <div class="min-w-0 flex-1">
              <p class="font-semibold text-gray-800 text-sm leading-tight truncate">
                {{ umkm.nama }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ umkm.kota }} · {{ umkm.sektor }}
              </p>
            </div>

            <span :class="umkm.status === 'verified' ? 'badge-verified' : 'badge-pending'">
              {{ umkm.status === 'verified' ? 'Verified' : 'Pending' }}
            </span>
          </div>

          <!-- Readiness bar -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-400">Readiness Score</span>
              <span
                class="font-bold"
                :style="{
                  color: umkm.readinessScore >= 80 ? '#6A994E' :
                         umkm.readinessScore >= 60 ? '#F4A261' : '#E76F51'
                }"
              >{{ umkm.readinessScore }}/100</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                :style="{
                  width: umkm.readinessScore + '%',
                  height: '100%',
                  borderRadius: '99px',
                  background: umkm.readinessScore >= 80 ? '#6A994E' :
                              umkm.readinessScore >= 60 ? '#F4A261' : '#E76F51',
                  transition: 'width 0.5s'
                }"
              />
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div class="bg-surface rounded-lg p-2 text-center">
              <p class="text-xs text-gray-400">Omzet/Bln</p>
              <p class="text-sm font-bold text-gray-800">{{ formatRp(umkm.omzet) }}</p>
            </div>
            <div class="bg-surface rounded-lg p-2 text-center">
              <p class="text-xs text-gray-400">Butuh Modal</p>
              <p class="text-sm font-bold text-gray-800">{{ formatRp(umkm.kebutuhanModal) }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <span class="badge-info text-xs">{{ umkm.sektor }}</span>
            <span class="text-xs text-brand-600 font-semibold group-hover:underline">
              Lihat Dashboard →
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Empty state -->
    <div v-if="watchlist.length === 0" class="text-center py-20">
      <span
        class="material-symbols-rounded block mb-3"
        style="font-size:56px; color:#D4EBBC"
      >bookmarks</span>
      <p class="font-semibold text-gray-500">Watchlist masih kosong</p>
      <p class="text-sm text-gray-400 mt-1">
        Simpan UMKM dari direktori untuk ditinjau nanti
      </p>
      <RouterLink to="/dashboard/investor/direktori" class="btn-primary mt-5 inline-flex">
        <span class="material-symbols-rounded" style="font-size:18px">search</span>
        Jelajahi Direktori
      </RouterLink>
    </div>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { umkmMock } from '../../../data/umkm.mock.js'

// Mock: ambil 3 UMKM pertama sebagai watchlist
const watchlist = umkmMock.slice(0, 3)

function formatRp(val) {
  if (!val) return '-'
  if (val >= 1e9) return 'Rp ' + (val / 1e9).toFixed(1) + ' M'
  if (val >= 1e6) return 'Rp ' + (val / 1e6).toFixed(0) + ' Jt'
  return 'Rp ' + val.toLocaleString('id-ID')
}
</script>