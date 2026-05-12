<template>
  <div class="space-y-6">

    <div>
      <h1 class="text-xl font-bold text-gray-800">Log Aktivitas Platform</h1>
      <p class="text-sm text-gray-400 mt-0.5">Rekam jejak semua aktivitas di InvestJatim</p>
    </div>

    <!-- Filter -->
    <div class="card p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"
              style="font-size:16px">search</span>
        <input v-model="search" class="input-base pl-8 text-sm" placeholder="Cari aktivitas..." />
      </div>
      <select v-model="filterType" class="input-base sm:w-48 text-sm">
        <option value="semua">Semua Aktivitas</option>
        <option value="verifikasi">Verifikasi</option>
        <option value="koneksi">Koneksi WA</option>
        <option value="daftar">Pendaftaran</option>
        <option value="login">Login</option>
      </select>
    </div>

    <!-- Stats ringkas -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="card p-3 text-center" v-for="s in stats" :key="s.label">
        <span class="material-symbols-rounded block mb-1" :style="{ fontSize:'22px', color: s.color }">
          {{ s.icon }}
        </span>
        <p class="text-xl font-bold text-gray-800">{{ s.value }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ s.label }}</p>
      </div>
    </div>

    <!-- Log timeline -->
    <div class="card p-5">
      <div class="space-y-0">
        <div
          v-for="(log, idx) in filteredLogs"
          :key="log.id"
          class="flex gap-4 pb-4"
        >
          <!-- Timeline line -->
          <div class="flex flex-col items-center">
            <div
              :style="{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: log.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }"
            >
              <span class="material-symbols-rounded" :style="{ fontSize:'16px', color: log.color }">
                {{ log.icon }}
              </span>
            </div>
            <div
              v-if="idx < filteredLogs.length - 1"
              class="w-px flex-1 bg-gray-100 mt-2"
            />
          </div>

          <!-- Konten -->
          <div class="flex-1 pb-2" :class="idx < filteredLogs.length - 1 ? 'mb-2' : ''">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-sm text-gray-800">
                  <span class="font-semibold">{{ log.aktor }}</span>
                  {{ log.aksi }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">{{ log.waktu }}</p>
              </div>
              <span
                :style="{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '99px',
                  fontWeight: 500, background: log.bg, color: log.color,
                  flexShrink: 0
                }"
              >{{ log.type }}</span>
            </div>
            <div v-if="log.detail"
                 class="mt-2 text-xs text-gray-400 bg-surface rounded-lg px-3 py-2">
              {{ log.detail }}
            </div>
          </div>
        </div>

        <div v-if="filteredLogs.length === 0" class="text-center py-10 text-gray-400">
          <span class="material-symbols-rounded text-gray-200 block mb-2" style="font-size:40px">
            history
          </span>
          Tidak ada aktivitas yang cocok
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search     = ref('')
const filterType = ref('semua')

const stats = [
  { icon:'check_circle', label:'Verifikasi Hari Ini', value:'9',  color:'#6A994E' },
  { icon:'person_add',   label:'Pendaftar Baru',      value:'14', color:'#3A86FF' },
  { icon:'chat',         label:'Koneksi WA',          value:'23', color:'#6A994E' },
  { icon:'cancel',       label:'Tolak Verifikasi',    value:'2',  color:'#E76F51' },
]

const allLogs = ref([
  { id:1,  icon:'check_circle', color:'#6A994E', bg:'#EEF6E8', type:'verifikasi', aktor:'Admin',         aksi:'menyetujui KTP Siti Rahayu',                  waktu:'5 menit lalu',    detail: null },
  { id:2,  icon:'person_add',   color:'#3A86FF', bg:'#EBF3FF', type:'daftar',     aktor:'Budi Santoso',  aksi:'mendaftar sebagai Investor',                  waktu:'12 menit lalu',   detail: 'Email: budi@demo.com' },
  { id:3,  icon:'chat',         color:'#6A994E', bg:'#EEF6E8', type:'koneksi',    aktor:'Andi Wijaya',   aksi:'menghubungi Kopi Ijen via WhatsApp',           waktu:'18 menit lalu',   detail: null },
  { id:4,  icon:'upload_file',  color:'#3A86FF', bg:'#EBF3FF', type:'verifikasi', aktor:'Batik Madura',  aksi:'mengunggah dokumen NIB untuk review',         waktu:'30 menit lalu',   detail: 'Dokumen: NIB-2024.pdf' },
  { id:5,  icon:'login',        color:'#2E2E2E', bg:'#F7F7F5', type:'login',      aktor:'Admin',         aksi:'masuk ke panel admin',                        waktu:'45 menit lalu',   detail: null },
  { id:6,  icon:'cancel',       color:'#E76F51', bg:'#FDECEA', type:'verifikasi', aktor:'Admin',         aksi:'menolak PIRT Kopi Bromo — foto buram',        waktu:'1 jam lalu',      detail: 'Alasan: Dokumen tidak terbaca' },
  { id:7,  icon:'chat',         color:'#6A994E', bg:'#EEF6E8', type:'koneksi',    aktor:'Siti Rahayu',   aksi:'menghubungi Batik Arjuna via WhatsApp',       waktu:'2 jam lalu',      detail: null },
  { id:8,  icon:'check_circle', color:'#6A994E', bg:'#EEF6E8', type:'verifikasi', aktor:'Admin',         aksi:'menyetujui NIB Konveksi Makmur',              waktu:'3 jam lalu',      detail: null },
  { id:9,  icon:'person_add',   color:'#3A86FF', bg:'#EBF3FF', type:'daftar',     aktor:'Kopi Bromo',    aksi:'mendaftar sebagai UMKM',                      waktu:'4 jam lalu',      detail: 'Sektor: Pertanian · Kota: Malang' },
  { id:10, icon:'bookmarks',    color:'#F4A261', bg:'#FEF3E8', type:'koneksi',    aktor:'Budi Santoso',  aksi:'menambahkan Sambal Bu Rini ke watchlist',      waktu:'5 jam lalu',      detail: null },
])

const filteredLogs = computed(() => {
  let list = [...allLogs.value]
  if (search.value)
    list = list.filter(l =>
      l.aktor.toLowerCase().includes(search.value.toLowerCase()) ||
      l.aksi.toLowerCase().includes(search.value.toLowerCase())
    )
  if (filterType.value !== 'semua')
    list = list.filter(l => l.type === filterType.value)
  return list
})
</script>