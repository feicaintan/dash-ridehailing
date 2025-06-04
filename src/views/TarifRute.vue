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
              class="menu-item active"
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
        to="/govdash"
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
          <router-link to="/daftar-trayek" class="view-button">Lihat</router-link>
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
      fetch('https://mikronet.systems/api/dashboard/reports?month=2', {
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

.main-content {
  flex: 1;
  background-color: #f3f7fa;
  padding: 24px;
  overflow-y: auto;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.page-title {
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}


/* Bagian Chart */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* Kartu detail (Chart) */
.details-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 14px;
  height: 330px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.details-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.details-card h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

canvas {
  width: 100% !important;
  height: calc(100% - 40px) !important;
  flex-grow: 1;
}

/* Fitur Menarik */
.features-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.features-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.features-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.features-content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.view-button {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(90deg, #5b9bd5, #3b82bf);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(91, 155, 213, 0.3);
}

.view-button:hover {
  background: linear-gradient(90deg, #3b82bf, #2c6aa9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 155, 213, 0.5);
}

/* Modal */
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 14px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.close {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 24px;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

/* Form dalam modal */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dfe4ea;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #5b9bd5;
  box-shadow: 0 0 0 3px rgba(91, 155, 213, 0.2);
  outline: none;
}

.submit-btn {
  background: linear-gradient(90deg, #5b9bd5, #3b82bf);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(91, 155, 213, 0.3);
}

.submit-btn:hover {
  background: linear-gradient(90deg, #3b82bf, #2c6aa9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 155, 213, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .details-card {
    height: 300px;
  }
}
</style>