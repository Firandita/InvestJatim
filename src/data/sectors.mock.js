/**
 * Data Mock Sektor Usaha (SinergiUMKM Jatim)
 * Digunakan untuk klasifikasi usaha, filter pencarian direktori,
 * serta data analitik visual pada panel pemerintah/investor.
 */
export const sectorsMock = [
  {
    id: "sek-01",
    slug: "kuliner",
    label: "Kuliner & Makanan Olahan",
    icon: "🍳",
    deskripsi: "Segala jenis makanan ringan, masakan siap saji, minuman herbal, dan olahan pangan lokal Jatim.",
    totalInvesMasuk: 450000000, // Rp 450 Juta investasi berjalan
    jumlahUmkm: 342,
    trenPertumbuhan: "Meningkat"
  },
  {
    id: "sek-02",
    slug: "kriya",
    label: "Kriya & Kerajinan",
    icon: "🏺",
    deskripsi: "Kerajinan tangan, anyaman, gerabah, ukiran kayu, dan produk dekorasi rumah tangga bernilai seni.",
    totalInvesMasuk: 185000000,
    jumlahUmkm: 124,
    trenPertumbuhan: "Stabil"
  },
  {
    id: "sek-03",
    slug: "fashion",
    label: "Fashion & Tekstil",
    icon: "👕",
    deskripsi: "Pakaian jadi, hijab, tas, sepatu, serta industri tenun ikat dan batik khas berbagai daerah Jawa Timur.",
    totalInvesMasuk: 310000000,
    jumlahUmkm: 215,
    trenPertumbuhan: "Meningkat"
  },
  {
    id: "sek-04",
    slug: "agrobisnis",
    label: "Agrobisnis & Pertanian",
    icon: "🌱",
    deskripsi: "Budidaya tanaman pangan, hidroponik, peternakan rakyat, pupuk organik, dan pengolahan hasil panen.",
    totalInvesMasuk: 540000000,
    jumlahUmkm: 198,
    trenPertumbuhan: "Sangat Pesat"
  },
  {
    id: "sek-05",
    slug: "manufaktur",
    label: "Manufaktur Ringan",
    icon: "⚙️",
    deskripsi: "Bengkel permesinan skala kecil, perakitan alat tepat guna pertanian, dan pengemasan komoditas.",
    totalInvesMasuk: 120000000,
    jumlahUmkm: 45,
    trenPertumbuhan: "Stabil"
  }
]

/**
 * Helper untuk mendapatkan list opsi ringkas untuk komponen <select> atau filter dropdown
 * @returns {Array} Array berisi { value, label }
 */
export const getSectorOptions = () => {
  return sectorsMock.map(sec => ({
    value: sec.slug,
    label: `${sec.icon} ${sec.label}`
  }))
}

/**
 * Helper untuk mencari informasi sektor berdasarkan slug/kategori
 * @param {String} slug 
 * @returns {Object|Undefined}
 */
export const getSectorBySlug = (slug) => {
  return sectorsMock.find(sec => sec.slug === slug)
}