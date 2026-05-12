<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold text-gray-800">Dashboard Mentor</h1>
      <p class="text-sm text-gray-400 mt-0.5">Pantau perkembangan UMKM binaan kamu</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-brand-600" style="font-size:18px">groups</span>
          <p class="text-xs text-gray-400">Total Binaan</p>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ umkmList.length }}</p>
        <p class="text-xs text-gray-400 mt-1">UMKM aktif</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-green-500" style="font-size:18px">trending_up</span>
          <p class="text-xs text-gray-400">Skor Rata-rata</p>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ avgScore }}</p>
        <p class="text-xs text-gray-400 mt-1">dari 100</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-amber-500" style="font-size:18px">rate_review</span>
          <p class="text-xs text-gray-400">Feedback Diberikan</p>
        </div>
        <p class="text-2xl font-bold text-gray-800">7</p>
        <p class="text-xs text-gray-400 mt-1">bulan ini</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-blue-400" style="font-size:18px">verified</span>
          <p class="text-xs text-gray-400">Legalitas Lengkap</p>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ legalComplete }}</p>
        <p class="text-xs text-gray-400 mt-1">dari {{ umkmList.length }} UMKM</p>
      </div>
    </div>

    <!-- UMKM Binaan List -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-700">UMKM Binaan</h2>
        <span class="text-xs text-gray-400">{{ umkmList.length }} UMKM</span>
      </div>

      <div class="space-y-3">
        <div
          v-for="umkm in umkmList"
          :key="umkm.id"
          class="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition"
          @click="$router.push({ name: 'mentor-progress', params: { id: umkm.id } })"
        >
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            :style="{ backgroundColor: umkm.warna }"
          >
            {{ umkm.logo }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <!-- ✅ Fix: pakai umkm.nama bukan umkm.namaUmkm -->
              <p class="text-sm font-medium text-gray-800 truncate">{{ umkm.nama }}</p>
              <span
                class="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                :class="sektorClass(umkm.sektor)"
              >
                {{ umkm.sektor }}
              </span>
            </div>
            <!-- ✅ Fix: pakai umkm.kota (mock tidak punya pemilik) -->
            <p class="text-xs text-gray-400 mt-0.5">{{ umkm.kota }} · {{ umkm.jumlahKaryawan }} karyawan</p>
          </div>

          <!-- Skor -->
          <div class="text-right flex-shrink-0">
            <p class="text-lg font-bold" :class="scoreColor(umkm.readinessScore)">
              {{ umkm.readinessScore }}
            </p>
            <p class="text-xs text-gray-400">skor</p>
          </div>

          <!-- Progress ring -->
          <div class="flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="none" stroke="#F3F4F6" stroke-width="5"/>
              <circle cx="20" cy="20" r="15" fill="none"
                :stroke="umkm.readinessScore >= 70 ? '#1D9E75' : umkm.readinessScore >= 40 ? '#EF9F27' : '#E24B4A'"
                stroke-width="5" stroke-linecap="round"
                :stroke-dasharray="`${umkm.readinessScore * 0.942} 94.2`"
                stroke-dashoffset="23.6"
              />
            </svg>
          </div>

          <span class="material-symbols-rounded text-gray-300" style="font-size:18px">chevron_right</span>
        </div>
      </div>
    </div>

    <!-- Catatan Terbaru -->
    <div class="card p-5">
      <h2 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="material-symbols-rounded text-brand-600" style="font-size:18px">sticky_note_2</span>
        Catatan Mentor Terbaru
      </h2>
      <div class="space-y-3">
        <!-- ✅ Filter hanya yang punya mentorNotes -->
        <template v-for="umkm in umkmList" :key="umkm.id + '-note'">
          <div v-if="umkm.mentorNotes" class="flex gap-3 p-3 bg-gray-50 rounded-xl">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              :style="{ backgroundColor: umkm.warna }"
            >
              {{ umkm.logo }}
            </div>
            <div>
              <!-- ✅ Fix: pakai umkm.nama -->
              <p class="text-xs font-medium text-gray-700">{{ umkm.nama }}</p>
              <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ umkm.mentorNotes }}</p>
              <!-- ✅ Fix: mock tidak punya updatedAt, pakai kota saja -->
              <p class="text-xs text-gray-400 mt-1">{{ umkm.kota }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { umkmMock } from '../../../data/umkm.mock.js'

const umkmList = umkmMock

const avgScore = computed(() => {
  const total = umkmList.reduce((s, u) => s + u.readinessScore, 0)
  return Math.round(total / umkmList.length)
})

const legalComplete = computed(() =>
  umkmList.filter(u => u.isLegalitasVerified).length
)

function scoreColor(score) {
  if (score >= 70) return 'text-green-500'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
}

function sektorClass(sektor) {
  const map = {
    Kuliner:   'bg-orange-50 text-orange-700',
    Fashion:   'bg-pink-50 text-pink-700',
    Kerajinan: 'bg-purple-50 text-purple-700',
    Pertanian: 'bg-green-50 text-green-700',
  }
  return map[sektor] || 'bg-gray-100 text-gray-600'
}
</script>