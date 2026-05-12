<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold" style="color:#2E2E2E">Peta Sebaran UMKM Jawa Timur</h1>
        <p class="text-sm mt-0.5" style="color:#777">Visualisasi distribusi UMKM per kabupaten/kota di seluruh Jawa Timur</p>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button
          v-for="m in metrikList" :key="m.value"
          @click="selectedMetrik = m.value"
          :style="{
            fontSize:'0.78rem', padding:'0.4rem 0.85rem', borderRadius:'0.5rem',
            border: '1px solid #6A994E', cursor:'pointer', transition:'all 0.15s',
            background: selectedMetrik === m.value ? '#6A994E' : 'white',
            color: selectedMetrik === m.value ? 'white' : '#6A994E',
          }"
        >{{ m.label }}</button>
      </div>
    </div>

    <!-- Legend + Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="stat in summaryStats" :key="stat.label">
        <span class="material-symbols-rounded" :style="{ fontSize:'1.3rem', color: stat.color, display:'block', marginBottom:'0.4rem' }">{{ stat.icon }}</span>
        <div style="font-size:1.4rem;font-weight:800;color:#2E2E2E">{{ stat.value }}</div>
        <div style="font-size:0.75rem;color:#777;margin-top:0.2rem">{{ stat.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Heatmap Grid (pengganti Leaflet untuk prototipe) -->
      <div class="card p-5 lg:col-span-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <h3 style="font-weight:700;color:#2E2E2E">Sebaran per Kabupaten/Kota</h3>
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.72rem;color:#777">
            <span>Rendah</span>
            <div style="display:flex;gap:2px">
              <div v-for="shade in heatShades" :key="shade" :style="{ width:'16px', height:'10px', background: shade, borderRadius:'2px' }"></div>
            </div>
            <span>Tinggi</span>
          </div>
        </div>

        <!-- Grid Kabupaten -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.5rem">
          <div
            v-for="kab in sortedKabupaten" :key="kab.nama"
            @click="selectedKab = kab"
            :style="{
              padding:'0.75rem', borderRadius:'0.6rem', cursor:'pointer',
              background: getHeatColor(kab[selectedMetrik], maxVal),
              border: selectedKab?.nama === kab.nama ? '2px solid #2E2E2E' : '2px solid transparent',
              transition: 'all 0.15s'
            }"
          >
            <div style="font-size:0.78rem;font-weight:700;color:#2E2E2E;margin-bottom:0.25rem">{{ kab.nama }}</div>
            <div style="font-size:0.85rem;font-weight:800;color:#4a7535">{{ formatVal(kab[selectedMetrik]) }}</div>
            <div style="font-size:0.65rem;color:#777;margin-top:0.1rem">{{ metrikLabel }}</div>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">
          {{ selectedKab ? selectedKab.nama : 'Pilih Kabupaten/Kota' }}
        </h3>

        <div v-if="!selectedKab" style="text-align:center;padding:3rem 1rem;color:#aaa">
          <span class="material-symbols-rounded" style="font-size:2.5rem;display:block;margin-bottom:0.5rem">touch_app</span>
          <p style="font-size:0.85rem">Klik salah satu kabupaten/kota di peta untuk melihat detail</p>
        </div>

        <div v-else style="display:flex;flex-direction:column;gap:0.75rem">
          <div style="padding:1rem;background:#EEF6E8;border-radius:0.75rem;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:#6A994E">{{ selectedKab.umkm.toLocaleString('id-ID') }}</div>
            <div style="font-size:0.78rem;color:#4a7535;margin-top:0.2rem">Total UMKM Terdaftar</div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
            <div style="padding:0.75rem;background:#F7F7F5;border-radius:0.6rem;text-align:center">
              <div style="font-size:1.1rem;font-weight:700;color:#2E2E2E">{{ selectedKab.verified.toLocaleString() }}</div>
              <div style="font-size:0.7rem;color:#777">Terverifikasi</div>
            </div>
            <div style="padding:0.75rem;background:#F7F7F5;border-radius:0.6rem;text-align:center">
              <div style="font-size:1.1rem;font-weight:700;color:#2E2E2E">{{ selectedKab.investor }}</div>
              <div style="font-size:0.7rem;color:#777">Investor Aktif</div>
            </div>
          </div>

          <div>
            <div style="font-size:0.78rem;font-weight:600;color:#555;margin-bottom:0.5rem">Sektor Dominan</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
              <span v-for="s in selectedKab.sektorDominan" :key="s"
                    style="background:#EEF6E8;color:#6A994E;font-size:0.72rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:99px">
                {{ s }}
              </span>
            </div>
          </div>

          <div style="padding:0.875rem;background:#F7F7F5;border-radius:0.75rem">
            <div style="font-size:0.78rem;font-weight:600;color:#555;margin-bottom:0.4rem">Total Kebutuhan Modal</div>
            <div style="font-size:1.2rem;font-weight:800;color:#F4A261">{{ selectedKab.totalModal }}</div>
          </div>

          <div style="padding:0.875rem;background:#FFF3E8;border-radius:0.75rem;border:1px solid #FDE68A">
            <div style="font-size:0.75rem;font-weight:700;color:#92400E;margin-bottom:0.3rem">Potensi Investasi</div>
            <p style="font-size:0.78rem;color:#78350F;line-height:1.5">{{ selectedKab.potensi }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ranking Tabel -->
    <div class="card p-5">
      <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Ranking Kabupaten/Kota — {{ metrikLabel }}</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
          <thead>
            <tr style="background:#F7F7F5">
              <th style="padding:0.75rem;text-align:center;color:#777;font-weight:600;width:40px">#</th>
              <th style="padding:0.75rem;text-align:left;color:#777;font-weight:600">Kabupaten/Kota</th>
              <th style="padding:0.75rem;text-align:right;color:#777;font-weight:600">UMKM</th>
              <th style="padding:0.75rem;text-align:right;color:#777;font-weight:600">Terverifikasi</th>
              <th style="padding:0.75rem;text-align:right;color:#777;font-weight:600">Investor</th>
              <th style="padding:0.75rem;text-align:left;color:#777;font-weight:600">Sektor Dominan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(kab, i) in sortedKabupaten.slice(0,10)" :key="kab.nama"
                style="border-bottom:1px solid #F7F7F5;cursor:pointer"
                @click="selectedKab = kab">
              <td style="padding:0.875rem 0.75rem;text-align:center">
                <span :style="{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:'24px', height:'24px', borderRadius:'50%', fontSize:'0.75rem', fontWeight:800,
                  background: i < 3 ? '#6A994E' : '#e8e8e4',
                  color: i < 3 ? 'white' : '#777'
                }">{{ i+1 }}</span>
              </td>
              <td style="padding:0.875rem 0.75rem;font-weight:600;color:#2E2E2E">{{ kab.nama }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:right;color:#6A994E;font-weight:700">{{ kab.umkm.toLocaleString('id-ID') }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:right;color:#777">{{ kab.verified.toLocaleString() }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:right;color:#3A86FF;font-weight:600">{{ kab.investor }}</td>
              <td style="padding:0.875rem 0.75rem">
                <span v-for="s in kab.sektorDominan.slice(0,2)" :key="s"
                      style="background:#EEF6E8;color:#6A994E;font-size:0.68rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:99px;margin-right:0.3rem">
                  {{ s }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedMetrik = ref('umkm')
const selectedKab = ref(null)

const metrikList = [
  { value: 'umkm',     label: 'Jumlah UMKM' },
  { value: 'verified', label: 'Terverifikasi' },
  { value: 'investor', label: 'Investor Aktif' },
]

const metrikLabel = computed(() => metrikList.find(m => m.value === selectedMetrik.value)?.label)

const heatShades = ['#EEF6E8','#c8ddb8','#a8cc88','#8ab86e','#6A994E','#4a7535']

const kabupatenData = [
  { nama:'Surabaya',   umkm:2840, verified:980, investor:142, sektorDominan:['Kuliner','Perdagangan'], totalModal:'Rp 12,4M', potensi:'Pusat ekonomi Jatim dengan ekosistem startup dan UMKM digital yang berkembang pesat.' },
  { nama:'Malang',     umkm:1620, verified:580, investor:98,  sektorDominan:['Kuliner','Fashion'],     totalModal:'Rp 7,2M',  potensi:'Kota wisata dengan potensi UMKM kuliner dan kerajinan tangan yang tinggi.' },
  { nama:'Sidoarjo',   umkm:1340, verified:420, investor:76,  sektorDominan:['Manufaktur','Kuliner'],  totalModal:'Rp 5,8M',  potensi:'Sentra industri dengan UMKM pendukung rantai pasok industri besar.' },
  { nama:'Kediri',     umkm:980,  verified:310, investor:55,  sektorDominan:['Fashion','Pertanian'],   totalModal:'Rp 4,1M',  potensi:'Sentra tenun ikat dan produk pertanian hortikultura unggulan.' },
  { nama:'Gresik',     umkm:760,  verified:240, investor:43,  sektorDominan:['Manufaktur','Perdagangan'], totalModal:'Rp 3,2M', potensi:'Kawasan industri dengan potensi UMKM pendukung supply chain.' },
  { nama:'Pasuruan',   umkm:680,  verified:210, investor:38,  sektorDominan:['Pertanian','Kuliner'],   totalModal:'Rp 2,9M',  potensi:'Sentra buah dan sayur dengan potensi agrowisata berkembang.' },
  { nama:'Jember',     umkm:620,  verified:185, investor:34,  sektorDominan:['Pertanian','Kuliner'],   totalModal:'Rp 2,6M',  potensi:'Penghasil tembakau dan kopi dengan peluang UMKM agrikultur tinggi.' },
  { nama:'Banyuwangi', umkm:580,  verified:172, investor:31,  sektorDominan:['Pariwisata','Pertanian'],totalModal:'Rp 2,4M',  potensi:'Destinasi wisata nasional dengan UMKM kerajinan dan kuliner lokal.' },
  { nama:'Mojokerto',  umkm:520,  verified:155, investor:28,  sektorDominan:['Manufaktur','Fashion'],  totalModal:'Rp 2,1M',  potensi:'Sentra industri alas kaki dan tekstil skala UMKM.' },
  { nama:'Probolinggo', umkm:480, verified:140, investor:25,  sektorDominan:['Pertanian','Kuliner'],   totalModal:'Rp 1,9M',  potensi:'Sentra anggur dan buah tropis dengan potensi ekspor.' },
  { nama:'Tulungagung', umkm:440, verified:128, investor:22,  sektorDominan:['Marmer','Fashion'],      totalModal:'Rp 1,8M',  potensi:'Industri marmer dan kerajinan tangan khas Jawa Timur.' },
  { nama:'Blitar',     umkm:410, verified:118, investor:20,  sektorDominan:['Pertanian','Kuliner'],   totalModal:'Rp 1,6M',  potensi:'Sentra coklat dan produk pertanian organik.' },
]

const maxVal = computed(() => Math.max(...kabupatenData.map(k => k[selectedMetrik.value])))
const sortedKabupaten = computed(() => [...kabupatenData].sort((a,b) => b[selectedMetrik.value] - a[selectedMetrik.value]))

function getHeatColor(val, max) {
  const ratio = val / max
  if (ratio > 0.8) return '#6A994E'
  if (ratio > 0.6) return '#8ab86e'
  if (ratio > 0.4) return '#a8cc88'
  if (ratio > 0.2) return '#c8ddb8'
  return '#EEF6E8'
}

function formatVal(val) {
  return val?.toLocaleString('id-ID') ?? '-'
}

const summaryStats = [
  { icon:'map',       label:'Kabupaten/Kota',   value:'38',     color:'#6A994E' },
  { icon:'store',     label:'Total UMKM Jatim',  value:'12.547', color:'#6A994E' },
  { icon:'verified',  label:'Rata-rata Verifikasi', value:'31%', color:'#3A86FF' },
  { icon:'groups',    label:'Total Investor',    value:'863',    color:'#F4A261' },
]
</script>