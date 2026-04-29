<template>
  <div class="space-y-6">

    <!-- ══ TAB NAVIGATION ══════════════════════════════════ -->
    <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id
          ? 'bg-white text-slate-800 shadow-sm font-semibold'
          : 'text-slate-500 hover:text-slate-700'"
        class="px-4 py-2 rounded-lg text-sm transition-all">
        {{ tab.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════
         TAB 1: RESPONS MASUK
    ══════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'responses'">
      <!-- Aksi atas -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Respons Kuesioner</h2>
          <p class="text-sm text-slate-400">Data masuk dari siswa · Approve untuk masuk ke clustering</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button @click="copyLink"
              class="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Salin Link Siswa
          </button>
          <button @click="exportCSV"
            class="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <!-- Link Info -->
      <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
        <p class="text-sm font-semibold text-blue-700 mb-1">Link Kuesioner untuk Siswa</p>
        <p class="text-xs text-blue-500 mb-2">Bagikan ke siswa via WhatsApp atau grup kelas:</p>
        <code class="text-xs bg-blue-100 px-3 py-2 rounded-lg block text-blue-800 break-all select-all">{{ studentLink }}</code>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <div v-for="stat in responseStats" :key="stat.label"
          class="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div v-if="!responses.length" class="py-16 text-center">
          <p class="text-4xl mb-3">📭</p>
          <p class="text-sm font-medium text-slate-400">Belum ada respons masuk</p>
          <p class="text-xs text-slate-300 mt-1">Bagikan link di atas ke siswa</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm min-w-[700px]">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th v-for="h in ['Nama','Kelas','Screen Time','Konsentrasi','Tidur','Mood','Pemahaman','Waktu','Aksi']"
                  :key="h" class="text-left px-4 py-3 text-slate-800 font-medium text-xs uppercase tracking-wide">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in responses" :key="i"
                class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-800">{{ r.nama }}</td>
                <td class="px-4 py-3 text-slate-500 text-xs">{{ r.kelas }}</td>
                <td class="px-4 py-3">
                  <span class="font-semibold text-sm"
                    :class="r.screen_time >= 8 ? 'text-red-500' : r.screen_time >= 5 ? 'text-orange-500' : 'text-teal-600'">
                    {{ r.screen_time }}j
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 text-xs">{{ r.konsentrasi }}%</td>
                <td class="px-4 py-3 text-slate-600 text-xs">{{ r.tidur }}%</td>
                <td class="px-4 py-3 text-slate-600 text-xs">{{ r.mood }}%</td>
                <td class="px-4 py-3 text-slate-600 text-xs">{{ r.pemahaman_materi }}%</td>
                <td class="px-4 py-3 text-slate-400 text-xs">{{ fmtDate(r.submittedAt) }}</td>
                <td class="px-4 py-3">
                  <button v-if="!r.processed" @click="approve(i)"
                    class="bg-teal-500 hover:bg-teal-600 text-grey-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                    + Masukkan
                  </button>
                  <span v-else class="text-teal-500 text-xs font-medium">Masuk</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         TAB 2: MANAJEMEN SOAL + AI
    ══════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'questions'" class="space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Manajemen Soal Kuesioner</h2>
          <p class="text-sm text-slate-400">Edit, tambah, atau hapus pertanyaan · Gunakan AI untuk rekomendasi soal</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <!-- <button @click="showAiPanel = !showAiPanel"
            :class="showAiPanel ? 'bg-violet-600 text-white' : 'border border-violet-300 text-violet-600 hover:bg-violet-50'"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Rekomendasi AI
          </button> -->
          <button @click="openAddModal"
           class="text-xs font-semibold text-slate-700 uppercase tracking-wide border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all">
            + Tambah Soal
          </button>
          <button @click="saveQuestions"
            class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Simpan & Aktifkan
          </button>
        </div>
      </div>

      <!-- Panel AI Rekomendasi -->
      <div v-if="showAiPanel" class="bg-violet-50 border border-violet-200 rounded-2xl p-5">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">AI</div>
          <div>
            <h3 class="font-semibold text-violet-800 text-sm">Rekomendasi Soal oleh Claude AI</h3>
            <p class="text-xs text-violet-600 mt-0.5">Jelaskan variabel atau aspek apa yang ingin kamu ukur, AI akan merekomendasikan soal yang tepat untuk clustering K-Means</p>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1 block">Konteks Kebutuhan</label>
            <textarea v-model="aiPrompt" rows="3"
              placeholder="Contoh: Saya ingin mengukur tingkat kecanduan media sosial dan dampaknya pada prestasi belajar siswa SMA. Variabel yang sudah ada: screen_time, konsentrasi, tidur, mood, pemahaman_materi."
              class="w-full border border-violet-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white resize-none"></textarea>
          </div>

          <div class="flex gap-2 flex-wrap">
            <button v-for="preset in aiPresets" :key="preset"
              @click="aiPrompt = preset"
              class="text-xs bg-white border border-violet-200 text-violet-600 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-all">
              {{ preset.substring(0, 40) }}...
            </button>
          </div>

          <button @click="askAI" :disabled="aiLoading || !aiPrompt.trim()"
            :class="aiLoading || !aiPrompt.trim() ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 text-white'"
            class="w-full rounded-xl py-3 text-sm font-bold transition-all">
            {{ aiLoading ? 'AI sedang menganalisis...' : 'Minta Rekomendasi AI' }}
          </button>
        </div>

        <!-- Hasil AI -->
        <div v-if="aiResult.length" class="mt-4 space-y-3">
          <p class="text-xs font-semibold text-violet-700 uppercase tracking-wide">Rekomendasi AI ({{ aiResult.length }} soal)</p>
          <div v-for="(q, i) in aiResult" :key="i"
            class="bg-white border border-violet-100 rounded-xl p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <span class="inline-block text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md mb-2 font-medium">
                  {{ q.variabel }}
                </span>
                <p class="text-sm font-medium text-slate-800">{{ q.text }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ q.hint }}</p>
                <p class="text-xs text-violet-600 mt-1.5 font-medium">Tipe: {{ q.type }}</p>
              </div>
              <button @click="addAiQuestion(q)"
                class="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all">
                + Pakai
              </button>
            </div>
          </div>
          <p class="text-xs text-slate-400 italic">* Tinjau dan sesuaikan soal sebelum mengaktifkan ke kuesioner siswa</p>
        </div>

        <!-- Error AI -->
        <div v-if="aiError" class="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
          <p class="text-xs text-red-600">{{ aiError }}</p>
        </div>
      </div>

      <!-- Daftar Soal Aktif -->
      <div class="space-y-3">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Soal Aktif ({{ editableQuestions.length }} pertanyaan)
        </p>
        <div v-if="!editableQuestions.length" class="bg-white border border-slate-100 rounded-xl p-8 text-center">
          <p class="text-slate-400 text-sm">Belum ada soal. Tambah manual atau gunakan rekomendasi AI.</p>
        </div>
        <div v-for="(q, i) in editableQuestions" :key="q.id"
          class="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">{{ q.variabel || 'informatif' }}</span>
                <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{{ q.type }}</span>
              </div>
              <p class="text-sm font-medium text-slate-800 leading-relaxed">{{ q.text }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ q.hint }}</p>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button @click="openEditModal(i)"
                class="text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all">
                Edit
              </button>
              <button @click="deleteQuestion(i)"
                class="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         TAB 3: PREVIEW TAMPILAN SISWA
    ══════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'preview'">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Preview Tampilan Siswa</h2>
          <p class="text-sm text-slate-400">Tampilan persis se  perti yang akan dilihat siswa</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">Soal {{ previewStep + 1 }} dari {{ editableQuestions.length + 2 }}</span>
          <button @click="previewStep = Math.max(0, previewStep-1)" :disabled="previewStep === 0"
            class="border border-slate-200 text-slate-500 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40">
            Prev
          </button>
          <button @click="previewStep = Math.min(editableQuestions.length + 1, previewStep+1)"
            :disabled="previewStep === editableQuestions.length + 1"
            class="border border-slate-200 text-slate-500 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40">
            Next
          </button>
        </div>
      </div>

      <!-- Frame preview mirip tampilan siswa -->
      <div class="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <!-- Simulasi header siswa -->
        <div class="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <span class="text-gray-600 font-bold text-sm">AQL-Metrics</span>
          <span class="text-slate-400 text-xs">Kuesioner</span>
        </div>

        <div class="p-5">
          <!-- Progress preview -->
          <div class="mb-4">
            <div class="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>
                <span v-if="previewStep === 0">Data Diri</span>
                <span v-else-if="previewStep <= editableQuestions.length">Pertanyaan {{ previewStep }} dari {{ editableQuestions.length }}</span>
                <span v-else>Muhasabah</span>
              </span>
              <span class="text-gray-500 font-medium">{{ Math.round(previewStep / (editableQuestions.length + 1) * 100) }}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5">
              <div class="bg-teal-500 h-1.5 rounded-full transition-all"
                :style="{ width: Math.round(previewStep / (editableQuestions.length + 1) * 100) + '%' }"></div>
            </div>
          </div>

          <!-- Step 0 preview -->
          <div v-if="previewStep === 0" class="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
            <p class="text-sm font-semibold text-slate-700">Data Diri Siswa</p>
            <div class="h-9 bg-slate-100 rounded-lg"></div>
            <div class="h-9 bg-slate-100 rounded-lg"></div>
            <div class="flex gap-2">
              <div class="flex-1 h-9 bg-slate-100 rounded-lg"></div>
              <div class="flex-1 h-9 bg-slate-100 rounded-lg"></div>
            </div>
          </div>

          <!-- Pertanyaan preview -->
          <div v-else-if="previewStep <= editableQuestions.length"
            class="bg-white rounded-xl border border-slate-100 p-4">
            <p class="text-sm font-semibold text-slate-800 leading-relaxed mb-1">
              {{ editableQuestions[previewStep-1].text }}
            </p>
            <p class="text-xs text-slate-400 mb-4">{{ editableQuestions[previewStep-1].hint }}</p>

            <!-- Preview slider -->
            <div v-if="editableQuestions[previewStep-1].type === 'slider'" class="space-y-2">
              <div class="text-center"><span class="text-2xl font-bold text-gray-500">6</span><span class="text-slate-400 text-xs ml-1">jam/hari</span></div>
              <div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-teal-400 h-2 rounded-full w-1/2"></div></div>
            </div>

            <!-- Preview scale -->
            <div v-else-if="editableQuestions[previewStep-1].type === 'scale'">
              <div class="grid grid-cols-5 gap-1.5">
                <div v-for="n in 5" :key="n"
                  :class="n === 3 ? 'bg-teal-500 text-gray' : 'bg-slate-100 text-blue-400'"
                  class="rounded-lg py-2 text-xs font-bold text-center">{{ n }}</div>
              </div>
              <div class="flex justify-between text-xs text-slate-300 mt-1 px-0.5">
                <span>{{ editableQuestions[previewStep-1].scaleMin }}</span>
                <span>{{ editableQuestions[previewStep-1].scaleMax }}</span>
              </div>
            </div>

            <!-- Preview choice -->
            <div v-else-if="editableQuestions[previewStep-1].type === 'choice'" class="space-y-1.5">
              <div v-for="(opt, oi) in (editableQuestions[previewStep-1].options || [])" :key="oi"
                :class="oi === 1 ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-slate-50 border-slate-100 text-slate-500'"
                class="w-full border rounded-lg px-3 py-2 text-xs text-left">
                {{ opt.label }}
              </div>
            </div>
          </div>

          <!-- Muhasabah preview -->
          <div v-else class="bg-white rounded-xl border border-slate-100 p-4">
            <p class="text-sm font-semibold text-slate-700 text-center mb-3">Muhasabah Digital</p>
            <div class="bg-teal-50 rounded-lg p-3 mb-3">
              <p class="text-xs text-teal-600 text-center italic">QS. Al-Isra: 36 — tentang pertanggungjawaban indra</p>
            </div>
            <div class="flex gap-2">
              <div v-for="o in ['Sudah','Sebagian','Belum']" :key="o"
                :class="o==='Sudah' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'"
                class="flex-1 rounded-lg py-2 text-xs text-center font-medium">{{ o }}</div>
            </div>
          </div>

          <!-- Nav preview -->
          <div class="flex gap-2 mt-4">
            <div class="flex-1 border border-slate-200 bg-gray-100 rounded-xl py-2.5 text-xs font-medium text-slate-400 text-center">Kembali</div>
            <div class="flex-1 bg-green-200 rounded-xl py-2.5 text-xs font-bold text-green-500 text-center">Lanjut</div>
          </div>
        </div>
      </div>
    </div>

 
    <!-- ══════════════════════════════════════════════════════
         MODAL: Tambah / Edit Soal
    ══════════════════════════════════════════════════════ -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 class="font-bold text-slate-800">{{ editingIndex >= 0 ? 'Edit Soal' : 'Tambah Soal Baru' }}</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Teks pertanyaan -->
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Teks Pertanyaan *</label>
            <textarea v-model="modalForm.text" rows="3"
              placeholder="Tulis pertanyaan yang akan dilihat siswa..."
              class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"></textarea>
          </div>

          <!-- Hint -->
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Keterangan / Hint</label>
            <input v-model="modalForm.hint" type="text"
              placeholder="Petunjuk tambahan untuk siswa (opsional)"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>

          <!-- Variabel -->
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Variabel Clustering</label>
            <select v-model="modalForm.variabel"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
              <option value="">-- Pilih variabel --</option>
              <option value="screen_time">screen_time — Durasi penggunaan gawai</option>
              <option value="konsentrasi">konsentrasi — Kemampuan fokus belajar</option>
              <option value="tidur">tidur — Kualitas dan durasi tidur</option>
              <option value="mood">mood — Kondisi emosional / perasaan</option>
              <option value="pemahaman_materi">pemahaman_materi — Pemahaman pelajaran</option>
              <option value="informatif">informatif — Tidak masuk clustering</option>
            </select>
            <p class="text-xs text-slate-400 mt-1">Jawaban soal ini akan dipetakan ke variabel tersebut saat clustering</p>
          </div>

          <!-- Tipe soal -->
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Tipe Soal *</label>
            <div class="flex gap-2">
              <button v-for="t in ['slider','scale','choice']" :key="t"
                @click="modalForm.type = t"
                :class="modalForm.type === t ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'"
                class="flex-1 border rounded-xl py-2 text-sm font-medium transition-all capitalize">
                {{ t }}
              </button>
            </div>
          </div>

          <!-- Slider config -->
          <div v-if="modalForm.type === 'slider'" class="grid grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Min</label>
              <input v-model.number="modalForm.min" type="number"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Max</label>
              <input v-model.number="modalForm.max" type="number"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Satuan</label>
              <input v-model="modalForm.unit" type="text" placeholder="jam/hari"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>

          <!-- Scale config -->
          <div v-if="modalForm.type === 'scale'" class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Label Kiri (nilai 1)</label>
              <input v-model="modalForm.scaleMin" type="text" placeholder="Sangat buruk"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label class="text-xs text-slate-500 mb-1 block">Label Kanan (nilai 5)</label>
              <input v-model="modalForm.scaleMax" type="text" placeholder="Sangat baik"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>

          <!-- Choice config -->
          <div v-if="modalForm.type === 'choice'">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Pilihan Jawaban</label>
            <div v-for="(opt, oi) in modalForm.options" :key="oi" class="flex gap-2 mb-2">
              <input v-model="modalForm.options[oi].label" type="text"
                :placeholder="'Pilihan ' + (oi+1)"
                class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <button @click="modalForm.options.splice(oi, 1)"
                class="text-red-400 hover:text-red-600 px-2 text-lg leading-none">×</button>
            </div>
            <button @click="modalForm.options.push({ label: '', value: modalForm.options.length + 1 })"
              class="text-xs text-teal-600 hover:text-teal-700 border border-dashed border-teal-300 rounded-xl px-4 py-2 w-full transition-all">
              + Tambah Pilihan
            </button>
          </div>
        </div>

        <div class="flex gap-3 p-5 border-t border-slate-100">
          <button @click="showModal = false"
            class="flex-1 border border-slate-200 text-slate-500 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50 transition-all">
            Batal
          </button>
          <button @click="saveModal" :disabled="!modalForm.text.trim() || !modalForm.type"
            :class="!modalForm.text.trim() || !modalForm.type ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-white'"
            class="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all">
            {{ editingIndex >= 0 ? 'Simpan Perubahan' : 'Tambahkan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['student-added'])

// ── Tabs ──────────────────────────────────────────────────
const tabs = [
  { id: 'responses', label: 'Respons Masuk' },
  { id: 'questions', label: 'Kelola Soal' },
  { id: 'preview',   label: 'Preview Siswa' },
]
const activeTab = ref('responses')

// ── Respons ────────────────────────────────────────────────
const responses = ref([])

const responseStats = computed(() => [
  { label: 'Total Respons', value: responses.value.length, color: 'text-slate-800' },
  { label: 'Belum Diproses', value: responses.value.filter(r => !r.processed).length, color: 'text-orange-500' },
  { label: 'Sudah Masuk', value: responses.value.filter(r => r.processed).length, color: 'text-slate-600' }
])

const approve = (i) => {
  const r = responses.value[i]
  emit('student-added', {
    nama: r.nama, kelas: r.kelas,
    screen_time: r.screen_time, konsentrasi: r.konsentrasi,
    tidur: r.tidur, mood: r.mood, pemahaman_materi: r.pemahaman_materi
  })
  responses.value[i].processed = true
  localStorage.setItem('aql_pending_responses', JSON.stringify(responses.value))
}

const studentLink = computed(() => window.location.origin + '/siswa')

const copyLink = () => {
  navigator.clipboard.writeText(studentLink.value)
  alert('Link berhasil disalin!')
}

const exportCSV = () => {
  if (!responses.value.length) return alert('Belum ada data!')
  const h = ['nama','kelas','screen_time','konsentrasi','tidur','mood','pemahaman_materi','cluster','submittedAt']
  const rows = responses.value.map(r => h.map(k => r[k] ?? '').join(','))
  const blob = new Blob([[h.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `aql-kuesioner-${Date.now()}.csv`
  a.click()
}

// ── Kelola Soal ────────────────────────────────────────────
const editableQuestions = ref([])
const previewStep = ref(0)

const saveQuestions = () => {
  localStorage.setItem('aql_active_questions', JSON.stringify(editableQuestions.value))
  alert('Soal berhasil disimpan dan diaktifkan ke kuesioner siswa!')
}

const deleteQuestion = (i) => {
  if (confirm('Hapus soal ini?')) editableQuestions.value.splice(i, 1)
}

// ── Modal Tambah/Edit ──────────────────────────────────────
const showModal = ref(false)
const editingIndex = ref(-1)
const blankForm = () => ({
  text: '', hint: '', variabel: '', type: 'scale',
  min: 0, max: 16, step: 0.5, unit: 'jam/hari',
  scaleMin: '', scaleMax: '',
  options: [
    { label: '', value: 1 }, { label: '', value: 2 },
    { label: '', value: 3 }, { label: '', value: 4 }, { label: '', value: 5 }
  ]
})
const modalForm = ref(blankForm())

const openAddModal = () => {
  editingIndex.value = -1
  modalForm.value = blankForm()
  showModal.value = true
}

const openEditModal = (i) => {
  editingIndex.value = i
  modalForm.value = JSON.parse(JSON.stringify(editableQuestions.value[i]))
  if (!modalForm.value.options) modalForm.value.options = blankForm().options
  showModal.value = true
}

const saveModal = () => {
  const q = {
    id: 'q_' + Date.now(),
    text: modalForm.value.text.trim(),
    hint: modalForm.value.hint.trim(),
    variabel: modalForm.value.variabel,
    type: modalForm.value.type,
    ...(modalForm.value.type === 'slider' && {
      min: modalForm.value.min, max: modalForm.value.max,
      step: modalForm.value.step || 0.5, unit: modalForm.value.unit
    }),
    ...(modalForm.value.type === 'scale' && {
      scaleMin: modalForm.value.scaleMin, scaleMax: modalForm.value.scaleMax
    }),
    ...(modalForm.value.type === 'choice' && {
      options: modalForm.value.options.filter(o => o.label.trim()).map((o, i) => ({ ...o, value: i + 1 }))
    })
  }
  if (editingIndex.value >= 0) {
    editableQuestions.value[editingIndex.value] = q
  } else {
    editableQuestions.value.push(q)
  }
  showModal.value = false
}

// // ── AI Rekomendasi ─────────────────────────────────────────
// const showAiPanel = ref(false)
// const aiPrompt = ref('')
// const aiLoading = ref(false)
// const aiResult = ref([])
// const aiError = ref('')

// const aiPresets = [
//   'Saya ingin mengukur tingkat kecanduan media sosial dan dampaknya pada prestasi belajar. Variabel: screen_time, konsentrasi, tidur, mood, pemahaman_materi.',
//   'Saya butuh soal untuk mengukur pola begadang siswa dan pengaruhnya pada konsentrasi dan mood di kelas.',
//   'Tambahkan soal untuk mengukur seberapa sering siswa menggunakan HP saat jam pelajaran berlangsung.'
// ]

// const askAI = async () => {
//   if (!aiPrompt.value.trim()) return
//   aiLoading.value = true
//   aiError.value = ''
//   aiResult.value = []

//   try {
//     const systemPrompt = `Kamu adalah ahli pendidikan dan psikologi yang membantu Guru BK menyusun pertanyaan kuesioner untuk mengukur kesehatan digital siswa SMA.

// Tugasmu: berikan 3–5 rekomendasi pertanyaan kuesioner yang:
// 1. Relevan dengan variabel clustering K-Means: screen_time, konsentrasi, tidur, mood, pemahaman_materi
// 2. Mudah dipahami siswa SMA
// 3. Dapat dikuantifikasi untuk analisis data

// Balas HANYA dengan JSON array, tanpa teks lain, format:
// [
//   {
//     "text": "teks pertanyaan",
//     "hint": "keterangan petunjuk singkat",
//     "variabel": "nama_variabel",
//     "type": "scale|choice|slider",
//     "alasan": "kenapa pertanyaan ini relevan untuk clustering"
//   }
// ]`

//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'claude-sonnet-4-20250514',
//         max_tokens: 1000,
//         system: systemPrompt,
//         messages: [{ role: 'user', content: aiPrompt.value }]
//       })
//     })

//     const data = await response.json()
//     const text = data.content?.map(c => c.text || '').join('') || ''
//     const clean = text.replace(/```json|```/g, '').trim()
//     const parsed = JSON.parse(clean)
//     aiResult.value = parsed
//   } catch (err) {
//     aiError.value = 'Gagal mendapatkan rekomendasi AI. Pastikan koneksi internet aktif dan coba lagi.'
//     console.error(err)
//   } finally {
//     aiLoading.value = false
//   }
// }

// const addAiQuestion = (q) => {
//   editableQuestions.value.push({
//     id: 'q_ai_' + Date.now(),
//     text: q.text,
//     hint: q.hint,
//     variabel: q.variabel,
//     type: q.type || 'scale',
//     ...(q.type === 'scale' && { scaleMin: 'Sangat rendah', scaleMax: 'Sangat tinggi' }),
//     ...(q.type === 'choice' && { options: [
//       { label: 'Sangat jarang', value: 1 },
//       { label: 'Jarang', value: 2 },
//       { label: 'Kadang-kadang', value: 3 },
//       { label: 'Sering', value: 4 },
//       { label: 'Sangat sering', value: 5 }
//     ]})
//   })
//   alert(`Soal berhasil ditambahkan ke daftar! Klik "Simpan & Aktifkan" untuk menerapkan.`)
// }

// ── Utils ──────────────────────────────────────────────────
const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('id-ID', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
}) : ''

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  responses.value = JSON.parse(localStorage.getItem('aql_pending_responses') || '[]')
  try {
    const saved = localStorage.getItem('aql_active_questions')
    if (saved) editableQuestions.value = JSON.parse(saved)
    else editableQuestions.value = JSON.parse(JSON.stringify(defaultQuestions))
  } catch {
    editableQuestions.value = JSON.parse(JSON.stringify(defaultQuestions))
  }
})

// ── Default Questions (fallback) ───────────────────────────
const defaultQuestions = [
  { id:'q1', variabel:'screen_time', type:'slider', min:0, max:16, step:0.5, unit:'jam/hari', text:'Rata-rata, berapa jam kamu menggunakan gawai untuk hiburan setiap hari?', hint:'Termasuk TikTok, YouTube, Instagram, game — tidak termasuk belajar' },
  { id:'q2', variabel:'konsentrasi', type:'choice', text:'Seberapa sering kamu menonton video pendek tanpa henti (doomscrolling)?', hint:'Scroll video terus-menerus tanpa tujuan jelas', options:[{label:'Hampir tidak pernah',value:1},{label:'1–2 kali seminggu',value:2},{label:'Hampir setiap hari',value:3},{label:'Setiap hari lebih dari 1 jam',value:4},{label:'Hampir setiap waktu luang',value:5}] },
  { id:'q3', variabel:'konsentrasi', type:'scale', scaleMin:'Tidak terganggu', scaleMax:'Sangat terganggu', text:'Ketika belajar, seberapa mudah kamu terganggu oleh HP?', hint:'1 = Tidak terganggu · 5 = Sangat mudah terganggu' },
  { id:'q4', variabel:'konsentrasi', type:'scale', scaleMin:'Sangat sulit fokus', scaleMax:'Sangat mudah fokus', text:'Seberapa baik kemampuan kamu berkonsentrasi saat pelajaran di kelas?', hint:'1 = Sangat sulit fokus · 5 = Sangat mudah fokus' },
  { id:'q5', variabel:'tidur', type:'choice', text:'Bagaimana kualitas tidurmu dalam seminggu terakhir?', hint:'Tidur cukup 7–9 jam sangat mempengaruhi kemampuan belajar', options:[{label:'Sangat baik — 8+ jam dan segar',value:5},{label:'Baik — 7–8 jam',value:4},{label:'Lumayan — 6–7 jam',value:3},{label:'Kurang — 5–6 jam karena main HP',value:2},{label:'Sangat kurang — sering begadang',value:1}] },
  { id:'q6', variabel:'mood', type:'scale', scaleMin:'Sangat buruk', scaleMax:'Sangat baik', text:'Bagaimana kondisi mood atau perasaanmu secara umum minggu ini?', hint:'1 = Sangat buruk / mudah marah · 5 = Sangat baik / semangat' },
  { id:'q7', variabel:'pemahaman_materi', type:'scale', scaleMin:'Tidak paham', scaleMax:'Paham semua', text:'Seberapa baik kamu memahami materi pelajaran yang diajarkan minggu ini?', hint:'1 = Tidak paham sama sekali · 5 = Paham semua dengan baik' },
  { id:'q8', variabel:'informatif', type:'choice', text:'Apa alasan utama kamu menggunakan gawai dalam waktu lama?', hint:'Pilih yang paling mendekati kebiasaanmu', options:[{label:'Untuk belajar atau mencari referensi',value:1},{label:'Komunikasi dengan teman atau keluarga',value:2},{label:'Hiburan (game, video, sosmed)',value:3},{label:'Sudah jadi kebiasaan',value:4},{label:'Mengisi waktu karena bosan',value:5}] }
]
</script>