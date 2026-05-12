<template>
  <div v-if="umkm" class="space-y-6">

    <!-- Back -->
    <RouterLink to="/dashboard/investor/direktori"
                class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-600 transition-colors">
      <span class="material-symbols-rounded" style="font-size:18px">arrow_back</span>
      Kembali ke Direktori
    </RouterLink>

    <!-- Profile Header -->
    <div class="card p-5">
      <div class="flex flex-col sm:flex-row sm:items-start gap-4">
        <div :style="{
          width:'64px', height:'64px', borderRadius:'14px', flexShrink:0,
          background: umkm.warna, color:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:800, fontSize:'18px'
        }">{{ umkm.logo }}</div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h1 class="text-xl font-bold text-gray-800">{{ umkm.nama }}</h1>
            <span :class="umkm.status === 'verified' ? 'badge-verified' : 'badge-pending'">
              <span class="material-symbols-rounded" style="font-size:12px">
                {{ umkm.status === 'verified' ? 'verified' : 'pending' }}
              </span>
              {{ umkm.status === 'verified' ? 'Terverifikasi' : 'Pending' }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span class="flex items-center gap-1">
              <span class="material-symbols-rounded" style="font-size:15px">location_on</span>
              {{ umkm.kota }}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-rounded" style="font-size:15px">category</span>
              {{ umkm.sektor }}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-rounded" style="font-size:15px">calendar_today</span>
              Berdiri {{ umkm.tahunBerdiri }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ umkm.deskripsi }}</p>
        </div>

        <!-- Score -->
        <div class="flex-shrink-0 text-center">
          <div :style="{
            width:'80px', height:'80px', borderRadius:'50%',
            background: `conic-gradient(${scoreColor} ${umkm.readinessScore * 3.6}deg, #F1F5F9 0deg)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative'
          }">
            <div style="width:60px;height:60px;border-radius:50%;background:white;
                        display:flex;flex-direction:column;align-items:center;justify-content:center">
              <span :style="{ fontSize:'18px', fontWeight:800, color: scoreColor }">
                {{ umkm.readinessScore }}
              </span>
              <span style="font-size:9px;color:#94a3b8">/100</span>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2">Readiness Score</p>
          <p :style="{ fontSize:'11px', fontWeight:600, color: scoreColor }">{{ scoreLabel }}</p>
        </div>
      </div>

      <!-- Legalitas chips -->
      <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        <span v-for="doc in legalChips" :key="doc.label"
              :class="doc.ok ? 'badge-verified' : 'badge-pending'">
          <span class="material-symbols-rounded" style="font-size:12px">
            {{ doc.ok ? 'check_circle' : 'pending' }}
          </span>
          {{ doc.label }}
        </span>
      </div>
    </div>

    <!-- Metric Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4 text-center" v-for="m in metricCards" :key="m.label">
        <p class="text-xs text-gray-400 mb-1">{{ m.label }}</p>
        <p class="text-xl font-bold text-gray-800">{{ m.value }}</p>
        <p v-if="m.trend" class="text-xs text-success-500 mt-0.5 flex items-center justify-center gap-0.5">
          <span class="material-symbols-rounded" style="font-size:13px">trending_up</span>
          {{ m.trend }}
        </p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Revenue Line Chart -->
      <div class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Tren Pendapatan (12 Bulan Terakhir)</h3>
          <span class="badge-info">2024</span>
        </div>
        <RevenueLineChart :data="umkm.omzetBulanan" />
      </div>

      <!-- Donut -->
      <div class="card p-5">
        <h3 class="font-bold text-gray-800 mb-1">Segmen Pelanggan</h3>
        <p class="text-xs text-gray-400 mb-4">Distribusi pasar saat ini</p>
        <SectorDonutChart :data="umkm.segmenPelanggan" />
        <div class="space-y-2 mt-4">
          <div v-for="(val, key) in umkm.segmenPelanggan" :key="key"
               class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span :style="{ width:'8px', height:'8px', borderRadius:'50%', background: segmenColors[key], display:'inline-block' }" />
              <span class="text-gray-600 text-xs">{{ segmenLabel[key] }}</span>
            </div>
            <span class="font-semibold text-xs text-gray-800">{{ val }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Kelengkapan Profil (Radar simulasi dengan bar) -->
    <div class="card p-5">
      <h3 class="font-bold text-gray-800 mb-4">Analisis Kelengkapan Profil</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="dim in dimensions" :key="dim.label">
          <div class="flex justify-between text-xs mb-1.5">
            <span class="text-gray-500 flex items-center gap-1">
              <span class="material-symbols-rounded" style="font-size:14px">{{ dim.icon }}</span>
              {{ dim.label }}
            </span>
            <span class="font-bold" :style="{ color: dim.pct >= 80 ? '#1D9E75' : dim.pct >= 50 ? '#EF9F27' : '#E24B4A' }">
              {{ dim.pct }}%
            </span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div :style="{
              width: dim.pct + '%',
              background: dim.pct >= 80 ? '#1D9E75' : dim.pct >= 50 ? '#EF9F27' : '#E24B4A',
              height: '100%', borderRadius: '99px', transition: 'width 0.6s ease'
            }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Rencana Investasi -->
    <div class="card p-5">
      <h3 class="font-bold text-gray-800 mb-4">Rencana Penggunaan Modal</h3>
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 bg-brand-50 rounded-xl p-4">
          <p class="text-xs text-brand-600 font-medium mb-1">Total Modal Dibutuhkan</p>
          <p class="text-2xl font-black text-brand-800">{{ formatRp(umkm.kebutuhanModal) }}</p>
        </div>
        <div class="flex-1 bg-gray-50 rounded-xl p-4">
          <p class="text-xs text-gray-400 font-medium mb-2">Rencana Penggunaan</p>
          <p class="text-sm text-gray-700 leading-relaxed">{{ umkm.penggunaanModal }}</p>
        </div>
      </div>
    </div>

    <!-- Tombol Kontak -->
    <div class="card p-5">
      <h3 class="font-bold text-gray-800 mb-1">Hubungi UMKM Ini</h3>
      <p class="text-sm text-gray-400 mb-4">
        {{ isVerified
          ? 'Identitas Anda sudah terverifikasi. Anda dapat menghubungi UMKM ini langsung.'
          : 'Verifikasi identitas Anda terlebih dahulu untuk mengakses kontak UMKM.' }}
      </p>
      <div class="flex flex-wrap gap-3">
        <button v-if="isVerified" @click="openWhatsapp"
                class="btn-primary">
          <span class="material-symbols-rounded" style="font-size:18px">chat</span>
          Hubungi via WhatsApp
        </button>
        <RouterLink v-else to="/dashboard/investor/verifikasi" class="btn-primary">
          <span class="material-symbols-rounded" style="font-size:18px">badge</span>
          Verifikasi KTP Dulu
        </RouterLink>
        <button @click="toggleWatchlist"
                :class="isWatchlisted ? 'btn-secondary' : 'btn-ghost'">
          <span class="material-symbols-rounded" style="font-size:18px">
            {{ isWatchlisted ? 'bookmark' : 'bookmark_border' }}
          </span>
          {{ isWatchlisted ? 'Tersimpan' : 'Simpan ke Watchlist' }}
        </button>
      </div>
    </div>

  </div>

  <!-- Not found -->
  <div v-else class="text-center py-20 text-gray-400">
    <span class="material-symbols-rounded block mb-3" style="font-size:56px">search_off</span>
    <p class="font-medium">UMKM tidak ditemukan</p>
    <RouterLink to="/dashboard/investor/direktori" class="btn-secondary mt-4 inline-flex">
      Kembali ke Direktori
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { umkmMock } from '../../../data/umkm.mock.js'
import RevenueLineChart from '../../../components/dashboard/charts/RevenueLineChart.vue'
import SectorDonutChart from '../../../components/dashboard/charts/SectorDonutChart.vue'

const route      = useRoute()
const isVerified = ref(false)
const isWatchlisted = ref(false)

const umkm = computed(() => umkmMock.find(u => u.id === route.params.id) || umkmMock[0])

const scoreColor = computed(() =>
  umkm.value.readinessScore >= 80 ? '#1D9E75' :
  umkm.value.readinessScore >= 60 ? '#EF9F27' : '#E24B4A'
)
const scoreLabel = computed(() =>
  umkm.value.readinessScore >= 80 ? 'Tingkat A' :
  umkm.value.readinessScore >= 60 ? 'Tingkat B' : 'Tingkat C'
)

const legalChips = computed(() => [
  { label: 'NIB',       ok: umkm.value.hasNib },
  { label: 'PIRT',      ok: umkm.value.hasPirt },
  { label: 'Halal MUI', ok: umkm.value.hasHalal },
])

const metricCards = computed(() => [
  { label: 'Omzet Tahunan',      value: formatRp(umkm.value.omzet * 12), trend: '+12% YoY' },
  { label: 'Margin Laba Bersih', value: umkm.value.laba ? ((umkm.value.laba / umkm.value.omzet) * 100).toFixed(1) + '%' : '-', trend: null },
  { label: 'Jumlah Karyawan',    value: umkm.value.jumlahKaryawan + ' orang', trend: null },
  { label: 'Berdiri Sejak',      value: umkm.value.tahunBerdiri, trend: null },
])

const dimensions = computed(() => [
  { label: 'Deskripsi Bisnis', icon: 'description',   pct: umkm.value.deskripsi ? 95 : 0 },
  { label: 'Data Keuangan',    icon: 'bar_chart',      pct: umkm.value.omzet ? 82 : 0 },
  { label: 'Legalitas',        icon: 'verified',       pct: umkm.value.hasNib ? (umkm.value.hasPirt ? (umkm.value.hasHalal ? 100 : 70) : 50) : 20 },
  { label: 'Foto & Media',     icon: 'photo_library',  pct: 40 },
  { label: 'Video Profil',     icon: 'videocam',       pct: 0 },
  { label: 'Kontak & Sosmed',  icon: 'share',          pct: umkm.value.instagram ? 90 : 30 },
])

const segmenColors = { b2c: '#185FA5', b2b: '#1D9E75', ekspor: '#EF9F27' }
const segmenLabel  = { b2c: 'B2C (Retail)', b2b: 'B2B (Korporat)', ekspor: 'Ekspor' }

function formatRp(val) {
  if (!val) return '-'
  if (val >= 1e9) return 'Rp ' + (val / 1e9).toFixed(1) + ' M'
  if (val >= 1e6) return 'Rp ' + (val / 1e6).toFixed(0) + ' Jt'
  return 'Rp ' + val.toLocaleString('id-ID')
}

function openWhatsapp() {
  window.open('https://wa.me/6281234567890?text=Halo, saya tertarik dengan usaha ' + umkm.value.nama, '_blank')
}

function toggleWatchlist() {
  isWatchlisted.value = !isWatchlisted.value
}
</script>