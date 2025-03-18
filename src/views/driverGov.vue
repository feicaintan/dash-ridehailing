<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/management" class="back-button">← Kembali</router-link>
      <h1 class="title">Daftar Data Driver</h1>
      <div class="search-container">
        <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
        <input
          type="text"
          class="search-bar"
          placeholder="Cari Driver..."
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
            <th>Nomor Kendaraan</th>
            <th>Nomor SIM</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in filteredDrivers" :key="driver.email">
            <td>
              <img :src="driver.photo" alt="Driver Photo" class="driver-photo" />
            </td>
            <td>{{ driver.name }}</td>
            <td>{{ driver.phone }}</td>
            <td>{{ driver.email }}</td>
            <td>{{ driver.vehicleNumber }}</td>
            <td>{{ driver.simNumber }}</td>
            <td>
              <span :class="driver.status === 'online' ? 'status-online' : 'status-offline'">
                {{ driver.status }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredDrivers.length === 0">
            <td colspan="7">Data tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "DaftarDriver",
  data() {
    return {
      searchQuery: "",
      drivers: [
        {
          name: "Budi Santoso",
          phone: "081298765432",
          email: "budi@example.com",
          vehicleNumber: "B 1234 CD",
          simNumber: "SIM123456",
          photo: "@/assets/driver1.jpg", // Ganti dengan path foto yang sesuai
          status: "online",
        },
        {
          name: "Agus Widodo",
          phone: "082334455667",
          email: "agus@example.com",
          vehicleNumber: "B 5678 EF",
          simNumber: "SIM654321",
          photo: "@/assets/driver2.jpg", // Ganti dengan path foto yang sesuai
          status: "offline",
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
  position: relative; /* Untuk menempatkan ikon di dalam input */
}

.search-icon {
  position: absolute;
  left: 10px; /* Jarak dari kiri */
  top: 50%; /* Menempatkan ikon di tengah vertikal */
  transform: translateY(-50%); /* Mengatur posisi ikon agar tepat di tengah */
  width: 20px; /* Ukuran ikon */
  height: 20px; /* Ukuran ikon */
}

.search-bar {
  padding: 10px 10px 10px 40px; /* Padding untuk memberi ruang bagi ikon */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px; /* Lebar search bar */
}

.table-container {
  overflow-x: auto; /* Untuk responsivitas tabel */
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
  background-color: #315882; /* Warna biru yang lebih kontras */
  color: white;
  font-weight: bold;
}

.data-table tr:hover {
  background-color: #e9ecef; /* Efek hover yang lebih halus */
}

.status {
  font-weight: bold;
}

.status-online {
  color: green;
  font-weight: bold;
}

.status-offline {
  color: gray;
  font-weight: bold;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Latar belakang gelap */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Pastikan popup di atas konten lainnya */
  transition: opacity 0.3s ease; /* Efek transisi */
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 400px; /* Lebar popup */
  animation: fadeIn 0.3s; /* Animasi saat popup muncul */
}

.form-group {
  margin-bottom: 15px; /* Jarak antar elemen form */
}

.form-group label {
  display: block; /* Membuat label menjadi block */
  margin-bottom: 5px; /* Jarak antara label dan input */
  font-weight: bold; /* Menebalkan label */
}

.form-group input,
.form-group select {
  width: 100%; /* Lebar penuh */
  padding: 4px; /* Padding dalam input */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between; /* Tombol di kiri dan kanan */
  margin-top: 20px; /* Jarak atas untuk pemisahan dari form */
}

.submit-button {
  background-color: #28a745; /* Warna hijau untuk tombol Add */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; /* Efek transisi saat hover */
}

.submit-button:hover {
  background-color: #218838; /* Warna lebih gelap saat hover */
}

.cancel-button {
  background-color: #dc3545; /* Warna merah untuk tombol Back */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-buttonblock {
  background-color: #6C757D; 
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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