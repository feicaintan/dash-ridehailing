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
              class="menu-item active"
              :class="{ active: activeMenu === 'log-activity' }"
              @click="setActiveMenu('log-activity')"
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
              @click="setActiveMenu('tarif-rute')"
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
              @click="setActiveMenu('admin-analysis')"
            >
              <img
                src="@/assets/anlysis.png"
                alt="Logo Analysis"
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
        <h2>Log Aktivitas</h2>
      </div>

      <!-- Grafik -->
      <div class="charts-container">
        <div class="chart">
          <h3>Pengguna Aktif</h3>
          <canvas id="activeUsersChart"></canvas>
        </div>
        <div class="chart">
          <h3>Pengemudi Aktif</h3>
          <canvas id="activeDriversChart"></canvas>
        </div>
      </div>

      <!-- Tombol Navigasi -->
      <div class="buttons-container">
        <router-link to="/ActiveUser" class="btn">
          Lihat Daftar Pengguna Aktif
        </router-link>
        <router-link to="/ActiveDriver" class="btn">
          Lihat Daftar Pengemudi Aktif
        </router-link>
      </div>

      <!-- Riwayat Perjalanan Section -->
      <div class="trip-history-section">
        <h3>Riwayat Perjalanan</h3>
        
        <!-- Search Bar -->
        <div class="search-container">
          <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari riwayat perjalanan..."
            class="search-input"
            @input="filterTrips"
          />
        </div>

        <!-- Trip History Table -->
        <div class="table-container">
          <table class="trip-table">
            <thead>
              <tr>
                <th>Nama Pengguna</th>
                <th>Nama Pengemudi</th>
                <th>Nomor Trayek</th>
                <th>Rute</th>
                <th>Waktu Mulai</th>
                <th>Waktu Selesai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trip in paginatedTrips" :key="trip.id">
                <td>{{ trip.userName }}</td>
                <td>{{ trip.driverName }}</td>
                <td>{{ trip.routeNumber }}</td>
                <td>{{ trip.route }}</td>
                <td>{{ trip.startTime }}</td>
                <td>{{ trip.endTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            &laquo; Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Next &raquo;
          </button>
        </div>
      </div>


    </main>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "LogActivity",
  data() {
    return {
      activeMenu: 'log-activity',
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      tripHistory: [
        {
          id: 1,
          userName: "John Doe",
          driverName: "Driver A",
          routeNumber: "MT01",
          route: "Terminal Purabaya - Joyoboyo",
          startTime: "2025-01-29 08:00",
          endTime: "2025-01-29 08:45"
        },
        {
          id: 2,
          userName: "Jane Smith",
          driverName: "Driver B",
          routeNumber: "MT02",
          route: "Joyoboyo - Tanjung Perak",
          startTime: "2025-01-29 09:15",
          endTime: "2025-01-29 10:00"
        },
      ],
      filteredTrips: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTrips.length / this.itemsPerPage);
    },
    paginatedTrips() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTrips.slice(start, end);
    }
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu;
    },
    filterTrips() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTrips = this.tripHistory.filter(trip => 
        trip.userName.toLowerCase().includes(query) ||
        trip.driverName.toLowerCase().includes(query) ||
        trip.routeNumber.toLowerCase().includes(query) ||
        trip.route.toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
  // Labels untuk 24 jam terakhir
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Data contoh untuk pengguna dan pengemudi aktif per jam
  const activeUsersData = [5, 10, 8, 15, 20, 25, 30, 35, 50, 60, 55, 70, 90, 80, 100, 110, 95, 85, 75, 60, 50, 40, 30, 20];
  const activeDriversData = [3, 5, 4, 10, 15, 20, 22, 25, 35, 45, 40, 55, 65, 60, 70, 75, 68, 58, 48, 38, 28, 22, 18, 10];

  // Grafik Pengguna Aktif
  const ctxUsers = document.getElementById("activeUsersChart").getContext("2d");
  new Chart(ctxUsers, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Pengguna Aktif",
          data: activeUsersData,
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Jam" },
        },
        y: {
          title: { display: true, text: "Jumlah Pengguna" },
          beginAtZero: true,
        },
      },
    },
  });

  // Grafik Pengemudi Aktif
  const ctxDrivers = document.getElementById("activeDriversChart").getContext("2d");
  new Chart(ctxDrivers, {
    type: "bar",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Pengemudi Aktif",
          data: activeDriversData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Jam" },
        },
        y: {
          title: { display: true, text: "Jumlah Pengemudi" },
          beginAtZero: true,
        },
      },
    },
  });

    this.filteredTrips = [...this.tripHistory];
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

/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #5B9BD5;
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

.more-item {
  display: flex;
  align-items: right;
  gap: 10px;
  margin-bottom: 10px;
  color: rgb(59, 64, 161);
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  list-style: none;
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

/* Main Content */
.main-content {
  flex: 1;
  background-color: #f0f4f7;
  padding: 20px;
  overflow-y: auto;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  color: #333;
  margin: 0;
}

/* Charts Styling */
.charts-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart h3 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

/* Navigation Buttons */
.buttons-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  background-color: #5b9bd5;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3b82bf;
}

/* Trip History Section */
.trip-history-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.trip-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.trip-table th,
.trip-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.trip-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.trip-table tbody tr:hover {
  background-color: #f5f5f5;
}

.trip-table td {
  color: #666;
}

/* Pagination Styling */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #5b9bd5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #3b82bf;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* Responsive Design */
@media screen and (max-width: 1024px) {
  .charts-container {
    flex-direction: column;
  }
  
  .buttons-container {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 10px;
  }
  
  .main-content {
    padding: 10px;
  }
  
  .trip-table {
    font-size: 14px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>