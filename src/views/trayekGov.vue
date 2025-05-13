
<template>
  <div class="data-container">
    <router-link to="/tarifruteGov" class="back-button">← Kembali</router-link>

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
            </tr>
          </thead>
          <tbody>
            <tr v-for="route in paginatedRoutes" :key="route.ID">
              <td>{{ route.ID }}</td>
              <td>{{ route.RouteName }}</td>
              <td>{{ route.Amount }}</td>
            </tr>
            <tr v-if="paginatedRoutes.length === 0">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="prevPage" class="pagination-button">Back</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-button">Next</button>
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
      isAddRoutePopupOpen: false,
      editingRoute: null,
    };
  },
  computed: {
    filteredRoutes() {
      if (!this.routes) return [];
      
      return this.routes.filter(route => {
        if (!route) return false;
        
        const searchLower = this.searchQuery ? this.searchQuery.toLowerCase() : "";
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
      return this.filteredRoutes ? this.filteredRoutes.slice(start, end) : [];
    },
    totalPages() {
      return this.filteredRoutes && this.filteredRoutes.length > 0 
        ? Math.ceil(this.filteredRoutes.length / this.itemsPerPage) 
        : 1;
    }
  },
  created() {
    // Using created instead of mounted to ensure data is requested earlier
    this.fetchRoutes();
  },
  methods: {
    getAccessToken() {
      try {
        // Consistently use the same key for access token
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          Swal.fire({
            title: 'Error!',
            text: 'Access token not found. Please login again.',
            icon: 'error',
            confirmButtonText: 'OK'
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
      
      try {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
          this.loading = false;
          return;
        }
        
        // Fetch data from API
        fetch('http://188.166.179.146:8000/api/dashboard/routeS', {
          method: 'GET',
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
          if (data.status === "Success") {
            // Store the routes from the response data
            this.routes = Array.isArray(data.data) ? data.data : [];
          } else {
            throw new Error('Failed to fetch routes: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error fetching routes:', error);
          this.routes = []; // Ensure routes is always an array
          Swal.fire({
            title: 'Error!',
            text: 'Failed to fetch routes. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })
        .finally(() => {
          this.loading = false;
        });
      } catch (error) {
        console.error('Exception in fetchRoutes:', error);
        this.loading = false;
        this.routes = []; // Ensure routes is always an array
      }
    },
    
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
      // Reset form
      this.newRoute = {
        RouteName: "",
        Amount: 0
      };
    },
    
    addRoute() {
      try {
        const accessToken = this.getAccessToken();
        if (!accessToken) return;
        
        // Add new route via API
        fetch('http://188.166.179.146:8000/api/dashboard/route', {
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
            
            // Fetch updated routes after adding
            this.fetchRoutes();
            
            // Reset form and close popup
            this.newRoute = {
              RouteName: "",
              Amount: 0
            };
            this.closeAddRoutePopup();
          } else {
            throw new Error('Failed to add route: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error adding route:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add route. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      } catch (error) {
        console.error('Exception in addRoute:', error);
      }
    },
    
    editRoute(route) {
      if (!route || !route.RouteName) {
        console.error('Invalid route to edit:', route);
        return;
      }
      
      // Store the route to edit
      this.editingRoute = { ...route };
      
      try {
        Swal.fire({
          title: 'Edit Trayek',
          html:
            `<div class="form-group">
              <label>Jalur</label>
              <input id="swal-route-name" class="swal2-input" value="${route.RouteName || ''}" placeholder="Jalur">
            </div>
            <div class="form-group">
              <label>Tarif</label>
              <input id="swal-route-amount" class="swal2-input" type="number" value="${route.Amount || 0}" placeholder="Tarif">
            </div>`,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Simpan',
          cancelButtonText: 'Batal',
          preConfirm: () => {
            try {
              return {
                RouteName: document.getElementById('swal-route-name').value,
                Amount: document.getElementById('swal-route-amount').value
              };
            } catch (error) {
              console.error('Error in SweetAlert preConfirm:', error);
              return {
                RouteName: route.RouteName || '',
                Amount: route.Amount || 0
              };
            }
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const updatedRoute = {
              ID: route.ID,
              RouteName: result.value.RouteName,
              Amount: Number(result.value.Amount)
            };
            
            this.updateRoute(updatedRoute);
          }
        });
      } catch (error) {
        console.error('Exception in editRoute:', error);
      }
    },
    
    updateRoute(route) {
      if (!route || !route.ID) {
        console.error('Invalid route to update:', route);
        return;
      }
      
      try {
        const accessToken = this.getAccessToken();
        if (!accessToken) return;
        
        // Update route via API
        fetch(`http://188.166.179.146:8000/api/dashboard/route/update/${route.ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            RouteName: route.RouteName,
            Amount: route.Amount
          })
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
              title: 'Berhasil!',
              text: 'Trayek berhasil diperbarui.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            // Fetch updated routes after updating
            this.fetchRoutes();
          } else {
            throw new Error('Failed to update route: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error updating route:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update route. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      } catch (error) {
        console.error('Exception in updateRoute:', error);
      }
    },
    
    deleteRoute(route) {
      if (!route || !route.ID) {
        console.error('Invalid route to delete:', route);
        return;
      }
      
      try {
        Swal.fire({
          title: 'Hapus Trayek?',
          text: `Apakah Anda yakin ingin menghapus trayek "${route.RouteName || ''}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Hapus',
          cancelButtonText: 'Batal'
        }).then((result) => {
          if (result.isConfirmed) {
            const accessToken = this.getAccessToken();
            if (!accessToken) return;
            
            // Delete route via API
            fetch(`http://188.166.179.146:8000/api/dashboard/route/delete/${route.ID}`, {
              method: 'POST',
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
              if (data.status === "Success") {
                Swal.fire({
                  title: 'Berhasil!',
                  text: 'Trayek berhasil dihapus.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                
                // Fetch updated routes after deletion
                this.fetchRoutes();
              } else {
                throw new Error('Failed to delete route: ' + (data.message || 'Unknown error'));
              }
            })
            .catch(error => {
              console.error('Error deleting route:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to delete route. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
          }
        });
      } catch (error) {
        console.error('Exception in deleteRoute:', error);
      }
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