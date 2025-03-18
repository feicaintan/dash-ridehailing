<template>
    <div class="data-container">
      <div class="header">
        <router-link to="/management" class="back-button">← Kembali</router-link>
        <h1 class="title">Daftar Verifikasi Pengemudi Baru</h1>
        <div class="search-container">
          <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
          <input
            type="text"
            class="search-bar"
            placeholder="Cari Pengemudi..."
            v-model="searchQuery"
          />
        </div>
      </div>
  
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Pengemudi</th>
              <th>Nomor Telepon</th>
              <th>Email</th>
              <th>Nomor KTP</th>
              <th>Nomor SIM</th>
              <th>Status Verifikasi</th>
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
              <td>
                <span :class="{'status-pending': driver.verificationStatus === 'Pending', 'status-accepted': driver.verificationStatus === 'Diterima'}">
                  {{ driver.verificationStatus }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredDrivers.length === 0">
              <td colspan="9">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
        </div>
  </template>
  
  <script>
  export default {
    name: "DaftarPengemudi",
    data() {
      return {
        searchQuery: "", 
        drivers: [
          {
            photo: "@/assets/driver1.jpg",
            name: "Minho Park",
            ktp: "1234567890123456",
            sim: "A123456789",
            phone: "081234567890",
            email: "minho@example.com",
            verificationStatus: "Pending", // Status verifikasi
          },
          {
            photo: "@/assets/driver1.jpg",
            name: "Debora Feica",
            ktp: "1234567890123456",
            sim: "A123456789",
            phone: "081234567890",
            email: "minho@example.com",
            verificationStatus: "Pending", // Status verifikasi
          },
        ],
      };
    },
    computed: {
      filteredDrivers() {
        if (this.searchQuery) {
          return this.drivers.filter((driver) =>
            driver.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        return this.drivers;
      },
    },
    methods: {
      

      },
    };
  </script>
  
  <style scoped>
  .status-pending {
    color: rgb(164, 164, 63); 
    font-weight: bold;
  }
  
  .status-accepted {
    color: green; 
    font-weight: bold;
  }
  
.data-container {
  padding: 20px;
  background-color: #f0f4f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  text-decoration: none;
  color: #004085;
  font-weight: bold;
  font-size: 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  flex-grow: 1;
  text-align: center; 
}

.search-container {
  position: relative; 
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
  width: 200px; 
}

.table-container {
  overflow-x: auto; 
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #315882; 
  color: white;
  font-weight: bold;
}

.data-table tr:hover {
  background-color: #e9ecef; 
}

.status {
  font-weight: bold;
}

.driver-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
  </style>