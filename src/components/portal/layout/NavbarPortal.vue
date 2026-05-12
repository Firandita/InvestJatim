<template>
  <nav class="navbar-portal">
    <div class="navbar-inner">
      <!-- Logo -->
      <!-- Logo -->
<router-link to="/" class="navbar-logo">
  <img src="../../../assets/images/logo-Investjatim.png" alt="InvestJatim" class="logo-img" />
</router-link>

      <!-- Desktop Menu -->
      <ul class="navbar-links">
        <li><router-link to="/" class="nav-link">Beranda</router-link></li>
        <li><router-link to="/direktori" class="nav-link">Direktori UMKM</router-link></li>
        <li><router-link to="/tentang" class="nav-link">Tentang</router-link></li>
      </ul>

      <!-- CTA -->
      <div class="navbar-cta">
        <router-link to="/login" class="btn-secondary">Masuk</router-link>
        <router-link to="/daftar" class="btn-primary">Daftar</router-link>
      </div>

      <!-- Hamburger Mobile -->
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span class="material-symbols-rounded">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <transition name="drawer">
      <div v-if="menuOpen" class="mobile-drawer">
        <router-link to="/" class="drawer-link" @click="menuOpen = false">Beranda</router-link>
        <router-link to="/direktori" class="drawer-link" @click="menuOpen = false">Direktori UMKM</router-link>
        <router-link to="/tentang" class="drawer-link" @click="menuOpen = false">Tentang</router-link>
        <hr class="drawer-divider" />
        <router-link to="/login" class="drawer-link" @click="menuOpen = false">Masuk</router-link>
        <router-link to="/daftar" class="btn-primary block text-center mt-2" @click="menuOpen = false">Daftar Sekarang</router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<!-- ===== NAVBAR STYLE ===== -->
<style scoped>
.navbar-portal {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #ddeece;
  box-shadow: 0 1px 12px rgba(106,153,78,0.06);
}
 
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}
 
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}
 
.logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
}
 
.logo-text {
  font-size: 1.125rem;
  color: #2E2E2E;
  letter-spacing: -0.02em;
}
 
.logo-text strong {
  color: #6A994E;
}
 
.navbar-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  flex: 1;
}
 
.nav-link {
  display: block;
  padding: 0.4rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
  text-decoration: none;
  transition: all 0.15s;
}
 
.nav-link:hover,
.nav-link.router-link-active {
  color: #6A994E;
  background: #EEF6E8;
}
 
.navbar-cta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
 
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #6A994E;
  padding: 0.25rem;
  margin-left: auto;
}
 
.hamburger .material-symbols-rounded {
  font-size: 1.75rem;
}
 
/* Mobile drawer */
.mobile-drawer {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #ddeece;
  background: white;
  gap: 0.25rem;
}
 
.drawer-link {
  padding: 0.75rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #2E2E2E;
  text-decoration: none;
  transition: background 0.15s;
}
 
.drawer-link:hover {
  background: #EEF6E8;
  color: #6A994E;
}
 
.drawer-divider {
  border: none;
  border-top: 1px solid #ddeece;
  margin: 0.5rem 0;
}
 
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.2s ease;
}
 
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
 
@media (max-width: 768px) {
  .navbar-links,
  .navbar-cta {
    display: none;
  }
  .hamburger {
    display: block;
  }
}
</style>
 