import { createRouter, createWebHistory } from 'vue-router'
import DashboardGuru from '../views/DashboardGuru.vue'
import StudentApp from '../views/StudentApp.vue'

const routes = [
  { path: '/', component: DashboardGuru },
  { path: '/siswa', component: StudentApp }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router