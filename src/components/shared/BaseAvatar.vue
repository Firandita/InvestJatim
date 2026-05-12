<template>
  <div
    :class="[sizeClass, 'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0']"
    :style="{ background: color }"
  >
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: 'U' },
  size: { type: String, default: 'md' }, // sm | md | lg
})

const colors = ['#185FA5','#1D9E75','#EF9F27','#E24B4A','#378ADD','#0C447C']
const color  = computed(() => {
  const i = props.name.charCodeAt(0) % colors.length
  return colors[i]
})
const initials = computed(() =>
  props.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)
const sizeClass = computed(() => ({
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}[props.size] || 'w-10 h-10 text-sm'))
</script>