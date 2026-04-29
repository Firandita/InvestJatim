import { createApp } from 'vue'
import '../style.css'
import App from './App.vue' // Kita pakai nama 'App' saja biar aman
import router from './router' 

const app = createApp(App) 
app.use(router)
app.mount('#app')