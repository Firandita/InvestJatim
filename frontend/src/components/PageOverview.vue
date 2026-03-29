<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-syne text-2xl font-extrabold text-ink">Overview</h1>
        <p class="text-sm text-ink-3 mt-0.5">Ringkasan kondisi seluruh siswa yang terdaftar</p>
      </div>
      <button class="btn btn-primary" @click="$emit('run-clustering')">⚙ Jalankan Clustering</button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-4 gap-4">
      <div class="stat-card stat-card-total">
        <div class="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-2">Total Siswa</div>
        <div class="font-syne text-4xl font-extrabold text-ink leading-none">{{ stats.total }}</div>
        <div class="text-xs text-ink-3 mt-1.5">siswa terdaftar</div>
      </div>
      <div class="stat-card stat-card-kritis">
        <div class="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-2">Kritis</div>
        <div class="font-syne text-4xl font-extrabold text-danger leading-none">{{ stats.kritis }}</div>
        <div class="text-xs text-ink-3 mt-1.5">perlu intervensi segera</div>
      </div>
      <div class="stat-card stat-card-berisiko">
        <div class="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-2">Berisiko</div>
        <div class="font-syne text-4xl font-extrabold text-warn leading-none">{{ stats.berisiko }}</div>
        <div class="text-xs text-ink-3 mt-1.5">perlu dipantau</div>
      </div>
      <div class="stat-card stat-card-normal">
        <div class="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-2">Normal</div>
        <div class="font-syne text-4xl font-extrabold text-teal leading-none">{{ stats.normal }}</div>
        <div class="text-xs text-ink-3 mt-1.5">kondisi baik</div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-[1.5fr_1fr] gap-4">
      <div class="card">
        <div class="card-title">Screen Time vs Skor Konsentrasi</div>
        <div class="card-sub">Scatter plot per siswa · klik titik untuk detail</div>
        <div class="relative h-[280px]">
          <canvas ref="scatterRef"></canvas>
        </div>
        <div class="flex gap-4 mt-3 flex-wrap">
          <div class="flex items-center gap-2 text-xs text-ink-2">
            <span class="w-3 h-3 rounded-full bg-danger inline-block"></span>Kritis
          </div>
          <div class="flex items-center gap-2 text-xs text-ink-2">
            <span class="w-3 h-3 rounded-full bg-warn inline-block"></span>Berisiko
          </div>
          <div class="flex items-center gap-2 text-xs text-ink-2">
            <span class="w-3 h-3 rounded-full inline-block" style="background:#14a896"></span>Normal
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Distribusi Cluster</div>
        <div class="card-sub">Perbandingan jumlah per cluster</div>
        <div class="relative h-[280px]">
          <canvas ref="donutRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Top risk table -->
    <div class="card">
      <div class="card-title">Siswa Prioritas Intervensi</div>
      <div class="card-sub">10 siswa dengan risk score tertinggi</div>
      <div class="overflow-x-auto">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nama</th><th>Kelas</th><th>Screen Time</th>
              <th>Konsentrasi</th><th>Risk Score</th><th>Cluster</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!topRisk.length">
              <td colspan="7" class="text-center text-ink-3 py-6">Jalankan clustering terlebih dahulu</td>
            </tr>
            <tr v-for="s in topRisk" :key="s.nama">
              <td class="td-name">{{ s.nama }}</td>
              <td>{{ s.kelas }}</td>
              <td :class="s.screen_time > 7 ? 'text-danger font-semibold' : s.screen_time > 4 ? 'text-warn' : ''">
                {{ s.screen_time }} jam
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="rbar">
                    <div class="rbar-fill" :style="{ width: s.fokus + '%', background: s.fokus < 40 ? '#c0392b' : s.fokus < 65 ? '#b5620a' : '#14a896' }"></div>
                  </div>
                  <span class="text-xs text-ink-3">{{ s.fokus }}%</span>
                </div>
              </td>
              <td>
                <RiskBar :value="s.risk" :cluster="s.cluster" />
              </td>
              <td><StudentBadge :cluster="s.cluster" /></td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="$emit('open-detail', s)">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import StudentBadge from './StudentBadge.vue'
import RiskBar from './RiskBar.vue'

const props = defineProps({ students: Array, stats: Object })
const emit = defineEmits(['run-clustering', 'open-detail'])

const scatterRef = ref(null)
const donutRef = ref(null)
let scatterChart = null
let donutChart = null

const topRisk = computed(() =>
  [...props.students].filter(s => s.cluster).sort((a, b) => (b.risk || 0) - (a.risk || 0)).slice(0, 10)
)

function buildScatter() {
  if (scatterChart) scatterChart.destroy()
  const colors = { Kritis: '#c0392b', Berisiko: '#b5620a', Normal: '#14a896' }
  const datasets = ['Kritis', 'Berisiko', 'Normal'].map(cl => ({
    label: cl,
    data: props.students.filter(s => s.cluster === cl).map(s => ({
      x: s.screen_time, y: s.fokus, r: 7, student: s,
    })),
    backgroundColor: colors[cl] + 'bb',
    borderColor: colors[cl],
    borderWidth: 1.5,
  }))
  scatterChart = new Chart(scatterRef.value, {
    type: 'bubble', data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.raw.student ? `${ctx.raw.student.nama} — ${ctx.raw.x}j/hr, fokus:${ctx.raw.y}%` : '' } },
      },
      onClick: (e, els) => {
        if (els.length) emit('open-detail', datasets[els[0].datasetIndex].data[els[0].index].student)
      },
      scales: {
        x: { title: { display: true, text: 'Screen Time (jam/hari)', color: '#9a9691', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#9a9691', font: { size: 10 } }, min: 0, max: 13 },
        y: { title: { display: true, text: 'Skor Konsentrasi (%)', color: '#9a9691', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#9a9691', font: { size: 10 } }, min: 0, max: 100 },
      },
    },
  })
}

function buildDonut() {
  if (donutChart) donutChart.destroy()
  donutChart = new Chart(donutRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Kritis', 'Berisiko', 'Normal', 'Belum Dianalisis'],
      datasets: [{
        data: [props.stats.kritis, props.stats.berisiko, props.stats.normal,
               props.students.filter(s => !s.cluster).length],
        backgroundColor: ['#c0392b', '#b5620a', '#0f7b6c', '#c8c5bf'],
        borderWidth: 0, borderRadius: 4, spacing: 3,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#4a4844', padding: 12, boxWidth: 10, boxHeight: 10 } } },
    },
  })
}

watch(() => props.students, async () => {
  await nextTick()
  buildScatter()
  buildDonut()
}, { deep: true })

onMounted(() => { buildScatter(); buildDonut() })
</script>
