<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold" style="color:#2E2E2E">Dashboard Pemerintah — Jawa Timur</h1>
        <p class="text-sm mt-0.5" style="color:#777">Pantau perkembangan ekosistem UMKM dan investasi di seluruh wilayah Jatim</p>
      </div>
      <div style="display:flex;gap:0.75rem">
        <router-link to="/dashboard/pemerintah/laporan" class="btn-secondary" style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.85rem">
          <span class="material-symbols-rounded" style="font-size:1.1rem">download</span>
          Export Laporan
        </router-link>
        <router-link to="/dashboard/pemerintah/peta" class="btn-primary" style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.85rem">
          <span class="material-symbols-rounded" style="font-size:1.1rem">map</span>
          Lihat Peta
        </router-link>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="kpi in kpiCards" :key="kpi.label">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
          <span class="material-symbols-rounded" :style="{ fontSize:'1.4rem', color: kpi.color }">{{ kpi.icon }}</span>
          <span :style="{
            fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.5rem',
            borderRadius:'99px', background: kpi.bgTrend, color: kpi.colorTrend
          }">{{ kpi.trend }}</span>
        </div>
        <div style="font-size:1.5rem;font-weight:800;color:#2E2E2E;letter-spacing:-0.02em">{{ kpi.value }}</div>
        <div style="font-size:0.75rem;color:#777;margin-top:0.25rem">{{ kpi.label }}</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Pertumbuhan UMKM per Bulan -->
      <div class="card p-5 lg:col-span-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
          <h3 style="font-weight:700;color:#2E2E2E">Pertumbuhan UMKM Terdaftar (2026)</h3>
          <span style="font-size:0.75rem;background:#EEF6E8;color:#6A994E;padding:0.2rem 0.75rem;border-radius:99px;font-weight:600">+18% YoY</span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:0.4rem;height:140px">
          <div v-for="(val, i) in growthData" :key="i"
               style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3rem">
            <span style="font-size:0.65rem;color:#777">{{ val }}</span>
            <div :style="{
              width:'100%', borderRadius:'4px 4px 0 0',
              background: i === growthData.length-1 ? '#6A994E' : '#c8ddb8',
              height: (val / Math.max(...growthData) * 110) + 'px',
              transition: 'height 0.5s'
            }"></div>
            <span style="font-size:0.65rem;color:#aaa">{{ months[i] }}</span>
          </div>
        </div>
      </div>

      <!-- Distribusi Sektor -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1.25rem">Distribusi Sektor</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          <div v-for="s in sektorData" :key="s.name">
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.3rem">
              <span style="color:#555;display:flex;align-items:center;gap:0.4rem">
                <span class="material-symbols-rounded" style="font-size:1rem;color:#6A994E">{{ s.icon }}</span>
                {{ s.name }}
              </span>
              <span style="font-weight:700;color:#2E2E2E">{{ s.pct }}%</span>
            </div>
            <div style="height:6px;background:#e8e8e4;border-radius:99px;overflow:hidden">
              <div :style="{ width: s.pct+'%', height:'100%', background:'#6A994E', borderRadius:'99px' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kabupaten/Kota Top & Verifikasi -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Top Kabupaten -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Top 5 Kabupaten/Kota — UMKM Terdaftar</h3>
        <div style="display:flex;flex-direction:column;gap:0.6rem">
          <div v-for="(kota, i) in topKota" :key="kota.nama"
               style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:0.75rem;background:#F7F7F5">
            <div :style="{
              width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
              background: i === 0 ? '#6A994E' : i === 1 ? '#8ab86e' : '#c8ddb8',
              color:'white', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, fontSize:'0.8rem'
            }">{{ i + 1 }}</div>
            <div style="flex:1">
              <div style="font-size:0.875rem;font-weight:600;color:#2E2E2E">{{ kota.nama }}</div>
              <div style="height:4px;background:#e8e8e4;border-radius:99px;margin-top:0.3rem;overflow:hidden">
                <div :style="{ width: (kota.jumlah/topKota[0].jumlah*100)+'%', height:'100%', background:'#6A994E', borderRadius:'99px' }"></div>
              </div>
            </div>
            <span style="font-size:0.875rem;font-weight:700;color:#6A994E;flex-shrink:0">{{ kota.jumlah.toLocaleString('id-ID') }}</span>
          </div>
        </div>
      </div>

      <!-- Status Verifikasi & Aktivitas -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Status Verifikasi UMKM</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">
          <div v-for="v in verifikasiStatus" :key="v.label"
               style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem;border-radius:0.75rem"
               :style="{ background: v.bg }">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <span class="material-symbols-rounded" :style="{ fontSize:'1.25rem', color: v.color }">{{ v.icon }}</span>
              <span style="font-size:0.875rem;font-weight:600" :style="{ color: v.color }">{{ v.label }}</span>
            </div>
            <span style="font-size:1.1rem;font-weight:800" :style="{ color: v.color }">{{ v.jumlah.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:0.75rem">Aktivitas Terkini</h3>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          <div v-for="a in aktivitas" :key="a.text"
               style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid #f0f0ee">
            <span class="material-symbols-rounded" style="font-size:1rem;color:#6A994E;flex-shrink:0">{{ a.icon }}</span>
            <div style="flex:1">
              <p style="font-size:0.8rem;color:#2E2E2E">{{ a.text }}</p>
              <p style="font-size:0.7rem;color:#aaa">{{ a.waktu }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
        style="display:flex;align-items:center;gap:1rem;padding:1.25rem;border-radius:1rem;background:white;border:1px solid #e8e8e4;text-decoration:none;transition:all 0.2s"
        @mouseenter="e => e.currentTarget.style.borderColor='#6A994E'"
        @mouseleave="e => e.currentTarget.style.borderColor='#e8e8e4'">
        <span class="material-symbols-rounded" style="font-size:1.75rem;color:#6A994E;background:#EEF6E8;padding:0.5rem;border-radius:0.6rem">{{ link.icon }}</span>
        <div>
          <div style="font-weight:700;font-size:0.9rem;color:#2E2E2E">{{ link.title }}</div>
          <div style="font-size:0.75rem;color:#777;margin-top:0.1rem">{{ link.desc }}</div>
        </div>
        <span class="material-symbols-rounded" style="font-size:1.1rem;color:#aaa;margin-left:auto">arrow_forward</span>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '../../../stores/auth.store.js'
const auth = useAuthStore()

const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']
const growthData = [980, 1050, 1120, 1200, 1180, 1350, 1420, 1380, 1510, 1620, 1750, 1890]

const kpiCards = [
  { icon: 'store',         label: 'Total UMKM Terdaftar',    value: '12.547',  trend: '+18% YoY', color: '#6A994E', bgTrend: '#EEF6E8', colorTrend: '#6A994E' },
  { icon: 'verified',      label: 'UMKM Terverifikasi',      value: '3.284',   trend: '+22%',     color: '#3A86FF', bgTrend: '#EBF3FF', colorTrend: '#3A86FF' },
  { icon: 'payments',      label: 'Total Investasi Masuk',   value: 'Rp 152M', trend: '+31%',     color: '#F4A261', bgTrend: '#FFF3E8', colorTrend: '#F4A261' },
  { icon: 'groups',        label: 'Investor Aktif',          value: '863',     trend: '+15%',     color: '#6A994E', bgTrend: '#EEF6E8', colorTrend: '#6A994E' },
]

const sektorData = [
  { name: 'Kuliner',      icon: 'restaurant',              pct: 38 },
  { name: 'Fashion',      icon: 'checkroom',               pct: 17 },
  { name: 'Pertanian',    icon: 'agriculture',             pct: 15 },
  { name: 'Perdagangan',  icon: 'storefront',              pct: 13 },
  { name: 'Manufaktur',   icon: 'precision_manufacturing', pct: 10 },
  { name: 'Lainnya',      icon: 'category',                pct: 7  },
]

const topKota = [
  { nama: 'Surabaya',  jumlah: 2840 },
  { nama: 'Malang',    jumlah: 1620 },
  { nama: 'Sidoarjo',  jumlah: 1340 },
  { nama: 'Kediri',    jumlah: 980  },
  { nama: 'Gresik',    jumlah: 760  },
]

const verifikasiStatus = [
  { icon: 'verified',      label: 'Terverifikasi',    jumlah: 3284, color: '#6A994E', bg: '#EEF6E8' },
  { icon: 'pending',       label: 'Menunggu Review',  jumlah: 847,  color: '#F4A261', bg: '#FFF3E8' },
  { icon: 'cancel',        label: 'Ditolak / Revisi', jumlah: 213,  color: '#E76F51', bg: '#FEF2F2' },
]

const aktivitas = [
  { icon: 'store',    text: 'Batik Arjuna Malang mendaftar sebagai UMKM baru', waktu: '10 menit lalu' },
  { icon: 'verified', text: 'Keripik Tempe Jaya berhasil diverifikasi admin',  waktu: '1 jam lalu' },
  { icon: 'payments', text: 'Investor baru menyatakan minat ke 3 UMKM Kediri', waktu: '3 jam lalu' },
  { icon: 'school',   text: 'Mentor Andi menyelesaikan sesi pendampingan',     waktu: '5 jam lalu' },
]

const quickLinks = [
  { to: '/dashboard/pemerintah/peta',    icon: 'map',              title: 'Peta Sebaran UMKM', desc: 'Visualisasi heatmap per kabupaten/kota' },
  { to: '/dashboard/pemerintah/sektor',  icon: 'bar_chart',        title: 'Analisis Sektor',   desc: 'Perbandingan kinerja antar sektor' },
  { to: '/dashboard/pemerintah/laporan', icon: 'file_download',    title: 'Export Laporan',    desc: 'Unduh data dalam format CSV / PDF' },
]
</script>