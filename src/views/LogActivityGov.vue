<template>
    <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">Ride-Hailing
          <img src="@/assets/logoridehailing.png" alt="Logo Ride-Hailing" class="logo-image inline" />
        </h1>
        <p class="tagline">"Yuk, Jelajahi Mikrolet dengan Lebih Mudah!"</p>
      </div>
      <nav class="menu">
        <h3 class="menu-title">MENU</h3>
        <ul>
          <li>
            <router-link to="/govdash" class="menu-item" :class="{ active: activeMenu === 'govdash' }"
              @click="setActiveMenu('govdash')">
              <img src="@/assets/dash.png" alt="Logo Dashboard" class="button-image inline" />
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/management" class="menu-item" :class="{ active: activeMenu === 'management' }"
              @click="setActiveMenu('management')">
              <img src="@/assets/management.png" alt="Logo Manajemen Kebijakan" class="button-image inline" />
              Manajemen Kebijakan
            </router-link>
          </li>

          <li>
            <router-link
              to="/LogActivityGov"
              class="menu-item active"
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
            <router-link to="/analysis" class="menu-item" :class="{ active: activeMenu === 'analysis' }"
              @click="setActiveMenu('analysis')">
              <img src="@/assets/anlysis.png" alt="Logo Analysis" class="button-image inline" />
              Laporan & Analisis
            </router-link>
          </li>
          <li>
            <router-link to="/tarifruteGov" class="menu-item" :class="{ active: activeMenu === 'tarifruteGov' }"
              @click="setActiveMenu('tarifruteGov')">
              <img src="@/assets/tarif.png" alt="Logo Keluhan/Blokir" class="button-image inline" />
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
  
    <!-- Main Content -->
    <main class="main-content">
      <div class="header">
        <h2>Log Aktivitas</h2>
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

  <!-- Spinner saat loading -->
  <div v-if="isLoading" class="loading-spinner">
    <p>Memuat data perjalanan...</p>
  </div>

  <!-- Tabel tampil setelah loading selesai -->
  <div v-else>
    <!-- Trip History Table -->
    <div class="table-container">
      <table class="trip-table">
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Nama Pengemudi</th>
            <th>Rute</th>
            <th>Waktu Transaksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in paginatedTrips" :key="trip.id">
            <td>{{ trip.passenger_name }}</td>
            <td>{{ trip.driver_name }}</td>
            <td>{{ trip.route }}</td>
            <td>{{ formatDate(trip.created_at) }}</td>
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
</div>
    </main>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      tripHistory: [],
      filteredTrips: [],
      currentPage: 1,
      pageSize: 5,
      searchQuery: '',
      loading: true,
    };
  },
  computed: {
    paginatedTrips() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredTrips.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredTrips.length / this.pageSize);
    },
  },
  methods: {
    async fetchTripHistory() {
      this.loading = true;
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://188.166.179.146:8000/api/dashboard/histories", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        this.tripHistory = result.data;
        this.filteredTrips = result.data;
      } catch (error) {
        console.error("Error fetching trip history:", error);
      } finally {
        this.loading = false;
      }
    },
    filterTrips() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTrips = this.tripHistory.filter((trip) => {
        return (
          trip.userName.toLowerCase().includes(query) ||
          trip.driverName.toLowerCase().includes(query) ||
          trip.routeNumber.toLowerCase().includes(query) ||
          trip.route.toLowerCase().includes(query)
        );
      });
      this.currentPage = 1;
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    async fetchActiveDrivers() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://188.166.179.146:8000/api/dashboard/drivers", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        const activeDrivers = result.data.drivers.filter(driver => driver.status === "on");
        this.activeDriversCount = activeDrivers.length;
      } catch (error) {
        console.error("Error fetching active drivers:", error);
      }
    },
    renderChart() {
      const ctx = document.getElementById("activeDriversChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Pengemudi Aktif"],
          datasets: [
            {
              label: "Jumlah",
              data: [this.activeDriversCount],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jumlah Pengemudi",
              },
            },
          },
        },
      });
    },
    formatDate(dateStr) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateStr).toLocaleString("id-ID", options);
    },
  },
  mounted() {
    this.fetchTripHistory();
    this.fetchActiveDrivers().then(() => {
      this.renderChart();
    });
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
  margin-bottom: 20px; /* Menambahkan jarak bawah */
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
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 20px; /* Menambahkan jarak atas */
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

.loading-spinner {
  text-align: center;
  padding: 2rem;
  font-weight: bold;
  font-size: 1.2rem;
}

</style>