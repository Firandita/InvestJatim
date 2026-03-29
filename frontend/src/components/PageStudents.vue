<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-syne text-2xl font-extrabold text-ink">Daftar Siswa</h1>
        <p class="text-sm text-ink-3 mt-0.5">Seluruh siswa terdaftar beserta status cluster</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <select v-model="filterKelas" class="btn btn-secondary text-sm" style="font-family:'Epilogue',sans-serif;">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelasOptions" :key="k">{{ k }}</option>
        </select>
        <select v-model="filterCluster" class="btn btn-secondary text-sm" style="font-family:'Epilogue',sans-serif;">
          <option value="">Semua Cluster</option>
          <option>Kritis</option>
          <option>Berisiko</option>
          <option>Normal</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nama</th><th>Kelas</th><th>Screen Time</th>
              <th>Konsentrasi</th><th>Tidur</th><th>Mood</th><th>Prestasi</th>
              <th>Risk Score</th><th>Cluster</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filtered.length">
              <td colspan="10">
                <div class="text-center py-12 text-ink-3">
                  <div class="text-4xl mb-3">👥</div>
                  <div class="font-semibold text-ink-2 mb-1">Belum ada data siswa</div>
                  <div class="text-sm">Tambah siswa via form atau upload CSV/Excel</div>
                </div>
              </td>
            </tr>
            <tr v-for="s in filtered" :key="s.nama">
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
              <td class="text-ink-3 text-xs">{{ s.tidur }}%</td>
              <td class="text-ink-3 text-xs">{{ s.mood }}%</td>
              <td class="text-ink-3 text-xs">{{ s.prestasi }}%</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="rbar">
                    <div class="rbar-fill" :style="{ width: Math.min(100, s.risk) + '%', background: clusterColor(s.cluster) }"></div>
                  </div>
                  <span class="text-xs font-semibold" :style="{ color: clusterColor(s.cluster) }">{{ s.risk }}</span>
                </div>
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
import { ref, computed } from 'vue'
import StudentBadge from './StudentBadge.vue'

const props = defineProps({ students: Array, kelasOptions: Array })
defineEmits(['open-detail'])

const filterKelas = ref('')
const filterCluster = ref('')

const filtered = computed(() => {
  let d = [...props.students]
  if (filterKelas.value) d = d.filter(s => s.kelas === filterKelas.value)
  if (filterCluster.value) d = d.filter(s => s.cluster === filterCluster.value)
  return d.sort((a, b) => (b.risk || 0) - (a.risk || 0))
})

function clusterColor(cl) {
  return cl === 'Kritis' ? '#c0392b' : cl === 'Berisiko' ? '#b5620a' : '#0f7b6c'
}
</script>
