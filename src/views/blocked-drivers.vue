<template>
  <div class="blocked-drivers-container">
    <!-- Back Button -->
    <div class="back-button">
      <button @click="goBack" class="btn-back">&laquo; Kembali</button>
    </div>

    <h1>DAFTAR Driver yang Terblokir</h1>

    <!-- Search and Total Count -->
    <div class="controls">
      <input v-model="search" type="text" placeholder="Cari driver..." class="search-input" />
      <span class="total-count">Total Driver Terblokir: {{ filteredBlockedDrivers.length }}</span>
    </div>

    <!-- Blocked Drivers Table -->
    <table class="blocked-drivers-table">
      <thead>
        <tr>
          <th>Nama Driver</th>
          <th>Nomor Kendaraan</th>
          <th>Jumlah Keluhan</th>
          <th>Rincian Keluhan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(driver, index) in paginatedBlockedDrivers" :key="index">
          <td>{{ driver.name }}</td>
          <td>{{ driver.vehicleNumber }}</td>
          <td>{{ driver.complaintsCount }}</td>
          <td>
            <button @click="showComplaintDetails(driver.complaintsDetails)" class="btn-details">Lihat Rincian</button>
          </td>
          <td>
            <button @click="confirmUnblock(driver)" class="btn-unblock">Buka Blokir</button>
          </td>
        </tr>
        <tr v-if="!paginatedBlockedDrivers.length">
          <td colspan="5" class="no-data">Tidak ada data yang ditemukan.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn-pagination">&laquo; Prev</button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Next &raquo;</button>
    </div>

    <!-- Popup for Complaint Details -->
    <div v-if="isPopupOpen" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Rincian Keluhan</h2>
        <ul>
          <li v-for="(detail, index) in selectedComplaintDetails" :key="index" class="complaint-item">
            {{ index + 1 }}. {{ detail }}
          </li>
        </ul>
        <button @click="closePopup" class="btn-close">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      search: "",
      currentPage: 1,
      itemsPerPage: 5,
      isPopupOpen: false,
      selectedComplaintDetails: [],
      blockedDrivers: [
        { id: 1, name: "Budi", vehicleNumber: "B1234XYZ", complaintsCount: 10, complaintsDetails: ["Terlambat datang", "Sikap kurang ramah", "Tidak mengikuti rute", "Mobil kotor", "Mengemudi ugal-ugalan", "Tidak menggunakan sabuk pengaman", "Sikap kasar", "Tidak sopan", "Mengemudi terlalu cepat", "Tidak mengikuti instruksi"] },
        { id: 2, name: "Bambang", vehicleNumber: "B5678ABC", complaintsCount: 12, complaintsDetails: ["Sikap kasar", "Terlambat datang", "Mobil kotor", "Tidak menggunakan sabuk pengaman", "Mengemudi ugal-ugalan", "Sikap kurang ramah", "Tidak mengikuti rute", "Terlambat menjemput", "Tidak menepati janji", "Mengemudi dengan kecepatan tinggi", "Tidak memperhatikan penumpang", "Sikap tidak profesional"] },
        { id: 3, name: "Cahyo", vehicleNumber: "B9101DEF", complaintsCount: 11, complaintsDetails: ["Sikap kurang ramah", "Terlambat datang", "Tidak mengikuti rute", "Mobil kotor", "Sikap kasar", "Tidak sopan", "Mengemudi terlalu cepat", "Tidak menggunakan sabuk pengaman", "Tidak memperhatikan penumpang", "Terlambat menjemput", "Mengemudi dengan kecepatan tinggi"] },
        { id: 4, name: "Dedi", vehicleNumber: "B1121GHI", complaintsCount: 10, complaintsDetails: ["Sikap kasar", "Tidak mengikuti rute", "Mobil kotor", "Terlambat datang", "Sikap kurang ramah", "Tidak sopan", "Mengemudi ugal-ugalan", "Tidak menggunakan sabuk pengaman", "Mengemudi dengan kecepatan tinggi", "Tidak memperhatikan penumpang"] },
        { id: 5, name: "Fajar", vehicleNumber: "B3141JKL", complaintsCount: 10, complaintsDetails: ["Terlambat datang", "Sikap kurang ramah", "Tidak mengikuti rute", "Mobil kotor", "Sikap kasar", "Tidak sopan", "Mengemudi terlalu cepat", "Tidak menggunakan sabuk pengaman", "Tidak memperhatikan penumpang", "Terlambat menjemput"] },
      ],
    };
  },
  computed: {
    filteredBlockedDrivers() {
      return this.blockedDrivers.filter(driver =>
        driver.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredBlockedDrivers.length / this.itemsPerPage);
    },
    paginatedBlockedDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredBlockedDrivers.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    showComplaintDetails(complaints) {
      this.selectedComplaintDetails = complaints;
      this.isPopupOpen = true;
    },
    closePopup() {
      this.isPopupOpen = false;
    },
    confirmUnblock(driver) {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: `Anda akan membuka blokir driver ${driver.name}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, buka blokir!',
        cancelButtonText: 'Tidak, batalkan'
      }).then((result) => {
        if (result.isConfirmed) {
          this.unblockDriver(driver);
          Swal.fire(
            'Dibuka!',
            `Driver ${driver.name} telah dibuka blokir.`,
            'success'
          );
        }
      });
    },
    unblockDriver(driver) {
      this.blockedDrivers = this.blockedDrivers.filter(d => d.id !== driver.id);
      console.log(`Driver dengan ID ${driver.id} telah dibuka blokir.`);
    },
    goBack() {
      this.$router.push('/data'); 
    },
  },
};
</script>

<style scoped>
.blocked-drivers-container {
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.back-button {
  margin-bottom: 20px;
  text-align: left;
}

.btn-back {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #0056b3;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  padding : 10px;
  font-size: 16px;
  width: 60%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.total-count {
  font-size: 16px;
  align-self: center;
}

.blocked-drivers-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.blocked-drivers-table th, .blocked-drivers-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.blocked-drivers-table th {
  background-color: #007bff;
  color: white;
}

.blocked-drivers-table tr:hover {
  background-color: #f1f1f1;
}

.btn-details {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-details:hover {
  background-color: #218838;
}

.btn-unblock {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-unblock:hover {
  background-color: #c82333;
}

.no-data {
  text-align: center;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-pagination {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-pagination:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.modal-title {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.complaint-item {
  margin-bottom: 5px;
}

.btn-close {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-close:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>