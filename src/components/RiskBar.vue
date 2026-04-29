<template>
  <div class="flex items-center gap-2">
    <div class="rbar">
      <div class="rbar-fill" :style="{ width: pct + '%', background: color }"></div>
    </div>
    <span class="text-xs" :style="{ color, fontWeight: 600 }">{{ value }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ value: Number, max: { default: 100 }, cluster: String })
const pct = computed(() => Math.min(100, (props.value / props.max) * 100))
const color = computed(() => {
  const c = (props.cluster || '').toLowerCase()
  return c === 'kritis' ? '#c0392b' : c === 'berisiko' ? '#b5620a' : '#0f7b6c'
})
</script>
