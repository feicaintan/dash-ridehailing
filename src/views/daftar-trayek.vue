<template>
  <div class="data-container">
    <router-link to="/TarifRute" class="back-button">← Kembali</router-link>

    <div class="content">
      <h1 class="title">Daftar Rute Trayek</h1>
      <div class="search-container">
        <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
        <input
          type="text"
          class="search-bar"
          placeholder="Cari Nomor Trayek/Jalur/Jalan..."
          v-model="searchQuery"
        />
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nomor Trayek</th>
              <th>Jalur</th>
              <th>Jalan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="route in paginatedRoutes" :key="route.routeNumber">
              <td>{{ route.routeNumber }}</td>
              <td>{{ route.routeLine }}</td>
              <td>{{ route.routeStreet }}</td>
              <td>
                <button class="edit-button" @click="editRoute(route)">Edit</button>
                <button class="delete-button" @click="deleteRoute(route)">Delete</button>
              </td>
            </tr>
            <tr v-if="paginatedRoutes.length === 0">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tombol Tambah Trayek -->
      <button class="add-route-button" @click="showAddRoutePopup">Tambah Trayek</button>

      <!-- Pagination Controls -->
      <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="prevPage" class="pagination-button">Back</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-button">Next</button>
      </div>
    </div>

    <!-- Popup Tambah Trayek -->
    <div v-if="isAddRoutePopupOpen" class="popup-overlay">
      <div class="popup">
        <h2>Tambah Trayek</h2>
        <form @submit.prevent="addRoute">
          <div class="form-group">
            <label>Nomor Trayek</label>
            <input type="text" v-model="newRoute.routeNumber" required />
          </div>
          <div class="form-group">
            <label>Jalur</label>
            <input type="text" v-model="newRoute.routeLine" required />
          </div>
          <div class="form-group">
            <label>Jalan</label>
            <input type="text" v-model="newRoute.routeStreet" required />
          </div>
          <div class="popup-buttons">
            <button class="submit-button" type="submit">Simpan</button>
            <button class="cancel-button" @click="closeAddRoutePopup">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "DaftarTrayek",
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      routes: [
        { routeNumber: "001", routeLine: "Terminal Malalayang - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "002", routeLine: "Terminal Malalayang - Terminal Karombasan", routeStreet: "Jalan Merdeka" },
        { routeNumber: "003", routeLine: "Terminal Karombasan - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "004", routeLine: "Terminal Karombasan - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "005", routeLine: "Winangun - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "006", routeLine: "Terminal Karombasan - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "007", routeLine: "Terminal Karombasan - Terminal Paal 2", routeStreet: "Jalan Merdeka" },
        { routeNumber: "008", routeLine: "Terminal Paal 2 - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "009", routeLine: "Kairagi - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "010", routeLine: "Perkamil - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "011", routeLine: "Banjer, Paal 4, Taas - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "012", routeLine: "Wonasa - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "013", routeLine: "Tuminting - Pusat Kota", routeStreet: "Jalan Merdeka" },
        { routeNumber: "014", routeLine: "Terminal Paal 2 - Lapangan", routeStreet: "Jalan Merdeka" },
        { routeNumber: "015", routeLine: "Terminal Paal 2 - Politeknik", routeStreet: "Jalan Merdeka" },
        { routeNumber: "016", routeLine: "Tuminting - Pandu", routeStreet: "Jalan Merdeka" },
        { routeNumber: "017", routeLine: "Tuminting - Tongkaina", routeStreet: "Jalan Merdeka" },
      ],
      newRoute: {
        routeNumber: "",
        routeLine: "",
        routeStreet: "",
      },
      isAddRoutePopupOpen: false,
    };
  },
  computed: {
    filteredRoutes() {
      return this.routes.filter(route => {
        return (
          route.routeNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          route.routeLine.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          route.routeStreet.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedRoutes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredRoutes.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredRoutes.length / this.itemsPerPage);
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
    showAddRoutePopup() {
      this.isAddRoutePopupOpen = true;
    },
    closeAddRoutePopup() {
      this.isAddRoutePopupOpen = false;
    },
    addRoute() {
      this.routes.push({ ...this.newRoute });
      this.newRoute = {
        routeNumber: "",
        routeLine: "",
        routeStreet: "",
      };
      this.closeAddRoutePopup();
      Swal.fire({
        title: 'Trayek Berhasil Ditambah!',
        text: 'Trayek baru telah berhasil ditambahkan.',
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
  margin-bottom : 20px;
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
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

.search-bar {
  width: 100%;
  padding: 10px 10px 10px 40px;
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

.edit-button,
.delete-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.delete-button {
  background-color: #dc3545;
}

.edit-button:hover,
.delete-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Add Button Styling */
.add-route-container {
  text-align: right; /* Memastikan teks di dalam container rata kanan */
}

.add-route-button {
  background-color: #315882;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-left: auto; 
  display: block; 
}

.add-route-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Popup Styling */
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

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.submit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover,
.cancel-button:hover {
  opacity: 0.9;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
 margin-top: 20px;
}

.pagination-button {
  background-color: #315882;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>