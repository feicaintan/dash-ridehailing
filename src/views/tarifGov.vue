<template>
    <div class="data-container">
      <router-link to="/management" class="back-button">← Kembali</router-link>
  
      <div class="content">
        <h1 class="title">Daftar Pengaturan Tarif</h1>
        <div class="search-container">
          <img src="@/assets/search.png" alt="Search Icon" class="search-icon" />
          <input
            type="text"
            class="search-bar"
            placeholder="Cari Jenis Penumpang/Trayek..."
            v-model="searchQuery"
          />
        </div>
  
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Jenis Penumpang</th>
                <th>Trayek</th>
                <th>Tarif</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tariff, index) in paginatedTariffs" :key="index">
                <td>{{ tariff.jenisPenumpang }}</td>
                <td>{{ tariff.trayek }}</td>
                <td>{{ tariff.tarif }}</td>
              </tr>
              <tr v-if="paginatedTariffs.length === 0">
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
  export default {
    name: "DaftarTarif",
    data() {
      return {
        searchQuery: "",
        currentPage: 1,
        itemsPerPage: 10,
        tarifData: [
          { jenisPenumpang: "Umum", trayek: "001 - 017", tarif: 6000 },
          { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "001 - 017", tarif: 4000 },
          { jenisPenumpang: "Umum", trayek: "Paal 2 - Perum/Politeknik Lapangan", tarif: 6500 },
          { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "Paal 2 - Perum/Politeknik Lapangan", tarif: 5000 },
          { jenisPenumpang: "Umum", trayek: "Tuminting - Pandu", tarif: 6500 },
          { jenisPenumpang: "Pelajar/Mahasiswa", trayek: "Tuminting - Pandu", tarif: 5000 },
          { jenisPenumpang: "Umum", trayek: "Tuminting - Tongkaina", tarif: 6500 },
        ],
      };
    },
    computed: {
      filteredTariffs() {
        return this.tarifData.filter(tariff => {
          return (
            tariff.jenisPenumpang.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            tariff.trayek.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      },
      paginatedTariffs() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredTariffs.slice(start, start + this.itemsPerPage);
      },
      totalPages() {
        return Math.ceil(this.filteredTariffs.length / this.itemsPerPage);
      }
    },
    methods: {
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
    margin-bottom: 20px;
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
    left: 10px;
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
  
  /* Button Styling */
  .delete-button {
    background-color: #ef4444; /* Merah */
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #b91c1c; /* Merah lebih gelap */
  }
  
  /* Add Tariff Button Styling */
  .add-tariff-container {
    text-align: right;
    margin-top: 20px;
  }
  
  .add-tariff-button {
    background-color: #315882;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-tariff-button:hover {
    background-color: #3b82bf; /* Biru lebih gelap */
  }
  
  /* Modal for Adding Tariff */
  .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.modal.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.modal.active .modal-content {
  transform: scale(1);
}

.modal-content h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #315882;
  text-align: center;
}

.modal-content form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.modal-content form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.modal-content form input:focus {
  border-color: #315882;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
  
  /* Pagination Styling */
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .save-button {
  background-color: #315882;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #3b82bf;
}

.cancel-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #b91c1c;
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