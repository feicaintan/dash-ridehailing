<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">
          Ride-Hailing
          <img
            src="@/assets/logoridehailing.png"
            alt="Logo Ride-Hailing"
            class="logo-image inline"
          />
        </h1>
        <p class="tagline">"Yuk, Jelajahi Mikrolet dengan Lebih Mudah!"</p>
      </div>
      <nav class="menu">
        <h3 class="menu-title">MENU</h3>
        <ul>
          <li>
            <router-link
              to="/admin-dash"
              class="menu-item"
              :class="{ active: activeMenu === 'admin-dash' }"
              @click="setActiveMenu('admin-dash')"
            >
              <img
                src="@/assets/dash.png"
                alt="Logo Dashboard"
                class="button-image inline"
              />
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link
              to="/data"
              class="menu-item"
              :class="{ active: activeMenu === 'admin-data' }"
              @click="setActiveMenu('admin-data')"
            >
              <img
                src="@/assets/datalogo.png"
                alt="Logo Data"
                class="button-image inline"
              />
              Data
            </router-link>
          </li>
          <li>
            <router-link
              to="/LogActivity"
              class="menu-item"
              :class="{ active: activeMenu === 'log-activity' }"
              @click="setActiveMenu('admin-data')"
            >
              <img
                src="@/assets/monitoring.png"
                alt="Logo Log Aktivitas"
                class="button-image inline"
              />
              Log Aktivitas
            </router-link>
          </li>
          <li>
            <router-link
              to="/TarifRute"
              class="menu-item"
              :class="{ active: activeMenu === 'tarif-rute' }"
              @click="setActiveMenu('admin-data')"
            >
              <img
                src="@/assets/tarif.png"
                alt="Logo Tarif"
                class="button-image inline"
              />
              Tarif dan Rute
            </router-link>
          </li>
          <li>
            <router-link
              to="/AdminAnalysis"
              class="menu-item active"
              :class="{ active: activeMenu === 'admin-analysis' }"
              @click="setActiveMenu('admin-data')"
            >
              <img
                src="@/assets/anlysis.png"
                alt="Logo Dashboard"
                class="button-image inline"
              />
              Laporan & Analisis
            </router-link>
          </li>
        </ul>
      </nav>
      <hr class="divider" />
        <router-link
          to="/loginform"
          class="menu-item"
          :class="{ active: activeMenu === 'home' }"
          @click="setActiveMenu('loginform')"
        >
          <img
            src="@/assets/quit.png"
            alt="Logo Quit"
            class="button-image inline"
          />
          Log out
        </router-link>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="header">
        <h2>Laporan dan Analisis</h2>
      </div>

      <!-- Laporan Kinerja Umum -->
      <section class="report-section">
        <h3>Laporan Kinerja Umum</h3>
        <!-- Tampilkan Hari Data (tanggal hari ini) -->
        <div class="data-date">
          <p>Hari Data: {{ timeDisplay }}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Pengguna</td>
              <td>1,500</td>
            </tr>
            <tr>
              <td>Total Driver</td>
              <td>300</td>
            </tr>
            <tr>
              <td>Total Perjalanan</td>
              <td>5,000</td>
            </tr>
            <tr>
              <td>Total Pendapatan</td>
              <td>Rp 50,000,000</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Laporan Penggunaan Rute -->
      <section class="report-section">
        <h3>Laporan Penggunaan Rute</h3>
        <!-- Tampilkan Hari Data untuk Laporan Penggunaan Rute -->
        <div class="data-date">
          <p>Hari Data: {{ timeDisplay }}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rute</th>
              <th>Jumlah Perjalanan</th>
              <th>Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rute 001</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute 002</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
            <tr>
              <td>Rute 003</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute 004</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
            <tr>
              <td>Rute 005</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute 005</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
            <tr>
              <td>Rute 006</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute 007</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
            <tr>
              <td>Rute 008</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute 009</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Tombol Unduh Laporan -->
      <section class="download-section">
        <button @click="downloadReport">Unduh Laporan</button>
      </section>

      <!-- Elemen untuk Tampilan Cetak -->
      <div id="printableArea" style="display: none;">
        <h2>Laporan dan Analisis</h2>
        <h3>Laporan Kinerja Umum</h3>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Pengguna</td>
              <td>1,500</td>
            </tr>
            <tr>
              <td>Total Driver</td>
              <td>300</td>
            </tr>
            <tr>
              <td>Total Perjalanan</td>
              <td>5,000</td>
            </tr>
            <tr>
              <td>Total Pendapatan</td>
              <td>Rp 50,000,000</td>
            </tr>
          </tbody>
        </table>

        <h3>Laporan Penggunaan Rute</h3>
        <table>
          <thead>
            <tr>
              <th>Rute</th>
              <th>Jumlah Perjalanan</th>
              <th>Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rute A</td>
              <td>2,000</td>
              <td>Rp 20,000,000</td>
            </tr>
            <tr>
              <td>Rute B</td>
              <td>1,500</td>
              <td>Rp 15,000,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      currentDate: new Date(),
      activeMenu: ""
    };
  },
  computed: {
    // Menampilkan tanggal hari ini dengan format: 10 Oktober 2025
    timeDisplay() {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return this.currentDate.toLocaleDateString("id-ID", options);
    }
  },
  methods: {
    downloadReport() {
      // Menampilkan elemen untuk tampilan cetak
      const printableArea = document.getElementById("printableArea");
      printableArea.style.display = "block";
      window.print();
      printableArea.style.display = "none"; // Menyembunyikan kembali setelah cetak
    },
    showWeeklyData() {
      // Logika untuk menampilkan data perminggu untuk Laporan Kinerja Umum
      alert("Menampilkan data perminggu untuk kinerja umum");
    },
    showMonthlyData() {
      // Logika untuk menampilkan data perbulan untuk Laporan Kinerja Umum
      alert("Menampilkan data perbulan untuk kinerja umum");
    },
    showWeeklyDataForRoutes() {
      // Logika untuk menampilkan data perminggu untuk Laporan Penggunaan Rute
      alert("Menampilkan data perminggu untuk penggunaan rute");
    },
    showMonthlyDataForRoutes() {
      // Logika untuk menampilkan data perbulan untuk Laporan Penggunaan Rute
      alert("Menampilkan data perbulan untuk penggunaan rute");
    },
    setActiveMenu(menu) {
      this.activeMenu = menu;
    }
  }
};
</script>

<style scoped>
/* General Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #5b9bd5;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar ul,
.sidebar ul li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.sidebar-header .tagline {
  font-size: 12px;
  font-style: italic;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
}

.logo-image {
  width: 40px;
  height: 40px;
  margin-left: 10px;
}

.button-image {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.tagline {
  font-size: 12px;
  font-style: italic;
  color: white;
  margin-top: 10px;
  text-align: left;
}

.menu-title {
  font-size: 12px;
  margin: 20px 0 10px;
  text-transform: uppercase;
  font-weight: bold;
}

.menu {
  flex-grow: 1;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  list-style: none;
}

.menu-item.active,
.menu-item:hover {
  background-color: #3b82bf;
}

.menu-icon {
  font-size: 16px;
}

.menu-item.active,
.menu-item:hover {
  background-color: #3b82bf;
  /* Warna hover */
}

.divider {
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 20px 0;
}

.logout {
  color: #ff8080;
  /* Merah terang */
  margin-top: auto;
}

.logout .menu-icon {
  color: #ff4040;
}

/* Main Content */
.main-content {
  flex: 1;
  background-color: #f0f4f7;
  padding: 20px;
  overflow-y: auto;
}

.main-content .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-section {
  margin-bottom: 30px;
}

/* Tabel */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #5b9bd5;
  color: white;
}

/* Tampilan Tanggal Data */
.data-date p {
  font-weight: bold;
  margin-bottom: 10px;
}

/* Tombol Data View (Perminggu & Perbulan) */
.data-view-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.data-view-buttons button {
  padding: 8px 16px;
  background-color: #5b9bd5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.data-view-buttons button:hover {
  background-color: #3b82bf;
}

/* Download Section */
.download-section {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #5b9bd5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3b82bf;
}

/* Review Table */
.review-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-table th,
.review-table td {
  padding: 15px;
  border: 1px solid #eee;
}

.review-table th {
  background: #3b82bf;
  font-weight: 600;
}

.stars {
  color: #ffd700;
  letter-spacing: 3px;
}

.star {
  font-size: 20px;
}

.star-empty {
  font-size: 20px;
  color: #ddd;
}

.review-table tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}

/* Print Styles */
@media print {
  .sidebar {
    display: none; /* Sembunyikan sidebar saat mencetak */
  }
  .download-section {
    display: none; /* Sembunyikan tombol unduh saat mencetak */
  }
}
</style>
