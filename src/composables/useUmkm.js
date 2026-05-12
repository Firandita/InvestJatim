import { ref, computed } from 'vue'
import { umkmMock, getUmkmById } from '@/data/umkm.mock'
import { calculateReadinessScore, getReadinessStatus } from '@/utils/readiness'

// State global internal agar modifikasi data tetap persisten selama aplikasi berjalan
const daftarUmkm = ref([...umkmMock])
const umkmAktifId = ref("umkm-01") // Simulasi ID UMKM yang sedang login saat ini

export function useUmkm() {
  
  // Mengambil data lengkap objek UMKM yang sedang login saat ini
  const umkmSaya = computed(() => {
    return daftarUmkm.value.find(u => u.id === umkmAktifId.value) || null
  })

  // Menghitung Investment Readiness Score UMKM aktif secara reaktif
  const skorKesiapanInves = computed(() => {
    if (!umkmSaya.value) return 0
    return calculateReadinessScore(umkmSaya.value)
  })

  // Mendapatkan label teks dan kelas warna Tailwind berdasarkan skor
  const statusKesiapanInves = computed(() => {
    return getReadinessStatus(skorKesiapanInves.value)
  })

  /**
   * Memperbarui profil dasar UMKM (digunakan di ProfileBuilderView.vue)
   * @param {Object} dataBaru 
   */
  const updateProfilSaya = (dataBaru) => {
    const indeks = daftarUmkm.value.findIndex(u => u.id === umkmAktifId.value)
    if (indeks !== -1) {
      daftarUmkm.value[indeks] = {
        ...daftarUmkm.value[indeks],
        ...dataBaru,
        updatedAt: new Date().toISOString().split('T')[0]
      }
    }
  }

  /**
   * Memperbarui data laporan keuangan UMKM (digunakan di FinancialDataView.vue)
   * @param {Object} dataKeuangan - { omzet, laba, kebutuhanModal, alokasiModal }
   */
  const updateKeuanganSaya = (dataKeuangan) => {
    const indeks = daftarUmkm.value.findIndex(u => u.id === umkmAktifId.value)
    if (indeks !== -1) {
      daftarUmkm.value[indeks].omzet = Number(dataKeuangan.omzet)
      daftarUmkm.value[indeks].laba = Number(dataKeuangan.laba)
      daftarUmkm.value[indeks].kebutuhanModal = Number(dataKeuangan.kebutuhanModal)
      daftarUmkm.value[indeks].alokasiModal = dataKeuangan.alokasiModal
      daftarUmkm.value[indeks].updatedAt = new Date().toISOString().split('T')[0]
    }
  }

  /**
   * Mencari detail UMKM lain berdasarkan ID (untuk kebutuhan panel Investor/Mentor)
   * @param {String} id 
   */
  const cariUmkmBerdasarkanId = (id) => {
    return computed(() => daftarUmkm.value.find(u => u.id === id) || null)
  }

  return {
    daftarUmkm,
    umkmSaya,
    skorKesiapanInves,
    statusKesiapanInves,
    updateProfilSaya,
    updateKeuanganSaya,
    cariUmkmBerdasarkanId
  }
}