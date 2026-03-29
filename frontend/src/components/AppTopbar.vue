<template>
  <header class="flex items-center justify-between px-4 md:px-7 h-14 bg-white border-b border-[#e0ddd6] sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <button 
        @click="$emit('toggle-sidebar')" 
        class="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-ink-3 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div class="font-syne text-[17px] font-extrabold text-ink tracking-tight whitespace-nowrap">
        AQL<span class="text-[#14a896]">-Metrics</span>
      </div>
      
      <div class="hidden md:block text-xs text-ink-3 ml-4 pl-4 border-l border-[#e0ddd6] whitespace-nowrap">
        SMA Al-Islam Krian · Guru BK
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden sm:block text-xs text-ink-3 tabular-nums">{{ clock }}</div>
      <div class="flex items-center gap-1.5 bg-teal-bg text-teal text-xs font-semibold px-3 py-1.5 rounded-full border border-[#14a896]/10">
        <span class="relative flex h-1.5 w-1.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14a896] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#14a896]"></span>
        </span>
        <span class="hidden xs:inline">Sistem Aktif</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
defineEmits(['toggle-sidebar']) // Penting: Mengirim sinyal klik ke luar

const clock = ref('')
let timer = null
function tick() {
  const n = new Date()
  clock.value =
    n.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + n.toLocaleTimeString('id-ID')
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
</script> 