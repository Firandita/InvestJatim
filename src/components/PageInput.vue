<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="font-syne text-2xl font-extrabold text-ink">Input Data Siswa</h1>
      <p class="text-sm text-ink-3 mt-0.5">Tambah data siswa secara manual</p>
    </div>

    <div class="card max-w-2xl">
      <div class="card-title">Form Data Siswa</div>
      <div class="card-sub">Isi semua field untuk mendapatkan analisis cluster yang akurat</div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Nama -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Nama Lengkap *</label>
          <input v-model="form.nama" type="text" class="form-input" placeholder="contoh: Ahmad Faiz" />
        </div>

        <!-- Kelas -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Kelas *</label>
          <select v-model="form.kelas" class="form-input">
            <option value="">— Pilih Kelas —</option>
            <option v-for="k in kelasList" :key="k">{{ k }}</option>
          </select>
        </div>

        <!-- Screen time -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Screen Time Medsos (jam/hari) *</label>
          <input v-model.number="form.screen_time" type="number" min="0" max="24" step="0.5" class="form-input" placeholder="contoh: 5" />
          <span class="text-[11px] text-ink-3">Rata-rata waktu penggunaan media sosial per hari</span>
        </div>

        <!-- Konsentrasi -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Skor Konsentrasi Belajar (0–100) *</label>
          <input v-model.number="form.fokus" type="number" min="0" max="100" class="form-input" placeholder="contoh: 65" />
          <span class="text-[11px] text-ink-3">Kemampuan mempertahankan fokus saat belajar</span>
        </div>

        <!-- Tidur -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Kualitas Tidur (0–100) *</label>
          <input v-model.number="form.tidur" type="number" min="0" max="100" class="form-input" placeholder="contoh: 70" />
          <span class="text-[11px] text-ink-3">Kualitas dan durasi tidur malam</span>
        </div>

        <!-- Mood -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Indeks Mood / Stabilitas Emosi (0–100) *</label>
          <input v-model.number="form.mood" type="number" min="0" max="100" class="form-input" placeholder="contoh: 60" />
          <span class="text-[11px] text-ink-3">Kestabilan emosi dan suasana hati</span>
        </div>

        <!-- Pemahaman Materi -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Pemahaman Materi (0–100) *</label>
          <input v-model.number="form.pemahaman_materi" type="number" min="0" max="100" class="form-input" placeholder="contoh: 72" />
          <span class="text-[11px] text-ink-3">Tingkat pemahaman terhadap materi pelajaran</span>
        </div>

        <!-- Gender -->
        <div class="flex flex-col gap-1.5">
          <label class="form-label">Jenis Kelamin</label>
          <select v-model="form.gender" class="form-input">
            <option value="">— Pilih —</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </div>

        <!-- Divider -->
        <div class="col-span-2 h-px bg-[#e0ddd6]"></div>

        <!-- Actions -->
        <div class="col-span-2 flex justify-end gap-3">
          <button class="btn btn-secondary" @click="resetForm">Reset</button>
          <button class="btn btn-primary" @click="submit">+ Tambah Siswa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['add-student', 'toast'])

const kelasList = [
  'X IPA 1','X IPA 2','X IPS 1','X IPS 2',
  'XI IPA 1','XI IPA 2','XI IPS 1','XI IPS 2',
  'XII IPA 1','XII IPA 2','XII IPS 1','XII IPS 2',
]

const emptyForm = () => ({ nama: '', kelas: '', screen_time: '', fokus: '', tidur: '', mood: '', prestasi: '', gender: '' })
const form = reactive(emptyForm())

function resetForm() { Object.assign(form, emptyForm()) }

function submit() {
  const { nama, kelas, screen_time, fokus, tidur, mood, prestasi } = form
  if (!nama || !kelas || screen_time === '' || fokus === '' || tidur === '' || mood === '' || prestasi === '') {
    emit('toast', '⚠ Harap isi semua field yang wajib.', 'warn'); return
  }
  if (screen_time < 0 || screen_time > 24 || fokus < 0 || fokus > 100 || tidur < 0 || tidur > 100 || mood < 0 || mood > 100 || prestasi < 0 || prestasi > 100) {
    emit('toast', '⚠ Nilai di luar rentang yang valid.', 'warn'); return
  }
  emit('add-student', { nama, kelas, screen_time: parseFloat(screen_time), fokus: parseInt(fokus), tidur: parseInt(tidur), mood: parseInt(mood), prestasi: parseInt(prestasi) })
  emit('toast', `✓ ${nama} berhasil ditambahkan. Jalankan clustering untuk klasifikasi.`)
  resetForm()
}
</script>
