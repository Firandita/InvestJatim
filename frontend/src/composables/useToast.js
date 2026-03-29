import { ref } from 'vue'

const msg = ref('')
const visible = ref(false)
const isWarn = ref(false)
let timer = null

export function useToast() {
  function toast(message, type = 'ok') {
    msg.value = message
    isWarn.value = type === 'warn'
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 3000)
  }
  return { msg, visible, isWarn, toast }
}
