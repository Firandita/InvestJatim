<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Data Keuangan</h1>
        <p class="text-sm text-gray-400 mt-0.5">Masukkan data keuangan usaha kamu secara akurat</p>
      </div>
      <button class="btn-primary" :disabled="isSaving" @click="handleSave">
        <span class="material-symbols-rounded" style="font-size:18px">{{ isSaving ? 'hourglass_empty' : 'save' }}</span>
        {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <!-- Metric Summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-brand-600" style="font-size:18px">payments</span>
          <p class="text-xs text-gray-400">Omzet / Bulan</p>
        </div>
        <p class="text-xl font-bold text-gray-800">{{ formatRp(form.omzet) }}</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-success-500" style="font-size:18px">trending_up</span>
          <p class="text-xs text-gray-400">Laba / Bulan</p>
        </div>
        <p class="text-xl font-bold text-success-500">{{ formatRp(form.laba) }}</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-warning-500" style="font-size:18px">account_balance</span>
          <p class="text-xs text-gray-400">Kebutuhan Modal</p>
        </div>
        <p class="text-xl font-bold text-gray-800">{{ formatRp(form.kebutuhanModal) }}</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-brand-400" style="font-size:18px">percent</span>
          <p class="text-xs text-gray-400">Margin Laba</p>
        </div>
        <p class="text-xl font-bold text-gray-800">{{ marginLaba }}%</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Form Input -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Pendapatan -->
        <div class="card p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span class="material-symbols-rounded text-brand-600" style="font-size:18px">bar_chart</span>
            Pendapatan & Laba
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Omzet per Bulan <span class="text-danger-500">*</span></label>
              <div class="flex">
                <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">Rp</span>
                <input v-model="form.omzet" type="number" class="input-base rounded-l-none" placeholder="0" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Laba Bersih per Bulan <span class="text-danger-500">*</span></label>
              <div class="flex">
                <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">Rp</span>
                <input v-model="form.laba" type="number" class="input-base rounded-l-none" placeholder="0" />
              </div>
            </div>
          </div>

          <!-- Margin indicator -->
          <div>
            <div class="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Margin Laba</span>
              <span :class="marginLaba >= 20 ? 'text-success-500 font-semibold' : marginLaba >= 10 ? 'text-warning-500 font-semibold' : 'text-danger-500 font-semibold'">
                {{ marginLaba }}%
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="marginLaba >= 20 ? 'bg-success-500' : marginLaba >= 10 ? 'bg-warning-500' : 'bg-danger-500'"
                :style="{ width: Math.min(marginLaba, 100) + '%' }"
              />
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {{ marginLaba >= 20 ? 'Margin sehat — menarik bagi investor' : marginLaba >= 10 ? 'Margin cukup — masih bisa dioptimalkan' : 'Margin rendah — perlu efisiensi biaya' }}
            </p>
          </div>
        </div>

        <!-- Kebutuhan Modal -->
        <div class="card p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span class="material-symbols-rounded text-warning-500" style="font-size:18px">account_balance</span>
            Kebutuhan Investasi
          </h2>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Total Kebutuhan Modal <span class="text-danger-500">*</span></label>
            <div class="flex">
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">Rp</span>
              <input v-model="form.kebutuhanModal" type="number" class="input-base rounded-l-none" placeholder="0" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Rencana Alokasi Modal <span class="text-danger-500">*</span></label>
            <textarea
              v-model="form.alokasiModal"
              class="input-base resize-none"
              rows="3"
              placeholder="Contoh: 60% mesin produksi, 40% digital marketing..."
            />
          </div>
        </div>

        <!-- Histori Omzet -->
        <div class="card p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span class="material-symbols-rounded text-brand-600" style="font-size:18px">timeline</span>
            Histori Omzet 6 Bulan Terakhir
          </h2>
          <div class="space-y-3">
            <div v-for="(entry, i) in form.histori" :key="i" class="flex items-center gap-3">
              <span class="text-xs text-gray-400 w-10 flex-shrink-0">{{ entry.bulan }}</span>
              <div class="flex">
                <span class="inline-flex items-center px-2 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-400 text-xs">Rp</span>
                <input v-model="entry.omzet" type="number" class="input-base rounded-l-none py-1.5 text-sm" placeholder="0" />
              </div>
              <div
                class="h-2 rounded-full bg-brand-200 flex-1 min-w-0 overflow-hidden"
                title="Proporsi omzet"
              >
                <div
                  class="h-2 rounded-full bg-brand-600 transition-all duration-300"
                  :style="{ width: maxHistori > 0 ? (entry.omzet / maxHistori * 100) + '%' : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Sidebar Info -->
      <div class="space-y-4">

        <!-- Skor Keuangan -->
        <div class="card p-5 text-center">
          <p class="text-xs text-gray-400 mb-2">Skor Kelayakan Keuangan</p>
          <div class="relative inline-flex items-center justify-center w-28 h-28 mb-3">
            <svg class="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" stroke-width="10"/>
              <circle
                cx="50" cy="50" r="40" fill="none"
                :stroke="skorColor"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="`${skorKeuangan * 2.51} 251`"
                class="transition-all duration-700"
              />
            </svg>
            <div class="absolute text-center">
              <p class="text-2xl font-bold text-gray-800">{{ skorKeuangan }}</p>
              <p class="text-xs text-gray-400">/100</p>
            </div>
          </div>
          <p class="text-sm font-semibold" :class="skorColor === '#1D9E75' ? 'text-success-500' : skorColor === '#EF9F27' ? 'text-warning-500' : 'text-danger-500'">
            {{ skorLabel }}
          </p>
          <p class="text-xs text-gray-400 mt-1">Berdasarkan margin & konsistensi omzet</p>
        </div>

        <!-- Tips -->
        <div class="card p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Tips Meningkatkan Skor</h3>
          <div v-for="tip in tips" :key="tip.text" class="flex gap-2.5">
            <span
              class="material-symbols-rounded flex-shrink-0 mt-0.5"
              style="font-size:16px"
              :class="tip.done ? 'text-success-500' : 'text-gray-300'"
            >{{ tip.done ? 'check_circle' : 'radio_button_unchecked' }}</span>
            <p class="text-xs text-gray-500 leading-relaxed">{{ tip.text }}</p>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
          <span class="material-symbols-rounded text-brand-600 flex-shrink-0" style="font-size:18px">lock</span>
          <p class="text-xs text-brand-700 leading-relaxed">Data keuangan hanya terlihat oleh investor yang sudah terverifikasi KTP di platform.</p>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm"
      >
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        Data keuangan berhasil disimpan!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

const myUmkm = umkmMock[0]

const form = reactive({
  omzet:         myUmkm.omzet,
  laba:          myUmkm.laba,
  kebutuhanModal:myUmkm.kebutuhanModal,
  alokasiModal:  myUmkm.alokasiModal,
  histori: [
    { bulan: 'Des', omzet: 22000000 },
    { bulan: 'Jan', omzet: 24500000 },
    { bulan: 'Feb', omzet: 23000000 },
    { bulan: 'Mar', omzet: 26000000 },
    { bulan: 'Apr', omzet: 27500000 },
    { bulan: 'Mei', omzet: myUmkm.omzet },
  ],
})

const marginLaba = computed(() => {
  if (!form.omzet || form.omzet == 0) return 0
  return Math.round((form.laba / form.omzet) * 100)
})

const maxHistori = computed(() => Math.max(...form.histori.map(h => Number(h.omzet) || 0)))

const skorKeuangan = computed(() => {
  let skor = 0
  if (marginLaba.value >= 20) skor += 40
  else if (marginLaba.value >= 10) skor += 25
  else skor += 10
  if (form.omzet >= 20000000) skor += 30
  else if (form.omzet >= 10000000) skor += 20
  else skor += 5
  if (form.alokasiModal?.length > 30) skor += 20
  if (form.kebutuhanModal > 0) skor += 10
  return Math.min(skor, 100)
})

const skorColor = computed(() => {
  if (skorKeuangan.value >= 70) return '#1D9E75'
  if (skorKeuangan.value >= 40) return '#EF9F27'
  return '#E24B4A'
})

const skorLabel = computed(() => {
  if (skorKeuangan.value >= 70) return 'Layak Investasi'
  if (skorKeuangan.value >= 40) return 'Perlu Perbaikan'
  return 'Risiko Tinggi'
})

const tips = computed(() => [
  { text: 'Margin laba di atas 20%', done: marginLaba.value >= 20 },
  { text: 'Omzet bulanan di atas Rp 20 juta', done: form.omzet >= 20000000 },
  { text: 'Rencana alokasi modal tertulis jelas', done: form.alokasiModal?.length > 30 },
  { text: 'Data histori omzet konsisten naik', done: form.histori[5]?.omzet > form.histori[0]?.omzet },
])

function formatRp(val) {
  if (!val) return 'Rp 0'
  const num = Number(val)
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}Jt`
  return `Rp ${num.toLocaleString('id-ID')}`
}

const isSaving  = ref(false)
const showToast = ref(false)

async function handleSave() {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 900))
  isSaving.value  = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>