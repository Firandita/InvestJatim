/**
 * Menghitung skor kesiapan investasi UMKM (0 - 100)
 * @param {Object} dataUmkm 
 * @returns {Number} Skor akhir
 */
export const calculateReadinessScore = (dataUmkm) => {
  if (!dataUmkm) return 0
  
  let score = 0
  
  // 1. Bobot Kelengkapan Profil (Maks 30 poin)
  if (dataUmkm.namaUmkm) score += 10
  if (dataUmkm.deskripsi && dataUmkm.deskripsi.length > 20) score += 10
  if (dataUmkm.alamat && dataUmkm.whatsapp) score += 10

  // 2. Bobot Dokumen Legalitas (Maks 40 poin)
  if (dataUmkm.hasNib) score += 15
  if (dataUmkm.hasPirt || dataUmkm.hasHalal) score += 15
  if (dataUmkm.isLegalitasVerified) score += 10

  // 3. Bobot Laporan Keuangan (Maks 30 poin)
  if (dataUmkm.omzet > 0) score += 10
  if (dataUmkm.laba > 0) score += 10
  // Suka dengan margin > 15%
  if (dataUmkm.laba / dataUmkm.omzet > 0.15) score += 10

  return score
}

/**
 * Menentukan label status kesiapan berdasarkan skor
 * @param {Number} score 
 * @returns {Object} { label, colorClass }
 */
export const getReadinessStatus = (score) => {
  if (score >= 80) {
    return { label: 'Sangat Siap Investasi', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  } else if (score >= 50) {
    return { label: 'Butuh Pendampingan', color: 'text-amber-600 bg-amber-50 border-amber-200' }
  } else {
    return { label: 'Belum Siap', color: 'text-rose-600 bg-rose-50 border-rose-200' }
  }
}