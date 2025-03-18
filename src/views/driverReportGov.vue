<template>
    <div class="report-container">
      <h1>Daftar Ulasan Terhadap Driver</h1>
  
      <!-- Back Button -->
      <div class="back-button">
        <button @click="goBack" class="btn-back">&laquo; Kembali</button>
      </div>
  
      <!-- Search and Total Count -->
      <div class="controls">
        <input v-model="search" type="text" placeholder="Cari penumpang atau driver..." class="search-input" />
        <span class="total-count">Total Laporan: {{ filteredReports.length }}</span>
      </div>
  
      <!-- Report Table -->
      <table class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Penumpang</th>
            <th>Nama Driver</th>
            <th>Nomor Kendaraan</th> <!-- Pindahkan kolom ini ke sini -->
            <th>Penilaian</th>
            <th>Ulasan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in paginatedReports" :key="index">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ report.passengerName }}</td>
            <td>{{ report.driverName }}</td>
            <td>{{ report.vehicleNumber }}</td> <!-- Pindahkan kolom ini ke sini -->
            <td>
              <span v-for="n in 5" :key="n" class="star" :class="{'filled': n <= report.rating}">
                &#9733;
              </span>
            </td>
            <td>{{ report.review }}</td>
          </tr>
          <tr v-if="!paginatedReports.length">
            <td colspan="6" class="no-data">Tidak ada data yang ditemukan.</td>
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
        itemsPerPage: 5,
        reports: [
          { vehicleNumber: "B1234XYZ", passengerName: "Andi", driverName: "Budi", rating: 4, review: "Driver sangat ramah." },
          { vehicleNumber: "B5678ABC", passengerName: "Siti", driverName: "Bambang", rating: 5, review: "Perjalanan sangat nyaman." },
          { vehicleNumber: "B9101DEF", passengerName: "Rina", driverName: "Cahyo", rating: 3, review: "Driver agak terlambat datang." },
          { vehicleNumber: "B1121GHI", passengerName: "Dian", driverName: "Dedi", rating: 2, review: "Driver kurang sopan." },
          { vehicleNumber: "B3141JKL", passengerName: "Eko", driverName: "Fajar", rating: 5, review: "Sangat profesional." },
          { vehicleNumber: "B5161MNO", passengerName: "Tini", driverName: "Gilang", rating: 1, review: "Driver tidak sesuai jadwal." }
        ],
      };
    },
    computed: {
      filteredReports() {
        return this.reports.filter(report =>
          report.passengerName.toLowerCase().includes(this.search.toLowerCase()) ||
          report.driverName.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      totalPages() {
        return Math.ceil(this.filteredReports.length / this.itemsPerPage);
      },
      paginatedReports() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredReports.slice(start, start + this.itemsPerPage);
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
        this.$router.push('/management');
      },
    },
  };
  </script>
  
  <style scoped>
  .report-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .back-button {
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
  
  .controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .search-input {
    padding: 10px;
    font-size: 16px;
    width: 60%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .total-count {
    font-size: 16px;
    align-self: center;
  }
  
  .report-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .report-table th, .report-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  .report-table th {
    background-color: #007bff;
    color: white;
  }
  
  .report-table tr:hover {
    background-color: #f1f1f1;
  }
  
  .star {
    color: #ccc;
  }
  
  .star.filled {
    color: #ffcc00;
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
    opacity : 0.5;
  }
  
  .no-data {
    text-align: center;
    font-style: italic;
    color: #999;
    padding: 20px;
  }
  </style>