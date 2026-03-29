<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      @click="$emit('close-sidebar')" 
      class="fixed inset-0 bg-black/20 z-[55] lg:hidden backdrop-blur-sm"
    ></div>
  </Transition>

  <aside 
    :class="[
      'bg-white border-r border-[#e0ddd6] px-3 py-5 flex flex-col gap-0.5 z-[60] transition-all duration-300 ease-in-out overflow-y-auto',
      // Mobile: Melayang & bisa geser | Desktop: Tetap di tempat
      'fixed lg:sticky top-0 lg:top-0 h-full lg:h-[calc(100vh-56px)] w-[260px] lg:w-[220px]',
      isOpen ? 'left-0 shadow-2xl lg:shadow-none' : '-left-[260px] lg:left-0'
    ]"
  >
    <div class="flex items-center justify-between px-2.5 mb-6 lg:hidden">
      <span class="font-bold text-[#14a896]">Menu Navigasi</span>
      <button @click="$emit('close-sidebar')" class="text-2xl text-ink-3">&times;</button>
    </div>

    <div class="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-2.5 pt-2 pb-1.5">Pemantauan</div>

    <button :class="['sb-item', activePage === 'overview' && 'active']" @click="nav('overview')">
      <span class="w-5 text-center">📊</span> Overview
    </button>
    <button :class="['sb-item', activePage === 'clustering' && 'active']" @click="nav('clustering')">
      <span class="w-5 text-center">🔵</span> Clustering K-Means
    </button>
    <button :class="['sb-item', activePage === 'alerts' && 'active']" @click="nav('alerts')">
      <span class="w-5 text-center">🔔</span> Alert EWS
      <span v-if="alertCount > 0" class="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {{ alertCount }}
      </span>
    </button>

    <div class="text-[10px] font-bold tracking-widest uppercase text-slate-400 px-2.5 pt-4 pb-1.5">Data</div>

    <button :class="['sb-item', activePage === 'students' && 'active']" @click="nav('students')">
      <span class="w-5 text-center">👥</span> Daftar Siswa
    </button>
    <button :class="['sb-item', activePage === 'input' && 'active']" @click="nav('input')">
      <span class="w-5 text-center">➕</span> Input Siswa
    </button>
    <button :class="['sb-item', activePage === 'upload' && 'active']" @click="nav('upload')">
      <span class="w-5 text-center">📁</span> Upload CSV/Excel
    </button>
  </aside>
</template>

<script setup>
const props = defineProps({ activePage: String, alertCount: Number, isOpen: Boolean })
const emit = defineEmits(['navigate', 'close-sidebar'])

const nav = (page) => {
  emit('navigate', page)
  emit('close-sidebar') // Otomatis tutup sidebar di HP setelah pilih menu
}
</script>

<style scoped>
.sb-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors;
}
.sb-item.active {
  @apply bg-[#14a896]/10 text-[#14a896] font-bold;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>