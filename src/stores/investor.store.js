import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { investorMock } from '@/data/investor.mock'

export const useInvestorStore = defineStore('investor', () => {
  // State Utama
  const listInvestor = ref([...investorMock])
  const activeInvestorId = ref('inv-01') // Simulasi ID investor yang sedang login/aktif mengoperasikan sistem
  const watchlist = ref(['umkm-01']) // State lokal untuk menyimpan ID UMKM yang difavoritkan investor aktif

  // Getters Reaktif

  // Mengambil profile data investor yang sedang login saat ini
  const myInvestorProfile = computed(() => {
    return listInvestor.value.find(inv => inv.id === activeInvestorId.value) || null
  })

  // Mengambil riwayat pengajuan penawaran minat yang dilakukan oleh investor aktif
  const myInvestmentProposals = computed(() => {
    return myInvestorProfile.value ? myInvestorProfile.value.riwayatMinat : []
  })

  /**
   * Menghasilkan daftar kotak masuk (inbox minat) untuk UMKM tertentu yang sedang login
   * Mengumpulkan penawaran dari seluruh objek investor yang ada di sistem
   * @param {String} umkmId
   * @returns {Array} List penawaran masuk ter-mapping rapi
   */
  const getInboxForUmkm = (umkmId) => {
    const proposals = []
    
    listInvestor.value.forEach(investor => {
      const minat = investor.riwayatMinat.find(r => r.umkmId === umkmId)
      if (minat) {
        proposals.push({
          investorId: investor.id,
          namaInvestor: investor.nama,
          tipeInvestor: investor.tipe,
          asalKota: investor.asalKota,
          isVerified: investor.isKtpVerified,
          tanggal: minat.tanggalAjuan,
          status: minat.status,
          pesan: minat.catatanPesan
        })
      }
    })
    
    return proposals
  }

  // Actions (Fungsi Pengubah State)

  /**
   * Mengajukan minat investasi baru ke UMKM tertentu
   * @param {String} umkmId - ID UMKM sasaran
   * @param {String} proposalMessage - Catatan atau pesan awal ajakan diskusi
   */
  const submitInvestmentInterest = async (umkmId, proposalMessage) => {
    const index = listInvestor.value.findIndex(inv => inv.id === activeInvestorId.value)
    if (index !== -1) {
      // Cek apakah sudah pernah mengajukan minat ke UMKM ini sebelumnya
      const sdhAda = listInvestor.value[index].riwayatMinat.some(r => r.umkmId === umkmId)
      if (sdhAda) return { success: false, message: 'Anda sudah mengirimkan penawaran ke UMKM ini.' }

      listInvestor.value[index].riwayatMinat.push({
        umkmId,
        tanggalAjuan: new Date().toISOString().split('T')[0],
        status: 'Menunggu Diskusi',
        catatanPesan: proposalMessage
      })
      return { success: true, message: 'Penawaran minat berhasil dikirimkan ke pelaku UMKM!' }
    }
    return { success: false, message: 'Sesi investor tidak ditemukan.' }
  }

  /**
   * Menambahkan atau menghapus UMKM ke dalam daftar pantau (Watchlist) investor
   * @param {String} umkmId 
   */
  const toggleWatchlist = (umkmId) => {
    const index = watchlist.value.indexOf(umkmId)
    if (index === -1) {
      watchlist.value.push(umkmId) // Tambahkan ke watchlist jika belum ada
    } else {
      watchlist.value.splice(index, 1) // Hapus dari watchlist jika sudah ada
    }
  }

  /**
   * Mengubah status penawaran dari sisi pelaku UMKM (Menerima / Menolak tawaran diskusi)
   * @param {String} investorId 
   * @param {String} umkmId 
   * @param {String} statusBaru - 'Disetujui UMKM' | 'Ditolak UMKM'
   */
  const updateProposalStatusFromUmkm = (investorId, umkmId, statusBaru) => {
    const investorIndex = listInvestor.value.findIndex(inv => inv.id === investorId)
    if (investorIndex !== -1) {
      const minatIndex = listInvestor.value[investorIndex].riwayatMinat.findIndex(r => r.umkmId === umkmId)
      if (minatIndex !== -1) {
        listInvestor.value[investorIndex].riwayatMinat[minatIndex].status = statusBaru
        return true
      }
    }
    return false
  }

  return {
    listInvestor,
    activeInvestorId,
    watchlist,
    myInvestorProfile,
    myInvestmentProposals,
    getInboxForUmkm,
    submitInvestmentInterest,
    toggleWatchlist,
    updateProposalStatusFromUmkm
  }
})