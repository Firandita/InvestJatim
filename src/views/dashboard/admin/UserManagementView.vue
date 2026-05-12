<template>
  <div class="space-y-5">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ filteredUsers.length }} pengguna terdaftar</p>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="card p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"
              style="font-size:16px">search</span>
        <input v-model="search" class="input-base pl-8 text-sm" placeholder="Cari nama atau email..." />
      </div>
      <select v-model="filterRole" class="input-base sm:w-44 text-sm">
        <option value="semua">Semua Role</option>
        <option value="umkm">UMKM</option>
        <option value="investor">Investor</option>
        <option value="mentor">Mentor</option>
      </select>
      <select v-model="filterStatus" class="input-base sm:w-44 text-sm">
        <option value="semua">Semua Status</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <!-- Tabel -->
    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-surface">
              <th class="text-left px-4 py-3 text-xs text-gray-400 font-semibold">Pengguna</th>
              <th class="text-left px-4 py-3 text-xs text-gray-400 font-semibold">Role</th>
              <th class="text-left px-4 py-3 text-xs text-gray-400 font-semibold hidden md:table-cell">Bergabung</th>
              <th class="text-left px-4 py-3 text-xs text-gray-400 font-semibold">Status</th>
              <th class="text-left px-4 py-3 text-xs text-gray-400 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-surface transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    :style="{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: roleColor[user.role], color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '12px', flexShrink: 0
                    }"
                  >{{ user.nama[0] }}</div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ user.nama }}</p>
                    <p class="text-xs text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  :style="{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '99px',
                    fontWeight: 500, background: roleBg[user.role], color: roleColor[user.role]
                  }"
                >{{ roleLabel[user.role] }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                {{ user.bergabung }}
              </td>
              <td class="px-4 py-3">
                <span :class="user.status === 'verified' ? 'badge-verified' : 'badge-pending'">
                  {{ user.status === 'verified' ? 'Verified' : 'Pending' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleStatus(user)"
                    :class="user.status === 'verified' ? 'text-warning-500' : 'text-brand-600'"
                    class="text-xs hover:underline font-medium"
                  >
                    {{ user.status === 'verified' ? 'Suspend' : 'Aktifkan' }}
                  </button>
                  <span class="text-gray-200">|</span>
                  <button
                    @click="hapusUser(user)"
                    class="text-xs text-danger-500 hover:underline font-medium"
                  >Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="text-center py-12 text-gray-400">
        <span class="material-symbols-rounded text-gray-200 block mb-2" style="font-size:40px">
          person_off
        </span>
        Tidak ada pengguna yang cocok
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search       = ref('')
const filterRole   = ref('semua')
const filterStatus = ref('semua')

const roleColor = { umkm: '#6A994E', investor: '#3A86FF', mentor: '#F4A261', admin: '#2E2E2E' }
const roleBg    = { umkm: '#EEF6E8', investor: '#EBF3FF', mentor: '#FEF3E8', admin: '#F7F7F5' }
const roleLabel = { umkm: 'UMKM', investor: 'Investor', mentor: 'Mentor', admin: 'Admin' }

const users = ref([
  { id:1,  nama:'Batik Arjuna',       email:'batik@demo.com',    role:'umkm',     status:'verified', bergabung:'Jan 2024' },
  { id:2,  nama:'Budi Santoso',       email:'budi@demo.com',     role:'investor', status:'verified', bergabung:'Feb 2024' },
  { id:3,  nama:'Siti Rahayu',        email:'siti@demo.com',     role:'investor', status:'pending',  bergabung:'Mar 2024' },
  { id:4,  nama:'Kopi Ijen',          email:'kopi@demo.com',     role:'umkm',     status:'verified', bergabung:'Jan 2024' },
  { id:5,  nama:'Mentor Andi',        email:'andi@demo.com',     role:'mentor',   status:'verified', bergabung:'Des 2023' },
  { id:6,  nama:'Tempe Pak Hadi',     email:'tempe@demo.com',    role:'umkm',     status:'pending',  bergabung:'Apr 2024' },
  { id:7,  nama:'Rina Wulandari',     email:'rina@demo.com',     role:'investor', status:'pending',  bergabung:'Apr 2024' },
  { id:8,  nama:'Sambal Bu Rini',     email:'sambal@demo.com',   role:'umkm',     status:'verified', bergabung:'Mar 2024' },
  { id:9,  nama:'Konveksi Makmur',    email:'konveksi@demo.com', role:'umkm',     status:'verified', bergabung:'Feb 2024' },
  { id:10, nama:'Mentor Dewi',        email:'dewi@demo.com',     role:'mentor',   status:'verified', bergabung:'Jan 2024' },
])

const filteredUsers = computed(() => {
  let list = [...users.value]
  if (search.value)
    list = list.filter(u =>
      u.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
    )
  if (filterRole.value !== 'semua')
    list = list.filter(u => u.role === filterRole.value)
  if (filterStatus.value !== 'semua')
    list = list.filter(u => u.status === filterStatus.value)
  return list
})

function toggleStatus(user) {
  user.status = user.status === 'verified' ? 'pending' : 'verified'
}
function hapusUser(user) {
  users.value = users.value.filter(u => u.id !== user.id)
}
</script>