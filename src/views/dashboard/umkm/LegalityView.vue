<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Legalitas</h1>
        <p class="text-sm text-gray-400 mt-0.5">Kelola dokumen legalitas usaha kamu</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="myUmkm.isLegalitasVerified" class="badge-verified">
          <span class="material-symbols-rounded" style="font-size:14px">verified</span>
          Terverifikasi Admin
        </span>
        <span v-else class="badge-pending">
          <span class="material-symbols-rounded" style="font-size:14px">schedule</span>
          Menunggu Verifikasi
        </span>
      </div>
    </div>

    <!-- Status Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="doc in documents"
        :key="doc.key"
        class="card p-4 flex items-center gap-3"
        :class="doc.uploaded ? 'border-l-4 border-l-success-500' : 'border-l-4 border-l-gray-200'"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="doc.uploaded ? 'bg-success-50' : 'bg-gray-100'">
          <span class="material-symbols-rounded" style="font-size:22px" :class="doc.uploaded ? 'text-success-500' : 'text-gray-400'">{{ doc.icon }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-700">{{ doc.name }}</p>
          <p class="text-xs" :class="doc.uploaded ? 'text-success-500' : 'text-gray-400'">
            {{ doc.uploaded ? 'Sudah diupload' : doc.required ? 'Belum diupload' : 'Opsional' }}
          </p>
        </div>
        <span
          class="material-symbols-rounded flex-shrink-0"
          style="font-size:20px"
          :class="doc.uploaded ? 'text-success-500' : 'text-gray-300'"
        >{{ doc.uploaded ? 'check_circle' : 'pending' }}</span>
      </div>
    </div>

    <!-- Dokumen Detail -->
    <div class="space-y-4">
      <div v-for="doc in documents" :key="doc.key" class="card p-5 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="doc.uploaded ? 'bg-success-50' : 'bg-gray-100'">
              <span class="material-symbols-rounded" style="font-size:20px" :class="doc.uploaded ? 'text-success-500' : 'text-gray-400'">{{ doc.icon }}</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-700">{{ doc.name }}
                <span v-if="doc.required" class="text-danger-500 ml-0.5">*</span>
                <span v-else class="text-xs text-gray-400 font-normal ml-1">(opsional)</span>
              </h3>
              <p class="text-xs text-gray-400">{{ doc.desc }}</p>
            </div>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
            :class="doc.uploaded
              ? myUmkm.isLegalitasVerified ? 'bg-success-50 text-success-800' : 'bg-warning-50 text-warning-800'
              : 'bg-gray-100 text-gray-500'"
          >
            {{ doc.uploaded ? (myUmkm.isLegalitasVerified ? 'Terverifikasi' : 'Review Admin') : 'Belum Upload' }}
          </span>
        </div>

        <!-- Sudah upload -->
        <div v-if="doc.uploaded" class="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
          <span class="material-symbols-rounded text-brand-600" style="font-size:24px">description</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-700 truncate">{{ doc.fileName }}</p>
            <p class="text-xs text-gray-400">Diupload {{ doc.uploadedAt }} · {{ doc.fileSize }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="text-xs text-brand-600 hover:underline">Lihat</button>
            <button class="text-xs text-danger-500 hover:underline" @click="doc.uploaded = false">Hapus</button>
          </div>
        </div>

        <!-- Belum upload -->
        <div
          v-else
          class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-400 hover:bg-brand-50 transition cursor-pointer"
          @click="simulateUpload(doc)"
        >
          <span class="material-symbols-rounded text-gray-300 block mb-2" style="font-size:36px">upload_file</span>
          <p class="text-sm font-medium text-gray-500">Klik untuk upload {{ doc.name }}</p>
          <p class="text-xs text-gray-400 mt-1">PDF atau gambar · Maks. 10MB</p>
        </div>

        <!-- Catatan -->
        <div v-if="doc.note" class="flex gap-2 bg-warning-50 border border-warning-200 rounded-lg p-3">
          <span class="material-symbols-rounded text-warning-500 flex-shrink-0" style="font-size:16px">warning</span>
          <p class="text-xs text-warning-800">{{ doc.note }}</p>
        </div>
      </div>
    </div>

    <!-- Catatan Mentor -->
    <div v-if="myUmkm.mentorNotes" class="card p-5">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span class="material-symbols-rounded text-brand-600" style="font-size:18px">school</span>
        Catatan dari Mentor
      </h3>
      <div class="bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p class="text-sm text-brand-800 leading-relaxed">{{ myUmkm.mentorNotes }}</p>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        {{ toastMsg }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

const myUmkm = umkmMock[0]

const documents = reactive([
  {
    key: 'nib',
    name: 'NIB',
    desc: 'Nomor Induk Berusaha — wajib untuk semua jenis usaha',
    icon: 'badge',
    required: true,
    uploaded: myUmkm.hasNib,
    fileName: 'NIB_Keripik_Tempe_Jaya.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '12 Mar 2026',
    note: null,
  },
  {
    key: 'pirt',
    name: 'PIRT',
    desc: 'Pangan Industri Rumah Tangga — untuk produk pangan olahan',
    icon: 'restaurant',
    required: true,
    uploaded: myUmkm.hasPirt,
    fileName: 'PIRT_Keripik_Tempe.pdf',
    fileSize: '0.8 MB',
    uploadedAt: '15 Mar 2026',
    note: null,
  },
  {
    key: 'halal',
    name: 'Sertifikat Halal MUI',
    desc: 'Sertifikasi halal dari BPJPH / MUI untuk produk pangan',
    icon: 'verified',
    required: false,
    uploaded: myUmkm.hasHalal,
    fileName: 'Halal_MUI_2026.pdf',
    fileSize: '1.5 MB',
    uploadedAt: '20 Apr 2026',
    note: null,
  },
  {
    key: 'siup',
    name: 'SIUP / Izin Usaha',
    desc: 'Surat Izin Usaha Perdagangan atau dokumen izin sejenis',
    icon: 'gavel',
    required: false,
    uploaded: false,
    fileName: '',
    fileSize: '',
    uploadedAt: '',
    note: 'Dokumen ini opsional namun meningkatkan kepercayaan investor secara signifikan.',
  },
])

const showToast = ref(false)
const toastMsg  = ref('')

function simulateUpload(doc) {
  doc.uploaded   = true
  doc.fileName   = `${doc.key.toUpperCase()}_Dokumen.pdf`
  doc.fileSize   = '1.1 MB'
  doc.uploadedAt = 'Baru saja'
  toastMsg.value  = `${doc.name} berhasil diupload!`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>