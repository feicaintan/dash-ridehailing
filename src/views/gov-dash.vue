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
            <router-link to="/govdash" class="menu-item active" :class="{ active: activeMenu === 'govdash' }"
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
            <router-link to="/report" class="menu-item" :class="{ active: activeMenu === 'report' }"
              @click="setActiveMenu('report')">
              <img src="@/assets/complaint.png" alt="Logo Keluhan/Blokir" class="button-image inline" />
              Keluhan/Blokir
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
      <header class="dashboard-header">
        <h2>Welcome back, <strong>Government~</strong></h2>
        <p>Glad to see you again!</p>
      </header>

      <section class="overview">
        <div class="overview-card">
          <div class="text-container">
            <p>+ Pengguna Terdaftar</p>
            <h3>1,975 <span class="growth">+3%</span></h3>
            <img
              src="@/assets/userplus.png"
              alt="Logo UserPlus"
              class="logo-image"
            />
          </div>
        </div>

        <div class="overview-card">
          <p>+ Pengemudi Terdaftar</p>
          <h3>41 <span class="growth">+5%</span></h3>
          <img
            src="@/assets/driverplus.png"
            alt="Logo DriverPlus"
            class="logo-image-section"
          />
        </div>
        <div class="overview-card">
          <p>Trayek Terdaftar</p>
          <h3>17</h3>
          <img
            src="@/assets/trayek.png"
            alt="Logo DriverPlus"
            class="logo-image-section"
          />
        </div>
      </section>

      <div class="details-card" style="height: 300px">
        <h3 style="font-size: 14px">Grafik Pengguna Aktif</h3>
        <canvas id="activeUsersChart" style="max-height: 250px"></canvas>
      </div>

      <div class="details-card" style="height: 300px">
        <h3 style="font-size: 14px">Distribusi Pendapatan</h3>
        <canvas
          id="revenueDistributionChart"
          style="max-height: 250px"
        ></canvas>
      </div>

      <div class="details-card" style="height: 300px">
        <h3>Aktivitas Pengemudi</h3>
        <canvas id="driverActivityChart"></canvas>
      </div>

      <div class="details-card" style="height: 400px">
        <h3>Peta Lalu Lintas Manado</h3>
        <div id="trafficMap" style="height: 350px"></div>
      </div>

      <section class="details-grid">
        <div class="details-card">
          <h3 class="header">
            <span>Daftar Pengemudi</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Samuel</td>
                <td class="status offline">Offline</td>
              </tr>
              <tr>
                <td>Kevin</td>
                <td class="status online">Online</td>
              </tr>
              <tr>
                <td>Glen</td>
                <td class="status offline">Offline</td>
              </tr>
              <tr>
                <td>Jaka</td>
                <td class="status online">Online</td>
              </tr>
              <tr>
                <td>Okta</td>
                <td class="status offline">Offline</td>
              </tr>
              <tr>
                <td>Kyrios</td>
                <td class="status online">Online</td>
              </tr>
              <tr>
                <td>Rivel</td>
                <td class="status online">Online</td>
              </tr>
            </tbody>
          </table>
          <router-link
            to="/driverGov"
            class="more-item"
            :class="{ active: activeMenu === 'DaftarDriver' }"
            @click="setActiveMenu('DaftarDriver')"
          >
            Selengkapnya &raquo;
          </router-link>
        </div>

        <div class="details-card">
          <h3>Analisis Penumpang (10 Hari)</h3>
          <canvas id="passengerChart"></canvas>
        </div>

        <div class="details-card">
          <h2 class="review-title">Ulasan/Rating</h2>
          <ul class="review-list">
            <li class="review-item" v-for="review in reviews" :key="review.id">
              <div class="profile-pic">
                <img :src="review.profilePicture" :alt="review.name" />
              </div>
              <div class="review-content">
                <p class="name">{{ review.name }}</p>
                <p class="rating">
                  ({{ review.rating }}/5) {{ review.comment }}
                  <span class="emoji">👍</span>
                </p>
              </div>
              <p class="time">{{ review.time }}</p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  name: "AdminData",
  mounted() {
    this.initChart();
    this.initActiveUsersChart();
    this.initRevenueDistributionChart();
    this.initDriverActivityChart();
    this.initTrafficMap();
  },
  data() {
    return {
      mapCenter: [1.4748, 124.8421], // Manado coordinates
      trafficDensity: {
        "Trayek Manado-Kawangkaren": "Padat",
        "Trayek Pusat Kota": "Sedang",
        "Trayek Pinggiran": "Lancar",
      },
      activeDrivers: [
        {
          id: 1,
          name: "Daniel",
          location: [1.4748, 124.8421],
          status: "online",
        },
        { id: 2, name: "Kevin", location: [1.47, 124.85], status: "offline" },
        {
          id: 1,
          name: "Daniel",
          location: [1.4748, 124.8421],
          status: "online",
        },
        { id: 2, name: "Kevin", location: [1.47, 124.85], status: "offline" },
        {
          id: 1,
          name: "Daniel",
          location: [1.4748, 124.8421],
          status: "online",
        },
        { id: 2, name: "Kevin", location: [1.47, 124.85], status: "offline" },
        {
          id: 1,
          name: "Daniel",
          location: [1.4748, 124.8421],
          status: "online",
        },
        { id: 2, name: "Kevin", location: [1.47, 124.85], status: "offline" },
      ],
      activeMenu: "admin-dash",
      contentSections: [
        {
          title: "Daftar Pengemudi",
          content: `
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Samuel</td>
                  <td class="status offline">Offline</td>
                </tr>
                <tr>
                  <td>Daniel</td>
                  <td class="status online">Online</td>
                </tr>
              </tbody>
            </table>`,
        },
      ],
      reviews: [
        {
          id: 1,
          name: "Travis",
          profilePicture: "@/assets/profile1.jpg",
          rating: 4,
          comment: "Nice",
          time: "15:56",
        },
        {
          id: 2,
          name: "John",
          profilePicture: "@/assets/profile2.jpg",
          rating: 3,
          comment: "Good",
          time: "15:56",
        },
        {
          id: 3,
          name: "Kevin",
          profilePicture: "@/assets/profile3.jpg",
          rating: 5,
          comment: "Mantappu",
          time: "15:56",
        },
        {
          id: 4,
          name: "Arthur",
          profilePicture: "@/assets/profile4.jpg",
          rating: 4,
          comment: "Kerenn",
          time: "15:56",
        },
        {
          id: 5,
          name: "Justin",
          profilePicture: "@/assets/profile5.jpg",
          rating: 4,
          comment: "👍👍👍",
          time: "15:56",
        },
        {
          id: 6,
          name: "Newton",
          profilePicture: "@/assets/profile6.jpg",
          rating: 5,
          comment: "👍👍",
          time: "15:56",
        },
      ],
      filteredContent: [], // Data yang difilter berdasarkan pencarian
    };
  },
  methods: {
    initDriverActivityChart() {
      const ctx = document
        .getElementById("driverActivityChart")
        .getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Trayek 01",
            "Trayek 02",
            "Trayek 03",
            "Trayek 04",
            "Trayek 05",
            "Trayek 06",
            "Trayek 07",
            "Trayek 08",
            "Trayek 09",
            "Trayek 10",
            "Trayek 11",
            "Trayek 12",
            "Trayek 13",
            "Trayek 14",
            "Trayek 15",
            "Trayek 16",
            "Trayek 17",
          ],
          datasets: [
            {
              label: "Jumlah Perjalanan",
              data: [
                120, 95, 85, 110, 75, 65, 100, 90, 80, 105, 70, 85, 95, 60, 115,
                50, 40,
              ],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Aktivitas Pengemudi per Trayek",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jumlah Perjalanan",
              },
            },
          },
        },
      });
    },
    initTrafficMap() {
      const map = L.map("trafficMap").setView(this.mapCenter, 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      Object.entries(this.trafficDensity).forEach(([route, density]) => {
        const color =
          density === "Padat"
            ? "red"
            : density === "Sedang"
            ? "orange"
            : "green";

        L.circle(this.mapCenter, {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          radius: 1500,
        })
          .bindPopup(`${route}: ${density}`)
          .addTo(map);
      });

      this.activeDrivers.forEach((driver) => {
        const driverIcon = L.divIcon({
          className: "driver-marker",
          html: `<div style="background-color: ${
            driver.status === "online" ? "green" : "red"
          }; 
                  width: 20px; height: 20px; border-radius: 50%;"></div>`,
          iconSize: [20, 20],
        });

        L.marker(driver.location, { icon: driverIcon })
          .bindPopup(`${driver.name} - Status: ${driver.status}`)
          .addTo(map);
      });
    },

    initRevenueDistributionChart() {
      const ctx = document
        .getElementById("revenueDistributionChart")
        .getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: [
            "Trayek 01",
            "Trayek 02",
            "Trayek 03",
            "Trayek 04",
            "Trayek 05",
            "Trayek 06",
            "Trayek 07",
            "Trayek 08",
            "Trayek 09",
            "Trayek 10",
            "Trayek 11",
            "Trayek 12",
            "Trayek 13",
            "Trayek 14",
            "Trayek 15",
            "Trayek 16",
            "Trayek 17",
          ],
          datasets: [
            {
              data: [12, 15, 8, 10, 7, 6, 9, 11, 5, 13, 4, 7, 6, 8, 5, 3, 2],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Distribusi Pendapatan per Trayek",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.parsed;
                  let total = context.dataset.data.reduce((a, b) => a + b, 0);
                  let percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value}% (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    },
    initActiveUsersChart() {
      const ctx = document.getElementById("activeUsersChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Harian",
              data: [120, 190, 150, 220, 240, 280, 200],
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Mingguan",
              data: [800, 850, 900, 950, 1000, 1050, 1100],
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Bulanan",
              data: [3500, 3700, 3900, 4100, 4300, 4500, 4700],
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Grafik Pengguna Aktif",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jumlah Pengguna",
              },
            },
          },
        },
      });
    },
    initChart() {
      const ctx = document.getElementById("passengerChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          datasets: [
            {
              label: "Penumpang (Menggunakan Aplikasi)",
              data: [12, 19, 3, 5, 2, 3, 8, 15, 10, 20],
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Penumpang (Manual)",
              data: [5, 10, 15, 10, 20, 18, 10, 7, 5, 4],
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
      });
    },
  },
};
</script>

<style scoped>
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
  padding: 20px;
  background-color: #f7f9fc;
  overflow-y: auto;
}

.main-content .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 25px;
  text-align: left;
  flex: 1 1 250px; /* This allows cards to shrink and grow, with min-width of 250px */
  min-width: 250px; /* Minimum width before wrapping */
  transition: all 0.3s ease;
  border: 1px solid rgba(91, 155, 213, 0.1);
  position: relative;
  overflow: hidden;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #5b9bd5, #8cc3f2);
}

.text-container {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.overview-card p {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.overview-card h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 10px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.growth {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.logo-image,
.logo-image-section {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.overview-card:hover .logo-image,
.overview-card:hover .logo-image-section {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overview-card {
  animation: cardFadeIn 0.5s ease-out forwards;
}

/* Stagger the animation for each card */
.overview-card:nth-child(1) { animation-delay: 0s; }
.overview-card:nth-child(2) { animation-delay: 0.2s; }
.overview-card:nth-child(3) { animation-delay: 0.4s; }

/* Media queries for better responsiveness */
@media (max-width: 1024px) {
  .overview {
    gap: 15px;
  }
  
  .overview-card {
    flex: 1 1 200px; /* Adjust min-width for medium screens */
  }
  
  .overview-card h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .overview {
    flex-direction: column;
  }
  
  .overview-card {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .logo-image,
  .logo-image-section {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .overview-card {
    padding: 15px;
  }
  
  .overview-card h3 {
    font-size: 1.2rem;
  }
  
  .logo-image,
  .logo-image-section {
    width: 30px;
    height: 30px;
    right: 15px;
  }
  
  .growth {
    font-size: 0.8rem;
    padding: 3px 6px;
  }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 50px;
}

.details-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 25px;
}

.details-card h3 {
  margin-bottom: 15px;
}

.driver-list,
.passenger-analysis {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.action-button {
  background: #6096ba;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

table th,
table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #6096ba;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 50px;
  color: #333;
}

.review-container {
  background: linear-gradient(to right, #d0e8f2, #ffffff);
  border-radius: 15px;
  padding: 20px;
  max-width: 1200px;
  width: 90%;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.review-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.review-item {
  display: flex;
  align-items: center;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #f9f9f9;
}

.review-item:last-child {
  border-bottom: none;
}

.profile-pic img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.review-content {
  flex-grow: 1;
}

.name {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.rating {
  font-size: 12px;
  color: #555;
}

.emoji {
  font-size: 14px;
}

.time {
  font-size: 12px;
  color: #888;
  text-align: right;
}
</style>
