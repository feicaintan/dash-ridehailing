<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/data" class="back-button">
        <span class="back-icon">←</span> Kembali
      </router-link>
      <h1 class="title">Daftar Data Driver</h1>
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="search-bar"
          placeholder="Cari Driver..."
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ drivers.length }}</div>
          <div class="stat-label">Total Driver</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔍</div>
        <div class="stat-content">
          <div class="stat-value">{{ filteredDrivers.length }}</div>
          <div class="stat-label">Hasil Pencarian</div>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable-header">
              <div class="th-content">
                <span>Nama Pengemudi</span>
                <span class="sort-icon" v-if="sortField === 'name'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('phone')" class="sortable-header">
              <div class="th-content">
                <span>Nomor Telepon</span>
                <span class="sort-icon" v-if="sortField === 'phone'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('email')" class="sortable-header">
              <div class="th-content">
                <span>Email</span>
                <span class="sort-icon" v-if="sortField === 'email'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('vehicleNumber')" class="sortable-header">
              <div class="th-content">
                <span>Nomor Kendaraan</span>
                <span class="sort-icon" v-if="sortField === 'vehicleNumber'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('simNumber')" class="sortable-header">
              <div class="th-content">
                <span>Nomor SIM</span>
                <span class="sort-icon" v-if="sortField === 'simNumber'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('status')" class="sortable-header">
              <div class="th-content">
                <span>Status</span>
                <span class="sort-icon" v-if="sortField === 'status'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="action-header">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in sortedFilteredDrivers" :key="driver.id" :class="{ 'odd-row': index % 2 !== 0 }">
            <td>
              <div class="user-info">
                <div class="user-avatar">{{ getUserInitials(driver.name) }}</div>
                <span>{{ driver.name }}</span>
              </div>
            </td>
            <td>{{ driver.phone }}</td>
            <td>{{ driver.email }}</td>
            <td>{{ driver.vehicleNumber }}</td>
            <td>{{ driver.simNumber }}</td>
            <td>
              <span :class="['status-badge', driver.status === 'online' ? 'status-online' : 'status-offline']">
                {{ driver.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="block-button" @click="showBlockPopup(driver)">
                  <span class="button-icon">🔒</span>
                  Blokir
                </button>
                <button class="delete-button" @click="showDeletePopup(driver)">
                  <span class="button-icon">🗑️</span>
                  Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredDrivers.length === 0">
            <td colspan="7" class="no-data">
              <div class="no-data-message">
                <div class="no-data-icon">🔍</div>
                <div>Data tidak ditemukan.</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-button">
        &lt; Sebelumnya
      </button>
      <span class="page-info">
        Halaman {{ currentPage }} dari {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-button">
        Selanjutnya &gt;
      </button>
    </div>

    <!-- Popup konfirmasi hapus -->
    <div v-if="deletePopup.show" class="popup-overlay">
      <div class="popup">
        <div class="popup-header">
          <h2>Konfirmasi Hapus</h2>
        </div>
        <div class="popup-content">
          <div class="warning-icon">⚠️</div>
          <p>Apakah Anda yakin ingin menghapus <strong>{{ deletePopup.driver?.name }}</strong>?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div class="popup-buttons">
          <button class="cancel-button" @click="deletePopup.show = false">Batal</button>
          <button class="confirm-button" @click="deleteDriver(deletePopup.driver)">Ya, Hapus</button>
        </div>
      </div>
    </div>

    <!-- Popup konfirmasi blokir -->
    <div v-if="blockPopup.show" class="popup-overlay">
      <div class="popup">
        <div class="popup-header">
          <h2>Konfirmasi Blokir</h2>
        </div>
        <div class="popup-content">
          <div class="warning-icon">🔒</div>
          <p>Apakah Anda yakin ingin memblokir <strong>{{ blockPopup.driver?.name }}</strong>?</p>
          <p class="warning-text">Driver yang diblokir tidak dapat mengakses aplikasi.</p>
        </div>
        <div class="popup-buttons">
          <button class="cancel-button" @click="blockPopup.show = false">Batal</button>
          <button class="confirm-button" @click="blockDriver(blockPopup.driver)">Ya, Blokir</button>
        </div>
      </div>
    </div>

    <!-- Notifikasi sukses -->
    <transition name="notification-fade">
      <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="notification-content">
          <div class="notification-title">
            {{ notification.type === 'success' ? 'Berhasil' : notification.type === 'error' ? 'Gagal' : 'Informasi' }}
          </div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" @click="hideNotification">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { useDriverStore } from '@/stores/driverStore';

export default {
    name: "DaftarDriver",

  data() {
    return {
      searchQuery: "",
      deletePopup: { show: false, driver: null },
      blockPopup: { show: false, driver: null },
      notification: {
        show: false,
        message: "",
        type: "success", // success, error, info
        timeout: null
      },
      drivers: [],
      apiUrl: "http://188.166.179.146:8000/api/dashboard/drivers",
      sortField: "name",
      sortDirection: "asc",
      currentPage: 1,
      itemsPerPage: 5,
      refreshKey: 0, // Kunci untuk memaksa komponen re-render
    };
  },
  computed: {
    filteredDrivers() {
      return this.drivers.filter(driver =>
        driver.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        driver.phone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        driver.vehicleNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        driver.simNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    sortedFilteredDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      
      return this.sortDrivers(this.filteredDrivers).slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDrivers.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchDrivers() {
      try {
        const token = localStorage.getItem("access_token")?.trim();
        if (!token) throw new Error("Token tidak ditemukan di localStorage");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log("Header fetchDrivers:", headers);

        const response = await fetch(this.apiUrl, {
          method: "GET",
          headers,
        });

        if (!response.ok) throw new Error("Gagal mengambil data driver");

        const data = await response.json();
        if (data && data.data && Array.isArray(data.data.drivers)) {
          this.drivers = data.data.drivers.map(driver => ({
            id: driver.id,
            name: driver.name,
            phone: driver.phone_number || "-",
            email: driver.email,
            vehicleNumber: driver.license_number || "-",
            simNumber: driver.sim || "-",
            status: driver.verified ? "online" : "offline",
          }));
          const driverStore = useDriverStore();
          driverStore.setActiveDrivers(this.drivers);
        } else {
          console.error("Invalid API response structure:", data);
          this.showNotification("Format respons API tidak valid", "error");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        this.showNotification("Gagal mengambil data driver", "error");
      }
    },

    showDeletePopup(driver) {
      this.deletePopup.driver = driver;
      this.deletePopup.show = true;
    },

    showBlockPopup(driver) {
      this.blockPopup.driver = driver;
      this.blockPopup.show = true;
    },

    async deleteDriver(driver) {
      try {
        const token = localStorage.getItem("access_token")?.trim();
        if (!token) throw new Error("Token tidak ditemukan di localStorage");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log("Header deleteDriver:", headers);
        console.log("Delete URL:", `${this.apiUrl}/${driver.id}`);
        console.log("Menghapus driver dengan ID:", driver.id);
        console.log("Jumlah driver sebelum delete:", this.drivers.length);

        const response = await fetch(`${this.apiUrl}/${driver.id}`, {
          method: "DELETE",
          headers,
        });

        const responseData = await response.json().catch(() => ({}));
        console.log("Status response:", response.status);
        console.log("Response data:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || `Gagal menghapus driver (${response.status})`);
        }

        // Hapus driver dari daftar data secara eksplisit
        const driverIdToRemove = driver.id;
        this.drivers = this.drivers.filter(d => d.id !== driverIdToRemove);
        console.log("Driver ID yang dihapus:", driverIdToRemove);
        console.log("Jumlah driver setelah delete:", this.drivers.length);
        
        // Update driver store 
        const driverStore = useDriverStore();
        driverStore.setActiveDrivers([...this.drivers]); // Pastikan membuat array baru
        
        // Update pagination jika diperlukan
        if (this.sortedFilteredDrivers.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
        
        // Paksa komponen untuk re-render
        this.refreshKey += 1;
        
        this.deletePopup.show = false;
        this.deletePopup.driver = null;
        this.showNotification(`Driver "${driver.name}" berhasil dihapus`, "success");
        
        // Terapkan perubahan secara langsung ke data komponen
        this.$forceUpdate();
      } catch (error) {
        console.error("Error deleting driver:", error);
        this.showNotification(`Terjadi kesalahan saat menghapus: ${error.message}`, "error");
      }
    },

    async blockDriver(driver) {
      try {
        const token = localStorage.getItem("access_token")?.trim();
        if (!token) throw new Error("Token tidak ditemukan di localStorage");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const blockUrl = `http://188.166.179.146:8000/api/dashboard/block/${driver.id}`;
        console.log("Block URL:", blockUrl);
        console.log("Memblokir driver dengan ID:", driver.id);
        console.log("Jumlah driver sebelum block:", this.drivers.length);

        const response = await fetch(blockUrl, {
          method: "POST", // atau "PUT" jika backend-nya pakai PUT
          headers,
        });

        const responseData = await response.json().catch(() => ({}));
        console.log("Status response:", response.status);
        console.log("Response data:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || `Gagal memblokir driver (${response.status})`);
        }

        // Hapus driver dari daftar data secara eksplisit dengan ID
        const driverIdToRemove = driver.id;
        this.drivers = this.drivers.filter(d => d.id !== driverIdToRemove);
        console.log("Driver ID yang dihapus:", driverIdToRemove);
        console.log("Jumlah driver setelah block:", this.drivers.length);
        
        // Update driver store
        const driverStore = useDriverStore();
        driverStore.setActiveDrivers([...this.drivers]); // Pastikan membuat array baru
        
        // Update pagination jika diperlukan
        if (this.sortedFilteredDrivers.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }

        // Paksa komponen untuk re-render
        this.refreshKey += 1;

        this.blockPopup.show = false;
        this.blockPopup.driver = null;
        this.showNotification(`Driver "${driver.name}" berhasil diblokir`, "success");
        
        // Terapkan perubahan secara langsung ke data komponen
        this.$forceUpdate();
      } catch (error) {
        console.error("Error blocking driver:", error);
        this.showNotification(`Terjadi kesalahan saat memblokir: ${error.message}`, "error");
      }
    },

    showNotification(message, type = "info") {
      // Clear any existing timeout
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }
      
      // Set notification data
      this.notification.show = true;
      this.notification.message = message;
      this.notification.type = type;
      
      // Auto-hide after 3 seconds
      this.notification.timeout = setTimeout(() => {
        this.hideNotification();
      }, 3000);
      
      console.log(`[${type}]`, message);
    },
    
    hideNotification() {
      this.notification.show = false;
    },

    getUserInitials(name) {
      if (!name) return "??";
      return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substr(0, 2)
        .toUpperCase();
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },

    sortDrivers(drivers) {
      return [...drivers].sort((a, b) => {
        let fieldA = a[this.sortField];
        let fieldB = b[this.sortField];

        if (this.sortDirection === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      });
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    this.fetchDrivers();
  },
};
</script>

<style scoped>
/* Reset CSS untuk menghilangkan margin dan padding default */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Container utama menggunakan lebar penuh */
.data-container {
  width: 100%;
  max-width: 100%;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

.back-button {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #315882;
  font-weight: 600;
  font-size: 16px;
  transition: color 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e1e5eb;
  background-color: white;
}

.back-button:hover {
  color: #1e3a5f;
  background-color: #f0f4f7;
}

.back-icon {
  margin-right: 6px;
  font-size: 18px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin: 0;
  flex-grow: 1;
}

.search-container {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 16px;
}

.search-bar {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.search-bar:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.stats-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  width: 100%;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 200px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 24px;
  padding: 12px;
  background-color: #ebf4ff;
  border-radius: 10px;
  color: #4299e1;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
}

.table-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th,
.data-table td {
  padding: 16px;
  text-align: left;
}

.data-table th {
  background-color: #315882;
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
  height: 60px;
  vertical-align: middle;
}

.data-table th:first-child {
  border-top-left-radius: 10px;
}

.data-table th:last-child {
  border-top-right-radius: 10px;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.sortable-header {
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
  padding: 0 16px;
}

.sortable-header:hover {
  background-color: #254569;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  width: 18px;
  height: 18px;
}

.action-header {
  text-align: center;
  width: 180px;
}

.odd-row {
  background-color: #f8fafc;
}

.data-table tr:hover {
  background-color: #edf2f7;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: #315882;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-online {
  background-color: #e6fffa;
  color: #38b2ac;
}

.status-offline {
  background-color: #edf2f7;
  color: #718096;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.delete-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  background-color: #fff5f5;
  color: #e53e3e;
}

.delete-button:hover {
  background-color: #fed7d7;
  transform: translateY(-2px);
}

.block-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  background-color: #fffaf0;
  color: #dd6b20;
}

.block-button:hover {
  background-color: #feebc8;
  transform: translateY(-2px);
}

.button-icon {
  font-size: 16px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #718096;
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-data-icon {
  font-size: 32px;
  opacity: 0.6;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: 100%;
}

.page-button {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #edf2f7;
  color: #2d3748;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #718096;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.popup {
  background-color: white;
  border-radius: 12px;
  width: 450px;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
}

.popup-header {
  background-color: #f7fafc;
  padding: 20px;
  border-bottom: 1px solid #edf2f7;
}

.popup-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2d3748;
  text-align: center;
}

.popup-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.warning-icon {
  font-size: 48px;
  color: #ed8936;
}

.warning-text {
  color: #e53e3e;
  font-size: 14px;
  text-align: center;
}

.popup-buttons {
  display: flex;
  padding: 16px 24px;
  border-top: 1px solid #edf2f7;
  gap: 12px;
}

.confirm-button,
.cancel-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-button {
  background-color: #e53e3e;
  color: white;
}

.confirm-button:hover {
  background-color: #c53030;
}

.cancel-button {
  background-color: #edf2f7;
  color: #4a5568;
}

.cancel-button:hover {
  background-color: #e2e8f0;
}

/* Notifikasi sistem */
.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 380px;
  max-width: calc(100% - 48px);
  z-index: 1050;
  background-color: white;
  animation: slideInRight 0.3s ease-out;
}

.notification-success {
  border-left: 4px solid #38a169;
}

.notification-error {
  border-left: 4px solid #e53e3e;
}

.notification-info {
  border-left: 4px solid #3182ce;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
}

.notification-success .notification-icon {
  background-color: #f0fff4;
  color: #38a169;
}

.notification-error .notification-icon {
  background-color: #fff5f5;
  color: #e53e3e;
}

.notification-info .notification-icon {
  background-color: #ebf8ff;
  color: #3182ce;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2d3748;
}

.notification-message {
  color: #4a5568;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #a0aec0;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.notification-close:hover {
  color: #4a5568;
  background-color: #f7fafc;
}

/* Animasi untuk notifikasi */
.notification-fade-enter-active, 
.notification-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.notification-fade-enter-from, 
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .stat-card {
    min-width: 100%;
  }
  
  .notification {
    bottom: 16px;
    right: 16px;
    width: calc(100% - 32px);
    max-width: none;
  }
}
</style>