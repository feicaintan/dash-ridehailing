<template>
  <div class="report-container">
    <h1>Daftar Ulasan Terhadap Driver</h1>

    <!-- Back Button -->
    <div class="back-button">
      <button @click="goBack" class="btn-back">&laquo; Kembali</button>
    </div>

    <!-- Search and Total Count -->
    <div class="controls">
      <input
        v-model="search"
        type="text"
        placeholder="Cari penumpang atau driver..."
        class="search-input"
      />
      <span class="total-count">Total Ulasan: {{ filteredReports.length }}</span>
    </div>

    <!-- Report Table -->
    <table class="report-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nama Penumpang</th>
          <th>Nama Driver</th>
          <th>Penilaian</th>
          <th>Ulasan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in paginatedReports" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td>{{ report.passengerName }}</td>
          <td>{{ report.driverName }}</td>
          <td>
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= report.rating }"
            >
              &#9733;
            </span>
          </td>
          <td>{{ report.review }}</td>
        </tr>
        <tr v-if="!paginatedReports.length">
          <td colspan="5" class="no-data">Tidak ada data yang ditemukan.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="btn-pagination"
      >
        &laquo; Prev
      </button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="btn-pagination"
      >
        Next &raquo;
      </button>
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
      reports: [],
    };
  },
  computed: {
    filteredReports() {
      return this.reports.filter((report) =>
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
    async fetchReviews() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token tidak ditemukan!");
        return;
      }

      try {
        const response = await fetch(
          "http://188.166.179.146:8000/api/dashboard/reviews",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.status === "Success" && data.data.reviews) {
          this.reports = data.data.reviews.map((item) => ({
            passengerName: item.passenger_name,
            driverName: item.driver_name,
            review: item.comment,
            rating: item.star,
          }));
        } else {
          console.error("Gagal mengambil data:", data);
          this.reports = [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    goBack() {
      this.$router.push("/data");
    },
  },
  mounted() {
    this.fetchReviews();
  },
};
</script>


<style scoped>
.report-container {
  width: 100vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 70%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
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
  margin-top: 20px;
}

.btn-pagination {
  padding: 8px 12px;
  margin: 0 5px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

.btn-back {
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .btn-back:hover {
    background-color: #083463;
    transform: scale(1.05);
  }
  
  .btn-back:active {
    transform: scale(0.95);
  }
</style>
