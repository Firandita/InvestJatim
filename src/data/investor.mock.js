/**
 * Data Mock Investor (InvestJatim)
 * Digunakan untuk menyuplai data riwayat minat investasi, 
 * kotak masuk penawaran di sisi UMKM, dan manajemen verifikasi KTP/Instansi.
 */
export const investorMock = [
  {
    id: "inv-01",
    nama: "Budi Santoso",
    tipe: "Angel Investor", // Individu berkekayaan tinggi
    asalKota: "Surabaya",
    isKtpVerified: true,
    preferensiSektor: ["kuliner", "fashion"],
    danaMaksimal: 150000000, // Budget maksimal investasi dalam Rp
    kontak: {
      email: "budi.santoso@email.com",
      phone: "628112233445"
    },
    riwayatMinat: [
      {
        umkmId: "umkm-01",
        tanggalAjuan: "2026-05-18",
        status: "Menunggu Diskusi", // Status proses deal-making
        catatanPesan: "Saya sangat tertarik dengan pertumbuhan omzet Keripik Tempe Jaya. Apakah ada waktu untuk melakukan sesi meeting daring via Zoom minggu ini?"
      }
    ]
  },
  {
    id: "inv-02",
    nama: "PT Sinergi Modal Bangsa",
    tipe: "Venture Capital (VC) Skala Kecil",
    asalKota: "Jakarta Pusat",
    isKtpVerified: true, // Untuk lembaga/VC, ini berarti dokumen legalitas perusahaan terverifikasi
    preferensiSektor: ["agrobisnis", "manufaktur"],
    danaMaksimal: 750000000,
    kontak: {
      email: "investment@sinergimodal.co.id",
      phone: "628129988776"
    },
    riwayatMinat: [
      {
        umkmId: "umkm-02",
        tanggalAjuan: "2026-05-14",
        status: "Disetujui UMKM",
        catatanPesan: "Kami melihat produk tenun Anda memiliki potensi ekspor yang kuat. Kami ingin meninjau laporan keuangan berformat Excel yang lebih rinci."
      }
    ]
  },
  {
    id: "inv-03",
    nama: "Hendra Wijaya",
    tipe: "Investor Retail",
    asalKota: "Malang",
    isKtpVerified: false, // Masih dalam antrian review admin
    preferensiSektor: ["kuliner"],
    danaMaksimal: 30000000,
    kontak: {
      email: "hendra.wj@email.com",
      phone: "628564433221"
    },
    riwayatMinat: []
  }
]

/**
 * Helper untuk mendapatkan semua daftar minat masuk yang diarahkan ke UMKM tertentu
 * Digunakan pada halaman inbox penawaran milik dashboard UMKM
 * @param {String} umkmId 
 * @returns {Array} List data penawaran investor yang di-mapping bersih
 */
export const getInboxByUmkmId = (umkmId) => {
  const inbox = []
  
  investorMock.forEach(investor => {
    const minat = investor.riwayatMinat.find(r => r.umkmId === umkmId)
    if (minat) {
      inbox.push({
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
  
  return inbox
}