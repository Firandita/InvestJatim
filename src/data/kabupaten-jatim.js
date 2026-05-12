/**
 * Data Master Kabupaten/Kota di Jawa Timur
 * Digunakan untuk dropdown filter, statistik wilayah, 
 * dan pemetaan Leaflet Map pada Dashboard Pemerintah.
 */
export const kabupatenJatim = [
  {
    id: "3515",
    nama: "Sidoarjo",
    tipe: "Kabupaten",
    koordinat: [-7.4478, 112.7183],
    totalUmkm: 12450,
    sektorUnggulan: "Kriya (Kerajinan Tas Tanggulangin) & Kuliner",
    tingkatPertumbuhan: "+5.4%",
    zonaInvestasi: "Hijau" // Kategori kesiapan wilayah menerima investor besar
  },
  {
    id: "3578",
    nama: "Surabaya",
    tipe: "Kota",
    koordinat: [-7.2575, 112.7521],
    totalUmkm: 24890,
    sektorUnggulan: "Fashion, Kuliner Olahan, & Jasa Kreatif",
    tingkatPertumbuhan: "+7.2%",
    zonaInvestasi: "Hijau"
  },
  {
    id: "3573",
    nama: "Malang",
    tipe: "Kota",
    koordinat: [-7.9653, 112.6214],
    totalUmkm: 15320,
    sektorUnggulan: "Agrobisnis (Olahan Buah) & Digital Kreatif",
    tingkatPertumbuhan: "+6.1%",
    zonaInvestasi: "Hijau"
  },
  {
    id: "3512",
    nama: "Situbondo",
    tipe: "Kabupaten",
    koordinat: [-7.7067, 113.9983],
    totalUmkm: 5120,
    sektorUnggulan: "Perikanan, Kelautan, & Pengolahan Hasil Laut",
    tingkatPertumbuhan: "+3.8%",
    zonaInvestasi: "Kuning"
  },
  {
    id: "3529",
    nama: "Sumenep",
    tipe: "Kabupaten",
    koordinat: [-7.0084, 113.8621],
    totalUmkm: 6740,
    sektorUnggulan: "Tenun Tradisional & Komoditas Garam",
    tingkatPertumbuhan: "+4.2%",
    zonaInvestasi: "Kuning"
  },
  {
    id: "3506",
    nama: "Kediri",
    tipe: "Kabupaten",
    koordinat: [-7.8311, 112.0119],
    totalUmkm: 9810,
    sektorUnggulan: "Perkebunan (Tebu/Kopi) & Tenun Ikat",
    tingkatPertumbuhan: "+4.9%",
    zonaInvestasi: "Hijau"
  },
  {
    id: "3501",
    nama: "Pacitan",
    tipe: "Kabupaten",
    koordinat: [-8.1333, 111.1617],
    totalUmkm: 4320,
    sektorUnggulan: "Olahan Gula Kelapa & Industri Gerabah",
    tingkatPertumbuhan: "+3.1%",
    zonaInvestasi: "Merah" // Membutuhkan stimulus pendampingan ekstra
  }
]

/**
 * Helper untuk mengambil data kabupaten berdasarkan ID
 * @param {String} id 
 * @returns {Object|Undefined}
 */
export const getKabupatenById = (id) => {
  return kabupatenJatim.find(item => item.id === id)
}

/**
 * Helper untuk mengambil list kabupaten yang masuk zona investasi tertentu
 * @param {String} zona - 'Hijau' | 'Kuning' | 'Merah'
 * @returns {Array}
 */
export const getKabupatenByZona = (zona) => {
  return kabupatenJatim.filter(item => item.zonaInvestasi.toLowerCase() === zona.toLowerCase())
}