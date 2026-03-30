<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-syne text-xl md:text-2xl font-extrabold text-ink">Clustering K-Means</h1>
        <p class="text-xs md:text-sm text-ink-3 mt-0.5">Segmentasi otomatis siswa berdasarkan 5 indikator brain rot</p>
      </div>
      <button class="btn btn-primary w-full sm:w-auto text-sm" @click="$emit('run-clustering')">
        ⚙ Jalankan Ulang
      </button>
    </div>

    <div class="card p-4 md:p-5">
      <div class="card-title text-base md:text-lg">Visualisasi Cluster (2D Projection)</div>
      <div class="card-sub text-xs">Proyeksi PCA · warna = cluster · ukuran = risk score</div>
      <div class="relative h-[300px] md:h-[360px]">
        <canvas ref="clusterRef"></canvas>
      </div>
      <div class="flex gap-3 md:gap-5 mt-4 flex-wrap">
        <div class="flex items-center gap-2 text-[10px] md:text-xs text-ink-2">
          <span class="w-2.5 h-2.5 rounded-full bg-danger inline-block"></span>Kritis
        </div>
        <div class="flex items-center gap-2 text-[10px] md:text-xs text-ink-2">
          <span class="w-2.5 h-2.5 rounded-full bg-warn inline-block"></span>Berisiko
        </div>
        <div class="flex items-center gap-2 text-[10px] md:text-xs text-ink-2">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:#14a896"></span>Normal
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      <div class="card p-4 md:p-5">
        <div class="card-title text-base md:text-lg">Centroid Cluster</div>
        <div class="card-sub text-xs">Rata-rata nilai tiap cluster per indikator</div>
        <div class="relative h-[240px] md:h-[280px]">
          <canvas ref="radarRef"></canvas>
        </div>
      </div>

      <div class="card p-4 md:p-5">
        <div class="card-title text-base md:text-lg">Statistik Cluster</div>
        <div class="card-sub text-xs">Ringkasan karakteristik tiap cluster</div>
        
        <div v-if="!clusterGroups.length" class="text-sm text-ink-3 mt-4">
          Belum ada data cluster. Jalankan clustering dahulu.
        </div>
        
        <div v-for="(g, idx) in clusterGroups" :key="g.label"
          :class="['py-4', idx < clusterGroups.length - 1 ? 'border-b border-[#e0ddd6]' : '']">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-sm md:text-base" :style="{ color: g.color }">{{ g.label }}</span>
            <span class="text-[10px] md:text-xs text-ink-3 px-2 py-0.5 bg-slate-100 rounded-full">{{ g.count }} siswa</span>
          </div>
          
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] md:text-xs text-ink-2">
            <div class="flex flex-col">
              <span class="text-slate-400">Screen time</span>
              <b class="text-ink">{{ g.avgSt }} jam</b>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-400">Konsentrasi</span>
              <b class="text-ink">{{ g.avgFokus }}%</b>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-400">Kualitas tidur</span>
              <b class="text-ink">{{ g.avgTidur }}%</b>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-400">Mood</span>
              <b class="text-ink">{{ g.avgMood }}%</b>
            </div>
            <div class="flex flex-col col-span-2 mt-1 pt-1 border-t border-dashed border-slate-200">
              <span class="text-slate-400">Risk score rata-rata</span>
              <b class="text-ink text-sm">{{ g.avgRisk }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({ students: Array })
defineEmits(['run-clustering'])

const clusterRef = ref(null)
const radarRef = ref(null)
let clusterChart = null
let radarChart = null

function avg(arr, fn) { return arr.length ? Math.round(arr.reduce((s, x) => s + fn(x), 0) / arr.length) : 0 }

const clusterGroups = computed(() => {
  const COLOR = { Kritis: '#c0392b', Berisiko: '#b5620a', Normal: '#0f7b6c' }
  return ['Kritis', 'Berisiko', 'Normal'].map(label => {
    const g = props.students.filter(s => s.cluster === label)
    return g.length ? {
      label, color: COLOR[label], count: g.length,
      avgSt: avg(g, s => s.screen_time),
      avgFokus: avg(g, s => s.fokus),
      avgTidur: avg(g, s => s.tidur),
      avgMood: avg(g, s => s.mood),
      avgRisk: avg(g, s => s.risk || 0),
    } : null
  }).filter(Boolean)
})

function buildCluster() {
  if (clusterChart) clusterChart.destroy()
  const colors = { Kritis: 'rgba(192,57,43,0.75)', Berisiko: 'rgba(181,98,10,0.75)', Normal: 'rgba(14,123,108,0.75)' }
  const borders = { Kritis: '#c0392b', Berisiko: '#b5620a', Normal: '#0f7b6c' }
  const datasets = ['Kritis', 'Berisiko', 'Normal'].map(cl => ({
    label: cl,
    data: props.students.filter(s => s.cluster === cl).map(s => ({
      x: s.screen_time + (Math.random() - .5) * .3,
      y: (100 - s.fokus) / 100 * 10 + (Math.random() - .5) * .3,
      r: Math.max(5, (s.risk || 50) / 12),
      student: s,
    })),
    backgroundColor: colors[cl], borderColor: borders[cl], borderWidth: 1.5,
  }))
  clusterChart = new Chart(clusterRef.value, {
    type: 'bubble', data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.raw.student ? `${ctx.raw.student.nama} · ${ctx.raw.student.cluster} · risk:${ctx.raw.student.risk}` : '' } },
      },
      scales: {
        x: { title: { display: true, text: 'PC1 (Screen Time)', color: '#9a9691', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#9a9691', font: { size: 10 } } },
        y: { title: { display: true, text: 'PC2 (Cognitive Load)', color: '#9a9691', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#9a9691', font: { size: 10 } } },
      },
    },
  })
}

function buildRadar() {
  if (radarChart) radarChart.destroy()
  const COLORS = { Kritis: 'rgba(192,57,43,0.15)', Berisiko: 'rgba(181,98,10,0.15)', Normal: 'rgba(14,123,108,0.15)' }
  const BORDERS = { Kritis: '#c0392b', Berisiko: '#b5620a', Normal: '#0f7b6c' }
  const datasets = ['Kritis', 'Berisiko', 'Normal'].map(cl => {
    const g = props.students.filter(s => s.cluster === cl)
    return {
      label: cl,
      data: [avg(g, s => s.screen_time / 12 * 100), avg(g, s => 100 - s.fokus), avg(g, s => 100 - s.tidur), avg(g, s => 100 - s.mood), avg(g, s => 100 - s.prestasi)],
      backgroundColor: COLORS[cl], borderColor: BORDERS[cl], borderWidth: 2, pointRadius: 3,
    }
  })
  radarChart = new Chart(radarRef.value, {
    type: 'radar',
    data: { labels: ['Screen Time', '↓ Konsentrasi', '↓ Tidur', '↓ Mood', '↓ Prestasi'], datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 11 }, color: '#4a4844', boxWidth: 10 } } },
      scales: { r: { ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.07)' }, pointLabels: { color: '#4a4844', font: { size: 11 } }, min: 0, max: 100 } },
    },
  })
}

watch(() => props.students, async () => { await nextTick(); buildCluster(); buildRadar() }, { deep: true })
onMounted(() => { buildCluster(); buildRadar() })
</script>