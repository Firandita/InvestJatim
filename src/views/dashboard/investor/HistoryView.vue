<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-800">Riwayat Kunjungan</h1>
      <p class="text-sm text-gray-400 mt-0.5">UMKM yang pernah Anda lihat dashboardnya</p>
    </div>
    <div class="card divide-y divide-gray-100">
      <RouterLink
        v-for="item in history"
        :key="item.id"
        :to="'/dashboard/investor/umkm/' + item.id"
        class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
      >
        <div :style="{
          width:'44px', height:'44px', borderRadius:'10px', flexShrink:0,
          background: item.warna, color:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:800, fontSize:'13px'
        }">{{ item.logo }}</div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 text-sm">{{ item.nama }}</p>
          <p class="text-xs text-gray-400">{{ item.kota }} · {{ item.sektor }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-xs text-gray-400">{{ item.waktu }}</p>
          <span :class="item.status === 'verified' ? 'badge-verified' : 'badge-pending'" class="mt-1">
            {{ item.status === 'verified' ? 'Verified' : 'Pending' }}
          </span>
        </div>
        <span class="material-symbols-rounded text-gray-300" style="font-size:18px">chevron_right</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { umkmMock } from '../../../data/umkm.mock.js'
const history = [
  { ...umkmMock[0], waktu: '30 menit lalu' },
  { ...umkmMock[2], waktu: '2 jam lalu' },
  { ...umkmMock[1], waktu: '1 hari lalu' },
  { ...umkmMock[3], waktu: '2 hari lalu' },
  { ...umkmMock[4], waktu: '3 hari lalu' },
]
</script>