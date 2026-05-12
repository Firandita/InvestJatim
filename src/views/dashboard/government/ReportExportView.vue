<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold" style="color:#2E2E2E">Export Laporan</h1>
      <p class="text-sm mt-0.5" style="color:#777">Unduh data UMKM dan investasi Jawa Timur dalam berbagai format</p>
    </div>

    <!-- Filter Panel -->
    <div class="card p-5">
      <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1.25rem">Filter Data Laporan</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div>
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#2E2E2E;margin-bottom:0.4rem">Periode</label>
          <select v-model="filter.periode" class="input-base">
            <option value="2026-Q1">2026 — Kuartal 1</option>
            <option value="2026-Q2">2026 — Kuartal 2</option>
            <option value="2025">Tahun 2025</option>
            <option value="2024">Tahun 2024</option>
            <option value="all">Semua Periode</option>
          </select>
        </div>

        <div>
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#2E2E2E;margin-bottom:0.4rem">Sektor</label>
          <select v-model="filter.sektor" class="input-base">
            <option value="all">Semua Sektor</option>
            <option value="kuliner">Kuliner</option>
            <option value="fashion">Fashion</option>
            <option value="pertanian">Pertanian</option>
            <option value="manufaktur">Manufaktur</option>
          </select>
        </div>

        <div>
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#2E2E2E;margin-bottom:0.4rem">Kabupaten/Kota</label>
          <select v-model="filter.kota" class="input-base">
            <option value="all">Semua Wilayah</option>
            <option value="surabaya">Surabaya</option>
            <option value="malang">Malang</option>
            <option value="sidoarjo">Sidoarjo</option>
            <option value="kediri">Kediri</option>
          </select>
        </div>

        <div>
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#2E2E2E;margin-bottom:0.4rem">Status Verifikasi</label>
          <select v-model="filter.status" class="input-base">
            <option value="all">Semua Status</option>
            <option value="verified">Terverifikasi</option>
            <option value="pending">Menunggu</option>
          </select>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:0.75rem;margin-top:1.25rem">
        <button class="btn-primary" style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.85rem" @click="applyFilter">
          <span class="material-symbols-rounded" style="font-size:1.1rem">filter_alt</span>
          Terapkan Filter
        </button>
        <button class="btn-secondary" style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.85rem" @click="resetFilter">
          <span class="material-symbols-rounded" style="font-size:1.1rem">refresh</span>
          Reset
        </button>
        <span style="font-size:0.8rem;color:#777;margin-left:0.5rem">
          Menampilkan <strong style="color:#2E2E2E">{{ filteredCount }}</strong> data UMKM
        </span>
      </div>
    </div>

    <!-- Export Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="exp in exportOptions" :key="exp.title" class="card p-5"
           style="display:flex;flex-direction:column;gap:1rem">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <span class="material-symbols-rounded" :style="{ fontSize:'2rem', color: exp.color, background: exp.bg, padding:'0.6rem', borderRadius:'0.75rem' }">{{ exp.icon }}</span>
          <div>
            <div style="font-weight:700;color:#2E2E2E">{{ exp.title }}</div>
            <div style="font-size:0.75rem;color:#777">{{ exp.format }}</div>
          </div>
        </div>
        <p style="font-size:0.82rem;color:#555;line-height:1.6;flex:1">{{ exp.desc }}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.75rem;background:#F7F7F5;border-radius:0.6rem">
          <span style="font-size:0.75rem;color:#777">Estimasi ukuran: <strong style="color:#2E2E2E">{{ exp.size }}</strong></span>
          <span style="font-size:0.75rem;color:#777">{{ exp.rows }} baris</span>
        </div>
        <button
          @click="handleExport(exp)"
          :disabled="exp.loading"
          class="btn-primary"
          style="display:flex;align-items:center;justify-content:center;gap:0.4rem;font-size:0.85rem"
        >
          <span v-if="exp.loading" class="material-symbols-rounded" style="font-size:1rem;animation:spin 1s linear infinite">refresh</span>
          <span v-else class="material-symbols-rounded" style="font-size:1rem">download</span>
          {{ exp.loading ? 'Memproses...' : 'Unduh ' + exp.format }}
        </button>
      </div>
    </div>

    <!-- Laporan Terjadwal -->
    <div class="card p-5">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <h3 style="font-weight:700;color:#2E2E2E">Riwayat Laporan</h3>
        <span style="font-size:0.78rem;color:#777">30 hari terakhir</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0">
        <div v-for="(lap, i) in riwayatLaporan" :key="i"
             style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 0;border-bottom:1px solid #F7F7F5">
          <span class="material-symbols-rounded" :style="{ fontSize:'1.25rem', color: lap.color, flexShrink:0 }">{{ lap.icon }}</span>
          <div style="flex:1">
            <div style="font-size:0.875rem;font-weight:600;color:#2E2E2E">{{ lap.nama }}</div>
            <div style="font-size:0.72rem;color:#aaa;margin-top:0.1rem">{{ lap.tanggal }} · {{ lap.size }}</div>
          </div>
          <span :style="{
            fontSize:'0.72rem', fontWeight:600, padding:'0.2rem 0.6rem',
            borderRadius:'99px', background: lap.statusBg, color: lap.statusColor
          }">{{ lap.status }}</span>
          <button style="display:flex;align-items:center;gap:0.3rem;font-size:0.78rem;color:#6A994E;background:none;border:none;cursor:pointer;font-weight:600">
            <span class="material-symbols-rounded" style="font-size:1rem">download</span>
            Unduh
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notif -->
    <transition name="toast">
      <div v-if="toastMsg" style="position:fixed;bottom:1.5rem;right:1.5rem;background:#2E2E2E;color:white;padding:0.875rem 1.25rem;border-radius:0.75rem;font-size:0.85rem;display:flex;align-items:center;gap:0.5rem;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:100">
        <span class="material-symbols-rounded" style="font-size:1.1rem;color:#6A994E">check_circle</span>
        {{ toastMsg }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const filter = reactive({ periode: '2026-Q2', sektor: 'all', kota: 'all', status: 'all' })
const filteredCount = ref(12547)
const toastMsg = ref('')

function applyFilter() {
  filteredCount.value = Math.floor(Math.random() * 8000) + 3000
}

function resetFilter() {
  filter.periode = '2026-Q2'
  filter.sektor = 'all'
  filter.kota = 'all'
  filter.status = 'all'
  filteredCount.value = 12547
}

const exportOptions = reactive([
  {
    title: 'Data UMKM Lengkap', format: 'CSV', icon: 'table_chart',
    color: '#6A994E', bg: '#EEF6E8',
    desc: 'Seluruh data profil UMKM termasuk informasi keuangan, legalitas, dan kontak.',
    size: '4.2 MB', rows: '12.547', loading: false,
  },
  {
    title: 'Laporan Investasi', format: 'PDF', icon: 'picture_as_pdf',
    color: '#E76F51', bg: '#FEF2F2',
    desc: 'Ringkasan eksekutif aliran investasi, minat investor, dan UMKM paling diminati.',
    size: '2.1 MB', rows: '863', loading: false,
  },
  {
    title: 'Analisis Sektor', format: 'XLSX', icon: 'bar_chart',
    color: '#3A86FF', bg: '#EBF3FF',
    desc: 'Breakdown kinerja per sektor industri dengan grafik dan visualisasi data.',
    size: '3.8 MB', rows: '6.200', loading: false,
  },
  {
    title: 'Peta Sebaran', format: 'GeoJSON', icon: 'map',
    color: '#F4A261', bg: '#FFF3E8',
    desc: 'Data koordinat dan statistik UMKM per kabupaten/kota format peta digital.',
    size: '1.4 MB', rows: '38', loading: false,
  },
  {
    title: 'Laporan Verifikasi', format: 'PDF', icon: 'verified',
    color: '#6A994E', bg: '#EEF6E8',
    desc: 'Status verifikasi seluruh UMKM beserta catatan admin dan mentor.',
    size: '1.8 MB', rows: '4.344', loading: false,
  },
  {
    title: 'Dashboard Ringkasan', format: 'PDF', icon: 'dashboard',
    color: '#3A86FF', bg: '#EBF3FF',
    desc: 'Dokumen siap cetak berisi semua KPI dan grafik utama ekosistem UMKM Jatim.',
    size: '5.2 MB', rows: '-', loading: false,
  },
])

async function handleExport(exp) {
  exp.loading = true
  await new Promise(r => setTimeout(r, 1500))
  exp.loading = false
  toastMsg.value = `${exp.title} (${exp.format}) berhasil diunduh!`
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

const riwayatLaporan = [
  { icon:'table_chart',    nama:'Data UMKM Lengkap Q1 2026',   tanggal:'15 Mei 2026',  size:'4.1 MB',  status:'Selesai', statusBg:'#EEF6E8', statusColor:'#6A994E', color:'#6A994E' },
  { icon:'picture_as_pdf', nama:'Laporan Investasi April 2026', tanggal:'1 Mei 2026',   size:'2.0 MB',  status:'Selesai', statusBg:'#EEF6E8', statusColor:'#6A994E', color:'#E76F51' },
  { icon:'bar_chart',      nama:'Analisis Sektor Q4 2025',      tanggal:'10 Jan 2026',  size:'3.5 MB',  status:'Selesai', statusBg:'#EEF6E8', statusColor:'#6A994E', color:'#3A86FF' },
  { icon:'map',            nama:'Peta Sebaran UMKM 2025',        tanggal:'5 Jan 2026',   size:'1.3 MB',  status:'Selesai', statusBg:'#EEF6E8', statusColor:'#6A994E', color:'#F4A261' },
  { icon:'dashboard',      nama:'Dashboard Ringkasan 2025',      tanggal:'31 Des 2025',  size:'5.0 MB',  status:'Selesai', statusBg:'#EEF6E8', statusColor:'#6A994E', color:'#3A86FF' },
]
</script>

<style scoped>
@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>