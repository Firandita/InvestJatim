<template>
  <span v-if="cluster" :class="['badge', `badge-${cluster.toLowerCase()}`]">{{ cluster }}</span>
  <span v-else class="text-xs text-ink-3">—</span>
</template>

<script setup>
defineProps({ cluster: String })
</script>
