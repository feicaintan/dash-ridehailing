<template>
  <div id="dashboard" class="dashboard-container">
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
              @click="setActiveMenu('gov-dash')">
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
            <router-link to="/analysis" class="menu-item" :class="{ active: activeMenu === 'analysis' }"
              @click="setActiveMenu('analysis')">
              <img src="@/assets/anlysis.png" alt="Logo Analysis" class="button-image inline" />
              Laporan & Analisis
            </router-link>
          </li>

          <li>
            <router-link to="/report" class="menu-item active" :class="{ active: activeMenu === 'report' }"
              @click="setActiveMenu('report')">
              <img src="@/assets/complaint.png" alt="Logo Keluhan/Blokir" class="button-image inline" />
              Keluhan/Blokir
            </router-link>
          </li>

        </ul>
      </nav>
      <hr class="divider" />
        <router-link to="/" class="menu-item" :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">
          <img src="@/assets/quit.png" alt="Logo Quit" class="button-image inline" />
          Login as Admin
        </router-link>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <header class="dashboard-header">
        <h2>Keluhan</h2>
      </header>

      <div class="search-container">
        <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
        <input
          type="text"
          class="search-bar"
          placeholder="Cari Pengemudi..."
          v-model="searchQuery"
        />
      </div>

      <div class="table-container">
        <table class="complaint-table">
          <thead>
            <tr>
              <th>Hari/Tanggal</th>
              <th>Nama Pengemudi</th>
              <th>Nama Penumpang</th>
              <th>Deskripsi Keluhan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="complaint in filteredComplaints" :key="complaint.id">
              <td>{{ complaint.date }}</td>
              <td>{{ complaint.driverName }}</td>
              <td>{{ complaint.passengerName }}</td>
              <td>{{ complaint.description }}</td>
            </tr>
            <tr v-if="filteredComplaints.length === 0">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button 
          class="pagination-button" 
          @click="prevPage" 
          :disabled="currentPage === 1"
        >
          Back
        </button>
        <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button 
          class="pagination-button" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Keluhan",
  data() {
    return {
      searchQuery: "", // Query pencarian
      currentPage: 1,
      itemsPerPage: 10,
      complaints: [
        { id: 1, date: "2024-07-01", driverName: "Minho Park", passengerName: "Alice", description: "Sikap tidak sopan." },
        { id: 2, date: "2024-07-02", driverName: "John Doe", passengerName: "Bob", description: "Terlambat menjemput." },
        { id: 3, date: "2024-07-03", driverName: "Jane Smith", passengerName: "Charlie", description: "Kendaraan tidak bersih." },
        { id: 4, date: "2024-07-04", driverName: "Michael Johnson", passengerName: "David", description: "Mengemudi ugal-ugalan." },
        { id: 5, date: "2024-07-05", driverName: "Emily Davis", passengerName: "Eve", description: "Tidak mengikuti rute." },
        { id: 6, date: "2024-07-06", driverName: "Chris Brown", passengerName: "Frank", description: "Berhenti di tempat terlarang." },
        { id: 7, date: "2024-07-07", driverName: "Sarah Wilson", passengerName: "Grace", description: "Tidak ramah." },
        { id: 8, date: "2024-07-08", driverName: "Daniel Lee", passengerName: "Hannah", description: "Kendaraan terlalu bising." },
        { id: 9, date: "2024-07-09", driverName: "Laura Taylor", passengerName: "Ivy", description: "Tidak menggunakan sabuk pengaman." },
        { id: 10, date: "2024-07-10", driverName: "James Anderson", passengerName: "Jack", description: "Berkendara terlalu cepat." },
        { id: 11, date: "2024-07-11", driverName: "Olivia Martinez", passengerName: "Liam", description: "Sikap tidak profesional." },
        // Tambahkan lebih banyak data jika diperlukan
      ],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredComplaints.length / this.itemsPerPage);
    },
    filteredComplaints() {
      const filtered = this.complaints.filter(complaint =>
        complaint.driverName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
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

/* Main Content Styling */
.main-content {
flex: 1;
padding: 20px;
background-color: #f7f9fc;
overflow-y: auto;
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

.search-bar {
  padding: 10px 10px 10px 40px; 
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; 
  max-width: 400px; 
}

.table-container {
  margin-top: 20px;
  overflow-x: auto; 
}

.complaint-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.complaint-table th,
.complaint-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.complaint-table th {
  background-color: #4f8cc5; 
  color: white;
  font-weight: bold;
}

.complaint-table tr:hover {
  background-color: #e9ecef; 
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #315882; 
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc; 
  cursor: not-allowed; 
}

.pagination-button:hover:not(:disabled) {
  background-color: #218838; 
}
</style>  