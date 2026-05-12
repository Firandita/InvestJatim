<template>
  <div class="relative h-36 flex items-center justify-center">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Object, default: () => ({ b2c: 60, b2b: 30, ekspor: 10 }) },
})

const chartData = computed(() => ({
  labels: ['B2C (Retail)', 'B2B (Korporat)', 'Ekspor'],
  datasets: [{
    data: [props.data.b2c, props.data.b2b, props.data.ekspor],
    backgroundColor: ['#185FA5', '#1D9E75', '#EF9F27'],
    borderWidth: 0,
    hoverOffset: 4,
  }],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' } },
  },
}
</script>