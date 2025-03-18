<template>
    <div class="data-container">
      <div class="header">
        <router-link to="/management" class="back-button">← Kembali</router-link>
        <h1 class="title">Daftar Data Pengguna</h1>
        <div class="search-container">
          <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
          <input
            type="text"
            class="search-bar"
            placeholder="Cari Pengguna..."
            v-model="searchQuery"
          />
        </div>
      </div>
  
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Email</th>
              <th>Nomor Telepon</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.email">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
  
    </div>
  </template>
  
  <script>
  export default {
    name: "DaftarPengguna",
    data() {
      return {
        searchQuery: "",
        users: [
          {
            name: "John Doe",
            phone: "081234567890",
            email: "john@example.com",
          },
          {
            name: "Jane Smith",
            phone: "082345678901",
            email: "jane@example.com",
          },
        ],
      };
    },
    computed: {
      filteredUsers() {
        if (this.searchQuery) {
          return this.users.filter((user) =>
            user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        return this.users;
      },
    },
    methods: {
    },
  };
  </script>
  
    
    <style scoped>
    .data-container {
      padding: 20px;
      background-color: #f0f4f7;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .back-button {
      text-decoration: none;
      color: #004085;
      font-weight: bold;
      font-size: 16px;
    }
    
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      flex-grow: 1;
      text-align: center; 
    }
    
    .search-container {
      position: relative; 
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
      padding: 10px 10px 10px 40px; 
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 200px; 
    }
    
    .table-container {
      overflow-x: auto; 
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .data-table th,
    .data-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .data-table th {
      background-color: #315882; 
      color: white;
      font-weight: bold;
    }
    
    .data-table tr:hover {
      background-color: #e9ecef; 
    }
    </style>
    