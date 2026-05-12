<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">

    <!-- Sidebar desktop -->
    <Sidebar class="hidden lg:flex" />

    <!-- Overlay backdrop mobile -->
    <transition name="fade">
      <div
        v-if="ui.isMobileMenuOpen"
        class="fixed inset-0 bg-black/40 z-30 lg:hidden"
        @click="ui.closeMobileMenu()"
      />
    </transition>

    <!-- Sidebar mobile drawer -->
    <transition name="slide-left">
      <SidebarMobile v-if="ui.isMobileMenuOpen" />
    </transition>

    <!-- Konten utama -->
    <div class="flex flex-col flex-1 overflow-hidden min-w-0">
      <TopBar />
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useUiStore } from '../../../stores/ui.store.js'
import Sidebar       from './Sidebar.vue'
import SidebarMobile from './SidebarMobile.vue'
import TopBar        from './TopBar.vue'

const ui = useUiStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform .25s ease; }
.slide-left-enter-from, .slide-left-leave-to       { transform: translateX(-100%); }
</style>