import { ref, computed } from 'vue'

/* ── sample data ── */
const SAMPLE = [
  ['Ahmad Faiz','XII IPA 1',7.5,38,45,40,52],
  ['Siti Nuraini','XII IPA 1',2.5,85,82,80,88],
  ['Budi Santoso','XI IPS 2',9.0,28,35,32,41],
  ['Lailatul Fitri','XII IPA 2',3.0,78,75,72,82],
  ['Muhammad Rizky','XI IPA 1',8.0,35,42,38,50],
  ['Nur Hidayah','XII IPS 1',2.0,90,88,85,92],
  ['Dimas Pratama','XI IPS 1',10.5,22,30,28,38],
  ['Aisyah Rahmawati','XII IPA 1',3.5,72,70,68,78],
  ['Faisal Rahman','XI IPA 2',6.5,48,52,45,60],
  ['Dewi Anggraini','XII IPS 2',4.0,68,65,62,72],
  ['Rizky Maulana','XII IPA 2',8.5,32,38,35,44],
  ['Fitria Sari','XI IPA 1',2.5,82,80,78,86],
  ['Andi Permana','XI IPS 2',9.5,25,28,30,36],
  ['Salma Putri','XII IPS 1',3.5,75,73,70,80],
  ['Yoga Pratama','XII IPA 1',7.0,42,48,40,55],
  ['Indah Lestari','XI IPA 2',2.0,88,86,84,90],
  ['Reza Firmansyah','XI IPS 1',11.0,18,25,22,32],
  ['Nadia Kusuma','XII IPS 2',4.5,65,62,60,70],
  ['Fajar Nugroho','XI IPA 1',6.0,50,55,48,62],
  ['Aini Rachmadani','XII IPA 2',3.0,79,77,74,83],
]

/* ── helpers ── */
export function computeRisk(s) {
  const w = [0.3, 0.25, 0.15, 0.15, 0.15]
  const vals = [
    s.screen_time / 12,
    1 - s.konsentrasi / 100,
    1 - s.tidur / 100,
    1 - s.mood / 100,
    1 - s.pemahaman_materi / 100,
  ]
  return Math.round(vals.reduce((sum, v, i) => sum + v * w[i], 0) * 100)
}

function dist(a, b) {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0))
}

function normalize(data) {
  return data.map(s => ({
    ...s,
    _n: [
      s.screen_time / 12,
      1 - s.konsentrasi / 100,
      1 - s.tidur / 100,
      1 - s.mood / 100,
      1 - s.pemahaman_materi / 100,
    ],
  }))
}

export function kMeans(data, k = 3, iter = 100) {
  if (data.length < k) return data.map(d => ({ ...d, cluster: 'Normal', isRead: d.isRead || false }))
  const norm = normalize(data)
  let centroids = [[0.2, 0.2, 0.2, 0.2, 0.2], [0.5, 0.5, 0.5, 0.5, 0.5], [0.8, 0.8, 0.8, 0.8, 0.8]]
  let assignments = new Array(norm.length).fill(0)

  for (let it = 0; it < iter; it++) {
    let changed = false
    norm.forEach((d, i) => {
      const dists = centroids.map(c => dist(d._n, c))
      const best = dists.indexOf(Math.min(...dists))
      if (best !== assignments[i]) { assignments[i] = best; changed = true }
    })
    if (!changed) break
    centroids = centroids.map((_, ci) => {
      const members = norm.filter((_, i) => assignments[i] === ci)
      if (!members.length) return centroids[ci]
      return centroids[0].map((_, fi) => members.reduce((s, m) => s + m._n[fi], 0) / members.length)
    })
  }

  const clusterRisk = centroids.map(c => c.reduce((s, v) => s + v, 0) / c.length)
  const sortedIdx = [...clusterRisk.keys()].sort((a, b) => clusterRisk[b] - clusterRisk[a])
  const labelMap = {}
  sortedIdx.forEach((ci, rank) => { labelMap[ci] = rank === 0 ? 'Kritis' : rank === 1 ? 'Berisiko' : 'Normal' })

  return norm.map((d, i) => {
    const s = { ...d }
    const currentIsRead = d.isRead
    delete s._n
    s.cluster = labelMap[assignments[i]]
    s.risk = computeRisk(s)
    s.isRead = currentIsRead !== undefined ? currentIsRead : false
    return s
  })
}

/* ── composable ── */
export function useStudents() {
  const students = ref([])
  const clustered = ref(false)

  function initSample() {
    students.value = SAMPLE.map(([nama, kelas, screen_time, konsentrasi, tidur, mood, pemahaman_materi]) => ({
      nama, kelas, screen_time, konsentrasi, tidur, mood, pemahaman_materi,
      cluster: '', risk: computeRisk({ screen_time, konsentrasi, tidur, mood, pemahaman_materi }),
      isRead: false
    }))
    runClustering()
  }

  function runClustering() {
    if (!students.value.length) return false
    students.value = kMeans(students.value)
    clustered.value = true
    return true
  }

  // Menandai SATU siswa sebagai sudah dibaca
  function markAsRead(studentName) {
    const target = students.value.find(s => s.nama === studentName)
    if (target) {
      target.isRead = true
    }
  }

  // Menandai SEMUA siswa kritis/berisiko sebagai sudah dibaca
  function markAllAsRead() {
    students.value = students.value.map(s => ({
      ...s,
      isRead: (s.cluster === 'Kritis' || s.cluster === 'Berisiko') ? true : s.isRead
    }))
  }

  function addStudent(s) {
    students.value.push({ ...s, cluster: '', risk: computeRisk(s), isRead: false })
  }

  function importStudents(rows) {
    const mapped = rows.map(r => ({
      nama: String(r.nama || '').trim(),
      kelas: String(r.kelas || '').trim(),
      screen_time: parseFloat(r.screen_time) || 0,
      konsentrasi: parseInt(r.konsentrasi) || 0,
      tidur: parseInt(r.tidur) || 0,
      mood: parseInt(r.mood) || 0,
      pemahaman_materi: parseInt(r.pemahaman_materi) || 0,
      cluster: '', risk: 0, isRead: false
    })).filter(s => s.nama)
    mapped.forEach(s => { s.risk = computeRisk(s) })
    students.value = [...students.value, ...mapped]
    runClustering()
    return mapped.length
  }

  const stats = computed(() => ({
    total: students.value.length,
    kritis: students.value.filter(s => s.cluster === 'Kritis').length,
    berisiko: students.value.filter(s => s.cluster === 'Berisiko').length,
    normal: students.value.filter(s => s.cluster === 'Normal').length,
  }))

  // Sidebar badge hanya menghitung yang BELUM dibaca
  const alertCount = computed(() => 
    students.value.filter(s => (s.cluster === 'Kritis' || s.cluster === 'Berisiko') && !s.isRead).length
  )

  const kelasOptions = [
    'X IPA 1', 'X IPA 2', 'X IPS 1', 'X IPS 2', 
    'XI IPA 1', 'XI IPA 2', 'XI IPS 1', 'XI IPS 2', 
    'XII IPA 1', 'XII IPA 2', 'XII IPS 1', 'XII IPS 2'
  ]

  return { 
    students, clustered, stats, alertCount, kelasOptions, 
    initSample, runClustering, addStudent, importStudents, 
    markAllAsRead, markAsRead 
  }
}