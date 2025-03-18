<template>
  <div class="data-container">
    <router-link to="/tarifRute" class="back-button">← Kembali</router-link>

    <div class="content">
      <h1 class="title">Daftar Pengaturan Tarif</h1>
      <div class="search-container">
        <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
        <input
          type="text"
          class="search-bar"
          placeholder="Cari Jenis Penumpang/Trayek..."
          v-model="searchQuery"
        />
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Jenis Penumpang</th>
              <th>Trayek</th>
              <th>Tarif</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tariff, index) in paginatedTariffs" :key="index">
              <td>{{ tariff.jenisPenumpang }}</td>
              <td>{{ tariff.trayek }}</td>
              <td>{{ tariff.tarif }}</td>
            </tr>
            <tr v-if="paginatedTariffs.length === 0">
              <td colspan="3">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tombol Tambah Tarif -->
      <div class="add-tariff-container">
        <button class="add-tariff-button" @click="showAddTariffPopup">Tambah Tarif</button>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="prevPage" class="pagination-button">Back</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-button">Next</button>
      </div>
    </div>

    <!-- Popup Tambah Tarif -->
    <div v-if="isAddTariffPopupOpen" class="popup-overlay">
      <div class="popup">
        <h2>Tambah Tarif</h2>
        <form @submit.prevent="addTariff">
          <div class="form-group">
            <label>Jenis Penumpang</label>
            <input type="text" v-model="newTariff.jenisPenumpang" required />
          </div>
          <div class="form-group">
            <label>Trayek</label>
            <input type="text" v-model="newTariff.trayek" required />
          </div>
          <div class="form-group">
            <label>Tarif</label>
            <input type="number" v-model="newTariff.tarif" required />
          </div>
          <div class="popup-buttons">
            <button class="submit-button" type="submit">Simpan</button>
            <button class="cancel-button" @click="closeAddTariffPopup">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "DaftarTarif",
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      isAddTariffPopupOpen: false,
      newTariff: {
        jenisPenumpang: "",
        trayek: "",
        tarif: null,
      },
      tarifData: [
        { jenisPenumpang: "Umum", trayek: "001 - 017", tarif: 6000 },
        { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "001 - 017", tarif: 4000 },
        { jenisPenumpang: "Umum", trayek: "Paal 2 - Perum/Politeknik Lapangan", tarif: 6500 },
        { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "Paal 2 - Perum/Politeknik Lapangan", tarif: 5000 },
        { jenisPenumpang: "Umum", trayek: "Tuminting - Pandu", tarif: 6500 },
        { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "Tuminting - Pandu", tarif: 5000 },
        { jenisPenumpang: "Umum", trayek: "Tuminting - Tongkaina", tarif: 6500 },
      ],
    };
  },
  computed: {
    filteredTariffs() {
      return this.tarifData.filter(tariff => {
        return (
          tariff.jenisPenumpang.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          tariff.trayek.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedTariffs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredTariffs.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredTariffs.length / this.itemsPerPage);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    showAddTariffPopup() {
      this.isAddTariffPopupOpen = true;
    },
    closeAddTariffPopup() {
      this.isAddTariffPopupOpen = false;
    },
    addTariff() {
      this.tarifData.push({ ...this.newTariff });
      this.newTariff = {
        jenisPenumpang: "",
        trayek: "",
        tarif: null,
      };
      this.closeAddTariffPopup();
      Swal.fire({
        title: 'Berhasil Ditambah!',
        text: 'Tarif baru telah berhasil ditambahkan.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
  }
};
</script>

<style scoped>
/* General Container Styling */
.data-container {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content {
  margin-top: 20px;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.back-button {
  text-decoration: none;
  color: #004085;
  font-weight: bold;
  font-size: 16px;
}

.back-button:hover {
  text-decoration: underline;
}

.search-container {
  position: relative;
  top: 0; /* Jarak dari atas */
  right: 0; /* Jarak dari kanan */
  margin-right: 50px;
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
  width: 100%;
  padding: 10px 10px 10px 40px; /* Padding untuk memberi ruang pada ikon */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-bar:focus {
  border-color: #315882;
  outline: none;
}

.search-bar::placeholder {
  color: #aaa;
}

/* Table Styling */
.table-container {
  overflow-x: auto;
  margin-top: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.data-table th {
  background-color: #315882;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

/* Button Styling */
.delete-button {
  background-color: #ef4444; /* Merah */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #b91c1c; /* Merah lebih gelap */
}

/* Add Tariff Button Styling */
.add-tariff-container {
  text-align: right;
  margin-top: 20px;
}

.add-tariff-button {
  background-color: #315882;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.add-tariff-button:hover {
  background-color: #3b82bf; /* Biru lebih gelap */
}

/* Modal for Adding Tariff */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
 to {
    opacity: 1;
  }
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.submit-button {
  background-color: #4CAF50; /* Hijau */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049; /* Hijau lebih gelap */
}

.cancel-button {
  background-color: #f44336; /* Merah */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #e53935; /* Merah lebih gelap */
}

/* Pagination Controls */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #315882;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #3b82bf; /* Biru lebih gelap */
}
</style>