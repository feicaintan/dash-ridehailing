<template>
  <div class="data-container">
    <div class="header">
      <router-link to="/data" class="back-button">← Kembali</router-link>
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.email">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <button class="edit-button" @click="editUser(user)">Edit</button>
              <button class="delete-button" @click="showDeletePopup(user)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4">Data tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Konfirmasi Hapus -->
    <div v-if="deletePopup.show" class="popup-overlay">
      <div class="popup">
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus <strong>{{ deletePopup.user?.name }}</strong>?</p>
        <div class="popup-buttons">
          <button class="confirm-button" @click="deleteUser(deletePopup.user)">Ya, Hapus</button>
          <button class="cancel-buttonblock" @click="deletePopup.show = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup Konfirmasi Blokir -->
    <div v-if="blockPopup.show" class="popup-overlay">
      <div class="popup">
        <h2>Konfirmasi Blokir</h2>
        <p>Apakah Anda yakin ingin memblokir <strong>{{ blockPopup.user?.name }}</strong>?</p>
        <div class="popup-buttons">
          <button class="confirm-button" @click="blockUser">Ya, Blokir</button>
          <button class="cancel-buttonblock" @click="blockPopup.show = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup Form -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2>{{ isEditing ? "Edit Pengguna" : "Tambah Pengguna" }}</h2>
        <form @submit.prevent="isEditing ? updateUser() : addUser()">
          <div class="form-group">
            <label for="name">Nama Pengguna:</label>
            <input type="text" id="name" v-model="newUser.name" required />
          </div>
          <div class="form-group">
            <label for="phone">Nomor Telepon:</label>
            <input type="text" id="phone" v-model="newUser.phone" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="newUser.email" required />
          </div>
          <div class="popup-buttons">
            <button type="submit" class="submit-button">
              {{ isEditing ? "Update" : "Add" }}
            </button>
            <button type="button" class="cancel-button" @click="showPopup = false">Back</button>
          </div>
        </form>
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
      showPopup: false,
      isEditing: false,
      blockPopup: { show: false, user: null },
      deletePopup: { show: false, user: null },
      newUser: {
        name: "",
        phone: "",
        email: "",
      },
      users: [],
      accessToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImV4cCI6MTc0MjMwMDE2NCwiaWQiOiIxMjMiLCJpc3MiOiJNaWtyb05ldCIsInJvbGUiOiJhZG1pbiJ9.pHS_Z1nZUmPlylkazHEUmL25wDR2VTmAwjtWPFH6G7s", // Masukkan Access Token dari Postman
      apiUrl: "http://188.166.179.146:8000/api//dashboard/users", // Ganti dengan URL API Anda
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
    // Ambil data pengguna dari API
    async fetchUsers() {
      try {
        const response = await fetch("http://188.166.179.146:8000/api//dashboard/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.accessToken,
          },
        });
        if (!response.ok) throw new Error("Gagal mengambil data pengguna");
        this.users = await response.json();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    // Tambahkan pengguna ke API
    async addUserToAPI() {
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.accessToken,
          },
          body: JSON.stringify(this.newUser),
        });

        if (!response.ok) throw new Error("Gagal menambahkan pengguna");
        const newUser = await response.json();
        this.users.push(newUser);
        this.resetForm();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },

    // Update pengguna di API
    async updateUserToAPI() {
      try {
        const response = await fetch(`${this.apiUrl}/${this.newUser.email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.accessToken,
          },
          body: JSON.stringify(this.newUser),
        });

        if (!response.ok) throw new Error("Gagal memperbarui pengguna");
        const updatedUser = await response.json();
        const index = this.users.findIndex((user) => user.email === updatedUser.email);
        if (index !== -1) this.users.splice(index, 1, updatedUser);

        this.resetForm();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },

    // Hapus pengguna dari API
    async deleteUserFromAPI(user) {
      try {
        const response = await fetch(`${this.apiUrl}/${user.email}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.accessToken,
          },
        });

        if (!response.ok) throw new Error("Gagal menghapus pengguna");
        this.users = this.users.filter((u) => u.email !== user.email);
        this.deletePopup.show = false;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },

    showDeletePopup(user) {
      this.deletePopup.user = user;
      this.deletePopup.show = true;
    },

    showBlockPopup(user) {
      this.blockPopup.user = user;
      this.blockPopup.show = true;
    },

    blockUser() {
      this.users = this.users.filter((d) => d !== this.blockPopup.user);
      this.blockPopup.show = false;
      this.blockPopup.user = null;
    },

    resetForm() {
      this.newUser = { name: "", phone: "", email: "" };
      this.isEditing = false;
      this.showPopup = false;
    },
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
  