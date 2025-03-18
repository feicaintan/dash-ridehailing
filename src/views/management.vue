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
              to="/report"
              class="menu-item"
              :class="{ active: activeMenu === 'report' }"
              @click="setActiveMenu('report')"
            >
              <img
                src="@/assets/complaint.png"
                alt="Logo Keluhan/Blokir"
                class="button-image inline"
              />
              Keluhan/Blokir
            </router-link>
          </li>
        </ul>
      </nav>
      <hr class="divider" />
      <router-link
        to="/"
        class="menu-item"
        :class="{ active: activeMenu === 'home' }"
        @click="setActiveMenu('home')"
      >
        <img
          src="@/assets/quit.png"
          alt="Logo Quit"
          class="button-image inline"
        />
        Login as Admin
      </router-link>
    </aside>

    <main class="main-content">
      <div class="analysis-section">
        <h2>Manajemen Kebijakan</h2>

        <div class="card">
          <div class="card-item">
            <span>Pengaturan Tarif</span>
            <router-link to="/tarifGov" class="view-button">Lihat</router-link>
          </div>
          <div class="card-item">
            <span>Daftar Rute Trayek</span>
            <router-link to="/trayekGov" class="view-button">Lihat</router-link>
          </div>
          <div class="card-item">
            <span>Verifikasi Izin Pengemudi</span>
            <router-link to="/NewDriversGovVue" class="view-button"
              >Lihat</router-link
            >
          </div>
          <div class="card-item">
            <span>Daftar Ulasan Terhadap Pengemudi</span>
            <router-link to="/driverReportGov" class="view-button"
              >Lihat</router-link
            >
          </div>
          <div class="card-item">
            <span>Daftar Pengemudi yang Terblokir</span>
            <router-link to="/blockedDriverGov" class="view-button"
              >Lihat</router-link
            >
          </div>
        </div>

        <!-- Daftar Pengemudi -->
        <div class="driver-list-section">
          <div class="driver-list-card">
            <h4>Daftar Pengemudi</h4>
            <table>
              <thead>
                <tr>
                  <th>Nama Pengemudi</th>
                  <th>Nomor Telepon</th>
                  <th>Email</th>
                  <th>Nomor Kendaraan</th>
                  <th>Nomor SIM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="driver in drivers" :key="driver.email">
                  <td>{{ driver.name }}</td>
                  <td>{{ driver.phone }}</td>
                  <td>{{ driver.email }}</td>
                  <td>{{ driver.vehicleNumber }}</td>
                  <td>{{ driver.simNumber }}</td>
                  <td>
                    <span
                      :class="
                        driver.status === 'online'
                          ? 'status-online'
                          : 'status-offline'
                      "
                    >
                      {{ driver.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="drivers.length === 0">
                  <td colspan="6">Data tidak ditemukan.</td>
                </tr>
              </tbody>
            </table>
            <!-- Tombol Selengkapnya -->
            <div class="button-container">
              <router-link to="/driverGov" class="more-button">
                Selengkapnya &raquo;
              </router-link>
            </div>
          </div>
        </div>

        <!-- Daftar Pengguna -->
        <div class="user-list-section">
          <div class="user-list-card">
            <h4>Daftar Pengguna</h4>
            <table>
              <thead>
                <tr>
                  <th>Nama Pengguna</th>
                  <th>Email</th>
                  <th>Nomor Telepon</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.email">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="3">Data tidak ditemukan.</td>
                </tr>
              </tbody>
            </table>
            <!-- Tombol Selengkapnya -->
            <div class="button-container">
              <router-link to="/userGov" class="more-button">
                Selengkapnya &raquo;
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filteredDrivers: [], // Data untuk verifikasi pendaftaran
      drivers: [
        {
          name: "Budi Santoso",
          phone: "081298765432",
          email: "budi@example.com",
          vehicleNumber: "B 1234 CD",
          simNumber: "SIM123456",
          photo: "@/assets/driver1.jpg", // Ganti dengan path foto yang sesuai
          status: "online",
          verificationStatus: "Terverifikasi",
        },
        {
          name: "Agus Widodo",
          phone: "082334455667",
          email: "agus@example.com",
          vehicleNumber: "B 5678 EF",
          simNumber: "SIM654321",
          photo: "@/assets/driver2.jpg", // Ganti dengan path foto yang sesuai
          status: "offline",
          verificationStatus: "Belum Terverifikasi",
        },
      ],

      users: [
        {
          name: "Ani Wijaya",
          phone: "081234567890",
          email: "ani@example.com",
        },
        {
          name: "Dedi Kurniawan",
          phone: "085678901234",
          email: "dedi@example.com",
        },
      ], // Data untuk daftar pengguna
    };
  },
  computed: {
    // Filtered drivers for verification section
    filteredDrivers() {
      return this.drivers.filter(
        (driver) => driver.verificationStatus === "Belum Terverifikasi"
      );
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
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

/* Main Content Styling */
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f7f9fc;
  overflow-y: auto;
}

.analysis-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0e7ff;
  padding: 10px;
  border-radius: 4px;
}

.verification-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.verification-card {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.verification-card table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.verification-card th,
.verification-card td {
  padding: 10px;
  text-align: left;
  border: 1px solid #d1d5db;
}

.driver-list-section {
  margin-top: 20px;
}

.driver-list-card {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.driver-list-card table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.driver-list-card th,
.driver-list-card td {
  padding: 10px;
  text-align: left;
  border: 1px solid #d1d5db;
}

.status-offline {
  color: #ef4444; /* Merah untuk offline */
}

.status-online {
  color: #22c55e; /* Hijau untuk online */
}

/* User List Styling */
.user-list-section {
  margin-top: 20px;
}
.user-list-card {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
.user-list-card table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.user-list-card th,
.user-list-card td {
  padding: 10px;
  text-align: left;
  border: 1px solid #d1d5db;
}

/* Styling untuk tombol Selengkapnya */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.more-button {
  background-color: #5b9bd5; /* Warna biru yang sama dengan sidebar */
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.more-button:hover {
  background-color: #3b82bf; /* Warna lebih gelap saat hover */
  transform: scale(1.05); /* Efek membesar sedikit */
}
/* Styling untuk tombol Lihat */
.view-button {
  background-color: #5b9bd5; /* Warna biru yang sama dengan sidebar */
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: inline-block;
}

.view-button:hover {
  background-color: #3b82bf; /* Warna lebih gelap saat hover */
  transform: scale(1.05); /* Efek membesar sedikit */
}
</style>
