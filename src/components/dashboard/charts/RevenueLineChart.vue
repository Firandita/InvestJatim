<template>
  <div class="relative h-48 md:h-56">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const labels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']

const chartData = computed(() => ({
  labels: labels.slice(0, props.data.length),
  datasets: [{
    label: 'Omzet (Juta Rp)',
    data: props.data,
    borderColor: '#185FA5',
    backgroundColor: 'rgba(24,95,165,0.08)',
    borderWidth: 2.5,
    pointBackgroundColor: '#185FA5',
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true,
    tension: 0.4,
  }],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => ' Rp ' + ctx.parsed.y.toLocaleString('id') + ' Jt',
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: 'rgba(0,0,0,.05)' },
      ticks: {
        font: { size: 11 },
        callback: v => 'Rp ' + v + ' Jt',
      },
    },
  },
}
</script>