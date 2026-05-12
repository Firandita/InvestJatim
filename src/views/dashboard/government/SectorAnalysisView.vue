<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold" style="color:#2E2E2E">Analisis Sektor UMKM Jawa Timur</h1>
        <p class="text-sm mt-0.5" style="color:#777">Perbandingan kinerja dan potensi investasi per sektor industri</p>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        <button
          v-for="s in sektorList" :key="s.value"
          @click="selectedSektor = s.value"
          :class="['btn-secondary']"
          :style="{
            fontSize:'0.78rem', padding:'0.4rem 0.85rem',
            background: selectedSektor === s.value ? '#6A994E' : 'white',
            color: selectedSektor === s.value ? 'white' : '#6A994E',
            borderColor: '#6A994E'
          }"
        >{{ s.label }}</button>
      </div>
    </div>

    <!-- Sektor KPI -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4" v-for="kpi in currentSektor.kpis" :key="kpi.label">
        <span class="material-symbols-rounded" :style="{ fontSize:'1.4rem', color: kpi.color, display:'block', marginBottom:'0.5rem' }">{{ kpi.icon }}</span>
        <div style="font-size:1.4rem;font-weight:800;color:#2E2E2E;letter-spacing:-0.02em">{{ kpi.value }}</div>
        <div style="font-size:0.75rem;color:#777;margin-top:0.2rem">{{ kpi.label }}</div>
      </div>
    </div>

    <!-- Main Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Omzet per Subsektor -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1.25rem">Rata-rata Omzet per Subsektor (Juta/Bln)</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          <div v-for="sub in currentSektor.subsektor" :key="sub.name">
            <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:0.35rem">
              <span style="color:#555">{{ sub.name }}</span>
              <span style="font-weight:700;color:#2E2E2E">Rp {{ sub.omzet }} Jt</span>
            </div>
            <div style="height:8px;background:#e8e8e4;border-radius:99px;overflow:hidden">
              <div :style="{
                width: (sub.omzet / currentSektor.maxOmzet * 100) + '%',
                height: '100%', background: '#6A994E', borderRadius: '99px', transition: 'width 0.5s'
              }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kebutuhan Modal vs Investor Minat -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1.25rem">Kebutuhan Modal vs Minat Investor</h3>
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div v-for="sub in currentSektor.subsektor" :key="sub.name + '_inv'"
               style="padding:0.875rem;background:#F7F7F5;border-radius:0.75rem">
            <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
              <span style="font-size:0.82rem;font-weight:600;color:#2E2E2E">{{ sub.name }}</span>
              <span style="font-size:0.75rem;color:#6A994E;font-weight:600">{{ sub.investor }} investor</span>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center">
              <span style="font-size:0.7rem;color:#777;width:60px">Modal</span>
              <div style="flex:1;height:6px;background:#e8e8e4;border-radius:99px;overflow:hidden">
                <div :style="{ width: (sub.modal/currentSektor.maxModal*100)+'%', height:'100%', background:'#F4A261', borderRadius:'99px' }"></div>
              </div>
              <span style="font-size:0.7rem;color:#777;width:50px;text-align:right">Rp {{ sub.modal }}Jt</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tren Tahunan & Potensi -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Tren Pertumbuhan -->
      <div class="card p-5 lg:col-span-2">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1.25rem">Tren Pertumbuhan UMKM Sektor {{ currentSektor.label }} (2022–2026)</h3>
        <div style="display:flex;align-items:flex-end;gap:0.75rem;height:150px">
          <div v-for="(item, i) in currentSektor.tren" :key="item.tahun"
               style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.4rem">
            <span style="font-size:0.72rem;color:#777;font-weight:600">{{ item.jumlah }}</span>
            <div :style="{
              width:'100%', borderRadius:'6px 6px 0 0',
              background: i === currentSektor.tren.length-1 ? '#6A994E' : '#c8ddb8',
              height: (item.jumlah / Math.max(...currentSektor.tren.map(t=>t.jumlah)) * 120) + 'px',
              transition: 'height 0.5s'
            }"></div>
            <span style="font-size:0.72rem;color:#aaa">{{ item.tahun }}</span>
          </div>
        </div>
      </div>

      <!-- Rekomendasi Kebijakan -->
      <div class="card p-5">
        <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">Rekomendasi Kebijakan</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          <div v-for="rek in currentSektor.rekomendasi" :key="rek"
               style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.75rem;background:#EEF6E8;border-radius:0.75rem">
            <span class="material-symbols-rounded" style="font-size:1rem;color:#6A994E;flex-shrink:0;margin-top:0.1rem">lightbulb</span>
            <p style="font-size:0.78rem;color:#2E2E2E;line-height:1.5">{{ rek }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel UMKM Unggulan per Sektor -->
    <div class="card p-5">
      <h3 style="font-weight:700;color:#2E2E2E;margin-bottom:1rem">UMKM Unggulan — Sektor {{ currentSektor.label }}</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
          <thead>
            <tr style="background:#F7F7F5">
              <th style="padding:0.75rem;text-align:left;color:#777;font-weight:600;border-radius:0.5rem 0 0 0.5rem">Nama UMKM</th>
              <th style="padding:0.75rem;text-align:left;color:#777;font-weight:600">Kabupaten</th>
              <th style="padding:0.75rem;text-align:right;color:#777;font-weight:600">Omzet/Bln</th>
              <th style="padding:0.75rem;text-align:right;color:#777;font-weight:600">Modal Dibutuhkan</th>
              <th style="padding:0.75rem;text-align:center;color:#777;font-weight:600;border-radius:0 0.5rem 0.5rem 0">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, i) in currentSektor.umkmUnggulan" :key="i"
                style="border-bottom:1px solid #F7F7F5">
              <td style="padding:0.875rem 0.75rem;font-weight:600;color:#2E2E2E">{{ u.nama }}</td>
              <td style="padding:0.875rem 0.75rem;color:#555">{{ u.kabupaten }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:right;color:#6A994E;font-weight:700">{{ u.omzet }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:right;color:#F4A261;font-weight:700">{{ u.modal }}</td>
              <td style="padding:0.875rem 0.75rem;text-align:center">
                <span class="badge-verified" v-if="u.verified">
                  <span class="material-symbols-rounded" style="font-size:0.85rem">verified</span>
                  Terverifikasi
                </span>
                <span class="badge-pending" v-else>
                  <span class="material-symbols-rounded" style="font-size:0.85rem">pending</span>
                  Proses
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

const selectedSektor = ref('kuliner')

const sektorList = [
  { value: 'kuliner',     label: 'Kuliner' },
  { value: 'fashion',     label: 'Fashion' },
  { value: 'pertanian',   label: 'Pertanian' },
  { value: 'manufaktur',  label: 'Manufaktur' },
]

const sektorDatabase = {
  kuliner: {
    label: 'Kuliner',
    kpis: [
      { icon: 'store',    label: 'Total UMKM Kuliner',   value: '4.820', color: '#6A994E' },
      { icon: 'payments', label: 'Rata-rata Omzet/Bln',  value: 'Rp 18Jt', color: '#F4A261' },
      { icon: 'groups',   label: 'Investor Tertarik',    value: '312',   color: '#3A86FF' },
      { icon: 'trending_up', label: 'Pertumbuhan YoY',  value: '+24%',  color: '#6A994E' },
    ],
    subsektor: [
      { name: 'Makanan Ringan',  omzet: 22, modal: 35, investor: 87 },
      { name: 'Minuman Kemasan', omzet: 31, modal: 55, investor: 64 },
      { name: 'Katering',        omzet: 45, modal: 80, investor: 92 },
      { name: 'Olahan Ikan',     omzet: 18, modal: 28, investor: 45 },
    ],
    maxOmzet: 45, maxModal: 80,
    tren: [
      { tahun: '2022', jumlah: 2800 },
      { tahun: '2023', jumlah: 3200 },
      { tahun: '2024', jumlah: 3750 },
      { tahun: '2025', jumlah: 4300 },
      { tahun: '2026', jumlah: 4820 },
    ],
    rekomendasi: [
      'Dorong sertifikasi Halal MUI untuk meningkatkan akses pasar ekspor ASEAN',
      'Fasilitasi pelatihan pengemasan modern dan branding digital',
      'Prioritaskan subsidi mesin produksi untuk UMKM kuliner dengan omzet > Rp 15Jt/bln',
    ],
    umkmUnggulan: [
      { nama: 'Keripik Tempe Jaya',    kabupaten: 'Sidoarjo', omzet: 'Rp 28Jt', modal: 'Rp 45Jt', verified: true },
      { nama: 'Sambal Petis Segoro',   kabupaten: 'Surabaya', omzet: 'Rp 12Jt', modal: 'Rp 20Jt', verified: false },
      { nama: 'Bakpia Malang Asri',    kabupaten: 'Malang',   omzet: 'Rp 35Jt', modal: 'Rp 60Jt', verified: true },
    ],
  },
  fashion: {
    label: 'Fashion',
    kpis: [
      { icon: 'store',       label: 'Total UMKM Fashion',  value: '2.150', color: '#6A994E' },
      { icon: 'payments',    label: 'Rata-rata Omzet/Bln', value: 'Rp 42Jt', color: '#F4A261' },
      { icon: 'groups',      label: 'Investor Tertarik',   value: '198',   color: '#3A86FF' },
      { icon: 'trending_up', label: 'Pertumbuhan YoY',    value: '+19%',  color: '#6A994E' },
    ],
    subsektor: [
      { name: 'Batik & Tenun',   omzet: 62, modal: 120, investor: 95 },
      { name: 'Konveksi',        omzet: 38, modal: 70,  investor: 60 },
      { name: 'Aksesoris',       omzet: 22, modal: 30,  investor: 43 },
    ],
    maxOmzet: 62, maxModal: 120,
    tren: [
      { tahun: '2022', jumlah: 1200 },
      { tahun: '2023', jumlah: 1450 },
      { tahun: '2024', jumlah: 1700 },
      { tahun: '2025', jumlah: 1920 },
      { tahun: '2026', jumlah: 2150 },
    ],
    rekomendasi: [
      'Kembangkan program wastra Jatim untuk meningkatkan nilai jual tenun dan batik lokal',
      'Fasilitasi akses marketplace internasional untuk produk fashion premium',
    ],
    umkmUnggulan: [
      { nama: 'Tenun Ikat Bandar Kidul', kabupaten: 'Kediri',   omzet: 'Rp 62Jt', modal: 'Rp 120Jt', verified: true },
      { nama: 'Batik Madura Sari',       kabupaten: 'Pamekasan', omzet: 'Rp 44Jt', modal: 'Rp 85Jt',  verified: true },
    ],
  },
  pertanian: {
    label: 'Pertanian',
    kpis: [
      { icon: 'store',       label: 'Total UMKM Pertanian', value: '1.890', color: '#6A994E' },
      { icon: 'payments',    label: 'Rata-rata Omzet/Bln',  value: 'Rp 25Jt', color: '#F4A261' },
      { icon: 'groups',      label: 'Investor Tertarik',    value: '143',   color: '#3A86FF' },
      { icon: 'trending_up', label: 'Pertumbuhan YoY',     value: '+12%',  color: '#6A994E' },
    ],
    subsektor: [
      { name: 'Hortikultura',  omzet: 28, modal: 50,  investor: 55 },
      { name: 'Perkebunan',    omzet: 35, modal: 90,  investor: 48 },
      { name: 'Perikanan',     omzet: 22, modal: 40,  investor: 40 },
    ],
    maxOmzet: 35, maxModal: 90,
    tren: [
      { tahun: '2022', jumlah: 1300 },
      { tahun: '2023', jumlah: 1450 },
      { tahun: '2024', jumlah: 1580 },
      { tahun: '2025', jumlah: 1720 },
      { tahun: '2026', jumlah: 1890 },
    ],
    rekomendasi: [
      'Dorong integrasi teknologi pertanian presisi untuk meningkatkan produktivitas',
      'Kembangkan cold chain logistics untuk produk hortikultura ekspor',
    ],
    umkmUnggulan: [
      { nama: 'Kebun Apel Batu Segar',  kabupaten: 'Batu',    omzet: 'Rp 38Jt', modal: 'Rp 75Jt', verified: true },
      { nama: 'Tambak Udang Lamongan',  kabupaten: 'Lamongan', omzet: 'Rp 55Jt', modal: 'Rp 110Jt', verified: false },
    ],
  },
  manufaktur: {
    label: 'Manufaktur',
    kpis: [
      { icon: 'store',       label: 'Total UMKM Manufaktur', value: '1.340', color: '#6A994E' },
      { icon: 'payments',    label: 'Rata-rata Omzet/Bln',   value: 'Rp 65Jt', color: '#F4A261' },
      { icon: 'groups',      label: 'Investor Tertarik',     value: '210',   color: '#3A86FF' },
      { icon: 'trending_up', label: 'Pertumbuhan YoY',      value: '+28%',  color: '#6A994E' },
    ],
    subsektor: [
      { name: 'Furnitur & Kayu',  omzet: 72, modal: 150, investor: 88 },
      { name: 'Logam & Mesin',    omzet: 85, modal: 200, investor: 72 },
      { name: 'Plastik & Karet',  omzet: 48, modal: 100, investor: 50 },
    ],
    maxOmzet: 85, maxModal: 200,
    tren: [
      { tahun: '2022', jumlah: 780 },
      { tahun: '2023', jumlah: 920 },
      { tahun: '2024', jumlah: 1050 },
      { tahun: '2025', jumlah: 1200 },
      { tahun: '2026', jumlah: 1340 },
    ],
    rekomendasi: [
      'Fasilitasi akses pembiayaan mesin industri melalui KUR Industri Manufaktur',
      'Dorong standarisasi SNI untuk produk manufaktur UMKM yang masuk rantai pasok industri besar',
    ],
    umkmUnggulan: [
      { nama: 'Mebel Jati Jepara Jatim', kabupaten: 'Mojokerto', omzet: 'Rp 78Jt', modal: 'Rp 160Jt', verified: true },
      { nama: 'Bengkel Las Presisi',      kabupaten: 'Gresik',    omzet: 'Rp 52Jt', modal: 'Rp 95Jt',  verified: false },
    ],
  },
}

const currentSektor = computed(() => sektorDatabase[selectedSektor.value])
</script>