<template>
  <footer class="footer-portal">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="material-symbols-rounded">trending_up</span>
          <span>Invest<strong>Jatim</strong></span>
        </div>
        <p class="footer-tagline">Platform komunikasi investasi UMKM Jawa Timur berbasis data.</p>
      </div>

      <div class="footer-links-group">
        <h4>Platform</h4>
        <ul>
          <li><router-link to="/direktori">Direktori UMKM</router-link></li>
          <li><router-link to="/tentang">Tentang Kami</router-link></li>
          <li><router-link to="/login">Masuk</router-link></li>
          <li><router-link to="/daftar">Daftar</router-link></li>
        </ul>
      </div>

      <div class="footer-links-group">
        <h4>Pengguna</h4>
        <ul>
          <li><span>UMKM</span></li>
          <li><span>Investor</span></li>
          <li><span>Mentor</span></li>
          <li><span>Pemerintah/Dinas</span></li>
        </ul>
      </div>

      <div class="footer-links-group">
        <h4>Kontak</h4>
        <ul>
          <li><span>investjatim@example.com</span></li>
          <li><span>Surabaya, Jawa Timur</span></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 InvestJatim. Prototipe untuk keperluan lomba.</p>
    </div>
  </footer>
</template>

<script setup></script>

<!-- ===== FOOTER STYLE ===== -->
<style scoped>
.footer-portal {
  background: #4a7535;
  color: #c8ddb8;
  margin-top: auto;
}
 
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2.5rem;
}
 
.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: white;
  margin-bottom: 0.75rem;
}
 
.footer-logo .material-symbols-rounded {
  color: #a8cc88;
}
 
.footer-logo strong {
  color: #a8cc88;
}
 
.footer-tagline {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #9bbf80;
  max-width: 240px;
}
 
.footer-links-group h4 {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: white;
  margin-bottom: 1rem;
}
 
.footer-links-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
 
.footer-links-group a,
.footer-links-group span {
  font-size: 0.875rem;
  color: #9bbf80;
  text-decoration: none;
  transition: color 0.15s;
}
 
.footer-links-group a:hover {
  color: white;
}
 
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem 1.5rem;
  text-align: center;
}
 
.footer-bottom p {
  font-size: 0.8rem;
  color: #7aaa55;
}
 
@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}
</style>