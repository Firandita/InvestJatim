<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center">
      <span class="material-icons xl text-warning-500 mb-4 block" style="font-size:64px">lock</span>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
      <p class="text-gray-400 mb-6">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
      <RouterLink to="/login" class="btn-primary">Kembali ke Login</RouterLink>
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>