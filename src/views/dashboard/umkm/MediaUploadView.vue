<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Foto & Media</h1>
        <p class="text-sm text-gray-400 mt-0.5">Upload foto produk dan video profil untuk menarik investor</p>
      </div>
      <button class="btn-primary" :disabled="isSaving" @click="handleSave">
        <span class="material-symbols-rounded" style="font-size:18px">{{ isSaving ? 'hourglass_empty' : 'save' }}</span>
        {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <!-- Tips Banner -->
    <div class="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
      <span class="material-symbols-rounded text-brand-600 flex-shrink-0" style="font-size:20px">tips_and_updates</span>
      <div>
        <p class="text-sm font-medium text-brand-700">Tips foto yang menarik investor</p>
        <p class="text-xs text-brand-600 mt-0.5">Gunakan foto pencahayaan natural, tampilkan produk dari berbagai sudut, dan sertakan foto proses produksi untuk meningkatkan kepercayaan.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">

        <!-- Foto Produk -->
        <div class="card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span class="material-symbols-rounded text-brand-600" style="font-size:18px">photo_library</span>
              Foto Produk
            </h2>
            <span class="text-xs text-gray-400">{{ photos.length }}/8 foto</span>
          </div>

          <!-- Grid foto -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="(photo, i) in photos"
              :key="photo.id"
              class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
            >
              <img :src="photo.url" :alt="photo.label" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                <span class="text-white text-xs font-medium">{{ photo.label }}</span>
                <button
                  class="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1 text-xs transition"
                  @click="removePhoto(i)"
                >
                  <span class="material-symbols-rounded" style="font-size:14px">delete</span>
                </button>
              </div>
              <div v-if="photo.isPrimary" class="absolute top-2 left-2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">Utama</div>
            </div>

            <!-- Upload slot -->
            <button
              v-if="photos.length < 8"
              class="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center gap-2 transition group"
              @click="simulateUpload"
            >
              <span class="material-symbols-rounded text-gray-300 group-hover:text-brand-400 transition" style="font-size:32px">add_photo_alternate</span>
              <span class="text-xs text-gray-400 group-hover:text-brand-500">Tambah foto</span>
            </button>
          </div>

          <p class="text-xs text-gray-400">Format: JPG, PNG, WebP. Maks. 5MB per foto. Foto pertama akan jadi foto utama.</p>
        </div>

        <!-- Video Profil -->
        <div class="card p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span class="material-symbols-rounded text-danger-500" style="font-size:18px">play_circle</span>
            Video Profil Usaha
          </h2>

          <div v-if="!videoUrl" class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50 transition cursor-pointer" @click="simulateVideoUpload">
            <span class="material-symbols-rounded text-gray-300 block mb-2" style="font-size:48px">videocam</span>
            <p class="text-sm font-medium text-gray-500">Upload video atau masukkan link YouTube</p>
            <p class="text-xs text-gray-400 mt-1">Maks. 2 menit · Format MP4 / MOV · atau link YouTube</p>
            <button class="btn-secondary mt-4 mx-auto">
              <span class="material-symbols-rounded" style="font-size:16px">upload</span>
              Pilih Video
            </button>
          </div>

          <div v-else class="space-y-3">
            <div class="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
              <span class="material-symbols-rounded text-white/30" style="font-size:64px">play_circle</span>
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span class="text-white text-xs bg-black/40 px-2 py-1 rounded-lg">preview_video_profil.mp4</span>
                <button class="text-white text-xs bg-danger-500 px-2 py-1 rounded-lg" @click="videoUrl = ''">Hapus</button>
              </div>
            </div>
            <p class="text-xs text-gray-400">Video berhasil diupload. Klik simpan untuk menyimpan perubahan.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Atau masukkan link YouTube</label>
            <div class="flex gap-2">
              <input v-model="youtubeLink" class="input-base flex-1" placeholder="https://youtube.com/watch?v=..." />
              <button class="btn-secondary flex-shrink-0" @click="youtubeLink = ''">
                <span class="material-symbols-rounded" style="font-size:16px">clear</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Sidebar -->
      <div class="space-y-4">

        <!-- Kelengkapan Media -->
        <div class="card p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Kelengkapan Media</h3>
          <div v-for="item in completionItems" :key="item.label" class="flex items-start gap-2.5">
            <span
              class="material-symbols-rounded flex-shrink-0 mt-0.5"
              style="font-size:16px"
              :class="item.done ? 'text-success-500' : 'text-gray-300'"
            >{{ item.done ? 'check_circle' : 'radio_button_unchecked' }}</span>
            <div>
              <p class="text-xs font-medium text-gray-600">{{ item.label }}</p>
              <p class="text-xs text-gray-400">{{ item.desc }}</p>
            </div>
          </div>

          <div class="pt-2 border-t border-gray-100">
            <div class="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Skor Media</span>
              <span class="font-semibold text-brand-600">{{ mediaScore }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="h-2 rounded-full bg-brand-600 transition-all duration-500" :style="{ width: mediaScore + '%' }" />
            </div>
          </div>
        </div>

        <!-- Panduan -->
        <div class="card p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Panduan Foto Terbaik</h3>
          <div v-for="guide in guides" :key="guide.title" class="flex gap-2.5">
            <span class="material-symbols-rounded text-brand-400 flex-shrink-0" style="font-size:16px">{{ guide.icon }}</span>
            <div>
              <p class="text-xs font-medium text-gray-600">{{ guide.title }}</p>
              <p class="text-xs text-gray-400">{{ guide.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <span class="material-symbols-rounded text-success-500" style="font-size:20px">check_circle</span>
        Media berhasil disimpan!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const photos = ref([
  { id: 1, url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&h=400&fit=crop', label: 'Produk Utama', isPrimary: true },
  { id: 2, url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', label: 'Variasi Rasa', isPrimary: false },
  { id: 3, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', label: 'Kemasan', isPrimary: false },
  { id: 4, url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop', label: 'Proses Produksi', isPrimary: false },
])

const videoUrl    = ref('mock_video.mp4')
const youtubeLink = ref('')
const isSaving    = ref(false)
const showToast   = ref(false)

const completionItems = computed(() => [
  { label: 'Minimal 3 foto produk', desc: 'Sudah ' + photos.value.length + ' foto diupload', done: photos.value.length >= 3 },
  { label: 'Foto proses produksi', desc: 'Tunjukkan bagaimana produk dibuat', done: photos.value.length >= 4 },
  { label: 'Video profil usaha', desc: 'Video singkat maks. 2 menit', done: !!videoUrl.value || !!youtubeLink.value },
  { label: 'Kualitas foto baik', desc: 'Resolusi minimal 800x800px', done: photos.value.length >= 2 },
])

const mediaScore = computed(() => {
  const done = completionItems.value.filter(i => i.done).length
  return Math.round((done / completionItems.value.length) * 100)
})

const guides = [
  { icon: 'wb_sunny', title: 'Cahaya Natural', desc: 'Foto di dekat jendela saat siang hari' },
  { icon: 'crop_free', title: 'Background Bersih', desc: 'Gunakan background putih atau polos' },
  { icon: 'zoom_in', title: 'Detail Produk', desc: 'Ambil close-up untuk tekstur & kualitas' },
  { icon: 'straighten', title: 'Proporsi Tepat', desc: 'Rasio 1:1 atau 4:3 untuk tampilan terbaik' },
]

let photoCounter = 5
function simulateUpload() {
  const mockUrls = [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
  ]
  photos.value.push({
    id: photoCounter++,
    url: mockUrls[photoCounter % mockUrls.length],
    label: 'Foto Baru',
    isPrimary: false,
  })
}

function simulateVideoUpload() {
  videoUrl.value = 'preview_video.mp4'
}

function removePhoto(index) {
  photos.value.splice(index, 1)
}

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