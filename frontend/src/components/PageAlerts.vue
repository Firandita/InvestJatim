<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-syne text-2xl font-extrabold text-ink">Alert Early Warning System</h1>
        <p class="text-sm text-ink-3 mt-0.5">Notifikasi siswa yang memerlukan perhatian segera</p>
      </div>
      <button 
        :class="['btn', hasUnread ? 'btn-primary' : 'btn-secondary opacity-60']"
        @click="handleMarkAll"
      >
        {{ hasUnread ? '✓ Tandai Semua Dibaca' : 'Semua Sudah Dibaca' }}
      </button>
    </div>

    <div class="card">
      <div class="card-title">Kritis — Intervensi Segera</div>
      <div class="card-sub">Siswa dengan skor brain rot sangat tinggi</div>
      <div v-if="!kritis.length" class="text-center py-6">
        <div class="text-3xl mb-2">✅</div>
        <div class="text-sm font-semibold text-ink-2">Data tidak tersedia</div>
      </div>
      <div v-else class="flex flex-col gap-2.5">
        <div v-for="s in kritis" :key="s.nama"
          :class="[
            'flex items-start gap-3.5 p-4 rounded-lg border transition-all duration-300',
            s.isRead ? 'bg-white border-slate-200 shadow-sm' : 'bg-danger-bg border-danger-mid'
          ]">
          <div class="text-lg mt-0.5 shrink-0">{{ s.isRead ? '✅' : '🚨' }}</div>
          <div class="flex-1 min-w-0">
            <div :class="['font-bold', s.isRead ? 'text-slate-700' : 'text-danger']">{{ s.nama }}</div>
            <div class="text-xs text-ink-2 mt-0.5">
              {{ s.kelas }} · Screen time: {{ s.screen_time }}j/hr · Konsentrasi: {{ s.konsentrasi}}% · Risk score: {{ s.risk }}
            </div>
          </div>
          <button 
            :class="['btn btn-sm shrink-0', s.isRead ? 'btn-secondary' : 'bg-danger text-white border-none']" 
            @click="$emit('open-detail', s)"
          >
            {{ s.isRead ? 'Lihat Kembali' : 'Detail' }}
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Berisiko — Perlu Dipantau</div>
      <div class="card-sub">Siswa dengan indikasi awal brain rot</div>
      <div v-if="!berisiko.length" class="text-center py-6">
        <div class="text-3xl mb-2">👍</div>
        <div class="text-sm font-semibold text-ink-2">Data tidak tersedia</div>
      </div>
      <div v-else class="flex flex-col gap-2.5">
        <div v-for="s in berisiko" :key="s.nama"
          :class="[
            'flex items-start gap-3.5 p-4 rounded-lg border transition-all duration-300',
            s.isRead ? 'bg-white border-slate-200 shadow-sm' : 'bg-warn-bg border-warn-mid'
          ]">
          <div class="text-lg mt-0.5 shrink-0">{{ s.isRead ? '✅' : '⚠️' }}</div>
          <div class="flex-1 min-w-0">
            <div :class="['font-bold', s.isRead ? 'text-slate-700' : 'text-warn']">{{ s.nama }}</div>
            <div class="text-xs text-ink-2 mt-0.5">
              {{ s.kelas }} · Screen time: {{ s.screen_time }}j/hr · Konsentrasi: {{ s.konsentrasi }}% · Risk score: {{ s.risk }}
            </div>
          </div>
          <button 
            :class="['btn btn-sm shrink-0', s.isRead ? 'btn-secondary' : 'bg-warn text-white border-none']" 
            @click="$emit('open-detail', s)"
          >
            {{ s.isRead ? 'Lihat Kembali' : 'Detail' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ students: Array })
const emit = defineEmits(['open-detail', 'toast', 'mark-read'])

// Kita TIDAK memfilter !s.isRead lagi agar datanya tetap muncul di list
const kritis = computed(() => props.students.filter(s => s.cluster === 'Kritis').sort((a, b) => b.risk - a.risk))
const berisiko = computed(() => props.students.filter(s => s.cluster === 'Berisiko').sort((a, b) => b.risk - a.risk))

// Cek apakah masih ada yang belum dibaca untuk mengubah warna tombol utama
const hasUnread = computed(() => 
  props.students.some(s => (s.cluster === 'Kritis' || s.cluster === 'Berisiko') && !s.isRead)
)

const handleMarkAll = () => {

  if (!hasUnread.value) return
  emit('mark-read')
  emit('toast', '✓ Semua alert ditandai dibaca.')
}
</script>