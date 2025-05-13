<template>
  <div id="dashboard" class="dashboard-container">
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
              to="/govdash"
              class="menu-item"
              :class="{ active: activeMenu === 'govdash' }"
              @click="setActiveMenu('govdash')"
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
              to="/management"
              class="menu-item active"
              :class="{ active: activeMenu === 'management' }"
              @click="setActiveMenu('management')"
            >
              <img
                src="@/assets/management.png"
                alt="Logo Manajemen Kebijakan"
                class="button-image inline"
              />
              Manajemen Kebijakan
            </router-link>
          </li>

          <li>
            <router-link
              to="/LogActivityGov"
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
              to="/analysis"
              class="menu-item"
              :class="{ active: activeMenu === 'analysis' }"
              @click="setActiveMenu('analysis')"
            >
              <img
                src="@/assets/anlysis.png"
                alt="Logo Analysis"
                class="button-image inline"
              />
              Laporan & Analisis
            </router-link>
          </li>


          <li>
            <router-link
              to="/tarifruteGov"
              class="menu-item"
              :class="{ active: activeMenu === 'tarifruteGov' }"
              @click="setActiveMenu('tarifruteGov')"
            >
              <img
                src="@/assets/tarif.png"
                alt="Logo Keluhan/Blokir"
                class="button-image inline"
              />
              Tarif Rute
            </router-link>
          </li>
        </ul>
      </nav>
      <hr class="divider" />
      <router-link to="/loginform" class="menu-item" :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">
          <img src="@/assets/quit.png" alt="Logo Quit" class="button-image inline" />
          Login as Admin
        </router-link>
    </aside>

    <!-- Main Content (Improved) -->
    <main class="main-content">
      <div class="header">
        <h2 class="page-title">Manajemen Kebijakan</h2>
      </div>
  
      <!-- Data Content -->
      <section class="content">
        <!-- Driver Section -->
        <div class="card driver-card">
          <div class="card-header">
            <img src="@/assets/driverplus.png" alt="Pengemudi Icon" class="title-icon" />
            <h2 class="card-title">Pengemudi</h2>
          </div>
          <ul class="card-list">
            <li class="card-list-item">
              <span class="item-label">Daftar Ulasan Terhadap Pengemudi</span>
              <router-link to="/driverReportGov" class="button-link">
                <i class="fas fa-eye"></i> Lihat
              </router-link>
            </li>
            <li class="card-list-item">
              <span class="item-label">Daftar Pengemudi Terblokir</span>
              <router-link to="/blockedDriverGov" class="button-link">
                <i class="fas fa-eye"></i> Lihat
              </router-link>
            </li>
            <li class="card-list-item">
              <span class="item-label">Daftar Verifikasi Pengemudi Baru</span>
              <router-link to="/NewDriversGovVue" class="button-link">
                <i class="fas fa-eye"></i> Lihat
              </router-link>
            </li>
          </ul>
        </div>
  
        <!-- User Data -->
        <div class="card user-card">
          <div class="card-header">
            <img src="@/assets/user-icon.png" alt="Pengguna Icon" class="title-icon" />
            <h2 class="card-title">Pengguna</h2>
          </div>
          <ul class="card-list">
            <li class="card-list-item">
              <span class="item-label">Daftar Data Pengguna</span>
              <router-link to="/userGov" class="button-link">
                <i class="fas fa-eye"></i> Lihat
              </router-link>
            </li>
          </ul>
          <div class="stats-container">
  <div class="stat-item">
    <div class="stat-number">{{ totalUsers }}</div>
    <div class="stat-label">Total Pengguna</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{{ totalDrivers }}</div>
    <div class="stat-label">Total Pengemudi</div>
  </div>
</div>
        </div>
  
<!-- Driver List -->
<div class="card large-card driver-list-card">
  <div class="card-header-with-actions">
    <h2 class="card-title">Daftar Data Pengemudi</h2>
  </div>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Nama Pengemudi</th>
          <th>Nomor Telepon</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in drivers.slice(0, 5)" :key="driver.ktp">
          <td>{{ driver.name }}</td>
          <td>{{ driver.phone_number }}</td>
          <td>{{ driver.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="button-container">
    <router-link to="/driverGov" class="more-item">
      Selengkapnya <i class="fas fa-chevron-right"></i>
    </router-link>
  </div>
</div>

</section>
</main>
</div>
</template>

<script>
export default {
  data() {
    return {
      drivers: [],
      totalUsers: 0,
      totalDrivers: 0, // ganti dari pengguna baru ke total pengemudi
    };
  },
  mounted() {
    this.fetchDrivers();
    this.fetchUsers();
  },
  methods: {
    async fetchDrivers() {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://188.166.179.146:8000/api/dashboard/drivers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (Array.isArray(result.data?.drivers)) {
          this.drivers = result.data.drivers;
          this.totalDrivers = result.data.count; // total pengemudi
        } else {
          console.warn("Struktur data driver tidak sesuai:", result);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengemudi:", error);
      }
    },

    async fetchUsers() {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://188.166.179.146:8000/api/dashboard/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (Array.isArray(result.data?.users)) {
          this.totalUsers = result.data.count; // total pengguna
        } else {
          console.warn("Struktur data user tidak sesuai:", result);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    },
  },
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
}

.divider {
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 20px 0;
}

.logout {
  color: #ff8080;
  margin-top: auto;
}

.logout .menu-icon {
  color: #ff4040;
}

/* Main Content Updated Styles */
.main-content {
  flex: 1;
  background-color: #f8f9fa;
  padding: 25px;
  overflow-y: auto;
}

.page-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e1e5eb;
}

/* Content Grid Improvements */
.content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

/* Card Styling Improvements */
.card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.card-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.title-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Card List Styling */
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.card-list-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 14px;
  color: #495057;
}

/* Button Link Improvements */
.button-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #5b9bd5;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-link:hover {
  background-color: #4a8bc6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Large Card Span */
.large-card {
  grid-column: span 2;
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #5b9bd5;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

/* Table Improvements */
.table-container {
  overflow-x: auto;
  margin: 0 -10px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #e1e5eb;
}

.table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  color: #444;
  vertical-align: middle;
}

.table tr:hover td {
  background-color: #f9fbfd;
}

/* Driver Photo */
.driver-photo-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.driver-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
}

.status-online {
  background-color: rgba(40, 167, 69, 0.15);
  color: #28a745;
}

.status-offline {
  background-color: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 5px;
}

.action-button {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.edit {
  background-color: rgba(91, 155, 213, 0.1);
  color: #5b9bd5;
}

.action-button.view {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.action-button:hover {
  transform: translateY(-2px);
}

/* User Grid */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

.user-grid-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.user-grid-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  background-color: #f0f0f0;
  border: 3px solid #e1e5eb;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;
}

.user-email {
  font-size: 13px;
  color: #6c757d;
  margin: 0 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-joined {
  font-size: 12px;
  color: #adb5bd;
  margin: 0;
}

.user-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.user-action-button {
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 5px;
}

.user-action-button:hover {
  color: #5b9bd5;
}

/* See More Button */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.more-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background-color: white;
  color: #5b9bd5;
  padding: 8px 15px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #5b9bd5;
}

.more-item:hover {
  background-color: #5b9bd5;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .large-card {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
</style>
