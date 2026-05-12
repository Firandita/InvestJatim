<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Profil Bisnis</h1>
        <p class="text-sm text-gray-400 mt-0.5">Lengkapi informasi usaha kamu agar menarik bagi investor</p>
      </div>
      <button
        class="btn-primary"
        :disabled="isSaving"
        @click="handleSave"
      >
        <span class="material-symbols-rounded" style="font-size:18px">{{ isSaving ? 'hourglass_empty' : 'save' }}</span>
        {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center gap-0">
      <div
        v-for="(step, i) in steps"
        :key="step.key"
        class="flex items-center"
      >
        <button
          class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm"
          :class="currentStep === i
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : completedSteps.includes(i)
              ? 'text-success-500 hover:bg-gray-50'
              : 'text-gray-400 hover:bg-gray-50'"
          @click="currentStep = i"
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            :class="currentStep === i
              ? 'bg-brand-600 text-white'
              : completedSteps.includes(i)
                ? 'bg-success-500 text-white'
                : 'bg-gray-200 text-gray-500'"
          >
            <span v-if="completedSteps.includes(i) && currentStep !== i" class="material-symbols-rounded" style="font-size:14px">check</span>
            <span v-else>{{ i + 1 }}</span>
          </span>
          <span class="hidden sm:block">{{ step.label }}</span>
        </button>
        <div v-if="i < steps.length - 1" class="w-6 h-px bg-gray-200 mx-1" />
      </div>
    </div>

    <!-- Form Card -->
    <div class="card p-6">

      <!-- Step 1: Identitas Usaha -->
      <div v-if="currentStep === 0" class="space-y-5">
        <h2 class="text-base font-semibold text-gray-700 pb-3 border-b border-gray-100">Identitas Usaha</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Nama Usaha <span class="text-danger-500">*</span></label>
            <input v-model="form.namaUmkm" class="input-base" placeholder="Nama usaha kamu" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Nama Pemilik <span class="text-danger-500">*</span></label>
            <input v-model="form.pemilik" class="input-base" placeholder="Nama lengkap pemilik" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Tahun Berdiri</label>
            <input v-model="form.tahunBerdiri" type="number" class="input-base" placeholder="2020" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Sektor Usaha <span class="text-danger-500">*</span></label>
            <select v-model="form.sektor" class="input-base">
              <option value="">Pilih sektor...</option>
              <option v-for="s in sektorOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Jumlah Karyawan</label>
            <input v-model="form.jumlahKaryawan" type="number" class="input-base" placeholder="0" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Alamat Lengkap</label>
            <input v-model="form.alamat" class="input-base" placeholder="Jl. ..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Kabupaten / Kota</label>
            <select v-model="form.kabupatenId" class="input-base">
              <option value="">Pilih kabupaten/kota...</option>
              <option v-for="k in kabupatenOptions" :key="k.id" :value="k.id">{{ k.nama }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Deskripsi Usaha <span class="text-danger-500">*</span></label>
          <textarea
            v-model="form.deskripsi"
            class="input-base resize-none"
            rows="4"
            placeholder="Ceritakan tentang produk/jasa kamu, keunggulan, dan proses produksi..."
          />
          <p class="text-xs text-gray-400 mt-1">{{ form.deskripsi.length }}/500 karakter</p>
        </div>
      </div>

      <!-- Step 2: Kontak & Media Sosial -->
      <div v-if="currentStep === 1" class="space-y-5">
        <h2 class="text-base font-semibold text-gray-700 pb-3 border-b border-gray-100">Kontak & Media Sosial</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Nomor WhatsApp <span class="text-danger-500">*</span></label>
            <div class="flex">
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">+62</span>
              <input v-model="form.whatsapp" class="input-base rounded-l-none" placeholder="81234567890" />
            </div>
            <p class="text-xs text-gray-400 mt-1">Tanpa angka 0 di depan</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Instagram</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">@</span>
              <input v-model="form.instagram" class="input-base rounded-l-none" placeholder="username" />
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Website</label>
            <input v-model="form.website" class="input-base" placeholder="https://..." />
          </div>
        </div>

        <!-- Preview kontak -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-xs font-medium text-gray-500 mb-3">Preview kontak yang akan dilihat investor:</p>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              <span class="material-symbols-rounded text-success-500" style="font-size:18px">chat</span>
              +62{{ form.whatsapp || '–' }}
            </div>
            <div v-if="form.instagram" class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              <span class="material-symbols-rounded text-pink-500" style="font-size:18px">photo_camera</span>
              @{{ form.instagram }}
            </div>
            <div v-if="form.website" class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              <span class="material-symbols-rounded text-brand-500" style="font-size:18px">language</span>
              {{ form.website }}
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Alokasi Modal -->
      <div v-if="currentStep === 2" class="space-y-5">
        <h2 class="text-base font-semibold text-gray-700 pb-3 border-b border-gray-100">Rencana Penggunaan Modal</h2>

        <div class="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
          <span class="material-symbols-rounded text-brand-600 flex-shrink-0" style="font-size:20px">info</span>
          <p class="text-sm text-brand-700">Informasi ini akan ditampilkan kepada investor sebagai dasar pertimbangan investasi. Pastikan rencana kamu jelas dan realistis.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Kebutuhan Modal <span class="text-danger-500">*</span></label>
          <div class="flex">
            <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">Rp</span>
            <input
              v-model="form.kebutuhanModal"
              type="number"
              class="input-base rounded-l-none"
              placeholder="0"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">
            {{ form.kebutuhanModal ? `Rp ${Number(form.kebutuhanModal).toLocaleString('id-ID')}` : '–' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Rencana Alokasi Modal <span class="text-danger-500">*</span></label>
          <textarea
            v-model="form.alokasiModal"
            class="input-base resize-none"
            rows="5"
            placeholder="Contoh: 60% untuk pembelian mesin produksi baru, 40% untuk biaya sertifikasi halal dan pemasaran digital..."
          />
        </div>

        <!-- Ringkasan -->
        <div class="grid grid-cols-2 gap-4">
          <div class="card p-4 text-center">
            <p class="text-xs text-gray-400 mb-1">Omzet / Bulan</p>
            <p class="text-lg font-bold text-gray-800">Rp {{ Number(form.omzet || 0).toLocaleString('id-ID') }}</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-xs text-gray-400 mb-1">Laba / Bulan</p>
            <p class="text-lg font-bold text-success-500">Rp {{ Number(form.laba || 0).toLocaleString('id-ID') }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 -mt-2">* Data keuangan diubah di halaman <router-link to="/dashboard/umkm/keuangan" class="text-brand-600 underline">Data Keuangan</router-link></p>
      </div>

    </div>

    <!-- Navigasi Bottom -->
    <div class="flex items-center justify-between">
      <button
        v-if="currentStep > 0"
        class="btn-ghost"
        @click="currentStep--"
      >
        <span class="material-symbols-rounded" style="font-size:18px">arrow_back</span>
        Sebelumnya
      </button>
      <div v-else />

      <button
        v-if="currentStep < steps.length - 1"
        class="btn-primary"
        @click="nextStep"
      >
        Selanjutnya
        <span class="material-symbols-rounded" style="font-size:18px">arrow_forward</span>
      </button>
      <button
        v-else
        class="btn-primary"
        :disabled="isSaving"
        @click="handleSave"
      >
        <span class="material-symbols-rounded" style="font-size:18px">check_circle</span>
        Selesai & Simpan
      </button>
    </div>

    <!-- Toast notifikasi -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm"
      >
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        Perubahan berhasil disimpan!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

// Ambil data UMKM pertama sebagai simulasi user yang login
const myUmkm = umkmMock[0]

// --- Form state (pre-filled dari mock data) ---
const form = reactive({
  namaUmkm:      myUmkm.namaUmkm,
  pemilik:       myUmkm.pemilik,
  tahunBerdiri:  myUmkm.tahunBerdiri,
  sektor:        myUmkm.sektor,
  jumlahKaryawan:myUmkm.jumlahKaryawan,
  alamat:        myUmkm.alamat,
  kabupatenId:   myUmkm.kabupatenId,
  deskripsi:     myUmkm.deskripsi,
  whatsapp:      myUmkm.whatsapp,
  instagram:     myUmkm.instagram,
  website:       myUmkm.website,
  kebutuhanModal:myUmkm.kebutuhanModal,
  alokasiModal:  myUmkm.alokasiModal,
  omzet:         myUmkm.omzet,
  laba:          myUmkm.laba,
})

// --- Steps ---
const steps = [
  { key: 'identitas', label: 'Identitas Usaha' },
  { key: 'kontak',    label: 'Kontak & Sosmed' },
  { key: 'modal',     label: 'Rencana Modal' },
]
const currentStep    = ref(0)
const completedSteps = ref([0, 1]) // Simulasi sudah lengkap karena pre-filled

// --- Options ---
const sektorOptions = [
  { value: 'kuliner',     label: 'Kuliner & Pangan' },
  { value: 'fashion',     label: 'Fashion & Tekstil' },
  { value: 'kerajinan',   label: 'Kerajinan Tangan' },
  { value: 'pertanian',   label: 'Pertanian & Agribisnis' },
  { value: 'jasa',        label: 'Jasa & Layanan' },
  { value: 'teknologi',   label: 'Teknologi' },
  { value: 'lainnya',     label: 'Lainnya' },
]

const kabupatenOptions = [
  { id: '3578', nama: 'Kota Surabaya' },
  { id: '3515', nama: 'Kabupaten Sidoarjo' },
  { id: '3506', nama: 'Kota Kediri' },
  { id: '3573', nama: 'Kota Malang' },
  { id: '3507', nama: 'Kabupaten Malang' },
  { id: '3576', nama: 'Kota Mojokerto' },
  { id: '3522', nama: 'Kabupaten Gresik' },
  { id: '3525', nama: 'Kabupaten Lamongan' },
  { id: '3529', nama: 'Kabupaten Jember' },
  { id: '3510', nama: 'Kabupaten Banyuwangi' },
]

// --- Actions ---
const isSaving  = ref(false)
const showToast = ref(false)

function nextStep() {
  if (!completedSteps.value.includes(currentStep.value)) {
    completedSteps.value.push(currentStep.value)
  }
  currentStep.value++
}

async function handleSave() {
  isSaving.value = true
  if (!completedSteps.value.includes(currentStep.value)) {
    completedSteps.value.push(currentStep.value)
  }
  // Simulasi API call
  await new Promise(r => setTimeout(r, 1000))
  isSaving.value  = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>