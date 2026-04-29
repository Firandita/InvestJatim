<template>
  <div class="min-h-screen bg-slate-100" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ══════════════════════════════════════
         VIEW: FORM KUESIONER
    ══════════════════════════════════════ -->
    <div v-if="view === 'form'">
      <!-- Header -->
      <div style="background:#fff; border-bottom:1px solid #e2e8f0; padding:12px 16px; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:#0d9488; font-weight:800; font-size:16px; letter-spacing:-0.5px;">AQL-Metrics</span>
          <span style="color:#cbd5e1;">|</span>
          <span style="color:#475569; font-size:14px;">Kuesioner Kesehatan Digital</span>
        </div>
        <span style="color:#94a3b8; font-size:12px;">Hifdz al-'Aql</span>
      </div>

      <div style="max-width:560px; margin:0 auto; padding:32px 16px;">

        <!-- Progress -->
        <div style="margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="font-size:13px; color:#64748b; font-weight:500;">
              <span v-if="step === 0">Data Diri</span>
              <span v-else-if="step <= activeQuestions.length">Pertanyaan {{ step }} dari {{ activeQuestions.length }}</span>
              <span v-else>Muhasabah Digital</span>
            </span>
            <span style="font-size:13px; color:#0d9488; font-weight:700;">{{ progressPct }}%</span>
          </div>
          <div style="width:100%; background:#e2e8f0; border-radius:99px; height:6px;">
            <div :style="{ width: progressPct + '%', background:'#0d9488', height:'6px', borderRadius:'99px', transition:'width 0.5s ease' }"></div>
          </div>
        </div>

        <!-- STEP 0: Identitas -->
        <div v-if="step === 0" style="background:#fff; border-radius:16px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <h2 style="font-size:15px; font-weight:700; color:#1e293b; margin-bottom:16px;">Data Diri Siswa</h2>
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">
              Nama Lengkap <span style="color:#ef4444;">*</span>
            </label>
            <input v-model="form.nama" type="text" placeholder="Tulis nama lengkap kamu"
              style="width:100%; border:1.5px solid #e2e8f0; border-radius:12px; padding:11px 16px; font-size:14px; color:#1e293b; outline:none; transition:border 0.2s; font-family:inherit;"
              @focus="e => e.target.style.borderColor='#0d9488'"
              @blur="e => e.target.style.borderColor='#e2e8f0'" />
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">
              Kelas <span style="color:#ef4444;">*</span>
            </label>
            <select v-model="form.kelas"
              style="width:100%; border:1.5px solid #e2e8f0; border-radius:12px; padding:11px 16px; font-size:14px; color:#1e293b; outline:none; background:#fff; font-family:inherit;">
              <option value="" style="color:#94a3b8;">-- Pilih Kelas --</option>
              <option v-for="k in kelasList" :key="k" :value="k" style="color:#1e293b;">{{ k }}</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">
              Jenis Kelamin
            </label>
            <div style="display:flex; gap:10px;">
              <button v-for="g in ['Laki-laki','Perempuan']" :key="g"
                @click="form.gender = g"
                :style="{
                  flex:1, border: form.gender===g ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                  borderRadius:'12px', padding:'10px', fontSize:'14px', fontWeight:'600',
                  color: form.gender===g ? '#fff' : '#475569',
                  background: form.gender===g ? '#0d9488' : '#fff',
                  cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit'
                }">
                {{ g }}
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 1–N: Pertanyaan -->
        <div v-else-if="step >= 1 && step <= activeQuestions.length"
          style="background:#fff; border-radius:16px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <p style="font-size:15px; font-weight:700; color:#1e293b; line-height:1.6; margin-bottom:6px;">
            {{ activeQuestions[step-1].text }}
          </p>
          <p style="font-size:12px; color:#94a3b8; margin-bottom:20px;">{{ activeQuestions[step-1].hint }}</p>

          <!-- Slider -->
          <div v-if="activeQuestions[step-1].type === 'slider'">
            <div style="text-align:center; margin-bottom:12px; padding:8px 0;">
              <span style="font-size:40px; font-weight:800; color:#0d9488;">{{ form.answers[step-1] }}</span>
              <span style="font-size:14px; color:#94a3b8; margin-left:6px;">{{ activeQuestions[step-1].unit }}</span>
            </div>
            <input type="range"
              :min="activeQuestions[step-1].min"
              :max="activeQuestions[step-1].max"
              :step="activeQuestions[step-1].step || 0.5"
              v-model.number="form.answers[step-1]"
              style="width:100%; accent-color:#0d9488; cursor:pointer; margin-bottom:8px;" />
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#94a3b8;">
              <span>{{ activeQuestions[step-1].min }} jam</span>
              <span>{{ activeQuestions[step-1].max }} jam</span>
            </div>
          </div>

          <!-- Scale 1–5 -->
          <div v-if="activeQuestions[step-1].type === 'scale'">
            <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin-bottom:8px;">
              <button v-for="n in 5" :key="n"
                @click="form.answers[step-1] = n"
                :style="{
                  border: form.answers[step-1]===n ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                  borderRadius:'12px', padding:'12px 0', fontSize:'15px', fontWeight:'700',
                  color: form.answers[step-1]===n ? '#fff' : '#334155',
                  background: form.answers[step-1]===n ? '#0d9488' : '#f8fafc',
                  cursor:'pointer', transition:'all 0.15s', fontFamily:'inherit'
                }">{{ n }}</button>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; padding:0 2px;">
              <span>{{ activeQuestions[step-1].scaleMin }}</span>
              <span>{{ activeQuestions[step-1].scaleMax }}</span>
            </div>
          </div>

          <!-- Choice -->
          <div v-if="activeQuestions[step-1].type === 'choice'">
            <button v-for="opt in activeQuestions[step-1].options" :key="opt.value"
              @click="form.answers[step-1] = opt.value"
              :style="{
                display:'block', width:'100%', textAlign:'left',
                border: form.answers[step-1]===opt.value ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                borderRadius:'12px', padding:'12px 16px', fontSize:'14px', fontWeight:'500',
                color: form.answers[step-1]===opt.value ? '#0f766e' : '#334155',
                background: form.answers[step-1]===opt.value ? '#f0fdfa' : '#fff',
                cursor:'pointer', transition:'all 0.15s', marginBottom:'8px', fontFamily:'inherit'
              }">
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- STEP MUHASABAH -->
        <div v-else-if="step === totalSteps - 1"
          style="background:#fff; border-radius:16px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <div style="background:#0d9488; padding:20px 24px; text-align:center;">
            <h2 style="font-size:17px; font-weight:800; color:#fff; margin-bottom:4px;">Muhasabah Digital</h2>
            <p style="font-size:13px; color:#99f6e4;">Renungkan sejenak sebelum mengirim</p>
          </div>
          <div style="padding:24px;">
            <div style="background:#f0fdfa; border:1px solid #99f6e4; border-radius:12px; padding:16px; margin-bottom:16px;">
              <p style="color:#0f766e; font-size:16px; line-height:1.8; text-align:right; margin-bottom:10px;" dir="rtl">
                وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ ٱلسَّمْعَ وَٱلْبَصَرَ وَٱلْفُؤَادَ كُلُّ أُو۟لَـٰٓئِكَ كَانَ عَنْهُ مَسْـُٔولًا
              </p>
              <p style="color:#0f766e; font-size:12px; line-height:1.7; font-style:italic;">
                "Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui. Sesungguhnya pendengaran, penglihatan, dan hati nurani — semua itu akan diminta pertanggungjawabannya."
              </p>
              <p style="color:#0d9488; font-size:12px; font-weight:700; margin-top:6px;">— QS. Al-Isra: 36</p>
            </div>
            <p style="font-size:14px; color:#475569; text-align:center; margin-bottom:14px;">
              Dari waktu gawaimu hari ini, sudahkah sebagiannya untuk menuntut ilmu yang bermanfaat?
            </p>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
              <button v-for="opt in muhasabahOpts" :key="opt.val"
                @click="form.muhasabah = opt.val"
                :style="{
                  border: form.muhasabah===opt.val ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                  borderRadius:'12px', padding:'12px 0', fontSize:'14px', fontWeight:'700',
                  color: form.muhasabah===opt.val ? '#fff' : '#334155',
                  background: form.muhasabah===opt.val ? '#0d9488' : '#fff',
                  cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit'
                }">{{ opt.label }}</button>
            </div>
          </div>
        </div>

        <!-- Navigasi -->
        <div style="display:flex; gap:12px; margin-top:20px;">
          <button v-if="step > 0" @click="step--"
            style="flex:1; border:1.5px solid #e2e8f0; border-radius:12px; padding:13px; font-size:14px; font-weight:600; color:#475569; background:#fff; cursor:pointer; transition:background 0.2s; font-family:inherit;"
            @mouseenter="e => e.target.style.background='#f8fafc'"
            @mouseleave="e => e.target.style.background='#fff'">
            Kembali
          </button>
          <button v-if="step < totalSteps - 1" @click="nextStep"
            :disabled="!canProceed"
            :style="{
              flex:1, border:'none', borderRadius:'12px', padding:'13px',
              fontSize:'14px', fontWeight:'700', cursor: canProceed ? 'pointer' : 'not-allowed',
              color:'#fff', background: canProceed ? '#0d9488' : '#cbd5e1',
              transition:'background 0.2s', fontFamily:'inherit'
            }">
            Lanjut
          </button>
          <button v-if="step === totalSteps - 1" @click="submitForm"
            style="flex:1; border:none; border-radius:12px; padding:13px; font-size:14px; font-weight:700; color:#fff; background:#0d9488; cursor:pointer; transition:background 0.2s; font-family:inherit;"
            @mouseenter="e => e.target.style.background='#0f766e'"
            @mouseleave="e => e.target.style.background='#0d9488'">
            Kirim Jawaban
          </button>
        </div>

        <p style="text-align:center; font-size:12px; color:#cbd5e1; margin-top:24px;">
          AQL-Metrics · SMA Al-Islam Krian · Data kamu aman dan hanya dilihat Guru BK
        </p>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         VIEW: LAPORAN HASIL
    ══════════════════════════════════════ -->
    <div v-if="view === 'report'" style="min-height:100vh; background:#0f172a;">
      <!-- Header -->
      <div style="background:#1e293b; border-bottom:1px solid #334155; padding:12px 16px; text-align:center;">
        <span style="color:#2dd4bf; font-weight:800; font-size:15px;">AQL-Metrics</span>
        <span style="color:#475569; font-size:14px;"> · Laporan Hasil Kuesioner</span>
      </div>

      <div style="max-width:560px; margin:0 auto; padding:32px 16px;">
        <!-- Identitas -->
        <div style="text-align:center; margin-bottom:20px;">
          <p style="color:#94a3b8; font-size:15px; font-weight:600;">{{ report.nama }}</p>
          <p style="color:#64748b; font-size:13px; margin-top:2px;">{{ report.kelas }} · {{ fmtDate(report.submittedAt) }}</p>
        </div>

        <!-- Badge Cluster -->
        <div style="border-radius:16px; padding:28px; text-align:center; margin-bottom:16px;"
          :style="{
            background: report.cluster==='Kritis' ? 'rgba(239,68,68,0.15)' : report.cluster==='Berisiko' ? 'rgba(249,115,22,0.15)' : 'rgba(13,148,136,0.15)',
            border: report.cluster==='Kritis' ? '1px solid rgba(239,68,68,0.4)' : report.cluster==='Berisiko' ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(13,148,136,0.4)'
          }">
          <div style="font-size:48px; margin-bottom:10px;">{{ clusterEmoji }}</div>
          <h1 style="font-size:28px; font-weight:800; margin-bottom:6px;"
            :style="{ color: report.cluster==='Kritis' ? '#f87171' : report.cluster==='Berisiko' ? '#fb923c' : '#2dd4bf' }">
            {{ report.cluster }}
          </h1>
          <p style="color:#94a3b8; font-size:14px; line-height:1.5;">{{ clusterDesc }}</p>
        </div>

        <!-- Skor -->
        <div style="background:#1e293b; border:1px solid #334155; border-radius:16px; padding:20px; margin-bottom:16px;">
          <h3 style="color:#e2e8f0; font-size:14px; font-weight:700; margin-bottom:14px;">Ringkasan Skormu</h3>
          <div v-for="item in scoreItems" :key="item.label" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:13px; color:#94a3b8;">{{ item.label }}</span>
              <span style="font-size:13px; font-weight:700;" :style="{ color: item.good ? '#2dd4bf' : '#fb923c' }">
                {{ item.display }}
              </span>
            </div>
            <div style="width:100%; background:#334155; border-radius:99px; height:6px;">
              <div :style="{
                width: item.pct + '%', height:'6px', borderRadius:'99px',
                background: item.good ? '#0d9488' : '#f97316', transition:'width 0.8s ease'
              }"></div>
            </div>
          </div>
        </div>

        <!-- Ayat -->
        <div style="background:rgba(13,148,136,0.12); border:1px solid rgba(13,148,136,0.3); border-radius:16px; padding:20px; margin-bottom:16px;">
          <p style="color:#5eead4; font-size:16px; line-height:1.9; text-align:right; margin-bottom:12px;" dir="rtl">
            {{ reportAyat.arab }}
          </p>
          <p style="color:#99f6e4; font-size:13px; line-height:1.7; font-style:italic;">{{ reportAyat.terjemah }}</p>
          <p style="color:#2dd4bf; font-size:12px; font-weight:700; margin-top:8px;">{{ reportAyat.sumber }}</p>
        </div>

        <!-- Saran -->
        <div style="background:#1e293b; border:1px solid #334155; border-radius:16px; padding:20px; margin-bottom:16px;">
          <h3 style="color:#e2e8f0; font-size:14px; font-weight:700; margin-bottom:16px;">Langkah Perbaikan Untukmu</h3>
          <div v-for="(s, i) in reportSaran" :key="i" style="display:flex; gap:12px; margin-bottom:16px;">
            <div style="width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;"
              :style="{ background: s.bg }">
              {{ s.icon }}
            </div>
            <div>
              <p style="color:#e2e8f0; font-size:14px; font-weight:700; margin-bottom:3px;">{{ s.judul }}</p>
              <p style="color:#94a3b8; font-size:13px; line-height:1.6;">{{ s.isi }}</p>
            </div>
          </div>
        </div>

        <!-- Muhasabah -->
        <div style="background:#1e293b; border:1px solid #334155; border-radius:16px; padding:16px; text-align:center; margin-bottom:16px;">
          <p style="color:#64748b; font-size:13px;">Jawaban muhasabaahmu:</p>
          <p style="color:#2dd4bf; font-weight:700; font-size:15px; margin-top:4px;">{{ report.muhasabah || '—' }}</p>
          <p style="color:#475569; font-size:12px; margin-top:10px; line-height:1.6;">
            "Barangsiapa menunjukkan kepada kebaikan maka baginya pahala seperti pelakunya." — HR. Muslim
          </p>
        </div>

        <button @click="resetForm"
          style="width:100%; border:1.5px solid #334155; border-radius:12px; padding:13px; font-size:14px; font-weight:600; color:#64748b; background:transparent; cursor:pointer; font-family:inherit; transition:all 0.2s;"
          @mouseenter="e => e.target.style.background='#1e293b'"
          @mouseleave="e => e.target.style.background='transparent'">
          Selesai
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const view = ref('form')
const step = ref(0)
const report = ref({})

const form = ref({
  nama: '', kelas: '', gender: '',
  answers: [6, 3, 3, 3, 3, 3, 3, 3],
  muhasabah: ''
})

const kelasList = [
  'X IPA 1','X IPA 2','X IPS 1','X IPS 2',
  'XI IPA 1','XI IPA 2','XI IPS 1','XI IPS 2',
  'XII IPA 1','XII IPA 2','XII IPS 1','XII IPS 2'
]
const muhasabahOpts = [
  { val:'Sudah', label:'Sudah' },
  { val:'Sebagian', label:'Sebagian' },
  { val:'Belum', label:'Belum' }
]

// Ambil soal dari localStorage (di-set Guru BK), fallback ke default
const activeQuestions = computed(() => {
  try {
    const saved = localStorage.getItem('aql_active_questions')
    if (saved) return JSON.parse(saved)
  } catch {}
  return defaultQuestions
})

const totalSteps = computed(() => activeQuestions.value.length + 2)
const progressPct = computed(() => Math.round((step.value / (totalSteps.value - 1)) * 100))

const canProceed = computed(() => {
  if (step.value === 0) return form.value.nama.trim() !== '' && form.value.kelas !== ''
  if (step.value >= 1 && step.value <= activeQuestions.value.length) {
    const a = form.value.answers[step.value - 1]
    return a !== null && a !== undefined
  }
  return true
})

const nextStep = () => { if (canProceed.value) step.value++ }

// ── Kalkulasi 5 Variabel ───────────────────────────────────
const calcScores = () => {
  const screen_time = form.value.answers[0] ?? 6
  const k1 = 6 - (form.value.answers[1] ?? 3)
  const k2 = 6 - (form.value.answers[2] ?? 3)
  const k3 = form.value.answers[3] ?? 3
  const konsentrasi = Math.round(((k1 + k2 + k3) / 3 / 5) * 100)
  const tidur = Math.round(((form.value.answers[4] ?? 3) / 5) * 100)
  const mood = Math.round(((form.value.answers[5] ?? 3) / 5) * 100)
  const pemahaman_materi = Math.round(((form.value.answers[6] ?? 3) / 5) * 100)
  return { screen_time, konsentrasi, tidur, mood, pemahaman_materi }
}

const previewCluster = (s) => {
  const risk = (s.screen_time / 12) * 0.30 + (1 - s.konsentrasi/100) * 0.25 +
    (1 - s.tidur/100) * 0.15 + (1 - s.mood/100) * 0.15 + (1 - s.pemahaman_materi/100) * 0.15
  if (risk >= 0.55) return 'Kritis'
  if (risk >= 0.35) return 'Berisiko'
  return 'Normal'
}

const submitForm = () => {
  const scores = calcScores()
  const cluster = previewCluster(scores)
  const entry = {
    nama: form.value.nama, kelas: form.value.kelas, gender: form.value.gender,
    ...scores, muhasabah: form.value.muhasabah, cluster,
    submittedAt: new Date().toISOString(), processed: false
  }
  const all = JSON.parse(localStorage.getItem('aql_pending_responses') || '[]')
  all.push(entry)
  localStorage.setItem('aql_pending_responses', JSON.stringify(all))
  report.value = entry
  view.value = 'report'
}

// ── Laporan ────────────────────────────────────────────────
const clusterEmoji = computed(() => ({ Kritis:'🔴', Berisiko:'🟠', Normal:'🟢' }[report.value.cluster] || ''))
const clusterDesc = computed(() => ({
  Kritis: 'Penggunaan gawaimu berdampak signifikan pada kemampuan belajar',
  Berisiko: 'Mulai terlihat dampak gawai pada konsentrasi dan kesehatanmu',
  Normal: 'Kamu sudah cukup baik dalam menjaga keseimbangan digital'
}[report.value.cluster] || ''))

const scoreItems = computed(() => {
  if (report.value.screen_time === undefined) return []
  const r = report.value
  return [
    { label:'Screen Time Harian', display: r.screen_time + ' jam/hari', pct: Math.min(r.screen_time/16*100, 100), good: r.screen_time < 5 },
    { label:'Konsentrasi Belajar', display: r.konsentrasi + '%', pct: r.konsentrasi, good: r.konsentrasi >= 65 },
    { label:'Kualitas Tidur', display: r.tidur + '%', pct: r.tidur, good: r.tidur >= 60 },
    { label:'Kondisi Mood', display: r.mood + '%', pct: r.mood, good: r.mood >= 60 },
    { label:'Pemahaman Materi', display: r.pemahaman_materi + '%', pct: r.pemahaman_materi, good: r.pemahaman_materi >= 60 }
  ]
})

const reportAyat = computed(() => ({
  Kritis: { arab:'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تُلْهِكُمْ أَمْوَٰلُكُمْ وَلَآ أَوْلَـٰدُكُمْ عَن ذِكْرِ ٱللَّهِ', terjemah:'"Wahai orang-orang yang beriman! Janganlah harta bendamu dan anak-anakmu melalaikan kamu dari mengingat Allah." Termasuk juga lalai karena gawai.', sumber:'— QS. Al-Munafiqun: 9' },
  Berisiko: { arab:'وَٱبْتَغِ فِيمَآ ءَاتَىٰكَ ٱللَّهُ ٱلدَّارَ ٱلْـَٔاخِرَةَ ۖ وَلَا تَنسَ نَصِيبَكَ مِنَ ٱلدُّنْيَا', terjemah:'"Dan carilah pahala negeri akhirat dengan apa yang telah dianugerahkan Allah kepadamu, tetapi janganlah kamu lupakan bagianmu di dunia."', sumber:'— QS. Al-Qashash: 77' },
  Normal: { arab:'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', terjemah:'"Sesungguhnya bersama kesulitan ada kemudahan." Pertahankan keseimbangan digitalmu dan terus tingkatkan!', sumber:'— QS. Al-Insyirah: 6' }
}[report.value.cluster] || { arab:'', terjemah:'', sumber:'' }))

const reportSaran = computed(() => ({
  Kritis: [
    { icon:'⏰', bg:'rgba(239,68,68,0.2)', judul:'Terapkan Screen Time Limit', isi:'Aktifkan Digital Wellbeing di HP-mu. Targetkan maksimal 3 jam hiburan per hari. Rasulullah SAW bersabda: "Manfaatkan lima perkara sebelum lima perkara: mudamu sebelum tua..." (HR. Al-Hakim)' },
    { icon:'📵', bg:'rgba(249,115,22,0.2)', judul:'Tetapkan Zona Bebas HP', isi:'Tiga waktu bebas HP: saat makan, 1 jam sebelum tidur, dan saat belajar. Ganti scroll dengan membaca Al-Quran 1 halaman per hari.' },
    { icon:'🕌', bg:'rgba(13,148,136,0.2)', judul:'Jadikan Shalat sebagai Reset Digital', isi:'Gunakan waktu 5 shalat wajib sebagai jeda alami dari layar. Shalat adalah detox spiritual sekaligus istirahat mata.' },
    { icon:'👥', bg:'rgba(59,130,246,0.2)', judul:'Ceritakan ke Guru BK', isi:'Guru BK siap membantu membuat rencana pengurangan screen time yang realistis sesuai kondisimu.' }
  ],
  Berisiko: [
    { icon:'📅', bg:'rgba(249,115,22,0.2)', judul:'Buat Jadwal Harian Terstruktur', isi:'Tulis jadwal harianmu termasuk slot khusus hiburan digital maksimal 2 jam. Struktur waktu mencegah scroll tanpa sadar.' },
    { icon:'😴', bg:'rgba(59,130,246,0.2)', judul:'Perbaiki Kualitas Tidur', isi:'Tidur jam 10 malam, bangun jam 5 untuk Subuh. Hindari HP 1 jam sebelum tidur — cahaya layar mengganggu hormon melatonin.' },
    { icon:'📖', bg:'rgba(13,148,136,0.2)', judul:'Ganti 15 Menit Scroll dengan Membaca', isi:'Setiap hari, ganti 15 menit doomscrolling dengan membaca — buku, artikel, atau tafsir Al-Quran. Otak dilatih fokus lebih lama.' }
  ],
  Normal: [
    { icon:'⭐', bg:'rgba(13,148,136,0.2)', judul:'Pertahankan Keseimbangan Ini', isi:'"Allah tidak akan mengubah suatu kaum hingga mereka mengubah diri mereka sendiri." (QS. Ar-Rad: 11). Tetap jaga pola baikmu!' },
    { icon:'🚀', bg:'rgba(59,130,246,0.2)', judul:'Tingkatkan Kualitas Konten', isi:'Pastikan konten yang dikonsumsi berkualitas: podcast ilmu, tutorial, atau konten edukatif Islami.' },
    { icon:'🤝', bg:'rgba(139,92,246,0.2)', judul:'Jadilah Inspirasi Teman', isi:'"Barangsiapa menunjukkan kepada kebaikan maka baginya pahala seperti pelakunya." (HR. Muslim).' }
  ]
}[report.value.cluster] || []))

const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('id-ID', {
  day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit'
}) : ''

const resetForm = () => {
  form.value = { nama:'', kelas:'', gender:'', answers:[6,3,3,3,3,3,3,3], muhasabah:'' }
  step.value = 0
  view.value = 'form'
}

// ── Pertanyaan Default ─────────────────────────────────────
const defaultQuestions = [
  { id:'q1', variabel:'screen_time', type:'slider', min:0, max:16, step:0.5, unit:'jam/hari',
    text:'Rata-rata, berapa jam kamu menggunakan gawai untuk hiburan setiap hari?',
    hint:'Termasuk TikTok, YouTube, Instagram, game — tidak termasuk belajar' },
  { id:'q2', variabel:'konsentrasi', type:'choice',
    text:'Seberapa sering kamu menonton video pendek tanpa henti (doomscrolling)?',
    hint:'Scroll video terus-menerus tanpa tujuan jelas',
    options:[{label:'Hampir tidak pernah',value:1},{label:'1–2 kali seminggu',value:2},{label:'Hampir setiap hari',value:3},{label:'Setiap hari lebih dari 1 jam',value:4},{label:'Hampir setiap waktu luang',value:5}] },
  { id:'q3', variabel:'konsentrasi', type:'scale', scaleMin:'Tidak terganggu', scaleMax:'Sangat terganggu',
    text:'Ketika belajar, seberapa mudah kamu terganggu oleh HP?',
    hint:'1 = Tidak terganggu · 5 = Sangat mudah terganggu' },
  { id:'q4', variabel:'konsentrasi', type:'scale', scaleMin:'Sangat sulit fokus', scaleMax:'Sangat mudah fokus',
    text:'Seberapa baik kemampuan kamu berkonsentrasi saat pelajaran di kelas?',
    hint:'1 = Sangat sulit fokus · 5 = Sangat mudah fokus' },
  { id:'q5', variabel:'tidur', type:'choice',
    text:'Bagaimana kualitas tidurmu dalam seminggu terakhir?',
    hint:'Tidur cukup 7–9 jam sangat mempengaruhi kemampuan belajar',
    options:[{label:'Sangat baik — 8+ jam dan terasa segar',value:5},{label:'Baik — 7–8 jam',value:4},{label:'Lumayan — 6–7 jam, kadang ngantuk',value:3},{label:'Kurang — 5–6 jam karena main HP',value:2},{label:'Sangat kurang — sering begadang',value:1}] },
  { id:'q6', variabel:'mood', type:'scale', scaleMin:'Sangat buruk', scaleMax:'Sangat baik',
    text:'Bagaimana kondisi mood atau perasaanmu secara umum minggu ini?',
    hint:'1 = Sangat buruk / mudah marah · 5 = Sangat baik / semangat' },
  { id:'q7', variabel:'pemahaman_materi', type:'scale', scaleMin:'Tidak paham', scaleMax:'Paham semua',
    text:'Seberapa baik kamu memahami materi pelajaran yang diajarkan minggu ini?',
    hint:'1 = Tidak paham sama sekali · 5 = Paham semua dengan baik' },
  { id:'q8', variabel:'informatif', type:'choice',
    text:'Apa alasan utama kamu menggunakan gawai dalam waktu lama?',
    hint:'Pilih yang paling mendekati kebiasaanmu',
    options:[{label:'Untuk belajar atau mencari referensi',value:1},{label:'Komunikasi dengan teman atau keluarga',value:2},{label:'Hiburan (game, video, sosmed)',value:3},{label:'Sudah jadi kebiasaan',value:4},{label:'Mengisi waktu karena bosan',value:5}] }
]
</script>