<template>
    <div class="active-drivers-container">
      <div class="header">
        <button @click="goBack" class="btn-back">&laquo; Kembali</button>
        <h2>Daftar Pengemudi yang Aktif</h2>
      </div>
  
<!-- Search Bar -->
<div class="search-container">
  <input
    v-model="search"
    type="text"
    placeholder="Cari pengemudi..."
    class="search-input"
  />
  <img src="@/assets/search.png" alt="Search" class="search-icon" />
</div>
  
      <!-- Active Drivers Table -->
      <table class="active-drivers-table">
        <thead>
          <tr>
            <th>Nama Pengemudi</th>
            <th>Trayek</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in paginatedActiveDrivers" :key="index">
            <td>{{ driver.name }}</td>
            <td>{{ driver.route }}</td>
            <td>{{ driver.status }}</td>
          </tr>
          <tr v-if="!paginatedActiveDrivers.length">
            <td colspan="3" class="no-data">Tidak ada data yang ditemukan.</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn-pagination">&laquo; Prev</button>
        <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Next &raquo;</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        search: "",
        currentPage: 1,
        itemsPerPage: 10,
        activeDrivers: [
          { name: "Andi", route: "Trayek 001", status: "Aktif" },
          { name: "Budi", route: "Trayek 002", status: "Aktif" },
          { name: "Cahyo", route: "Trayek 003", status: "Aktif" },
          { name: "Dedi", route: "Trayek 004", status: "Aktif" },
          { name: "Eka", route: "Trayek 005", status: "Aktif" },
          { name: "Fajar", route: "Trayek 006", status: "Aktif" },
          { name: "Gina", route: "Trayek 007", status: "Aktif" },
          { name: "Hendra", route: "Trayek 008", status: "Aktif" },
          { name: "Ika", route: "Trayek 009", status: "Aktif" },
          { name: "Joko", route: "Trayek 010", status: "Aktif" },
          { name: "Kiki", route: "Trayek 011", status: "Aktif" },
          { name: "Lina", route: "Trayek 012", status: "Aktif" },
        ],
      };
    },
    computed: {
      filteredActiveDrivers() {
        return this.activeDrivers.filter(driver =>
          driver.name.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      totalPages() {
        return Math.ceil(this.filteredActiveDrivers.length / this.itemsPerPage);
      },
      paginatedActiveDrivers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredActiveDrivers.slice(start, start + this.itemsPerPage);
      },
    },
    methods: {
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      goBack() {
        this.$router.push('/LogActivity'); 
      },
    },
  };
  </script>
  
  <style scoped>
  .active-drivers-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
  
  .search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-left: 30px;
}

.search-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
  
  .active-drivers-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .active-drivers-table th, .active-drivers-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  .active-drivers-table th {
    background-color: #007bff;
    color: white;
  }
  
  .no-data {
    text-align: center;
    font-style: italic;
    color: #999;
    padding: 20px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  
  .btn-pagination {
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .btn-pagination:hover {
    background-color: #0056b3;
  }
  
  .btn-pagination:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  </style>