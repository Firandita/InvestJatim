<template>
  <div class="space-y-5">

    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold text-gray-800">Direktori UMKM Jawa Timur</h1>
      <p class="text-sm text-gray-400 mt-0.5">
        {{ filteredList.length }} UMKM ditemukan
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-5">

      <!-- Filter Sidebar -->
      <aside class="w-full lg:w-56 flex-shrink-0">
        <div class="bg-white border border-gray-100 rounded-xl p-4 space-y-5 lg:sticky lg:top-20">

          <h3 class="font-semibold text-gray-800 text-sm">Filter</h3>

          <!-- Search -->
          <div>
            <label class="text-xs text-gray-400 mb-1.5 block">Cari UMKM</label>
            <div class="relative">
              <span
                class="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"
                style="font-size:16px"
              >search</span>
              <input
                v-model="search"
                class="input-base pl-8 text-sm"
                placeholder="nama UMKM..."
              />
            </div>
          </div>

          <!-- Sektor -->
          <div>
            <label class="text-xs text-gray-400 mb-2 block">Sektor</label>
            <div class="space-y-1">
              <label
                v-for="s in sektorList"
                :key="s"
                class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer
                       hover:text-brand-600 transition-colors py-0.5"
              >
                <input
                  type="radio"
                  :value="s"
                  v-model="filterSektor"
                  class="accent-brand-600"
                />
                {{ s }}
              </label>
            </div>
          </div>

          <!-- Kota -->
          <div>
            <label class="text-xs text-gray-400 mb-1.5 block">Kota</label>
            <select v-model="filterKota" class="input-base text-sm">
              <option v-for="k in kotaList" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <!-- Min Score -->
          <div>
            <label class="text-xs text-gray-400 mb-1.5 block">
              Min Score: <strong class="text-gray-700">{{ filterScore }}</strong>
            </label>
            <input
              type="range"
              v-model.number="filterScore"
              min="0" max="100" step="10"
              class="w-full accent-brand-600"
            />
          </div>

          <!-- Reset -->
          <button @click="resetFilter" class="btn-ghost w-full justify-center text-xs py-2">
            <span class="material-symbols-rounded" style="font-size:16px">filter_alt_off</span>
            Reset
          </button>
        </div>
      </aside>

      <!-- UMKM Grid -->
      <div class="flex-1 min-w-0">

        <!-- Sort bar -->
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <button
            v-for="s in sortOptions"
            :key="s.value"
            @click="sortBy = s.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-lg border transition-all font-medium',
              sortBy === s.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-gray-200 text-gray-500 hover:border-brand-300 bg-white'
            ]"
          >{{ s.label }}</button>
        </div>

        <!-- Grid kartu -->
        <div
          v-if="filteredList.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <RouterLink
            v-for="umkm in filteredList"
            :key="umkm.id"
            :to="{ name: 'inv-umkm-detail', params: { id: umkm.id } }"
            class="block bg-white border border-gray-100 rounded-2xl overflow-hidden
                   hover:shadow-lg hover:border-brand-200 transition-all group cursor-pointer"
          >
            <!-- Warna bar atas -->
            <div :style="{ background: umkm.warna, height: '4px' }" />

            <div class="p-4">
              <!-- Header -->
              <div class="flex items-start gap-3 mb-3">
                <div
                  :style="{
                    width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                    background: umkm.warna, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '13px'
                  }"
                >{{ umkm.logo }}</div>

                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-gray-800 text-sm leading-tight truncate">
                    {{ umkm.nama }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-0.5">
                    <span class="material-symbols-rounded" style="font-size:12px">location_on</span>
                    {{ umkm.kota }}
                  </p>
                </div>

                <span :class="umkm.status === 'verified' ? 'badge-verified' : 'badge-pending'">
                  {{ umkm.status === 'verified' ? '✓' : '⏳' }}
                </span>
              </div>

              <!-- Readiness Score -->
              <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-400">Readiness Score</span>
                  <span
                    class="font-bold"
                    :style="{
                      color: umkm.readinessScore >= 80 ? '#6A994E' :
                             umkm.readinessScore >= 60 ? '#F4A261' : '#E76F51'
                    }"
                  >{{ umkm.readinessScore }}/100</span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    :style="{
                      width: umkm.readinessScore + '%',
                      background: umkm.readinessScore >= 80 ? '#6A994E' :
                                  umkm.readinessScore >= 60 ? '#F4A261' : '#E76F51',
                      height: '100%', borderRadius: '99px'
                    }"
                  />
                </div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-surface rounded-lg p-2 text-center">
                  <p class="text-xs text-gray-400">Omzet/Bln</p>
                  <p class="text-sm font-bold text-gray-800">{{ formatRp(umkm.omzet) }}</p>
                </div>
                <div class="bg-surface rounded-lg p-2 text-center">
                  <p class="text-xs text-gray-400">Butuh Modal</p>
                  <p class="text-sm font-bold text-gray-800">{{ formatRp(umkm.kebutuhanModal) }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <span class="badge-info">{{ umkm.sektor }}</span>
                <span class="text-xs text-brand-600 font-semibold group-hover:underline">
                  Lihat Dashboard →
                </span>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <span
            class="material-symbols-rounded block mb-3"
            style="font-size:56px; color:#D4EBBC"
          >search_off</span>
          <p class="font-semibold text-gray-500">Tidak ada UMKM yang cocok</p>
          <p class="text-sm text-gray-400 mt-1">Coba ubah atau reset filter</p>
          <button @click="resetFilter" class="btn-secondary mt-4">
            Reset Filter
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { umkmMock, sektorList, kotaList } from '../../../data/umkm.mock.js'

const search       = ref('')
const filterSektor = ref('Semua')
const filterKota   = ref('Semua')
const filterScore  = ref(0)
const sortBy       = ref('score')

const sortOptions = [
  { value: 'score', label: 'Readiness Score' },
  { value: 'omzet', label: 'Omzet Tertinggi' },
  { value: 'nama',  label: 'A–Z' },
]

const filteredList = computed(() => {
  let list = [...umkmMock]

  if (search.value.trim())
    list = list.filter(u =>
      u.nama.toLowerCase().includes(search.value.toLowerCase())
    )
  if (filterSektor.value !== 'Semua')
    list = list.filter(u => u.sektor === filterSektor.value)
  if (filterKota.value !== 'Semua')
    list = list.filter(u => u.kota === filterKota.value)

  list = list.filter(u => u.readinessScore >= filterScore.value)

  if (sortBy.value === 'score')
    list.sort((a, b) => b.readinessScore - a.readinessScore)
  else if (sortBy.value === 'omzet')
    list.sort((a, b) => b.omzet - a.omzet)
  else if (sortBy.value === 'nama')
    list.sort((a, b) => a.nama.localeCompare(b.nama))

  return list
})

function resetFilter() {
  search.value = ''
  filterSektor.value = 'Semua'
  filterKota.value   = 'Semua'
  filterScore.value  = 0
  sortBy.value       = 'score'
}

function formatRp(val) {
  if (!val) return '-'
  if (val >= 1e9) return 'Rp ' + (val / 1e9).toFixed(1) + ' M'
  if (val >= 1e6) return 'Rp ' + (val / 1e6).toFixed(0) + ' Jt'
  return 'Rp ' + val.toLocaleString('id-ID')
}
</script>