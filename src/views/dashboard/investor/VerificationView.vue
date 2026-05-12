<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-xl font-bold text-gray-800">Verifikasi Identitas</h1>
      <p class="text-sm text-gray-400 mt-0.5">
        Diperlukan untuk mengakses kontak UMKM dan fitur lengkap platform
      </p>
    </div>

    <!-- Status -->
    <div :class="[
      'flex items-start gap-3 p-4 rounded-xl border',
      status === 'verified' ? 'bg-success-50 border-success-500' :
      status === 'pending'  ? 'bg-warning-50 border-warning-500' :
                              'bg-gray-50 border-gray-200'
    ]">
      <span class="material-symbols-rounded mt-0.5" :style="{ fontSize:'22px', color: statusColor }">
        {{ statusIcon }}
      </span>
      <div>
        <p class="font-semibold text-sm" :style="{ color: statusColor }">{{ statusTitle }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ statusDesc }}</p>
      </div>
    </div>

    <!-- Upload form -->
    <div v-if="status === 'unverified'" class="card p-5 space-y-5">
      <h3 class="font-bold text-gray-800">Upload Dokumen KTP</h3>

      <!-- Panduan -->
      <div class="bg-brand-50 rounded-xl p-4 space-y-2">
        <p class="text-xs font-semibold text-brand-800">Panduan Upload</p>
        <div v-for="tip in tips" :key="tip" class="flex items-start gap-2 text-xs text-brand-700">
          <span class="material-symbols-rounded text-brand-400 mt-0.5" style="font-size:14px">check_circle</span>
          {{ tip }}
        </div>
      </div>

      <!-- Drop zone -->
      <div
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer"
        @click="triggerUpload"
      >
        <span class="material-symbols-rounded text-gray-300 block mb-2" style="font-size:48px">
          upload_file
        </span>
        <p class="text-sm font-medium text-gray-500">Drag & drop atau klik untuk pilih file</p>
        <p class="text-xs text-gray-400 mt-1">JPG, PNG, atau PDF · Maks 5MB</p>
        <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.pdf" class="hidden" @change="handleFile" />
      </div>

      <!-- Preview -->
      <div v-if="fileName" class="flex items-center gap-3 p-3 bg-success-50 rounded-xl">
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">description</span>
        <span class="text-sm text-success-800 font-medium flex-1 truncate">{{ fileName }}</span>
        <button @click="fileName = ''" class="text-gray-400 hover:text-danger-500">
          <span class="material-symbols-rounded" style="font-size:18px">close</span>
        </button>
      </div>

      <button @click="submitVerification" :disabled="!fileName" class="btn-primary w-full justify-center py-3">
        <span class="material-symbols-rounded" style="font-size:18px">send</span>
        Kirim untuk Diverifikasi
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const status   = ref('unverified') // unverified | pending | verified
const fileName = ref('')
const fileInput= ref(null)

const tips = [
  'Pastikan foto KTP jelas dan tidak blur',
  'Seluruh bagian KTP harus terlihat (tidak terpotong)',
  'Gunakan pencahayaan yang baik, hindari cahaya pantul',
  'Ukuran file maksimal 5MB',
]

const statusColor = computed(() =>
  status.value === 'verified' ? '#1D9E75' :
  status.value === 'pending'  ? '#EF9F27' : '#64748b'
)
const statusIcon = computed(() =>
  status.value === 'verified' ? 'verified_user' :
  status.value === 'pending'  ? 'pending' : 'badge'
)
const statusTitle = computed(() =>
  status.value === 'verified' ? 'Identitas Terverifikasi' :
  status.value === 'pending'  ? 'Dokumen Sedang Ditinjau' : 'Belum Terverifikasi'
)
const statusDesc = computed(() =>
  status.value === 'verified' ? 'Anda dapat mengakses kontak semua UMKM terverifikasi.' :
  status.value === 'pending'  ? 'Admin sedang meninjau dokumen Anda. Proses 1×24 jam.' :
  'Upload KTP/NIK untuk mengakses fitur kontak UMKM.'
)

function triggerUpload() { fileInput.value?.click() }
function handleFile(e)   { const f = e.target.files[0]; if (f) fileName.value = f.name }
function handleDrop(e)   { const f = e.dataTransfer.files[0]; if (f) fileName.value = f.name }
function submitVerification() {
  if (!fileName.value) return
  status.value = 'pending'
  fileName.value = ''
}
</script>