<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Preview Publik</h1>
        <p class="text-sm text-gray-400 mt-0.5">Begini tampilan profil kamu di mata investor</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost" @click="copyLink">
          <span class="material-symbols-rounded" style="font-size:16px">link</span>
          Salin Link
        </button>
        <router-link to="/dashboard/umkm/profil" class="btn-primary">
          <span class="material-symbols-rounded" style="font-size:16px">edit</span>
          Edit Profil
        </router-link>
      </div>
    </div>

    <!-- Banner mode preview -->
    <div class="bg-warning-50 border border-warning-200 rounded-xl p-3 flex items-center gap-3">
      <span class="material-symbols-rounded text-warning-500 flex-shrink-0" style="font-size:18px">visibility</span>
      <p class="text-sm text-warning-800">Ini adalah tampilan <strong>preview</strong> — begini profil kamu terlihat oleh investor yang sudah login dan terverifikasi.</p>
    </div>

    <!-- Simulasi halaman publik -->
    <div class="bg-gray-100 rounded-2xl p-4 lg:p-8">
      <div class="max-w-3xl mx-auto space-y-4">

        <!-- Card utama -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm">

          <!-- Cover / foto utama -->
          <div class="h-40 bg-gradient-to-br from-brand-600 to-brand-900 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=300&fit=crop"
              alt="Cover"
              class="w-full h-full object-cover opacity-40"
            />
            <div class="absolute inset-0 flex items-end p-5">
              <div class="flex items-end gap-4">
                <div class="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=100&h=100&fit=crop" class="w-full h-full object-cover" />
                </div>
                <div class="text-white pb-1">
                  <h2 class="text-lg font-bold">{{ umkm.namaUmkm }}</h2>
                  <p class="text-sm text-white/70">{{ umkm.alamat }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Konten -->
          <div class="p-5 space-y-5">

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span class="bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 rounded-full capitalize">{{ umkm.sektor }}</span>
              <span class="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">Berdiri {{ umkm.tahunBerdiri }}</span>
              <span class="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{{ umkm.jumlahKaryawan }} Karyawan</span>
              <span v-if="umkm.hasNib" class="badge-verified">NIB ✓</span>
              <span v-if="umkm.hasPirt" class="badge-verified">PIRT ✓</span>
              <span v-if="umkm.hasHalal" class="badge-verified">Halal ✓</span>
            </div>

            <!-- Deskripsi -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Tentang Usaha</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ umkm.deskripsi }}</p>
            </div>

            <!-- Metrik keuangan -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Indikator Keuangan</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-gray-50 rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-400 mb-1">Omzet/Bulan</p>
                  <p class="text-sm font-bold text-gray-800">{{ formatRp(umkm.omzet) }}</p>
                </div>
                <div class="bg-success-50 rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-400 mb-1">Laba/Bulan</p>
                  <p class="text-sm font-bold text-success-600">{{ formatRp(umkm.laba) }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-400 mb-1">Karyawan</p>
                  <p class="text-sm font-bold text-gray-800">{{ umkm.jumlahKaryawan }} orang</p>
                </div>
                <div class="bg-warning-50 rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-400 mb-1">Butuh Modal</p>
                  <p class="text-sm font-bold text-warning-700">{{ formatRp(umkm.kebutuhanModal) }}</p>
                </div>
              </div>
            </div>

            <!-- Readiness score -->
            <div class="bg-gradient-to-br from-brand-600 to-brand-900 rounded-xl p-4 text-white">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-xs text-white/70">Investment Readiness Score</p>
                  <div class="flex items-end gap-2 mt-0.5">
                    <span class="text-3xl font-bold">100</span>
                    <span class="text-white/60 mb-1">/100</span>
                    <span class="bg-white/20 text-xs px-2 py-0.5 rounded-full mb-1">Tingkat A — Sangat Siap</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <div v-if="umkm.hasNib" class="flex flex-col items-center gap-1">
                    <div class="w-9 h-9 rounded-full bg-success-500 flex items-center justify-center">
                      <span class="material-symbols-rounded text-white" style="font-size:18px">check</span>
                    </div>
                    <span class="text-xs text-white/70">NIB</span>
                  </div>
                  <div v-if="umkm.hasPirt" class="flex flex-col items-center gap-1">
                    <div class="w-9 h-9 rounded-full bg-success-500 flex items-center justify-center">
                      <span class="material-symbols-rounded text-white" style="font-size:18px">check</span>
                    </div>
                    <span class="text-xs text-white/70">PIRT</span>
                  </div>
                  <div v-if="umkm.hasHalal" class="flex flex-col items-center gap-1">
                    <div class="w-9 h-9 rounded-full bg-success-500 flex items-center justify-center">
                      <span class="material-symbols-rounded text-white" style="font-size:18px">check</span>
                    </div>
                    <span class="text-xs text-white/70">Halal</span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-white/70">Profil kamu sudah menarik bagi investor. Pertahankan kelengkapan data!</p>
            </div>

            <!-- Rencana modal -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Rencana Penggunaan Modal</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ umkm.alokasiModal }}</p>
            </div>

            <!-- Foto produk -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Foto Produk</h3>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="photo in productPhotos" :key="photo" class="aspect-square rounded-xl overflow-hidden">
                  <img :src="photo" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Kontak (terkunci jika investor belum verifikasi) -->
            <div class="border border-gray-100 rounded-xl p-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Hubungi UMKM</h3>
              <div class="flex gap-2">
                <button class="btn-primary flex-1 justify-center">
                  <span class="material-symbols-rounded" style="font-size:16px">chat</span>
                  WhatsApp
                </button>
                <button v-if="umkm.instagram" class="btn-secondary flex-1 justify-center">
                  <span class="material-symbols-rounded" style="font-size:16px">photo_camera</span>
                  Instagram
                </button>
              </div>
              <p class="text-xs text-gray-400 text-center mt-2">Kontak tersedia setelah verifikasi identitas investor</p>
            </div>

          </div>
        </div>

        <!-- Watermark preview -->
        <p class="text-center text-xs text-gray-400">— Tampilan ini adalah preview — data sebenarnya ditampilkan setelah login —</p>
      </div>
    </div>

    <!-- Skor kelengkapan -->
    <div class="card p-5">
      <h3 class="text-sm font-semibold text-gray-700 mb-4">Kelengkapan Profil Publik</h3>
      <div class="space-y-3">
        <div v-for="item in completionItems" :key="item.label">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded" style="font-size:16px" :class="item.done ? 'text-success-500' : 'text-gray-300'">
                {{ item.done ? 'check_circle' : 'radio_button_unchecked' }}
              </span>
              <span class="text-sm text-gray-600">{{ item.label }}</span>
            </div>
            <span class="text-xs font-medium" :class="item.done ? 'text-success-500' : 'text-gray-400'">
              {{ item.done ? '✓ Lengkap' : 'Belum' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        Link profil berhasil disalin!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

const umkm = umkmMock[0]

const productPhotos = [
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
]

const completionItems = [
  { label: 'Identitas & deskripsi usaha', done: true },
  { label: 'Data keuangan (omzet & laba)', done: true },
  { label: 'Dokumen legalitas (NIB, PIRT, Halal)', done: true },
  { label: 'Foto produk (min. 3)', done: true },
  { label: 'Rencana penggunaan modal', done: true },
  { label: 'Kontak WhatsApp aktif', done: true },
  { label: 'Video profil usaha', done: false },
]

function formatRp(val) {
  if (!val) return 'Rp 0'
  const num = Number(val)
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Jt`
  return `Rp ${num.toLocaleString('id-ID')}`
}

const showToast = ref(false)

function copyLink() {
  navigator.clipboard.writeText(`https://investjatim.id/umkm/${umkm.id}`)
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>