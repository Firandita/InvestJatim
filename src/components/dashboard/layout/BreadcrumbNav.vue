<template>
  <nav
    v-if="breadcrumbs.length > 1"
    aria-label="Breadcrumb"
    class="flex items-center gap-1 text-xs text-gray-400 mb-1"
  >
    <template v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
      <!-- Separator -->
      <span v-if="i > 0" class="material-symbols-rounded text-[14px] text-gray-300">
        chevron_right
      </span>

      <!-- Link (kecuali item terakhir) -->
      <RouterLink
        v-if="i < breadcrumbs.length - 1"
        :to="crumb.path"
        class="hover:text-brand-600 transition-colors"
      >
        {{ crumb.label }}
      </RouterLink>

      <!-- Item aktif (terakhir) -->
      <span v-else class="font-semibold text-gray-700">
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/**
 * Membangun breadcrumb dari matched routes.
 * Setiap route perlu punya: meta.breadcrumb = 'Nama Label'
 *
 * Contoh di router:
 *   {
 *     path: '/dashboard/umkm/keuangan',
 *     name: 'umkm-keuangan',
 *     meta: { title: 'Data Keuangan', breadcrumb: 'Data Keuangan' },
 *     component: ...
 *   }
 */
const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Dashboard', path: '/dashboard' }]

  for (const matched of route.matched) {
    const label = matched.meta?.breadcrumb ?? matched.meta?.title
    if (label && matched.path !== '/dashboard') {
      crumbs.push({ label, path: matched.path })
    }
  }

  return crumbs
})
</script>