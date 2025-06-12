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
              class="menu-item active"
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
              class="menu-item"
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
      <router-link
        to="/loginform"
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
          <h3>{{ stats.users }} <span class="growth">+3%</span></h3>
          <img
            src="@/assets/userplus.png"
            alt="Logo UserPlus"
            class="logo-image"
          />
        </div>
      </div>

      <div class="overview-card">
        <p>+ Pengemudi Terdaftar</p>
        <h3>{{ stats.drivers }} <span class="growth">+5%</span></h3>
        <img
          src="@/assets/driverplus.png"
          alt="Logo DriverPlus"
          class="logo-image-section"
        />
      </div>
      <!-- <div class="overview-card">
        <p>Total Rute</p>
        <h3>{{ stats.routes }}</h3>
        <img
          src="@/assets/trayek.png"
          alt="Logo DriverPlus"
          class="logo-image-section"
        />
      </div> -->
    </section>

      <div class="details-card" style="height: 300px">
        <h3 style="font-size: 14px">Grafik Rata-rata Umur Pengguna</h3>
        <canvas id="passengerAgeChart" style="max-height: 250px"></canvas>
      </div>

      <div class="details-card" style="height: 400px">
        <h3>Peta Lokasi</h3>
        <div id="trafficMap" style="height: 350px"></div>
      </div>

      <section class="details-grid">
        <div class="details-card">
          <h3 class="header">
            <span>Daftar Pengemudi</span>
          </h3>
          <table>
  <thead>
    <tr><th>Nama</th><th>Email</th></tr>
  </thead>
  <tbody>
    <tr v-for="driver in driversList.slice(0, 5)" :key="driver.id">
      <td>{{ driver.name }}</td>
      <td>{{ driver.email }}</td>
    </tr>
  </tbody>
</table>

          <router-link
            to="/driverGov"
            class="more-item"
            :class="{ active: activeMenu === 'driverGov' }"
            @click="setActiveMenu('driverGov')"
          >
            Selengkapnya &raquo;
          </router-link>
        </div>

        <div class="details-card">
  <h2 class="review-title">Ulasan/Rating</h2>
  <ul class="review-list">
    <li class="review-item" v-for="review in reviews.slice(0, 6)" :key="review.id">
      <div class="profile-pic">
        <img :src="review.profilePicture" :alt="review.name" />
      </div>
      <div class="review-content">
        <p class="name">{{ review.name }}</p>
        <p class="rating">
          ({{ review.rating }}/5) {{ review.comment }}
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
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "AdminData",
  data() {
    return {
      stats: {
        users: 0,
        drivers: 0,
        routes: 0,
      },
      mapCenter: [1.4748, 124.8421],
      trafficDensity: {
        "Trayek Manado-Kawangkaren": "Padat",
        "Trayek Pusat Kota": "Sedang",
        "Trayek Pinggiran": "Lancar",
      },
      activeDrivers: [
        { id: 1, name: "Daniel", location: [1.4748, 124.8421], status: "online" },
        { id: 2, name: "Kevin", location: [1.47, 124.85], status: "offline" },
      ],
      // Data dummy 100 driver di sekitar Manado
      dummyDrivers: this.generateDummyDrivers(),
      driversList: [],
      activeMenu: "admin-dash",
      reviews: [],
      passengerAgeData: {
        labels: [],
        values: [],
      },
      // Untuk menyimpan referensi map dan markers
      map: null,
      markers: {},
      wsConnection: null,
    };
  },
  mounted() {
    this.fetchDashboardStats();
    this.fetchPassengerAgeData()
    this.initTrafficMap();
  },
  beforeUnmount() {
    // Cleanup WebSocket connection
    if (this.wsConnection) {
      this.wsConnection.close();
    }
  },
  methods: {
    // Method untuk generate 100 driver dummy di area daratan kota Manado
    generateDummyDrivers() {
      const drivers = [];
      const names = [
        "Maria Sondakh", "Robert Pangkey",
         "Grace Tumundo", "David Rumondor",
        "Christy Luntungan", "Irene Tombokan",
        "Michael Lengkong", "Martha Kandou", "Ferdy Supit",
         "William Turang", "Jonathan Wongkar",
        "Steven Waworuntu", "Venny Sumarauw", "Andreas Lawalata", "Richard Kumaat",
        "Jacky Tumanduk", "Febby Kawulur", "Olivia Paat",
        "Cindy Palit", "Tommy Rotinsulu", "Rudy Parengkuan", "Viona Rarung",
        "Benny Sumampouw", "Nova Pangkey", "Denny Watulingas", "Tony Kandoli",
        "Serly Mamahit", "Billy Kumendong", "Merry Palendeng", "Ricky Paat", "Dessy Karundeng"
      ];
      
      const routes = [
        "Pusat Kota", "Wenang", "Tikala", "Wanea", "Sario", "Singkil", "Paal Dua", 
        "Kleak", "Malalayang", "Tuminting", "Mapanget", "Paniki", "Boulevard", 
        "Sam Ratulangi", "Ring Road", "Terminal Malalayang", "Pasar Bersehati", 
        "Mega Mall", "IT Center", "Karombasan", "Ranotana", "Wenang-Tikala",
        "Sario-Malalayang", "Boulevard-Megamas", "Paal Dua-Karombasan"
      ];
      
      // Area daratan spesifik di Kota Manado (menghindari area laut)
      const landAreas = [
        // Area Pusat Kota Manado
        {
          name: "Pusat Kota",
          bounds: {
            north: 1.4900,
            south: 1.4820,
            east: 124.8500,
            west: 124.8400
          }
        },
        // Area Wenang
        {
          name: "Wenang",
          bounds: {
            north: 1.4880,
            south: 1.4800,
            east: 124.8550,
            west: 124.8450
          }
        },
        // Area Tikala
        {
          name: "Tikala",
          bounds: {
            north: 1.4950,
            south: 1.4870,
            east: 124.8600,
            west: 124.8500
          }
        },
        // Area Wanea
        {
          name: "Wanea",
          bounds: {
            north: 1.4850,
            south: 1.4770,
            east: 124.8650,
            west: 124.8550
          }
        },
        // Area Sario
        {
          name: "Sario",
          bounds: {
            north: 1.4920,
            south: 1.4840,
            east: 124.8480,
            west: 124.8380
          }
        },
        // Area Singkil
        {
          name: "Singkil",
          bounds: {
            north: 1.4800,
            south: 1.4720,
            east: 124.8520,
            west: 124.8420
          }
        },
        // Area Paal Dua
        {
          name: "Paal Dua",
          bounds: {
            north: 1.4750,
            south: 1.4670,
            east: 124.8580,
            west: 124.8480
          }
        },
        // Area Malalayang
        {
          name: "Malalayang",
          bounds: {
            north: 1.4680,
            south: 1.4600,
            east: 124.8650,
            west: 124.8550
          }
        },
        // Area Tuminting
        {
          name: "Tuminting",
          bounds: {
            north: 1.4950,
            south: 1.4870,
            east: 124.8650,
            west: 124.8550
          }
        },
        // Area Mapanget
        {
          name: "Mapanget",
          bounds: {
            north: 1.5000,
            south: 1.4920,
            east: 124.8700,
            west: 124.8600
          }
        },
        // Area Paniki
        {
          name: "Paniki",
          bounds: {
            north: 1.4990,
            south: 1.4910,
            east: 124.8580,
            west: 124.8480
          }
        },
        // Area Boulevard
        {
          name: "Boulevard",
          bounds: {
            north: 1.4880,
            south: 1.4800,
            east: 124.8420,
            west: 124.8320
          }
        },
        // Area Ranotana
        {
          name: "Ranotana",
          bounds: {
            north: 1.4720,
            south: 1.4640,
            east: 124.8700,
            west: 124.8600
          }
        },
        // Area Karombasan
        {
          name: "Karombasan",
          bounds: {
            north: 1.4640,
            south: 1.4560,
            east: 124.8650,
            west: 124.8550
          }
        }
      ];
      
      for (let i = 1; i <= 100; i++) {
        // Pilih area daratan secara acak
        const selectedArea = landAreas[Math.floor(Math.random() * landAreas.length)];
        
        // Generate koordinat dalam area daratan yang dipilih
        const lat = this.randomInRange(selectedArea.bounds.south, selectedArea.bounds.north);
        const lng = this.randomInRange(selectedArea.bounds.west, selectedArea.bounds.east);
        
        // Pilih nama secara acak dan tambahkan nomor jika perlu
        let driverName;
        if (i <= names.length) {
          driverName = names[i - 1];
        } else {
          // Jika lebih dari jumlah nama, tambahkan nomor
          const baseNameIndex = (i - 1) % names.length;
          const nameNumber = Math.floor((i - 1) / names.length) + 1;
          driverName = `${names[baseNameIndex]} ${nameNumber}`;
        }
        
        drivers.push({
          id: i,
          name: driverName,
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          status: "online", // Semua driver online
          route: routes[Math.floor(Math.random() * routes.length)],
          area: selectedArea.name // Menambahkan info area untuk referensi
        });
      }
      
      return drivers;
    },
    
    // Helper method untuk generate angka random dalam range
    randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    // Method baru untuk validasi posisi daratan
    isValidLandPosition(lat, lng) {
      // Definisi area daratan yang valid (sama seperti di generateDummyDrivers)
      const validLandAreas = [
        { north: 1.4900, south: 1.4820, east: 124.8500, west: 124.8400 }, // Pusat Kota
        { north: 1.4880, south: 1.4800, east: 124.8550, west: 124.8450 }, // Wenang
        { north: 1.4950, south: 1.4870, east: 124.8600, west: 124.8500 }, // Tikala
        { north: 1.4850, south: 1.4770, east: 124.8650, west: 124.8550 }, // Wanea
        { north: 1.4920, south: 1.4840, east: 124.8480, west: 124.8380 }, // Sario
        { north: 1.4800, south: 1.4720, east: 124.8520, west: 124.8420 }, // Singkil
        { north: 1.4750, south: 1.4670, east: 124.8580, west: 124.8480 }, // Paal Dua
        { north: 1.4680, south: 1.4600, east: 124.8650, west: 124.8550 }, // Malalayang
        { north: 1.4950, south: 1.4870, east: 124.8650, west: 124.8550 }, // Tuminting
        { north: 1.5000, south: 1.4920, east: 124.8700, west: 124.8600 }, // Mapanget
        { north: 1.4990, south: 1.4910, east: 124.8580, west: 124.8480 }, // Paniki
        { north: 1.4880, south: 1.4800, east: 124.8420, west: 124.8320 }, // Boulevard
        { north: 1.4720, south: 1.4640, east: 124.8700, west: 124.8600 }, // Ranotana
        { north: 1.4640, south: 1.4560, east: 124.8650, west: 124.8550 }  // Karombasan
      ];
      
      // Cek apakah koordinat berada dalam salah satu area daratan yang valid
      return validLandAreas.some(area => 
        lat >= area.south && 
        lat <= area.north && 
        lng >= area.west && 
        lng <= area.east
      );
    },

    async fetchPassengerAgeData() {
      const token = localStorage.getItem("access_token");
      if (!token) return console.error("Token tidak ditemukan di localStorage (access_token)");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/users", {
          method: "GET",
          headers,
        });
        const result = await response.json();

        if (result.data?.users) {
          const ageGroups = this.processAgeData(result.data.users);
          this.passengerAgeData.labels = Object.keys(ageGroups);
          this.passengerAgeData.values = Object.values(ageGroups);
        }

        this.initPassengerAgeChart();
      } catch (err) {
        console.error("Gagal mengambil data umur Pengguna:", err);
        this.initPassengerAgeChart();
      }
    },

    processAgeData(users) {
      const ageGroups = {
        "< 18": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45-54": 0,
        "55+": 0,
      };

      const today = new Date();

      users.forEach((user) => {
        if (!user.date_of_birth) return;

        const dob = new Date(user.date_of_birth);
        if (isNaN(dob)) return;

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 18) ageGroups["< 18"]++;
        else if (age < 25) ageGroups["18-24"]++;
        else if (age < 35) ageGroups["25-34"]++;
        else if (age < 45) ageGroups["35-44"]++;
        else if (age < 55) ageGroups["45-54"]++;
        else ageGroups["55+"]++;
      });

      return ageGroups;
    },

    initPassengerAgeChart() {
      const canvas = document.getElementById("passengerAgeChart");
      if (!canvas) return;

      if (this.passengerAgeData.labels.length === 0) {
        const ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.fillText("Tidak ada data umur Pengguna tersedia", canvas.width / 2, canvas.height / 2);
        return;
      }

      new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
          labels: this.passengerAgeData.labels,
          datasets: [{
            label: "Jumlah Pengguna",
            data: this.passengerAgeData.values,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Distribusi Umur Pengguna",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Jumlah Pengguna" },
            },
            x: {
              title: { display: true, text: "Kelompok Umur" },
            },
          },
        },
      });
    },

    // Method untuk mendapatkan warna berdasarkan status
    getStatusColor(status) {
      switch(status) {
        case 'online': return '#28a745';
        case 'offline': return '#dc3545';
        case 'busy': return '#ffc107';
        default: return '#6c757d';
      }
    },

    // Method untuk mendapatkan text status
    getStatusText(status) {
      switch(status) {
        case 'online': return 'Online';
        case 'offline': return 'Offline';
        case 'busy': return 'Sibuk';
        default: return 'Unknown';
      }
    },

    // Method untuk menambahkan data dummy driver ke map
    addDummyDriversToMap() {
      if (!this.map) return;

      console.log(`Menambahkan ${this.dummyDrivers.length} driver ke map...`);

      this.dummyDrivers.forEach(driver => {
        const color = this.getStatusColor(driver.status);
        
        // Create custom icon
        const icon = L.divIcon({
          className: 'custom-driver-icon',
          html: `
            <div style="
              background-color: ${color};
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 3px rgba(0,0,0,0.5);
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        
        // Create marker
        const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(this.map);
        
        // Create popup content
        const popupContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">
            <div style="font-weight: 600; color: #495057; margin-bottom: 3px;">ID: ${driver.id}</div>
            <div style="font-weight: 600; color: #495057; margin-bottom: 3px;">${driver.name}</div>
            <div style="font-size: 10px; color: #6c757d; margin-bottom: 5px;">
            </div>
            <div>
              <span style="
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 6px;
                background-color: ${color};
                color: white;
                display: inline-block;
              ">
                ${this.getStatusText(driver.status)}
              </span>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        this.markers[driver.id] = marker;
      });
      
      console.log(`Berhasil menambahkan ${Object.keys(this.markers).length} marker ke map`);
    },

    // Method untuk simulasi pergerakan driver yang diperbaiki
    simulateDriverMovement() {
      setInterval(() => {
        this.dummyDrivers.forEach(driver => {
          // Simulasi pergerakan yang lebih kecil dan terkontrol
          const moveDistance = 0.0002; // Sekitar 20 meter
          
          // Tentukan batas pergerakan berdasarkan posisi saat ini
          const currentLat = driver.lat;
          const currentLng = driver.lng;
          
          // Buat pergerakan acak kecil
          const latChange = (Math.random() - 0.5) * moveDistance;
          const lngChange = (Math.random() - 0.5) * moveDistance;
          
          const newLat = currentLat + latChange;
          const newLng = currentLng + lngChange;
          
          // Validasi apakah posisi baru masih dalam area daratan yang valid
          if (this.isValidLandPosition(newLat, newLng)) {
            driver.lat = newLat;
            driver.lng = newLng;
          }
          // Jika posisi tidak valid, driver tetap di posisi sebelumnya
          
          // Update marker di map
          const marker = this.markers[driver.id];
          if (marker) {
            const color = this.getStatusColor(driver.status);
            const icon = L.divIcon({
              className: 'custom-driver-icon',
              html: `
                <div style="
                  background-color: ${color};
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 0 3px rgba(0,0,0,0.5);
                "></div>
              `,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });
            
            marker.setLatLng([driver.lat, driver.lng]);
            marker.setIcon(icon);
            
            // Update popup content
            const popupContent = `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px;">
                <div style="font-weight: 600; color: #495057; margin-bottom: 3px;">ID: ${driver.id}</div>
                <div style="font-weight: 600; color: #495057; margin-bottom: 3px;">${driver.name}</div>
                <div style="font-size: 11px; color: #6c757d; margin-bottom: 3px;">Rute: ${driver.route}</div>
                </div>
                <div>
                  <span style="
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 6px;
                    background-color: ${color};
                    color: white;
                    display: inline-block;
                  ">
                    ${this.getStatusText(driver.status)}
                  </span>
                </div>
              </div>
            `;
            marker.setPopupContent(popupContent);
          }
        });
      }, 10000); // Update setiap 10 detik
    },

    initTrafficMap() {
      if (typeof L === "undefined") {
        console.error("Leaflet tidak ditemukan");
        return;
      }

      this.map = L.map("trafficMap").setView(this.mapCenter, 14); // Zoom level lebih dekat untuk area kota

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18
      }).addTo(this.map);

      // Tambahkan data dummy driver ke map
      this.addDummyDriversToMap();
      
      // Mulai simulasi pergerakan
      this.simulateDriverMovement();

      // Track marker berdasarkan user_id dari WebSocket (tetap ada untuk data real)
      try {
        this.wsConnection = new WebSocket("ws://mikronet.systems/api/tracking/ws/location");

        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { user_id, name, lat, lng, status } = data;

            const icon = L.divIcon({
              className: "custom-driver-icon",
              html: `
                <div style="
                  background-color: ${status === 'online' ? 'green' : 'red'};
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 5px rgba(0,0,0,0.7);
                "></div>
              `,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            if (this.markers[`real_${user_id}`]) {
              // Update posisi & ikon marker real
              this.markers[`real_${user_id}`].setLatLng([lat, lng]);
              this.markers[`real_${user_id}`].setIcon(icon);
              this.markers[`real_${user_id}`].setPopupContent(`
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  <div style="font-weight: 600; color: #495057; margin-bottom: 5px;">${name}</div>
                  <div style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">Status: ${status}</div>
                  <div style="font-size: 11px; color: #28a745; font-weight: 500;">🔴 REAL-TIME DATA</div>
                </div>
              `);
            } else {
              // Buat marker baru untuk data real
              const marker = L.marker([lat, lng], { icon }).addTo(this.map);
              marker.bindPopup(`
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  <div style="font-weight: 600; color: #495057; margin-bottom: 5px;">${name}</div>
                  <div style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">Status: ${status}</div>
                  <div style="font-size: 11px; color: #28a745; font-weight: 500;">🔴 REAL-TIME DATA</div>
                </div>
              `);
              this.markers[`real_${user_id}`] = marker;
            }
          } catch (err) {
            console.error("Data WebSocket tidak valid:", err);
          }
        };

        this.wsConnection.onerror = (err) => {
          console.error("WebSocket error:", err);
        };
      } catch (err) {
        console.error("Gagal membuat koneksi WebSocket:", err);
      }
    },

    async fetchDashboardStats() {
      const token = localStorage.getItem("access_token");
      if (!token) return console.error("Token tidak ditemukan di localStorage (access_token)");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await this.fetchUsers(headers);
      await this.fetchDrivers(headers);
      await this.fetchRoutes(headers);
      await this.fetchDriversList(headers);
      await this.fetchReviews(headers);
    },

    async fetchUsers(headers) {
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/users", { method: "GET", headers });
        const result = await response.json();
        this.stats.users = result.data?.count || 0;
      } catch (err) {
        console.error("Gagal mengambil data pengguna:", err);
      }
    },

    async fetchDrivers(headers) {
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/drivers", { method: "GET", headers });
        const result = await response.json();
        this.stats.drivers = result.data?.count || 0;
      } catch (err) {
        console.error("Gagal mengambil data pengemudi:", err);
      }
    },

    async fetchRoutes(headers) {
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/routes", { method: "GET", headers });
        const result = await response.json();
        this.stats.routes = result.data?.count || result.total || 0;
      } catch (err) {
        console.error("Gagal mengambil data rute:", err);
        this.stats.routes = 0;
      }
    },

    async fetchDriversList(headers) {
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/drivers", { method: "GET", headers });
        const result = await response.json();
        this.driversList = result.data?.drivers || [];
      } catch (err) {
        console.error("Gagal mengambil daftar pengemudi:", err);
      }
    },

    async fetchReviews(headers) {
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/reviews", { method: "GET", headers });
        const result = await response.json();
        this.reviews = result.data.reviews.map((review) => ({
          id: review.id,
          name: review.passenger_name,
          profilePicture: "@/assets/default-profile.jpg",
          rating: review.star,
          comment: review.comment,
          time: "N/A",
        }));
      } catch (err) {
        console.error("Gagal mengambil data ulasan:", err);
      }
    },

    setActiveMenu(menuItem) {
      this.activeMenu = menuItem;
    },

    // Method tambahan untuk mendapatkan statistik driver berdasarkan status
    getDriverStats() {
      const online = this.dummyDrivers.filter(d => d.status === 'online').length;
      const busy = this.dummyDrivers.filter(d => d.status === 'busy').length;
      const offline = this.dummyDrivers.filter(d => d.status === 'offline').length;
      
      return {
        total: this.dummyDrivers.length,
        online,
        busy,
        offline
      };
    },

    // Method untuk mendapatkan driver berdasarkan area tertentu
    getDriversByArea(bounds) {
      return this.dummyDrivers.filter(driver => 
        driver.lat >= bounds.south && 
        driver.lat <= bounds.north && 
        driver.lng >= bounds.west && 
        driver.lng <= bounds.east
      );
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
  content: "";
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
.overview-card:nth-child(1) {
  animation-delay: 0s;
}
.overview-card:nth-child(2) {
  animation-delay: 0.2s;
}
.overview-card:nth-child(3) {
  animation-delay: 0.4s;
}

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
