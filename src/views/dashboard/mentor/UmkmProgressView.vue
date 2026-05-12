<template>
  <div class="space-y-6">

    <!-- Back -->
    <button class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition" @click="$router.back()">
      <span class="material-symbols-rounded" style="font-size:18px">arrow_back</span>
      Kembali ke Overview
    </button>

    <!-- Header UMKM -->
    <div class="card p-5 flex items-center gap-4">
      <div class="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-lg font-bold text-brand-700 flex-shrink-0">
        {{ initials(umkm.namaUmkm) }}
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-lg font-bold text-gray-800">{{ umkm.namaUmkm }}</h1>
        <p class="text-sm text-gray-400">{{ umkm.pemilik }} · {{ umkm.alamat }}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span class="text-xs px-2 py-0.5 rounded-full capitalize bg-brand-50 text-brand-700">{{ umkm.sektor }}</span>
          <span v-if="umkm.hasNib" class="badge-verified">NIB ✓</span>
          <span v-if="umkm.hasPirt" class="badge-verified">PIRT ✓</span>
          <span v-if="umkm.hasHalal" class="badge-verified">Halal ✓</span>
        </div>
      </div>
      <div class="text-center flex-shrink-0">
        <p class="text-3xl font-bold" :class="scoreColor(totalScore)">{{ totalScore }}</p>
        <p class="text-xs text-gray-400">Skor Total</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">

        <!-- Dimensi Progress -->
        <div class="card p-5 space-y-5">
          <h2 class="text-sm font-semibold text-gray-700">Progress per Dimensi</h2>

          <div v-for="dim in dimensions" :key="dim.key" class="space-y-1.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded" style="font-size:16px" :class="dim.score >= 70 ? 'text-success-500' : dim.score >= 40 ? 'text-warning-500' : 'text-danger-500'">
                  {{ dim.icon }}
                </span>
                <span class="text-sm text-gray-600">{{ dim.label }}</span>
              </div>
              <span class="text-sm font-semibold" :class="dim.score >= 70 ? 'text-success-500' : dim.score >= 40 ? 'text-warning-500' : 'text-danger-500'">
                {{ dim.score }}%
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-700"
                :class="dim.score >= 70 ? 'bg-success-500' : dim.score >= 40 ? 'bg-warning-500' : 'bg-danger-500'"
                :style="{ width: dim.score + '%' }"
              />
            </div>
            <p class="text-xs text-gray-400">{{ dim.desc }}</p>
          </div>
        </div>

        <!-- Catatan Mentor -->
        <div class="card p-5 space-y-3">
          <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span class="material-symbols-rounded text-brand-600" style="font-size:18px">school</span>
            Catatan Mentor
          </h2>
          <div class="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p class="text-sm text-brand-800 leading-relaxed">{{ umkm.mentorNotes }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Tambah Catatan Baru</label>
            <textarea
              v-model="newNote"
              class="input-base resize-none"
              rows="3"
              placeholder="Tulis catatan perkembangan UMKM ini..."
            />
            <button class="btn-primary mt-2" :disabled="!newNote.trim()" @click="addNote">
              <span class="material-symbols-rounded" style="font-size:16px">send</span>
              Kirim Catatan
            </button>
          </div>
        </div>

      </div>

      <!-- Sidebar -->
      <div class="space-y-4">

        <!-- Data Keuangan -->
        <div class="card p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Ringkasan Keuangan</h3>
          <div class="space-y-2">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-xs text-gray-500">Omzet/Bulan</span>
              <span class="text-xs font-semibold text-gray-700">{{ formatRp(umkm.omzet) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-xs text-gray-500">Laba/Bulan</span>
              <span class="text-xs font-semibold text-success-500">{{ formatRp(umkm.laba) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-xs text-gray-500">Margin</span>
              <span class="text-xs font-semibold" :class="margin >= 20 ? 'text-success-500' : 'text-warning-500'">{{ margin }}%</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-xs text-gray-500">Kebutuhan Modal</span>
              <span class="text-xs font-semibold text-gray-700">{{ formatRp(umkm.kebutuhanModal) }}</span>
            </div>
          </div>
        </div>

        <!-- Rekomendasi -->
        <div class="card p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Rekomendasi Aksi</h3>
          <div v-for="rec in recommendations" :key="rec.text" class="flex gap-2.5 p-2.5 rounded-lg" :class="rec.bg">
            <span class="material-symbols-rounded flex-shrink-0 mt-0.5" style="font-size:16px" :class="rec.color">{{ rec.icon }}</span>
            <p class="text-xs leading-relaxed" :class="rec.textColor">{{ rec.text }}</p>
          </div>
        </div>

        <!-- Aksi cepat -->
        <div class="space-y-2">
          <router-link
            :to="{ name: 'mentor-feedback', params: { id: umkm.id } }"
            class="btn-primary w-full justify-center"
          >
            <span class="material-symbols-rounded" style="font-size:16px">rate_review</span>
            Beri Feedback
          </router-link>
          <router-link
            :to="{ name: 'mentor-checklist', params: { id: umkm.id } }"
            class="btn-secondary w-full justify-center"
          >
            <span class="material-symbols-rounded" style="font-size:16px">checklist</span>
            Lihat Checklist
          </router-link>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        Catatan berhasil dikirim!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { umkmMock } from '../../../data/umkm.mock.js'

const route = useRoute()
const umkm  = umkmMock.find(u => u.id === route.params.id) || umkmMock[0]

const dimensions = computed(() => [
  {
    key: 'profil',
    label: 'Kelengkapan Profil',
    icon: 'person',
    score: umkm.deskripsi?.length > 100 ? 90 : umkm.deskripsi?.length > 50 ? 60 : 30,
    desc: umkm.deskripsi?.length > 100 ? 'Deskripsi lengkap dan informatif' : 'Deskripsi perlu diperlengkap',
  },
  {
    key: 'keuangan',
    label: 'Data Keuangan',
    icon: 'bar_chart',
    score: umkm.omzet > 20000000 ? 85 : umkm.omzet > 10000000 ? 60 : 40,
    desc: umkm.omzet > 20000000 ? 'Omzet sehat, margin baik' : 'Omzet perlu ditingkatkan',
  },
  {
    key: 'legalitas',
    label: 'Legalitas & Dokumen',
    icon: 'verified',
    score: [umkm.hasNib, umkm.hasPirt, umkm.hasHalal].filter(Boolean).length * 30 + (umkm.isLegalitasVerified ? 10 : 0),
    desc: umkm.isLegalitasVerified ? 'Sudah diverifikasi admin' : 'Menunggu verifikasi admin',
  },
  {
    key: 'modal',
    label: 'Rencana Modal',
    icon: 'account_balance',
    score: umkm.alokasiModal?.length > 50 ? 80 : umkm.alokasiModal?.length > 20 ? 50 : 20,
    desc: umkm.alokasiModal?.length > 50 ? 'Rencana alokasi jelas dan terstruktur' : 'Rencana modal perlu diperjelas',
  },
])

const totalScore = computed(() => {
  const avg = dimensions.value.reduce((s, d) => s + d.score, 0) / dimensions.value.length
  return Math.round(avg)
})

const margin = computed(() => {
  if (!umkm.omzet) return 0
  return Math.round((umkm.laba / umkm.omzet) * 100)
})

const recommendations = computed(() => {
  const recs = []
  if (umkm.deskripsi?.length <= 100)
    recs.push({ icon: 'edit', text: 'Lengkapi deskripsi usaha dengan info produk & keunggulan', bg: 'bg-brand-50', color: 'text-brand-600', textColor: 'text-brand-800' })
  if (!umkm.hasHalal)
    recs.push({ icon: 'verified', text: 'Dorong UMKM untuk segera mengurus sertifikasi Halal', bg: 'bg-warning-50', color: 'text-warning-500', textColor: 'text-warning-800' })
  if (margin.value < 20)
    recs.push({ icon: 'trending_up', text: 'Diskusikan strategi efisiensi biaya untuk meningkatkan margin', bg: 'bg-danger-50', color: 'text-danger-500', textColor: 'text-danger-800' })
  if (recs.length === 0)
    recs.push({ icon: 'star', text: 'UMKM ini sudah dalam kondisi sangat baik!', bg: 'bg-success-50', color: 'text-success-500', textColor: 'text-success-800' })
  return recs
})

const newNote   = ref('')
const showToast = ref(false)

function initials(nama) {
  return nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function scoreColor(score) {
  if (score >= 70) return 'text-success-500'
  if (score >= 40) return 'text-warning-500'
  return 'text-danger-500'
}

function formatRp(val) {
  if (!val) return 'Rp 0'
  const num = Number(val)
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Jt`
  return `Rp ${num.toLocaleString('id-ID')}`
}

function addNote() {
  newNote.value   = ''
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>