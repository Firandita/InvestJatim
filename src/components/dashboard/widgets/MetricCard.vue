<template>
  <div class="card flex items-start gap-3">
    <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBg]">
      <span class="material-icons text-white" style="font-size:20px">{{ icon }}</span>
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-xs text-gray-400 mb-0.5">{{ label }}</p>
      <p class="text-lg font-bold text-gray-800 leading-tight truncate">{{ value }}</p>
      <div v-if="trendValue" class="flex items-center gap-1 mt-0.5">
        <span :class="['material-icons', trend === 'up' ? 'text-success-500' : 'text-danger-500']" style="font-size:14px">
          {{ trend === 'up' ? 'arrow_upward' : 'arrow_downward' }}
        </span>
        <span :class="['text-xs font-medium', trend === 'up' ? 'text-success-500' : 'text-danger-500']">{{ trendValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  icon:       { type: String, default: 'analytics' },
  label:      { type: String, required: true },
  value:      { type: String, required: true },
  trend:      { type: String, default: null },
  trendValue: { type: String, default: null },
  color:      { type: String, default: 'blue' },
})
const iconBg = computed(() => ({
  blue:  'bg-brand-600',
  green: 'bg-success-500',
  amber: 'bg-warning-500',
  red:   'bg-danger-500',
}[props.color] || 'bg-brand-600'))
</script>