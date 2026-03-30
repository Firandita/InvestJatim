<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-syne text-xl md:text-2xl font-extrabold text-ink">Overview</h1>
        <p class="text-xs md:text-sm text-ink-3 mt-0.5">Ringkasan kondisi seluruh siswa yang terdaftar</p>
      </div>
      <button class="btn btn-primary w-full sm:w-auto text-sm" @click="$emit('run-clustering')">
        ⚙ Jalankan Clustering
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div class="stat-card stat-card-total p-4">
        <div class="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-1">Total Siswa</div>
        <div class="font-syne text-2xl md:text-4xl font-extrabold text-ink leading-none">{{ stats.total }}</div>
        <div class="text-[10px] md:text-xs text-ink-3 mt-1.5">siswa terdaftar</div>
      </div>
      <div class="stat-card stat-card-kritis p-4">
        <div class="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-1">Kritis</div>
        <div class="font-syne text-2xl md:text-4xl font-extrabold text-danger leading-none">{{ stats.kritis }}</div>
        <div class="text-[10px] md:text-xs text-ink-3 mt-1.5">perlu intervensi</div>
      </div>
      <div class="stat-card stat-card-berisiko p-4">
        <div class="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-1">Berisiko</div>
        <div class="font-syne text-2xl md:text-4xl font-extrabold text-warn leading-none">{{ stats.berisiko }}</div>
        <div class="text-[10px] md:text-xs text-ink-3 mt-1.5">perlu dipantau</div>
      </div>
      <div class="stat-card stat-card-normal p-4">
        <div class="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-1">Normal</div>
        <div class="font-syne text-2xl md:text-4xl font-extrabold text-teal leading-none">{{ stats.normal }}</div>
        <div class="text-[10px] md:text-xs text-ink-3 mt-1.5">kondisi baik</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
      <div class="card p-4 md:p-5">
        <div class="card-title text-base md:text-lg">Screen Time vs Skor Konsentrasi</div>
        <div class="card-sub text-xs">Scatter plot per siswa · klik titik untuk detail</div>
        <div class="relative h-[250px] md:h-[300px]">
          <canvas ref="scatterRef"></canvas>
        </div>
        <div class="flex gap-3 mt-3 flex-wrap">
          <div class="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-2">
            <span class="w-2.5 h-2.5 rounded-full bg-danger inline-block"></span>Kritis
          </div>
          <div class="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-2">
            <span class="w-2.5 h-2.5 rounded-full bg-warn inline-block"></span>Berisiko
          </div>
          <div class="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-2">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#14a896"></span>Normal
          </div>
        </div>
      </div>
      <div class="card p-4 md:p-5">
        <div class="card-title text-base md:text-lg">Distribusi Cluster</div>
        <div class="card-sub text-xs">Perbandingan jumlah per cluster</div>
        <div class="relative h-[250px] md:h-[300px]">
          <canvas ref="donutRef"></canvas>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="p-4 md:p-5 pb-0">
        <div class="card-title text-base md:text-lg">Siswa Prioritas Intervensi</div>
        <div class="card-sub text-xs">10 siswa dengan risk score tertinggi</div>
      </div>
      <div class="overflow-x-auto w-full mt-4">
        <table class="tbl w-full min-w-[800px]"> <thead>
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