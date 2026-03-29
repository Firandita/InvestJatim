<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="font-syne text-2xl font-extrabold text-ink">Upload CSV / Excel</h1>
      <p class="text-sm text-ink-3 mt-0.5">Import data siswa secara massal dari file</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Upload card -->
      <div class="card">
        <div class="card-title">Upload File</div>
        <div class="card-sub">Format CSV atau Excel (.csv / .xlsx)</div>

        <div
          class="upload-zone"
          :class="{ dragover: isDragging }"
          @dragenter.prevent="isDragging = true"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <input type="file" accept=".csv,.xlsx,.xls" @change="onFileChange" />
          <div class="text-4xl mb-3">📁</div>
          <div class="font-semibold text-ink mb-1">Drag & drop atau klik untuk pilih file</div>
          <div class="text-xs text-ink-3">Mendukung .csv dan .xlsx · Maks 5MB</div>
        </div>

        <!-- Preview info -->
        <div v-if="pendingCount" class="flex items-center justify-between mt-3 px-4 py-2.5 bg-teal-bg rounded-lg">
          <span class="text-sm font-semibold text-teal">📄 {{ fileName }}</span>
          <span class="text-xs text-ink-3">{{ pendingCount }} siswa ditemukan</span>
        </div>
      </div>

      <!-- Format guide -->
      <div class="card">
        <div class="card-title">Format Kolom yang Diperlukan</div>
        <div class="card-sub">Pastikan file CSV/Excel memiliki kolom berikut</div>
        <table class="tbl mt-2">
          <thead>
            <tr><th>Nama Kolom</th><th>Keterangan</th><th>Tipe</th></tr>
          </thead>
          <tbody>
            <tr v-for="col in columns" :key="col.name">
              <td class="td-name font-mono text-xs">{{ col.name }}</td>
              <td class="text-xs">{{ col.desc }}</td>
              <td class="text-xs" :class="col.type === 'teks' ? 'text-teal' : 'text-warn'">{{ col.type }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4">
          <button class="btn btn-secondary btn-sm" @click="downloadTemplate">⬇ Download Template CSV</button>
        </div>
      </div>
    </div>

    <!-- Preview table -->
    <div v-if="pendingRows.length" class="card">
      <div class="card-title">Preview Data</div>
      <div class="card-sub text-ink-3">{{ pendingRows.length }} baris data siap diimport</div>
      <div class="overflow-x-auto">
        <table class="tbl">
          <thead>
            <tr><th>Nama</th><th>Kelas</th><th>Screen Time</th><th>Konsentrasi</th><th>Tidur</th><th>Mood</th><th>Prestasi</th></tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in previewRows" :key="i">
              <td class="td-name">{{ s.nama }}</td>
              <td>{{ s.kelas }}</td>
              <td>{{ s.screen_time }}</td>
              <td>{{ s.fokus }}%</td>
              <td>{{ s.tidur }}%</td>
              <td>{{ s.mood }}%</td>
              <td>{{ s.prestasi }}%</td>
            </tr>
            <tr v-if="pendingRows.length > 10">
              <td colspan="7" class="text-xs text-ink-3 py-3">
                ... dan {{ pendingRows.length - 10 }} siswa lainnya
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex gap-3 mt-5">
        <button class="btn btn-secondary" @click="cancelUpload">Batal</button>
        <button class="btn btn-primary" @click="confirmUpload">✓ Import Semua Data</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const emit = defineEmits(['import-students', 'toast'])

const pendingRows = ref([])
const fileName = ref('')
const isDragging = ref(false)

const pendingCount = computed(() => pendingRows.value.length)
const previewRows = computed(() => pendingRows.value.slice(0, 10))

const columns = [
  { name: 'nama', desc: 'Nama lengkap siswa', type: 'teks' },
  { name: 'kelas', desc: 'Kelas siswa (misal: XII IPA 1)', type: 'teks' },
  { name: 'screen_time', desc: 'Jam/hari medsos (0–24)', type: 'angka' },
  { name: 'konsentrasi', desc: 'Skor fokus belajar (0–100)', type: 'angka' },
  { name: 'tidur', desc: 'Kualitas tidur (0–100)', type: 'angka' },
  { name: 'mood', desc: 'Stabilitas emosi (0–100)', type: 'angka' },
  { name: 'prestasi', desc: 'Skor akademik (0–100)', type: 'angka' },
]

function processData(rawData, name) {
  const required = ['nama', 'kelas', 'screen_time', 'konsentrasi', 'tidur', 'mood', 'prestasi']
  if (!rawData.length) { emit('toast', '⚠ File kosong.', 'warn'); return }
  const missing = required.filter(k => !(k in rawData[0]))
  if (missing.length) { emit('toast', `⚠ Kolom tidak lengkap: ${missing.join(', ')}`, 'warn'); return }

  fileName.value = name
  pendingRows.value = rawData.map(r => ({
    nama: String(r.nama || '').trim(),
    kelas: String(r.kelas || '').trim(),
    screen_time: parseFloat(r.screen_time) || 0,
    fokus: parseInt(r.konsentrasi) || 0,
    tidur: parseInt(r.tidur) || 0,
    mood: parseInt(r.mood) || 0,
    prestasi: parseInt(r.prestasi) || 0,
  })).filter(s => s.nama)
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) handleFile(file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) handleFile(file)
}

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'csv') {
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: res => processData(res.data, file.name) })
  } else if (ext === 'xlsx' || ext === 'xls') {
    const reader = new FileReader()
    reader.onload = e => {
      const wb = XLSX.read(e.target.result, { type: 'binary' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      processData(XLSX.utils.sheet_to_json(ws), file.name)
    }
    reader.readAsBinaryString(file)
  } else {
    emit('toast', '⚠ Format file tidak didukung. Gunakan .csv atau .xlsx', 'warn')
  }
}

function confirmUpload() {
  const count = emit('import-students', pendingRows.value)
  cancelUpload()
}

function cancelUpload() {
  pendingRows.value = []
  fileName.value = ''
}

function downloadTemplate() {
  const csv = 'nama,kelas,screen_time,konsentrasi,tidur,mood,prestasi\nAhmad Faiz,XII IPA 1,6,55,60,50,65\nSiti Nuraini,XII IPA 1,3,80,78,75,85\nBudi Santoso,XI IPS 2,9,30,40,35,45\n'
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'template_aql_metrics.csv'
  a.click()
}
</script>
