<template>
  <div class="blocked-drivers-container">
    <!-- Tombol Kembali -->
    <div class="back-button">
      <button @click="goBack" class="btn-back">&laquo; Kembali</button>
    </div>

    <h1>DAFTAR DRIVER YANG TERBLOKIR</h1>

    <!-- Pencarian dan Jumlah -->
    <div class="controls">
      <input v-model="search" type="text" placeholder="Cari driver..." class="search-input" />
      <span class="total-count">Total: {{ filteredBlockedDrivers.length }} driver</span>
    </div>

    <!-- Tabel Driver Terblokir -->
    <div class="table-wrapper">
      <table class="blocked-drivers-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nama</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in paginatedBlockedDrivers" :key="index">
            <td>
              <img :src="driver.profilePicture || 'https://via.placeholder.com/50'" alt="Profile" class="profile-img"/>
            </td>
            <td>{{ driver.name }}</td>
            <td>{{ driver.email }}</td>
          </tr>
          <tr v-if="!paginatedBlockedDrivers.length">
            <td colspan="4" class="no-data">Tidak ada data ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Navigasi Halaman -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn-pagination">&laquo; Prev</button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Next &raquo;</button>
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
      blockedDrivers: [],
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
    async fetchBlockedDrivers() {
      try {
        const token = localStorage.getItem("access_token") || "";
        if (!token.trim()) {
          console.error("Token tidak ditemukan!");
          return;
        }

        const response = await fetch("http://188.166.179.146:8000/api/dashboard/block", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.status === "Success" && result.data.block_accounts) {
          this.blockedDrivers = result.data.block_accounts.map(driver => ({
            id: driver.id,
            name: driver.name,
            email: driver.email,
            profilePicture: driver.profile_picture || ""
          }));
        } else {
          console.error("Gagal mengambil data:", result);
        }
      } catch (error) {
        console.error("Error fetching blocked drivers:", error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    confirmUnblock(driver) {
      Swal.fire({
        title: 'Yakin buka blokir?',
        text: `Driver ${driver.name} akan dibuka blokirnya.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, buka!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.unblockDriver(driver);
          Swal.fire('Berhasil!', `Driver ${driver.name} telah dibuka blokir.`, 'success');
        }
      });
    },
    async unblockDriver(driver) {
  try {
    const token = localStorage.getItem("access_token") || "";
    if (!token.trim()) {
      console.error("Token tidak ditemukan!");
      return;
    }

    const response = await fetch(`http://188.166.179.146:8000/api/dashboard/block/${driver.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (response.ok && result.status === "Success") {
      // Hapus dari daftar
      this.blockedDrivers = this.blockedDrivers.filter(d => d.id !== driver.id);
    } else {
      console.error("Gagal buka blokir:", result);
      Swal.fire('Gagal!', 'Tidak bisa membuka blokir driver.', 'error');
    }
  } catch (error) {
    console.error("Error unblock driver:", error);
    Swal.fire('Gagal!', 'Terjadi kesalahan saat membuka blokir.', 'error');
  }
    },
    goBack() {
      this.$router.push('/management');
    },
  },
  mounted() {
    this.fetchBlockedDrivers();
  },
};
</script>

<style scoped>
:global(body), :global(html) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.blocked-drivers-container {
  width: 100%;
  padding: 30px 0;
  background-color: #f4f6f8;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.back-button {
  margin: 0 20px 20px;
}

.btn-back {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-back:hover {
  background-color: #0056b3;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20px 20px;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.total-count {
  align-self: center;
  font-weight: 500;
  margin-left: 20px;
}

.table-wrapper {
  overflow-x: auto;
  margin: 0 20px;
}

.blocked-drivers-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.blocked-drivers-table th, .blocked-drivers-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.blocked-drivers-table th {
  background-color: #007bff;
  color: white;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-unblock {
  padding: 8px 14px;
  background-color: #dc3545;
  border: none;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-unblock:hover {
  background-color: #c82333;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 15px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.btn-pagination {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-pagination:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
