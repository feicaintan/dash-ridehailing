<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/management" class="back-button">← Kembali</router-link>
      <div class="total-count">Total: {{ filteredDrivers.length }} Pengemudi Baru</div>
      <h1 class="title">Daftar Pengemudi Baru</h1>
    </div>

    <div class="search-container">
      <div class="search-wrapper">
        <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama pengemudi..."
          class="search-bar"
        />
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Memuat data pengemudi...</p>
    </div>

    <div v-else-if="filteredDrivers.length === 0" class="empty-state">
      <p>Tidak ada driver baru yang ditemukan</p>
    </div>

    <div v-else class="grid-container">
      <transition-group name="fade" tag="div" class="driver-grid">
        <div
          v-for="driver in paginatedDrivers"
          :key="driver.id"
          class="driver-card"
        >
          <div class="driver-header">
            <div class="driver-avatar-container">
              <img
                :src="driver.profile_picture || '@/assets/default-avatar.png'"
                alt="Foto Profil"
                class="driver-photo"
                @error="handleImageError"
              />
            </div>
            <div class="driver-name-container">
              <h3 class="driver-name">{{ driver.name }}</h3>
              <span class="driver-status">Menunggu Verifikasi</span>
            </div>
          </div>
          
          <div class="driver-details">
            <div class="detail-item">
              <i class="icon email-icon"></i>
              <p>{{ driver.email }}</p>
            </div>
            <div class="detail-item">
              <i class="icon phone-icon"></i>
              <p>{{ formatPhoneNumber(driver.phone_number) || '-' }}</p>
            </div>
            <div class="detail-item">
              <i class="icon id-icon"></i>
              <p>SIM: {{ driver.sim || '-' }}</p>
            </div>
            <div class="detail-item">
              <i class="icon license-icon"></i>
              <p>Plat: {{ driver.license_number || '-' }}</p>
            </div>
          </div>
        
        </div>
      </transition-group>
    </div>
    
    <div class="pagination" v-if="totalPages > 1">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="page-button"
      >
        &laquo;
      </button>
      
      <button
        v-for="page in displayedPageNumbers"
        :key="page"
        @click="changePage(page)"
        :class="['page-number', { active: currentPage === page }]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="page-button"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useDriverStore } from '@/stores/driverStore'; 

export default {
  name: "DaftarPengemudi",
  data() {
    return {
      searchQuery: "",
      drivers: [],
      isLoading: true,
      currentPage: 1,
      itemsPerPage: 4,
      defaultAvatar: '@/assets/default-avatar.png'
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
    totalPages() {
      return Math.ceil(this.filteredDrivers.length / this.itemsPerPage);
    },
    paginatedDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDrivers.slice(start, end);
    },
    displayedPageNumbers() {
      const displayCount = 5;
      const pages = [];
      let startPage = Math.max(1, this.currentPage - Math.floor(displayCount / 2));
      let endPage = Math.min(this.totalPages, startPage + displayCount - 1);
      
      if (endPage - startPage + 1 < displayCount) {
        startPage = Math.max(1, endPage - displayCount + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  methods: {
    async fetchDrivers() {
      this.isLoading = true;
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("https://mikronet.systems/api/dashboard/drivers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        this.drivers = data.data.drivers.filter(driver => driver.verified === false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Gagal memuat data pengemudi',
          icon: 'error',
          confirmButtonText: 'Coba Lagi',
        }).then(() => {
          this.fetchDrivers();
        });
      } finally {
        this.isLoading = false;
      }
    },

    async acceptDriver(driver) {
      const token = localStorage.getItem("access_token");
      const driverStore = useDriverStore(); // ambil store
      
      Swal.fire({
        title: 'Konfirmasi',
        text: `Apakah Anda yakin ingin menerima ${driver.name} sebagai pengemudi?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Terima',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`https://mikronet.systems/api/dashboard/drivers/verified/${driver.id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              Swal.fire({
                title: 'Driver Diterima!',
                text: `Driver ${driver.name} telah berhasil diterima.`,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#10b981',
              });

              this.drivers = this.drivers.filter(d => d.id !== driver.id);
              driver.verified = true; // tandai sudah diverifikasi
              driverStore.addDriver(driver); // masukkan ke daftar aktif
            } else {
              const errorData = await response.json();
              console.error("Gagal memverifikasi:", errorData);
              Swal.fire({
                title: 'Gagal!',
                text: 'Gagal memverifikasi driver. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          } catch (error) {
            console.error("Error:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Terjadi kesalahan saat memproses permintaan.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      });
    },

    previewKTP(driver) {
      if (driver.ktp && driver.ktp !== "") {
        Swal.fire({
          title: `KTP - ${driver.name}`,
          html: `
            <div class="ktp-preview-container">
              <img src="${driver.ktp}" class="zoom-image" alt="KTP ${driver.name}" />
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          width: 'auto',
          customClass: {
            container: 'ktp-modal-container',
            popup: 'ktp-modal-popup',
          }
        });
      } else {
        Swal.fire({
          title: 'KTP Tidak Ditemukan',
          text: `Driver ${driver.name} belum mengunggah KTP.`,
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
        });
      }
    },
    
    handleImageError(e) {
      e.target.src = this.defaultAvatar;
    },
    
    formatPhoneNumber(phone) {
      if (!phone) return '-';
      const cleaned = ('' + phone).replace(/\D/g, '');
      if (cleaned.startsWith('62')) {
        return `+62 ${cleaned.substring(2, 5)}-${cleaned.substring(5, 9)}-${cleaned.substring(9)}`;
      } else if (cleaned.startsWith('0')) {
        return `+62 ${cleaned.substring(1, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
      }
      return phone;
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  mounted() {
    this.fetchDrivers();
  },
};
</script>


<style scoped>
.total-count {
  position: absolute;
  right: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
  background-color: #ecfdf5;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #a7f3d0;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.data-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb, #e5ecf3);
  min-height: 100vh;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.title {
  display: inline-block;
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #2563eb, #10b981);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-shadow: 0 2px 10px rgba(37, 99, 235, 0.1);
  letter-spacing: -0.5px;
}

.back-button {
  text-decoration: none;
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 600;
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: rgba(219, 234, 254, 0.7);
}

.back-button:hover {
  color: #1d4ed8;
  background-color: rgba(219, 234, 254, 1);
  transform: translateX(-3px);
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.6;
  pointer-events: none;
}

.search-bar {
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background-color: white;
}

.search-bar:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6b7280;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.driver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.driver-card {
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.driver-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #3b82f6, #10b981);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.driver-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.driver-card:hover::before {
  opacity: 1;
}

.driver-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.driver-avatar-container {
  position: relative;
  margin-right: 1rem;
}

.driver-photo {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  transition: all 0.3s ease;
  background-color: #f1f5f9;
}

.driver-photo:hover {
  transform: scale(1.05);
  border-color: #3b82f6;
}

.driver-name-container {
  flex: 1;
}

.driver-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.3rem 0;
}

.driver-status {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #f59e0b;
  background-color: #fffbeb;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid #fef3c7;
}

.driver-details {
  flex: 1;
  margin-bottom: 1.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #64748b;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
  opacity: 0.7;
}

.email-icon::before {
  content: "📧";
}

.phone-icon::before {
  content: "📱";
}

.id-icon::before {
  content: "🪪";
}

.license-icon::before {
  content: "🚗";
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
}

.accept-button,
.preview-button {
  flex: 1;
  padding: 0.6rem 0;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.accept-button {
  background: linear-gradient(to right, #16a34a, #10b981);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.accept-button:hover {
  background: linear-gradient(to right, #15803d, #059669);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.preview-button {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.preview-button:hover {
  background-color: #eff6ff;
  transform: translateY(-2px);
}

.zoom-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.ktp-preview-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.page-button,
.page-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-button:hover,
.page-number:hover:not(.active) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-container {
    padding: 1.5rem 1rem;
  }
  
  .driver-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .back-button {
    left: 0.5rem;
    font-size: 0.9rem;
  }
  
  .search-wrapper {
    max-width: 100%;
  }
}

/* Custom Modal Styles */
:global(.ktp-modal-container) {
  z-index: 1060;
}

:global(.ktp-modal-popup) {
  border-radius: 1rem;
  padding: 1rem;
}
</style>