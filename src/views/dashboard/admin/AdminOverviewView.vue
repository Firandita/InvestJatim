<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold text-gray-800">Overview Platform</h1>
      <p class="text-sm text-gray-400 mt-0.5">Pantau aktivitas dan kesehatan platform InvestJatim</p>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="m in metrics" :key="m.label">
        <div class="flex items-center gap-2 mb-3">
          <div
            :style="{ background: m.bg, borderRadius: '8px', padding: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }"
          >
            <span class="material-symbols-rounded" :style="{ fontSize: '18px', color: m.color }">
              {{ m.icon }}
            </span>
          </div>
          <span class="text-xs text-gray-400">{{ m.label }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ m.value }}</div>
        <div v-if="m.trend" class="text-xs text-brand-600 mt-1 flex items-center gap-1">
          <span class="material-symbols-rounded" style="font-size:13px">trending_up</span>
          {{ m.trend }}
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Antrian Verifikasi -->
      <div class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Antrian Verifikasi</h3>
          <RouterLink
            to="/dashboard/admin/verifikasi"
            class="text-xs text-brand-600 hover:underline font-medium"
          >
            Lihat semua
          </RouterLink>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in verifikasiQueue"
            :key="item.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-brand-50 transition-colors"
          >
            <div
              :style="{
                width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                background: item.type === 'investor' ? '#EEF6E8' : '#EBF3FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }"
            >
              <span
                class="material-symbols-rounded"
                :style="{ fontSize: '18px', color: item.type === 'investor' ? '#6A994E' : '#3A86FF' }"
              >
                {{ item.type === 'investor' ? 'badge' : 'store' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800">{{ item.nama }}</p>
              <p class="text-xs text-gray-400">
                {{ item.type === 'investor' ? 'Investor' : 'UMKM' }} · {{ item.waktu }}
              </p>
            </div>
            <span class="badge-pending">{{ item.dokumen }}</span>
            <RouterLink
              to="/dashboard/admin/verifikasi"
              class="btn-primary text-xs px-3 py-1.5"
            >
              Review
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Statistik Singkat -->
      <div class="space-y-4">

        <!-- Status UMKM -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Status UMKM</h3>
          <div class="space-y-3">
            <div v-for="s in umkmStatus" :key="s.label">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-500">{{ s.label }}</span>
                <span class="font-semibold text-gray-800">{{ s.count }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  :style="{
                    width: (s.count / totalUmkm * 100) + '%',
                    background: s.color,
                    height: '100%',
                    borderRadius: '99px'
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Aktivitas Hari Ini -->
        <div class="card p-4">
          <h3 class="font-bold text-gray-800 text-sm mb-3">Aktivitas Hari Ini</h3>
          <div class="space-y-2.5">
            <div
              v-for="a in todayActivity"
              :key="a.label"
              class="flex items-center gap-2.5"
            >
              <span
                class="material-symbols-rounded"
                :style="{ fontSize: '16px', color: a.color }"
              >{{ a.icon }}</span>
              <span class="text-sm text-gray-600 flex-1">{{ a.label }}</span>
              <span class="text-sm font-bold text-gray-800">{{ a.value }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Log Aktivitas Terbaru -->
    <div class="card p-5">
      <h3 class="font-bold text-gray-800 mb-4">Log Aktivitas Terbaru</h3>
      <div class="space-y-0 divide-y divide-gray-100">
        <div
          v-for="log in activityLog"
          :key="log.id"
          class="flex items-start gap-3 py-3"
        >
          <div
            :style="{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: log.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }"
          >
            <span class="material-symbols-rounded" :style="{ fontSize: '16px', color: log.color }">
              {{ log.icon }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800">
              <span class="font-semibold">{{ log.aktor }}</span>
              {{ log.aksi }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ log.waktu }}</p>
          </div>
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full font-medium',
              log.type === 'approved' ? 'bg-brand-50 text-brand-800' :
              log.type === 'rejected' ? 'bg-danger-50 text-danger-800' :
              'bg-gray-100 text-gray-500'
            ]"
          >{{ log.badge }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const metrics = [
  { icon: 'storefront',      label: 'Total UMKM',          value: '1.284', color: '#6A994E', bg: '#EEF6E8', trend: '+12 bulan ini' },
  { icon: 'people',          label: 'Total Investor',       value: '850',   color: '#3A86FF', bg: '#EBF3FF', trend: '+5 bulan ini' },
  { icon: 'pending_actions', label: 'Menunggu Verifikasi',  value: '18',    color: '#F4A261', bg: '#FEF3E8', trend: null },
  { icon: 'handshake',       label: 'Koneksi Terjadi',      value: '234',   color: '#6A994E', bg: '#EEF6E8', trend: 'bulan ini' },
]

const verifikasiQueue = [
  { id: 1, nama: 'Siti Rahayu',       type: 'investor', dokumen: 'KTP/NIK',  waktu: '2 jam lalu' },
  { id: 2, nama: 'Batik Madura',      type: 'umkm',     dokumen: 'NIB',      waktu: '3 jam lalu' },
  { id: 3, nama: 'Budi Santoso',      type: 'investor', dokumen: 'KTP/NIK',  waktu: '5 jam lalu' },
  { id: 4, nama: 'Kopi Bromo',        type: 'umkm',     dokumen: 'PIRT',     waktu: '6 jam lalu' },
]

const umkmStatus = [
  { label: 'Terverifikasi',  count: 892, color: '#6A994E' },
  { label: 'Pending Review', count: 247, color: '#F4A261' },
  { label: 'Ditolak',        count: 145, color: '#E76F51' },
]
const totalUmkm = 892 + 247 + 145

const todayActivity = [
  { icon: 'check_circle', label: 'Verifikasi disetujui', value: '7',  color: '#6A994E' },
  { icon: 'cancel',       label: 'Verifikasi ditolak',   value: '2',  color: '#E76F51' },
  { icon: 'person_add',   label: 'Pengguna baru',        value: '14', color: '#3A86FF' },
  { icon: 'chat',         label: 'Koneksi WA terjadi',   value: '23', color: '#6A994E' },
]

const activityLog = [
  { id:1, icon:'check_circle', color:'#6A994E', bg:'#EEF6E8', aktor:'Admin',        aksi:'menyetujui verifikasi KTP Siti Rahayu',   waktu:'5 menit lalu',   type:'approved', badge:'Approved' },
  { id:2, icon:'person_add',   color:'#3A86FF', bg:'#EBF3FF', aktor:'Budi Santoso', aksi:'mendaftar sebagai Investor',              waktu:'12 menit lalu',  type:'new',      badge:'Baru' },
  { id:3, icon:'store',        color:'#6A994E', bg:'#EEF6E8', aktor:'Batik Madura', aksi:'mengunggah dokumen NIB',                  waktu:'25 menit lalu',  type:'new',      badge:'Upload' },
  { id:4, icon:'cancel',       color:'#E76F51', bg:'#FDECEA', aktor:'Admin',        aksi:'menolak verifikasi PIRT karena buram',    waktu:'1 jam lalu',     type:'rejected', badge:'Rejected' },
  { id:5, icon:'chat',         color:'#6A994E', bg:'#EEF6E8', aktor:'Investor Andi',aksi:'menghubungi Kopi Ijen via WhatsApp',      waktu:'2 jam lalu',     type:'new',      badge:'Koneksi' },
]
</script>