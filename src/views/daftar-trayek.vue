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

      <div v-if="loading" class="loading">Loading data...</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nomor Trayek</th>
              <th>Jalur</th>
              <th>Tarif</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(route, index) in paginatedRoutes" :key="route.ID || index">
              <td>{{ route.ID }}</td>
              <td>{{ route.RouteName }}</td>
              <td>{{ route.Amount }}</td>
              <td>
                <button class="delete-button" @click="deleteRoute(route)">Hapus</button>
              </td>
            </tr>
            <tr v-if="paginatedRoutes.length === 0">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button class="add-route-button" @click="showAddRoutePopup">Tambah Trayek</button>

      <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="prevPage" class="pagination-button">Back</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-button">Next</button>
      </div>
    </div>

    <div v-if="isAddRoutePopupOpen" class="popup-overlay">
      <div class="popup">
        <h2>Tambah Trayek</h2>
        <form @submit.prevent="addRoute">
          <div class="form-group">
            <label>Jalur</label>
            <input type="text" v-model="newRoute.RouteName" required />
          </div>
          <div class="form-group">
            <label>Tarif</label>
            <input type="number" v-model="newRoute.Amount" required />
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
      routes: [],
      loading: true,
      newRoute: {
        RouteName: "",
        Amount: 0
      },
      isAddRoutePopupOpen: false
    };
  },
  computed: {
    filteredRoutes() {
      if (!this.routes) return [];
      return this.routes.filter(route => {
        if (!route) return false;
        const searchLower = this.searchQuery.toLowerCase();
        const idString = route.ID ? route.ID.toString() : "";
        return (
          idString.includes(searchLower) ||
          (route.RouteName && route.RouteName.toLowerCase().includes(searchLower)) ||
          (route.Amount && route.Amount.toString().toLowerCase().includes(searchLower))
        );
      });
    },
    paginatedRoutes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRoutes.slice(start, end);
    },
    totalPages() {
      return this.filteredRoutes.length > 0
        ? Math.ceil(this.filteredRoutes.length / this.itemsPerPage)
        : 1;
    }
  },
  created() {
    this.fetchRoutes();
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    getAccessToken() {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          Swal.fire({
            title: 'Error!',
            text: 'Access token tidak ditemukan. Silakan login kembali.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push('/login');
          });
          return null;
        }
        return accessToken;
      } catch (error) {
        console.error('Error getting access token:', error);
        return null;
      }
    },

    fetchRoutes() {
      this.loading = true;
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        this.loading = false;
        return Promise.resolve();
      }

      return fetch(`https://mikronet.systems/api/dashboard/routeS?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem('access_token');
              this.$router.push('/login');
              throw new Error('Sesi anda telah berakhir. Silakan login kembali.');
            }
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          this.routes = Array.isArray(data.data) ? data.data : [];
        })
        .catch(error => {
          console.error('Error fetching routes:', error);
          this.routes = [];
          Swal.fire({
            title: 'Error!',
            text: 'Gagal mengambil data trayek. Silakan coba lagi nanti.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    showAddRoutePopup() {
      this.isAddRoutePopupOpen = true;
    },

    closeAddRoutePopup() {
      this.isAddRoutePopupOpen = false;
      this.newRoute = {
        RouteName: "",
        Amount: 0
      };
    },

    addRoute() {
      const accessToken = this.getAccessToken();
      if (!accessToken) return;

      fetch('https://mikronet.systems/api/dashboard/route', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newRoute)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.status === "Success") {
            Swal.fire({
              title: 'Trayek Berhasil Ditambah!',
              text: 'Trayek baru telah berhasil ditambahkan.',
              icon: 'success',
              confirmButtonText: 'OK'
            });

            this.fetchRoutes().then(() => {
              this.currentPage = 1;
              this.closeAddRoutePopup();
            });
          } else {
            throw new Error('Failed to add route: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error adding route:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menambahkan trayek. Silakan coba lagi nanti.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    },

    deleteRoute(route) {
      if (!route || !route.ID) return;

      Swal.fire({
        title: 'Hapus Trayek?',
        text: `Apakah Anda yakin ingin menghapus trayek "${route.RouteName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = this.getAccessToken();
          if (!accessToken) return;

          fetch(`https://mikronet.systems/api/dashboard/route/${route.ID}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              if (data.status === "Success" || data.status === 200 || data.success) {
                Swal.fire({
                  title: 'Berhasil!',
                  text: 'Trayek berhasil dihapus.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                this.fetchRoutes();
              } else {
                throw new Error('Gagal menghapus trayek');
              }
            })
            .catch(error => {
              console.error('Error deleting route:', error);
              this.fetchRoutes();
              Swal.fire({
                title: 'Error!',
                text: 'Gagal menghapus trayek. Silakan coba lagi nanti.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
        }
      });
    }
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