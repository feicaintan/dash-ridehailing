<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/data" class="back-button">← Kembali</router-link>
      <h1 class="title">Daftar Data Pengguna</h1>
      <div class="search-container">
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <button class="edit-button" @click="editUser(user)">Edit</button>
              <button class="delete-button" @click="showDeletePopup(user)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4">Data tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="deletePopup.show" class="popup-overlay">
      <div class="popup">
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus <strong>{{ deletePopup.user?.name }}</strong>?</p>
        <div class="popup-buttons">
          <button class="confirm-button" @click="deleteUser(deletePopup.user)">Ya, Hapus</button>
          <button class="cancel-button" @click="deletePopup.show = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DaftarPengguna",
  data() {
    return {
      searchQuery: "",
      deletePopup: { show: false, user: null },
      users: [],
      apiUrl: "http://188.166.179.146:8000/api/dashboard/users",
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch(this.apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) throw new Error("Gagal mengambil data pengguna");
        const data = await response.json();
        this.users = data.data.users;
        console.log(this.users.data)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    showDeletePopup(user) {
      this.deletePopup.user = user;
      this.deletePopup.show = true;
    },
    async deleteUser(user) {
      try {
        const response = await fetch(`${this.apiUrl}/${user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) throw new Error("Gagal menghapus pengguna");
        this.users = this.users.filter(u => u.id !== user.id);
        this.deletePopup.show = false;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  },
  mounted() {
    this.fetchUsers();
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
  
  .add-driver-container {
    display: none; 
  }
  
  .submit-button {
    background-color: #28a745; 
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .cancel-buttonblock {
    background-color: #6C757D; 
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .edit-button {
    background-color: rgb(17, 142, 40);
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .popup-overlay {
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); 
  display: flex;
  justify-content: center; 
  align-items: center; 
  padding: 10px;
  z-index: 1000;
}

.popup {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 450px; 
  animation: fadeIn 0.3s ease; 
}

.popup h2 {
  font-size: 22px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px; 
}

.form-group label {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px; 
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px; 
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4e73df; 
  background-color: #fff; 
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button {
  background-color: #4e73df; 
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease; 
}

.submit-button:hover {
  background-color: #2e59d9; 
}

.cancel-button {
  background-color: #6C757D;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.popup-buttons button {
  width: 48%; 
}

.popup-overlay {
  background-color: rgba(0, 0, 0, 0.6); 
  padding: 10px; 
  border-radius: 8px;
  transition: opacity 0.3s ease;
}
.block-button {
  background-color: #ff9800;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

.block-button:hover {
  background-color: #e68900;
}
.confirm-button {
  background-color: #e03232;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

  </style>
  