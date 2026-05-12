/**
 * Mengubah string tanggal standar menjadi format lokal Indonesia
 * @param {String|Date} dateString - Contoh: '2026-05-19'
 * @param {Boolean} withTime - Jika true, menyertakan jam:menit
 * @returns {String} Contoh: "19 Mei 2026" atau "19 Mei 2026, 14:30"
 */
export const formatDate = (dateString, withTime = false) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  if (withTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('id-ID', options).format(date)
}

/**
 * Menghitung selisih hari dari tanggal sekarang (Time Ago)
 * @param {String|Date} dateString 
 * @returns {String} Contoh: "2 hari yang lalu"
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  let interval = Math.floor(seconds / 86400)
  if (interval >= 1) return `${interval} hari yang lalu`
  
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) return `${interval} jam yang lalu`
  
  interval = Math.floor(seconds / 60)
  if (interval >= 1) return `${interval} menit yang lalu`
  
  return 'Baru saja'
}