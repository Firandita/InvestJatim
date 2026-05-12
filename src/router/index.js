import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // ── PUBLIC PORTAL ──────────────────────────
    {
      path: '/',
      name: 'home',
      component: () => import('../views/portal/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/portal/LoginView.vue'),
    },
    {
      path: '/daftar',
      name: 'register',
      component: () => import('../views/portal/RegisterView.vue'),
    },
    {
      path: '/direktori',
      name: 'directory',
      component: () => import('../views/portal/DirectoryView.vue'),
    },
    {
      path: '/umkm/:id',
      name: 'umkm-detail',
      component: () => import('../views/portal/UmkmDetailView.vue'),
    },
    {
      path: '/tentang',
      name: 'about',
      component: () => import('../views/portal/AboutView.vue'),
    },

    // ── DASHBOARD (semua role) ──────────────────
    {
      path: '/dashboard',
      component: () => import('../components/dashboard/layout/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // UMKM
        { path: 'umkm',               name: 'umkm-overview',  component: () => import('../views/dashboard/umkm/UmkmOverviewView.vue'),    meta: { role: 'umkm' } },
        { path: 'umkm/profil',         name: 'umkm-profil',    component: () => import('../views/dashboard/umkm/ProfileBuilderView.vue'),  meta: { role: 'umkm' } },
        { path: 'umkm/keuangan',       name: 'umkm-keuangan',  component: () => import('../views/dashboard/umkm/FinancialDataView.vue'),   meta: { role: 'umkm' } },
        { path: 'umkm/media',          name: 'umkm-media',     component: () => import('../views/dashboard/umkm/MediaUploadView.vue'),     meta: { role: 'umkm' } },
        { path: 'umkm/legalitas',      name: 'umkm-legalitas', component: () => import('../views/dashboard/umkm/LegalityView.vue'),        meta: { role: 'umkm' } },
        { path: 'umkm/investor-masuk', name: 'umkm-inbox',     component: () => import('../views/dashboard/umkm/InvestorInboxView.vue'),   meta: { role: 'umkm' } },
        { path: 'umkm/preview',        name: 'umkm-preview',   component: () => import('../views/dashboard/umkm/PublicPreviewView.vue'),   meta: { role: 'umkm' } },

        // INVESTOR
        { path: 'investor',            name: 'inv-overview',   component: () => import('../views/dashboard/investor/InvestorOverviewView.vue'),   meta: { role: 'investor' } },
        { path: 'investor/direktori',  name: 'inv-directory',  component: () => import('../views/dashboard/investor/InvestorDirectoryView.vue'),  meta: { role: 'investor' } },
        { path: 'investor/umkm/:id',   name: 'inv-umkm-detail',component: () => import('../views/dashboard/investor/UmkmDashboardView.vue'),      meta: { role: 'investor' } },
        { path: 'investor/watchlist',  name: 'inv-watchlist',  component: () => import('../views/dashboard/investor/WatchlistView.vue'),          meta: { role: 'investor' } },
        { path: 'investor/riwayat',    name: 'inv-history',    component: () => import('../views/dashboard/investor/HistoryView.vue'),            meta: { role: 'investor' } },
        { path: 'investor/verifikasi', name: 'inv-verify',     component: () => import('../views/dashboard/investor/VerificationView.vue'),       meta: { role: 'investor' } },

        // ADMIN
        { path: 'admin',               name: 'admin-overview', component: () => import('../views/dashboard/admin/AdminOverviewView.vue'),          meta: { role: 'admin' } },
        { path: 'admin/verifikasi',    name: 'admin-verify',   component: () => import('../views/dashboard/admin/VerificationQueueView.vue'),      meta: { role: 'admin' } },
        { path: 'admin/pengguna',      name: 'admin-users',    component: () => import('../views/dashboard/admin/UserManagementView.vue'),         meta: { role: 'admin' } },
        { path: 'admin/aktivitas',     name: 'admin-activity', component: () => import('../views/dashboard/admin/PlatformActivityView.vue'),       meta: { role: 'admin' } },

        // PEMERINTAH
        { path: 'pemerintah',          name: 'gov-overview',   component: () => import('../views/dashboard/government/GovOverviewView.vue'),       meta: { role: 'pemerintah' } },
        { path: 'pemerintah/peta',     name: 'gov-heatmap',    component: () => import('../views/dashboard/government/HeatmapView.vue'),           meta: { role: 'pemerintah' } },
        { path: 'pemerintah/sektor',   name: 'gov-sector',     component: () => import('../views/dashboard/government/SectorAnalysisView.vue'),    meta: { role: 'pemerintah' } },
        { path: 'pemerintah/laporan',  name: 'gov-report',     component: () => import('../views/dashboard/government/ReportExportView.vue'),      meta: { role: 'pemerintah' } },

        // MENTOR
        { path: 'mentor',              name: 'mentor-overview',  component: () => import('../views/dashboard/mentor/MentorOverviewView.vue'),      meta: { role: 'mentor' } },
        { path: 'mentor/umkm/:id',     name: 'mentor-progress',  component: () => import('../views/dashboard/mentor/UmkmProgressView.vue'),        meta: { role: 'mentor' } },
        { path: 'mentor/feedback/:id', name: 'mentor-feedback',  component: () => import('../views/dashboard/mentor/FeedbackView.vue'),            meta: { role: 'mentor' } },
        { path: 'mentor/checklist/:id',name: 'mentor-checklist', component: () => import('../views/dashboard/mentor/ChecklistView.vue'),           meta: { role: 'mentor' } },
      ],
    },

    // ── UTILITY ────────────────────────────────
    { path: '/unauthorized', name: 'unauthorized', component: () => import('../views/utility/UnauthorizedView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/utility/NotFoundView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.restoreSession()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'unauthorized' }
  }
})


export default router