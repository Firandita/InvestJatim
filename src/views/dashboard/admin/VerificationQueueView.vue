<template>
  <div class="space-y-5">

    <div>
      <h1 class="text-xl font-bold text-gray-800">Antrian Verifikasi</h1>
      <p class="text-sm text-gray-400 mt-0.5">
        {{ queue.length }} dokumen menunggu ditinjau
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-5">

      <!-- List Antrian -->
      <div class="w-full lg:w-80 flex-shrink-0 space-y-2">

        <!-- Filter tab -->
        <div class="flex gap-2 mb-3">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
              activeTab === tab.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-gray-200 text-gray-500 hover:border-brand-300'
            ]"
          >{{ tab.label }}</button>
        </div>

        <div
          v-for="item in filteredQueue"
          :key="item.id"
          @click="selected = item"
          :class="[
            'p-3.5 rounded-xl border cursor-pointer transition-all',
            selected?.id === item.id
              ? 'border-brand-400 bg-brand-50'
              : 'border-gray-100 bg-white hover:border-brand-200'
          ]"
        >
          <div class="flex items-center gap-3">
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
              >{{ item.type === 'investor' ? 'badge' : 'store' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ item.nama }}</p>
              <p class="text-xs text-gray-400">{{ item.dokumen }} · {{ item.waktu }}</p>
            </div>
            <span class="badge-pending text-xs">Review</span>
          </div>
        </div>

        <div v-if="filteredQueue.length === 0"
             class="text-center py-8 text-gray-400 text-sm">
          Tidak ada antrian
        </div>
      </div>

      <!-- Panel Preview -->
      <div class="flex-1">
        <div v-if="selected" class="space-y-4">

          <!-- Info Dokumen -->
          <div class="card p-5">
            <div class="flex items-start gap-4">
              <div
                :style="{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: selected.type === 'investor' ? '#EEF6E8' : '#EBF3FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }"
              >
                <span
                  class="material-symbols-rounded"
                  :style="{ fontSize: '24px', color: selected.type === 'investor' ? '#6A994E' : '#3A86FF' }"
                >{{ selected.type === 'investor' ? 'badge' : 'store' }}</span>
              </div>
              <div class="flex-1">
                <h2 class="font-bold text-gray-800 text-lg">{{ selected.nama }}</h2>
                <p class="text-sm text-gray-400">
                  {{ selected.type === 'investor' ? 'Investor' : 'UMKM' }}
                  · Dokumen: <strong>{{ selected.dokumen }}</strong>
                </p>
                <p class="text-xs text-gray-400 mt-0.5">Dikirim {{ selected.waktu }}</p>
              </div>
            </div>
          </div>

          <!-- Preview Dokumen (simulasi) -->
          <div class="card p-5">
            <h3 class="font-bold text-gray-800 mb-3">Pratinjau Dokumen</h3>
            <div
              class="rounded-xl border-2 border-dashed border-gray-200 bg-surface
                     flex flex-col items-center justify-center py-16 gap-2"
            >
              <span class="material-symbols-rounded text-gray-300" style="font-size:56px">
                id_card
              </span>
              <p class="text-sm text-gray-400 font-medium">{{ selected.dokumen }}</p>
              <p class="text-xs text-gray-300">{{ selected.nama }}</p>
            </div>
          </div>

          <!-- Checklist -->
          <div class="card p-5">
            <h3 class="font-bold text-gray-800 mb-3">Checklist Verifikasi</h3>
            <div class="space-y-2.5">
              <label
                v-for="(item, idx) in checklist"
                :key="idx"
                class="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  v-model="item.checked"
                  class="accent-brand-600 w-4 h-4"
                />
                <span
                  :class="[
                    'text-sm transition-colors',
                    item.checked ? 'text-brand-600 line-through' : 'text-gray-600'
                  ]"
                >{{ item.label }}</span>
                <span
                  v-if="item.checked"
                  class="material-symbols-rounded text-brand-500"
                  style="font-size:16px"
                >check_circle</span>
              </label>
            </div>
          </div>

          <!-- Catatan Admin -->
          <div class="card p-5">
            <h3 class="font-bold text-gray-800 mb-2">Catatan (opsional)</h3>
            <textarea
              v-model="catatan"
              class="input-base resize-none"
              rows="3"
              placeholder="Tulis alasan penolakan atau catatan tambahan..."
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="approve"
              :disabled="!allChecked"
              class="btn-primary flex-1 justify-center py-3"
            >
              <span class="material-symbols-rounded" style="font-size:18px">check_circle</span>
              Setujui Verifikasi
            </button>
            <button
              @click="reject"
              class="btn-danger flex-1 justify-center py-3"
            >
              <span class="material-symbols-rounded" style="font-size:18px">cancel</span>
              Tolak
            </button>
          </div>

          <!-- Hint jika checklist belum lengkap -->
          <p v-if="!allChecked" class="text-xs text-warning-500 text-center">
            <span class="material-symbols-rounded" style="font-size:13px;vertical-align:-2px">
              info
            </span>
            Centang semua checklist sebelum menyetujui
          </p>

        </div>

        <!-- Empty panel -->
        <div v-else class="card p-10 text-center text-gray-400 h-full flex flex-col items-center justify-center">
          <span class="material-symbols-rounded text-gray-200 mb-3" style="font-size:56px">
            fact_check
          </span>
          <p class="font-medium text-gray-500">Pilih dokumen dari antrian</p>
          <p class="text-sm mt-1">untuk memulai proses verifikasi</p>
        </div>
      </div>

    </div>

    <!-- Toast notifikasi -->
    <transition name="fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg z-50 text-white text-sm font-medium',
          toast.type === 'success' ? 'bg-brand-600' : 'bg-danger-500'
        ]"
      >
        <span class="material-symbols-rounded" style="font-size:18px">
          {{ toast.type === 'success' ? 'check_circle' : 'cancel' }}
        </span>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const activeTab = ref('semua')
const selected  = ref(null)
const catatan   = ref('')

const tabs = [
  { value: 'semua',    label: 'Semua' },
  { value: 'investor', label: 'Investor' },
  { value: 'umkm',     label: 'UMKM' },
]

const queue = ref([
  { id:1, nama:'Siti Rahayu',       type:'investor', dokumen:'KTP/NIK', waktu:'2 jam lalu' },
  { id:2, nama:'Batik Madura',      type:'umkm',     dokumen:'NIB',     waktu:'3 jam lalu' },
  { id:3, nama:'Budi Santoso',      type:'investor', dokumen:'KTP/NIK', waktu:'5 jam lalu' },
  { id:4, nama:'Kopi Bromo',        type:'umkm',     dokumen:'PIRT',    waktu:'6 jam lalu' },
  { id:5, nama:'Rina Wulandari',    type:'investor', dokumen:'KTP/NIK', waktu:'8 jam lalu' },
  { id:6, nama:'Tempe Organik Bu Sri', type:'umkm',  dokumen:'NIB',     waktu:'1 hari lalu' },
])

const filteredQueue = computed(() => {
  if (activeTab.value === 'semua') return queue.value
  return queue.value.filter(q => q.type === activeTab.value)
})

const checklist = reactive([
  { label: 'Foto/scan dokumen jelas dan tidak blur',         checked: false },
  { label: 'Seluruh bagian dokumen terlihat (tidak terpotong)', checked: false },
  { label: 'Data pada dokumen sesuai dengan profil',         checked: false },
  { label: 'Dokumen masih berlaku (tidak kadaluarsa)',       checked: false },
])

const allChecked = computed(() => checklist.every(c => c.checked))

const toast = reactive({ show: false, type: 'success', message: '' })

function showToast(type, message) {
  toast.show    = true
  toast.type    = type
  toast.message = message
  setTimeout(() => { toast.show = false }, 3000)
}

function approve() {
  if (!allChecked.value || !selected.value) return
  queue.value = queue.value.filter(q => q.id !== selected.value.id)
  showToast('success', `Verifikasi ${selected.value.nama} berhasil disetujui`)
  selected.value = null
  catatan.value  = ''
  checklist.forEach(c => c.checked = false)
}

function reject() {
  if (!selected.value) return
  queue.value = queue.value.filter(q => q.id !== selected.value.id)
  showToast('error', `Verifikasi ${selected.value.nama} ditolak`)
  selected.value = null
  catatan.value  = ''
  checklist.forEach(c => c.checked = false)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease, transform .3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(8px); }
</style>