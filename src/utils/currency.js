/**
 * Mengubah angka menjadi format mata uang Rupiah (IDR)
 * @param {Number|String} value - Angka yang ingin diformat
 * @returns {String} Hasil format Rp xx.xxx.xxx
 */
export const formatRupiah = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Rp 0'
  }
  
  const number = typeof value === 'string' ? parseFloat(value) : value
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number)
}

/**
 * Mengubah string format Rupiah kembali menjadi angka murni
 * @param {String} rupiahString 
 * @returns {Number}
 */
export const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return 0
  return Number(rupiahString.replace(/[^0-9,-]+/g, ''))
}