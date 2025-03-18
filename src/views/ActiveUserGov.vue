<template>
    <div class="active-users-container">
      <div class="header">
        <button @click="goBack" class="btn-back">&laquo; Kembali</button>
        <h2>Daftar Pengguna yang Aktif</h2>
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
  
      <!-- Active Users Table -->
      <table class="active-users-table">
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedActiveUsers" :key="index">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.status }}</td>
          </tr>
          <tr v-if="!paginatedActiveUsers.length">
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
        activeUsers: [
          { name: "John Doe", email: "john@example.com", status: "Aktif" },
          { name: "Jane Smith", email: "jane@example.com", status: "Aktif" },
          { name: "Alice Johnson", email: "alice@example.com", status: "Aktif" },
          { name: "Bob Brown", email: "bob@example.com", status: "Aktif" },
          { name: "Charlie Davis", email: "charlie@example.com", status: "Aktif" },
          { name: "David Wilson", email: "david@example.com", status: "Aktif" },
          { name: "Eva Green", email: "eva@example.com", status: "Aktif" },
          { name: "Frank White", email: "frank@example.com", status: "Aktif" },
          { name: "Grace Lee", email: "grace@example.com", status: "Aktif" },
          { name: "Hannah Scott", email: "hannah@example.com", status: "Aktif" },
          { name: "Ian Black", email: "ian@example.com", status: "Aktif" },
          { name: "Jack Blue", email: "jack@example.com", status: "Aktif" },
        ],
      };
    },
    computed: {
      filteredActiveUsers() {
        return this.activeUsers.filter(user =>
          user.name.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      totalPages() {
        return Math.ceil(this.filteredActiveUsers.length / this.itemsPerPage);
      },
      paginatedActiveUsers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredActiveUsers.slice(start, start + this.itemsPerPage);
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
        this.$router.push('/LogActivityGov'); 
      },
    },
  };
  </script>
  
  <style scoped>
  .active-users-container {
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
  
  .active-users-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .active-users-table th, .active-users-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  .active-users-table th {
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