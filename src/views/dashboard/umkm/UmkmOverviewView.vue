<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Selamat datang, {{ auth.user?.nama }} 👋</h1>
        <p class="text-sm text-gray-400 mt-0.5">Pantau perkembangan profil dan investor yang tertarik</p>
      </div>
      <RouterLink to="/dashboard/umkm/profil" class="btn-primary whitespace-nowrap" style="display:inline-flex;align-items:center;gap:0.4rem">
        <span class="material-symbols-rounded" style="font-size:18px">edit</span>
        Lengkapi Profil
      </RouterLink>
    </div>

    <!-- Readiness Score Banner -->
    <div style="background:linear-gradient(135deg,#4a7535,#6A994E);border-radius:1rem;padding:1.5rem;color:white">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1">
          <p style="color:rgba(255,255,255,0.65);font-size:0.82rem;margin-bottom:0.4rem">Investment Readiness Score</p>
          <div style="display:flex;align-items:flex-end;gap:0.75rem">
            <span style="font-size:3rem;font-weight:800;line-height:1">{{ readinessScore }}</span>
            <span style="color:rgba(255,255,255,0.5);margin-bottom:0.25rem">/100</span>
            <span style="margin-bottom:0.25rem;font-size:0.75rem;background:rgba(255,255,255,0.15);padding:0.2rem 0.75rem;border-radius:99px">
              {{ readinessLabel }}
            </span>
          </div>
          <p style="color:rgba(255,255,255,0.55);font-size:0.78rem;margin-top:0.5rem">
            {{ readinessDesc }}
          </p>
        </div>
        <div style="display:flex;gap:0.75rem">
          <div v-for="doc in docStatus" :key="doc.label"
               style="text-align:center;background:rgba(255,255,255,0.1);border-radius:0.75rem;padding:0.75rem 1rem">
            <span class="material-symbols-rounded" :style="{ fontSize:'1.5rem', color: doc.ok ? '#4ade80' : 'rgba(255,255,255,0.3)' }">
              {{ doc.ok ? 'check_circle' : 'cancel' }}
            </span>
            <p style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-top:0.25rem">{{ doc.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="m in metrics" :key="m.label">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
          <span class="material-symbols-rounded" :style="{ fontSize:'1.25rem', color: m.color }">{{ m.icon }}</span>
          <span style="font-size:0.75rem;color:#777">{{ m.label }}</span>
        </div>
        <div style="font-size:1.3rem;font-weight:800;color:#2E2E2E;letter-spacing:-0.02em">{{ m.value }}</div>
        <div v-if="m.trend" style="font-size:0.72rem;color:#6A994E;margin-top:0.25rem;display:flex;align-items:center;gap:0.25rem">
          <span class="material-symbols-rounded" style="font-size:0.9rem">trending_up</span>
          {{ m.trend }}
        </div>
      </div>
    </div>

    <!-- Profil Completeness -->
    <div class="card p-5">
      <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Kelengkapan Profil</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in completeness" :key="item.label">
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:0.4rem">
            <span style="color:#555">{{ item.label }}</span>
            <span style="font-weight:600;color:#2E2E2E">{{ item.pct }}%</span>
          </div>
          <div style="height:6px;background:#e8e8e4;border-radius:99px;overflow:hidden">
            <div :style="{
              width: item.pct + '%',
              height: '100%',
              borderRadius: '99px',
              background: item.pct >= 80 ? '#6A994E' : item.pct >= 50 ? '#F4A261' : '#E76F51',
              transition: 'width 0.5s'
            }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Legalitas -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Status Legalitas</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          <div v-for="doc in legalDocs" :key="doc.label"
               style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;border-radius:0.75rem;background:#F7F7F5">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <span class="material-symbols-rounded" style="font-size:1.25rem;color:#6A994E">{{ doc.icon }}</span>
              <div>
                <div style="font-size:0.875rem;font-weight:600;color:#2E2E2E">{{ doc.label }}</div>
                <div style="font-size:0.72rem;color:#777">{{ doc.desc }}</div>
              </div>
            </div>
            <span v-if="doc.ok" class="badge-verified">
              <span class="material-symbols-rounded" style="font-size:0.9rem">verified</span>
              Ada
            </span>
            <span v-else class="badge-pending">
              <span class="material-symbols-rounded" style="font-size:0.9rem">pending</span>
              Belum
            </span>
          </div>
        </div>
      </div>

      <!-- Investor Tertarik -->
      <div class="card p-5">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <h3 style="font-weight:700;color:#2E2E2E">Investor yang Tertarik</h3>
          <RouterLink to="/dashboard/umkm/investor-masuk" style="font-size:0.8rem;color:#6A994E;text-decoration:none">
            Lihat semua
          </RouterLink>
        </div>
        <div v-if="umkm.totalInvestorBerminat === 0" style="text-align:center;padding:2rem;color:#aaa">
          <span class="material-symbols-rounded" style="font-size:2.5rem;display:block;margin-bottom:0.5rem">inbox</span>
          <p style="font-size:0.85rem">Belum ada investor yang tertarik</p>
        </div>
        <div v-else style="display:flex;flex-direction:column;gap:0.75rem">
          <div v-for="inv in recentInvestors" :key="inv.id"
               style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:0.75rem;background:#F7F7F5">
            <div :style="{
              width:'36px', height:'36px', borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg,#6A994E,#4a7535)',
              color:'white', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:'0.85rem'
            }">{{ inv.nama[0] }}</div>
            <div style="flex:1">
              <p style="font-size:0.875rem;font-weight:600;color:#2E2E2E">{{ inv.nama }}</p>
              <p style="font-size:0.72rem;color:#aaa">{{ inv.waktu }}</p>
            </div>
            <span class="badge-verified">
              <span class="material-symbols-rounded" style="font-size:0.9rem">verified</span>
              Terverifikasi
            </span>
          </div>
        </div>

        <!-- Mentor Note -->
        <div v-if="umkm.mentorNotes" style="margin-top:1rem;padding:0.875rem;background:#FFF7ED;border-radius:0.75rem;border:1px solid #FDE68A">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem">
            <span class="material-symbols-rounded" style="font-size:1rem;color:#F4A261">school</span>
            <span style="font-size:0.75rem;font-weight:700;color:#92400E">Catatan Mentor</span>
          </div>
          <p style="font-size:0.8rem;color:#78350F;line-height:1.6">{{ umkm.mentorNotes }}</p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.store.js'
import { umkmMock } from '../../../data/umkm.mock.js'

const auth = useAuthStore()
const umkm = umkmMock[0]

const readinessScore = computed(() => {
  let score = 40
  if (umkm.hasNib)   score += 15
  if (umkm.hasPirt)  score += 10
  if (umkm.hasHalal) score += 15
  if (umkm.isLegalitasVerified) score += 10
  if (umkm.website)  score += 5
  if (umkm.instagram) score += 5
  return score
})

const readinessLabel = computed(() => {
  if (readinessScore.value >= 80) return 'Tingkat A — Sangat Siap'
  if (readinessScore.value >= 60) return 'Tingkat B — Siap'
  return 'Tingkat C — Perlu Perbaikan'
})

const readinessDesc = computed(() => {
  if (readinessScore.value >= 80) return 'Profil kamu sudah menarik bagi investor. Pertahankan kelengkapan data!'
  if (readinessScore.value >= 60) return 'Profil cukup baik. Lengkapi legalitas untuk meningkatkan daya tarik.'
  return 'Lengkapi profil dan legalitas untuk menarik lebih banyak investor.'
})

const docStatus = [
  { label: 'NIB',   ok: umkm.hasNib },
  { label: 'PIRT',  ok: umkm.hasPirt },
  { label: 'Halal', ok: umkm.hasHalal },
]

const formatRp = (val) => {
  if (val >= 1e9) return 'Rp ' + (val / 1e9).toFixed(1) + ' M'
  if (val >= 1e6) return 'Rp ' + (val / 1e6).toFixed(0) + ' Jt'
  return 'Rp ' + val.toLocaleString('id-ID')
}

const metrics = [
  { icon: 'payments',        label: 'Omzet/Bulan',  value: formatRp(umkm.omzet),          color: '#6A994E', trend: null },
  { icon: 'trending_up',     label: 'Laba/Bulan',   value: formatRp(umkm.laba),            color: '#6A994E', trend: '+12% vs bulan lalu' },
  { icon: 'groups',          label: 'Karyawan',      value: umkm.jumlahKaryawan + ' orang', color: '#3A86FF', trend: null },
  { icon: 'account_balance', label: 'Butuh Modal',   value: formatRp(umkm.kebutuhanModal),  color: '#F4A261', trend: null },
]

const completeness = [
  { label: 'Deskripsi Bisnis', pct: umkm.deskripsi ? 95 : 0 },
  { label: 'Data Keuangan',    pct: umkm.omzet ? 80 : 0 },
  { label: 'Legalitas',        pct: umkm.isLegalitasVerified ? 100 : umkm.hasNib ? 60 : 20 },
  { label: 'Foto Produk',      pct: 40 },
  { label: 'Video Profil',     pct: 0 },
  { label: 'Kontak & Sosmed',  pct: umkm.instagram || umkm.website ? 90 : 30 },
]

const legalDocs = [
  { icon: 'badge',       label: 'NIB',       desc: 'Nomor Induk Berusaha',       ok: umkm.hasNib },
  { icon: 'inventory_2', label: 'PIRT',      desc: 'Izin Industri Rumah Tangga', ok: umkm.hasPirt },
  { icon: 'verified',    label: 'Halal MUI', desc: 'Sertifikasi Halal',          ok: umkm.hasHalal },
]

const recentInvestors = [
  { id: 1, nama: 'Budi Santoso', waktu: '2 jam lalu' },
  { id: 2, nama: 'Siti Rahayu',  waktu: '5 jam lalu' },
  { id: 3, nama: 'Andi Wijaya',  waktu: '1 hari lalu' },
].slice(0, umkm.totalInvestorBerminat || 0)
</script>