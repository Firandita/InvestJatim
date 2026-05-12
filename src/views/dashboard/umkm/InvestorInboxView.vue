<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Investor Masuk</h1>
        <p class="text-sm text-gray-400 mt-0.5">Daftar investor yang tertarik dengan usaha kamu</p>
      </div>
      <span class="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
        {{ investors.length }} Investor
      </span>
    </div>

    <!-- Empty state -->
    <div v-if="investors.length === 0" class="card p-16 text-center">
      <span class="material-symbols-rounded text-gray-200 block mb-4" style="font-size:64px">inbox</span>
      <p class="text-gray-500 font-medium">Belum ada investor yang tertarik</p>
      <p class="text-sm text-gray-400 mt-1">Lengkapi profil dan data keuangan untuk menarik lebih banyak investor</p>
      <router-link to="/dashboard/umkm/profil" class="btn-primary mt-4 inline-flex">
        <span class="material-symbols-rounded" style="font-size:16px">edit</span>
        Lengkapi Profil
      </router-link>
    </div>

    <!-- Tips banner -->
    <div v-if="investors.length > 0" class="bg-success-50 border border-success-200 rounded-xl p-4 flex gap-3">
      <span class="material-symbols-rounded text-success-500 flex-shrink-0" style="font-size:20px">celebration</span>
      <div>
        <p class="text-sm font-medium text-success-700">{{ investors.length }} investor tertarik dengan usaha kamu!</p>
        <p class="text-xs text-success-600 mt-0.5">Segera respon dalam 48 jam untuk meningkatkan peluang deal. Kontak investor hanya muncul setelah kamu terverifikasi.</p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div v-if="investors.length > 0" class="flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-4 py-2 rounded-lg text-sm transition"
        :class="activeTab === tab.key ? 'bg-brand-600 text-white font-medium' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full" :class="activeTab === tab.key ? 'text-white' : 'bg-gray-100 text-gray-500'">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Investor list -->
    <div v-if="investors.length > 0" class="space-y-4">
      <div
        v-for="inv in filteredInvestors"
        :key="inv.id"
        class="card p-5"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            :style="{ background: inv.avatarBg, color: inv.avatarColor }">
            {{ initials(inv.nama) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-semibold text-gray-800">{{ inv.nama }}</h3>
              <span v-if="inv.isVerified" class="badge-verified text-xs">
                <span class="material-symbols-rounded" style="font-size:12px">verified</span>
                Terverifikasi
              </span>
              <span v-else class="badge-pending text-xs">KTP Pending</span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">{{ inv.profesi }} · {{ inv.kota }}</p>
            <p class="text-xs text-gray-500 mt-2 leading-relaxed">{{ inv.pesan }}</p>

            <div class="flex items-center gap-4 mt-3">
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <span class="material-symbols-rounded" style="font-size:14px">schedule</span>
                {{ inv.waktu }}
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <span class="material-symbols-rounded" style="font-size:14px">payments</span>
                Minat invest: {{ inv.minatInvest }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 flex-shrink-0">
            <span
              class="text-xs px-2 py-1 rounded-full font-medium text-center"
              :class="statusClass(inv.status)"
            >{{ inv.status }}</span>
          </div>
        </div>

        <!-- Kontak (hanya jika UMKM terverifikasi) -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div v-if="myUmkm.isLegalitasVerified && inv.isVerified" class="flex items-center gap-2 flex-wrap">
            <a
              :href="`https://wa.me/${inv.whatsapp}`"
              target="_blank"
              class="btn-primary text-xs py-2"
            >
              <span class="material-symbols-rounded" style="font-size:14px">chat</span>
              Hubungi via WhatsApp
            </a>
            <button class="btn-ghost text-xs py-2" @click="markRead(inv)">
              <span class="material-symbols-rounded" style="font-size:14px">{{ inv.status === 'Direspon' ? 'check' : 'done_all' }}</span>
              {{ inv.status === 'Direspon' ? 'Sudah Direspon' : 'Tandai Direspon' }}
            </button>
          </div>
          <div v-else class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span class="material-symbols-rounded text-gray-400" style="font-size:16px">lock</span>
            <p class="text-xs text-gray-400">
              {{ !myUmkm.isLegalitasVerified ? 'Kontak terbuka setelah legalitas kamu diverifikasi admin.' : 'Kontak terbuka setelah investor menyelesaikan verifikasi KTP.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips kelengkapan -->
    <div class="card p-5">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span class="material-symbols-rounded text-warning-500" style="font-size:18px">lightbulb</span>
        Cara menarik lebih banyak investor
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="tip in attractTips" :key="tip.title" class="flex gap-2.5 p-3 bg-gray-50 rounded-xl">
          <span class="material-symbols-rounded text-brand-400 flex-shrink-0" style="font-size:18px">{{ tip.icon }}</span>
          <div>
            <p class="text-xs font-medium text-gray-700">{{ tip.title }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ tip.desc }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

const myUmkm = umkmMock[0]

const investors = ref([
  {
    id: 1,
    nama: 'Budi Santoso',
    profesi: 'Pengusaha Kuliner',
    kota: 'Surabaya',
    pesan: 'Saya tertarik dengan produk keripik tempe Anda. Margin laba yang cukup baik dan sertifikasi halal membuat saya yakin ini peluang yang menjanjikan.',
    waktu: '2 hari lalu',
    minatInvest: 'Rp 15–25 juta',
    isVerified: true,
    status: 'Baru',
    whatsapp: '6281234567891',
    avatarBg: '#E6F1FB',
    avatarColor: '#185FA5',
  },
  {
    id: 2,
    nama: 'Dewi Rahayu',
    profesi: 'Investor Angel',
    kota: 'Malang',
    pesan: 'Tertarik untuk diskusi lebih lanjut mengenai rencana ekspansi dan kebutuhan modal. Saya punya pengalaman di bidang FMCG.',
    waktu: '5 hari lalu',
    minatInvest: 'Rp 30–50 juta',
    isVerified: true,
    status: 'Direspon',
    whatsapp: '6285712345679',
    avatarBg: '#E1F5EE',
    avatarColor: '#1D9E75',
  },
  {
    id: 3,
    nama: 'Rizky Firmansyah',
    profesi: 'Manajer Investasi',
    kota: 'Sidoarjo',
    pesan: 'Produk lokal dengan packaging modern sangat relevan dengan tren pasar saat ini. Ingin mengetahui lebih detail soal kapasitas produksi.',
    waktu: '1 minggu lalu',
    minatInvest: 'Rp 20–40 juta',
    isVerified: false,
    status: 'Baru',
    whatsapp: '6282198765433',
    avatarBg: '#FAEEDA',
    avatarColor: '#854F0B',
  },
])

const activeTab = ref('semua')

const tabs = computed(() => [
  { key: 'semua', label: 'Semua', count: investors.value.length },
  { key: 'baru', label: 'Baru', count: investors.value.filter(i => i.status === 'Baru').length },
  { key: 'direspon', label: 'Direspon', count: investors.value.filter(i => i.status === 'Direspon').length },
])

const filteredInvestors = computed(() => {
  if (activeTab.value === 'semua') return investors.value
  if (activeTab.value === 'baru') return investors.value.filter(i => i.status === 'Baru')
  return investors.value.filter(i => i.status === 'Direspon')
})

function initials(nama) {
  return nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function statusClass(status) {
  if (status === 'Baru') return 'bg-brand-50 text-brand-700'
  if (status === 'Direspon') return 'bg-success-50 text-success-800'
  return 'bg-gray-100 text-gray-500'
}

function markRead(inv) {
  inv.status = 'Direspon'
}

const attractTips = [
  { icon: 'photo_library', title: 'Tambah foto produk', desc: 'Minimal 5 foto dengan pencahayaan baik' },
  { icon: 'bar_chart', title: 'Update data keuangan', desc: 'Data terkini meningkatkan kepercayaan investor' },
  { icon: 'verified', title: 'Lengkapi legalitas', desc: 'NIB + PIRT + Halal = kepercayaan penuh' },
  { icon: 'videocam', title: 'Upload video profil', desc: 'Video singkat meningkatkan engagement 3x' },
]
</script>