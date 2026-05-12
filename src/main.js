import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())  // ← pastikan ini ada
app.use(router)
app.mount('#app')