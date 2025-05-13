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
            <router-link to="/tarifruteGov" class="menu-item active" :class="{ active: activeMenu === 'tarifruteGov' }"
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
    
    <main class="main-content">
      <div class="header">
        <h2 class="page-title">Tarif dan Rute</h2>
      </div>

      <!-- Charts Grid dengan desain yang diperbaiki -->
      <div class="charts-grid">
        <div class="details-card">
          <h3>Pendapatan per Trayek</h3>
          <canvas id="routeRevenueChart"></canvas>
        </div>
        <div class="details-card">
          <h3>Distribusi Penggunaan Rute Bulan Ini</h3>
          <canvas id="routeUsageChart"></canvas>
        </div>
      </div>

      <div class="features-section">
        <div class="features-content">
          <h3>Daftar Pembagian Rute</h3>
          <router-link to="/trayekGov" class="view-button">Lihat</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import 'chartjs-chart-matrix';

export default {
  name: 'TarifRute',
  mounted() {
    this.fetchRouteDataAndInitCharts();
  },
  data() {
    return {
      showModal: false,
      isEditing: false,
      newTarif: {
        jenisPenumpang: '',
        trayek: '',
        tarif: 0
      },
      editIndex: null
    }
  },
  methods: {
    fetchRouteDataAndInitCharts() {
      const token = localStorage.getItem('access_token');
      fetch('http://188.166.179.146:8000/api/dashboard/reports?month=2', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(result => {
          const trips = result.data.trips;
          const labels = trips.map(item => item.route);
          const revenues = trips.map(item => item.revenue / 1000); // ribuan
          const totals = trips.map(item => item.total);

          this.initRouteRevenueChart(labels, revenues);
          this.initRouteUsageChart(labels, totals);
        })
        .catch(error => {
          console.error('Gagal mengambil data trips:', error);
        });
    },
    initRouteRevenueChart(labels, data) {
      const ctx = document.getElementById('routeRevenueChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Pendapatan Bulan Ini (Ribu Rp)',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Pendapatan per Rute'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Rp ${(context.raw * 1000).toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Pendapatan (Ribu Rupiah)'
              },
              ticks: {
                callback: function (value) {
                  return `Rp ${value}k`;
                }
              }
            }
          }
        }
      });
    },
    initRouteUsageChart(labels, data) {
      const ctx = document.getElementById('routeUsageChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#45B7D1', '#96C93D', '#E67E22', '#7F8C8D',
              '#C0392B', '#8E44AD', '#2980B9', '#27AE60', '#F1C40F',
              '#D35400', '#34495E', '#2ECC71', '#E74C3C', '#1ABC9C'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Distribusi Penggunaan Rute Bulan Ini'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: ${percentage}% (${context.raw} perjalanan)`;
                }
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%; /* Ensure the map fills the card */
  flex-grow: 1; /* Allow the map to grow */
}
/* General Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.details-card h3 {
  margin-bottom: 15px;
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
  background-color: #3b82bf; /* Warna hover */
}

.divider {
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 20px 0;
}

.logout {
  color: #ff8080; /* Merah terang */
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Fitur Menarik */
.features-section {
  margin-top: 20px; /* Jarak atas untuk fitur menarik */
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan */
}

.features-content {
  display: flex;
  justify-content: space-between; /* Memastikan tulisan dan tombol berada di sisi yang berbeda */
  align-items: center; /* Vertikal center */
}

.view-button {
  display: inline-block;
  padding: 10px 15px;
  background-color: #5b9bd5;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s; /* Transisi saat hover */
}

.view-button:hover {
  background-color: #3b82bf; /* Warna saat hover */
  transform: scale(1.05); /* Efek zoom saat hover */
}

/* Popup */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.modal-content .close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer; /* Menambahkan kursor pointer */
}

.close:hover,
.close:focus {
  color: #000; /* Mengubah warna saat hover */
  text-decoration: none;
  cursor: pointer;
}

button {
  background-color: #5b9bd5; /* Warna tombol */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px; /* Menambahkan border-radius pada tombol */
  cursor: pointer;
  transition: background-color 0.3s; /* Transisi saat hover */
}

button:hover {
  background-color: #3b82bf; /* Warna saat hover */
}

/* Form dalam modal */
.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  margin-bottom: 5px; /* Jarak antara label dan input */
  font-weight: bold; /* Menebalkan label */
}

.modal-content input,
.modal-content select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px; /* Jarak antar elemen form */
}

/* Bagian Chart */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px; /* Jarak atas untuk grafik */
  margin-bottom: 20px; /* Jarak bawah untuk grafik */
}

/* Responsive untuk tampilan mobile */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

/* Kartu detail (Chart) */
.details-card {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  height: 300px; /* Adjust height as needed */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align items to the top */
  overflow: hidden; /* Hide overflow */
}

canvas {
  width: 100% !important; /* Ensure canvas fills the width */
  height: 100% !important; /* Ensure canvas fills the height */
  flex-grow: 1; /* Allow canvas to grow */
}
</style>