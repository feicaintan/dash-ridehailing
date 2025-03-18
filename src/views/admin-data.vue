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
              class="menu-item active"
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
              class="menu-item"
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
          :class="{ active: activeMenu === 'loginform' }"
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
        <h2>Data</h2>
      </div>

      <!-- Data Content -->
      <section class="content">
        <!-- Reports Section -->
        <div class="card">
          <h2 class="card-title">
            <img src="@/assets/driverplus.png" alt="Trayek Icon" class="title-icon" />
            Pengemudi</h2>
          <ul class="card-list">
            <li>
              Daftar Ulasan Terhadap Pengemudi
              <router-link to="/driver-report" class="button-link"
                >Lihat</router-link
              >
            </li>
            <li>
              Daftar Pengemudi Terblokir
              <router-link to="/blocked-drivers" class="button-link"
                >Lihat</router-link
              >
            </li>
            <li>
              Daftar Verifikasi Pengemudi Baru
              <router-link to="/NewDriversAdminVue" class="button-link"
                >Lihat</router-link
              >
            </li>
          </ul>
        </div>

        <!-- User Data -->
        <div class="card">
          <h2 class="card-title">
            <img src="@/assets/user-icon.png" alt="Trayek Icon" class="title-icon" />
            Pengguna</h2>
          <ul class="card-list">
            <li>
              Daftar Data Pengguna
              <router-link to="/daftar-user" class="button-link"
                >Lihat</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Driver List -->
        <div class="card large-card" style="position: relative">
          <h2 class="card-title">Daftar Data Pengemudi</h2>
          <table class="table">
            <thead>
              <tr>
            <th>Foto</th>
            <th>Nama Pengemudi</th>
            <th>Nomor Telepon</th>
            <th>Email</th>
            <th>Nomor KTP</th>
            <th>Nomor SIM</th>
            <th>Password</th>
            <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in filteredDrivers" :key="driver.ktp">
            <td><img :src="driver.photo" alt="Driver Photo" class="driver-photo" /></td>
            <td>{{ driver.name }}</td>
            <td>{{ driver.phone }}</td>
            <td>{{ driver.email }}</td>
            <td>{{ driver.ktp }}</td>
            <td>{{ driver.sim }}</td>
            <td>{{ driver.password }}</td>
            <tr>
              <span :class="{'status-online': driver.status === 'Online', 'status-offline': driver.status === 'Offline'}">
                {{ driver.status }}
              </span>
            </tr>
            </tr>
            </tbody>
          </table>
          <div class="button-container">
            <router-link to="/daftar-driver" class="more-item">
              Selengkapnya &raquo;
            </router-link>
          </div>
        </div>

        <!-- Application User Details -->
        <div class="card large-card">
          <h2 class="card-title">Daftar Data Pengguna</h2>
          <div class="user-details">
            <div class="user-card">
              <p>Travis</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>John</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>Kevin</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>Debora</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>Mikha</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>Alice</p>
              <p>xxxxx@gmail.com</p>
            </div>
            <div class="user-card">
              <p>Adestansia</p>
              <p>xxxxx@gmail.com</p>
            </div>
          </div>
          <!-- Button Container -->
          <div class="button-container">
            <router-link to="/daftar-user" class="more-item">
              Selengkapnya &raquo;
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
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

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 1000px;
}

/* Input search */
.search-bar {
  width: 100%;
  padding: 10px 15px 10px 40px; 
  border: 1px solid #ccc;
  border-radius: 20px; 
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}
.search-icon {
  position: absolute;
  left: 10px; 
  width: 20px; 
  height: 20px;
  pointer-events: none; 
}
.add-widget-button {
  background-color: #004085;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  margin-left: 20px;
}

.add-widget-button:hover {
  background-color: #0056b3;
}

.content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.large-card {
  grid-column: span 2;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-list {
  list-style: none;
  padding: 0;
}

.card-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.view-button {
  background-color: #004085;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.view-button:hover {
  background-color: #0056b3;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.status {
  font-weight: bold;
}

.status.online {
  color: green;
}

.status.offline {
  color: red;
}

.user-details {
  display: flex;
  gap: 20px;
}

.user-card {
  background-color: #f7f9fc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.button-link {
  display: inline-block;
  background-color: rgb(25, 86, 152);
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s;
}

.button-link:hover {
  background-color: rgb(9, 44, 81);
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.see-more-button {
  background-color: rgb(255, 255, 255);
  color: black;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid black;
  text-decoration: none;
  font-size: 12px;
  transition: background-color 0.3s, color 0.3s;
}

.see-more-button:hover {
  background-color: #0056b3;
  color: white;
}

.more-item {
  display: inline-block;
  background-color: rgb(255, 255, 255);
  color: black;
  padding: 10px 10px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 12px;
  transition: background-color 0.3s, color 0.3s;
  position: absolute;
  bottom: 10px;
  right: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.more-item:hover {
  background-color: #0056b3;
  color: white;
}
</style>
