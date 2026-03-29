<template>
  <div :class="['modal-overlay', open && 'open']" @click.self="$emit('close')">
    <div v-if="student" class="bg-white rounded-2xl p-8 w-[560px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-syne text-lg font-extrabold text-ink">Detail Siswa</h2>
        <button class="text-ink-3 hover:text-ink text-xl leading-none" @click="$emit('close')">✕</button>
      </div>

      <!-- Profile -->
      <div class="flex items-center gap-4 mb-6">
        <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-2xl',
          cl === 'kritis' ? 'bg-danger-bg' : cl === 'berisiko' ? 'bg-warn-bg' : 'bg-teal-bg']">
          {{ cl === 'kritis' ? '🚨' : cl === 'berisiko' ? '⚠️' : '✅' }}
        </div>
        <div>
          <div class="text-lg font-bold text-ink">{{ student.nama }}</div>
          <div class="text-sm text-ink-3 mt-0.5 flex items-center gap-2">
            {{ student.kelas }}
            <StudentBadge :cluster="student.cluster" />
          </div>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 gap-4 mb-5">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-1">Risk Score</div>
          <div class="text-2xl font-extrabold font-syne" :style="{ color: riskColor }">{{ student.risk }}/100</div>
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-1">Cluster</div>
          <div class="text-xl font-bold text-ink">{{ student.cluster || '—' }}</div>
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-1">Screen Time</div>
          <div class="text-xl font-bold text-ink">{{ student.screen_time }} jam/hari</div>
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-1">Konsentrasi</div>
          <div class="text-xl font-bold text-ink">{{ student.fokus }}%</div>
        </div>
      </div>

      <!-- Score bars -->
      <div class="text-[10px] font-bold uppercase tracking-widest text-ink-3 mb-3">Indikator Brain Rot</div>
      <div class="flex flex-col gap-3">
        <div v-for="dim in dims" :key="dim.label" class="flex items-center gap-3 text-xs">
          <div class="w-32 text-ink-2 shrink-0">{{ dim.label }}</div>
          <div class="score-bar">
            <div class="score-bar-fill" :style="{ width: dim.pct + '%', background: dim.color }"></div>
          </div>
          <div class="w-8 text-right text-ink-3">{{ dim.val }}</div>
        </div>
      </div>

      <!-- Recommendation -->
      <div v-if="student.cluster === 'Kritis'"
        class="mt-5 p-4 bg-danger-bg border border-danger-mid rounded-lg">
        <div class="font-bold text-danger mb-1">🚨 Rekomendasi Tindak Lanjut</div>
        <div class="text-sm text-ink-2">Siswa ini memerlukan konseling segera. Screen time sangat tinggi dan konsentrasi belajar sangat rendah — indikasi kuat sindrom brain rot. Lakukan sesi konseling individual dan koordinasi dengan orang tua.</div>
      </div>
      <div v-else-if="student.cluster === 'Berisiko'"
        class="mt-5 p-4 bg-warn-bg border border-warn-mid rounded-lg">
        <div class="font-bold text-warn mb-1">⚠ Rekomendasi Pemantauan</div>
        <div class="text-sm text-ink-2">Pantau perkembangan siswa ini secara berkala. Berikan edukasi mengenai manajemen screen time dan teknik belajar efektif. Lakukan evaluasi ulang dalam 2 minggu.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StudentBadge from './StudentBadge.vue'

const props = defineProps({ open: Boolean, student: Object })
defineEmits(['close'])

const cl = computed(() => (props.student?.cluster || '').toLowerCase())
const riskColor = computed(() =>
  cl.value === 'kritis' ? '#c0392b' : cl.value === 'berisiko' ? '#b5620a' : '#0f7b6c'
)

const dims = computed(() => {
  if (!props.student) return []
  const s = props.student
  const entries = [
    { label: 'Screen Time', pct: Math.round(s.screen_time / 12 * 100), val: s.screen_time + 'j' },
    { label: 'Konsentrasi', pct: 100 - s.fokus, val: s.fokus + '%' },
    { label: 'Kualitas Tidur', pct: 100 - s.tidur, val: s.tidur + '%' },
    { label: 'Mood', pct: 100 - s.mood, val: s.mood + '%' },
    { label: 'Prestasi', pct: 100 - s.prestasi, val: s.prestasi + '%' },
  ]
  return entries.map(d => ({
    ...d,
    color: d.pct > 65 ? '#c0392b' : d.pct > 40 ? '#b5620a' : '#14a896',
  }))
})
</script>
