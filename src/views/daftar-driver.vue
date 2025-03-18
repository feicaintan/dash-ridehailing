<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/data" class="back-button">← Kembali</router-link>
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
            <th>Aksi</th>
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
            <td>
              <button class="edit-button" @click="editDriver(driver)">Edit</button>
              <button class="delete-button" @click="showDeleteDriverPopup(driver)">Delete</button>
              <button class="block-button" @click="showBlockPopup(driver)">Block</button>
            </td>
          </tr>
          <tr v-if="filteredDrivers.length === 0">
            <td colspan="8">Data tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Konfirmasi Hapus Driver -->
    <div v-if="deleteDriverPopup.show" class="popup-overlay">
      <div class="popup">
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus <strong>{{ deleteDriverPopup.driver?.name }}</strong>?</p>
        <div class="popup-buttons">
          <button class="confirm-button" @click="deleteDriver(deleteDriverPopup.driver)">Ya, Hapus</button>
          <button class="cancel-buttonblock" @click="deleteDriverPopup.show = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup Konfirmasi Blokir Driver -->
    <div v-if="blockPopup.show" class="popup-overlay">
      <div class="popup">
        <h2>Konfirmasi Blokir</h2>
        <p>Apakah Anda yakin ingin memblokir <strong>{{ blockPopup.user?.name }}</strong>?</p>
        <div class="popup-buttons">
          <button class="confirm-button" @click="blockUser ">Ya, Blokir</button>
          <button class="cancel-buttonblock" @click="blockPopup.show = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup Form -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2>{{ isEditing ? "Edit Driver" : "Tambah Driver" }}</h2>
        <form @submit.prevent="isEditing ? updateDriver() : addDriver()">
          <div class="form-group">
            <label for="name">Nama Driver:</label>
            <input type="text" id="name" v-model="newDriver.name" required />
          </div>
          <div class="form-group">
            <label for="phone">Nomor Telepon:</label>
            <input type="text" id="phone" v-model="newDriver.phone" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="newDriver.email" required />
          </div>
          <div class="form-group">
            <label for="vehicleNumber">Nomor Kendaraan:</label>
            <input type="text" id="vehicleNumber" v-model="newDriver.vehicleNumber" required />
          </div>
          <div class="form-group">
            <label for="simNumber">Nomor SIM:</label>
            <input type="text" id="simNumber" v-model="newDriver.simNumber" required />
          </div>
          <div class="popup-buttons">
            <button type="submit" class="submit-button">
              {{ isEditing ? "Update" : "Add" }}
            </button>
            <button type="button" class="cancel-button" @click="showPopup = false">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DaftarDriver",
  data() {
    return {
      searchQuery: "",
      showPopup: false,
      isEditing: false,
      blockPopup: { show: false, user: null },
      deleteDriverPopup: { show: false, driver: null },
      newDriver: {
        name: "",
        phone: "",
        email: "",
        vehicleNumber: "",
        simNumber: "",
        photo: "", // Tambahkan foto
        status: "offline", // Status default
      },
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
        {
          name: "Joko Widodo",
          phone: "082334455667",
          email: "joko@example.com",
          vehicleNumber: "B 5767 EF",
          simNumber: "SIM654321",
          photo: "@/assets/driver2.jpg", // Ganti dengan path foto yang sesuai
          status: "offline",
        },
        {
          name: "Glen Manitik",
          phone: "082334455667",
          email: "glen@example.com",
          vehicleNumber: "B 1631 DF",
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
    addDriver() {
      this.drivers.push({ ...this.newDriver });
      this.resetForm();
    },
    editDriver(driver) {
      this.newDriver = { ...driver };
      this.isEditing = true;
      this.showPopup = true;
    },
    updateDriver() {
      const index = this.drivers.findIndex(
        (driver) => driver.email === this.newDriver.email
      );
      if (index !== -1) {
        this.drivers.splice(index, 1, { ...this.newDriver });
      }
      this.resetForm();
    },
    showDeleteDriverPopup(driver) {
      this.deleteDriverPopup.driver = driver;
      this.deleteDriverPopup.show = true;
    },
    deleteDriver(driver) {
      this.drivers = this.drivers.filter((d) => d !== driver);
      this.deleteDriverPopup.show = false;
      this.deleteDriverPopup.driver = null;
    },
    showBlockPopup(driver) {
      this.blockPopup.user = driver;
      this.blockPopup.show = true;
    },
    blockUser () {
      this.drivers = this.drivers.filter((d) => d !== this.blockPopup.user);
      this.blockPopup.show = false;
      this.blockPopup.user = null;
    },
    resetForm() {
      this.newDriver = {
        name: "",
        phone: "",
        email: "",
        vehicleNumber: "",
        simNumber: "",
        photo: "",
        status: "offline",
      };
      this.isEditing = false;
      this.showPopup = false;
    },
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

.add-driver-container {
  display: flex;
  justify-content: flex-end; /* Menempatkan tombol di sebelah kanan */
  margin-top: 20px; /* Jarak atas untuk pemisahan dari tabel */
}

.add-driver-button {
  background-color: #315882; /* Warna tombol */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

.edit-button {
  background-color: rgb(17, 142, 40);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-button:hover {
  background-color: rgb(2, 77, 16);
}

.delete-button {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
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

.block-button {
  background-color: #ff9800;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

.block-button:hover {
  background-color: #e68900;
}

.confirm-button {
  background-color: #DC3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

</style>