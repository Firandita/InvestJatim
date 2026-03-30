<template>
  <div class="h-screen flex flex-col font-epilogue overflow-hidden bg-slate-50">
    <AppTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <div class="flex flex-1 overflow-hidden">
      <AppSidebar
        :active-page="activePage"
        :alert-count="alertCount"
        :is-open="isSidebarOpen"
        @navigate="goPage"
        @close-sidebar="isSidebarOpen = false"
      />

      <main class="flex-1 p-4 md:p-7 min-w-0 overflow-y-auto">
        <div class="max-w-[1400px] mx-auto">
          <PageOverview
            v-if="activePage === 'overview'"
            :students="students"
            :stats="stats"
            @run-clustering="handleRunClustering"
            @open-detail="openDetail"
          />
          <PageClustering
            v-else-if="activePage === 'clustering'"
            :students="students"
            @run-clustering="handleRunClustering"
          />
          <PageAlerts
            v-else-if="activePage === 'alerts'"
            :students="students"
            @open-detail="handleAlertDetail"
            @mark-read="markAllAsRead"
            @toast="(msg) => showToast(msg)"
          />
          <PageStudents
            v-else-if="activePage === 'students'"
            :students="students"
            :kelas-options="kelasOptions"
            @open-detail="openDetail"
          />
          <PageInput
            v-else-if="activePage === 'input'"
            @add-student="handleAddStudent"
            @toast="showToast"
          />
          <PageUpload
            v-else-if="activePage === 'upload'"
            @import-students="handleImport"
            @toast="showToast"
          />
        </div>
      </main>
    </div>

    <StudentModal
      :open="modalOpen"
      :student="selectedStudent"
      @close="modalOpen = false"
    />

    <div
      id="toast-el"
      :class="{ show: toastVisible }"
      :style="{ background: toastWarn ? '#b5620a' : '#1a1917' }"
    >
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppTopbar from './components/AppTopbar.vue'
import AppSidebar from './components/AppSidebar.vue'
import StudentModal from './components/StudentModal.vue'
import PageOverview from './components/PageOverview.vue'
import PageClustering from './components/PageClustering.vue'
import PageAlerts from './components/PageAlerts.vue'
import PageStudents from './components/PageStudents.vue'
import PageInput from './components/PageInput.vue'
import PageUpload from './components/PageUpload.vue'
import { useStudents } from './composables/useStudents.js'

const { 
  students, stats, kelasOptions, alertCount, 
  initSample, runClustering, addStudent, 
  importStudents, markAllAsRead, markAsRead 
} = useStudents()

const isSidebarOpen = ref(false)
const activePage = ref('overview')
function goPage(page) { activePage.value = page }

function handleRunClustering() {
  const ok = runClustering()
  if (!ok) showToast('⚠ Belum ada data siswa. Tambah atau upload data terlebih dahulu.', 'warn')
  else showToast(`✓ Clustering selesai! ${students.value.length} siswa berhasil diklasifikasi.`)
}

function handleAddStudent(s) {
  addStudent(s)
  runClustering()
}

function handleImport(rows) {
  const count = importStudents(rows)
  showToast(`✓ ${count} siswa berhasil diimport dan diklasifikasi.`)
}

const modalOpen = ref(false)
const selectedStudent = ref(null)

// Fungsi umum modal
function openDetail(s) { 
  selectedStudent.value = s
  modalOpen.value = true 
}

// KHUSUS Halaman Alert: Klik detail = Tandai sudah dibaca
function handleAlertDetail(s) {
  markAsRead(s.nama)
  openDetail(s)
}

const toastMsg = ref('')
const toastVisible = ref(false)
const toastWarn = ref(false)
let toastTimer = null
function showToast(msg, type = 'ok') {
  toastMsg.value = msg
  toastWarn.value = type === 'warn'
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 3000)
}

onMounted(() => initSample())
</script>

<style>
/* CSS Toast sederhana agar muncul */
#toast-el {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  transform: translateY(100px);
  transition: transform 0.3s ease;
  z-index: 999;
}
#toast-el.show {
  transform: translateY(0);
}
</style>