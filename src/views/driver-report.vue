<template>
  <div class="report-container">
    <div class="header-section">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1><i class="fas fa-star"></i> Daftar Ulasan Terhadap Driver</h1>
    </div>

    <div class="card-container">
      <!-- Search and Total Count -->
      <div class="controls">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Cari Pengguna atau driver..."
            class="search-input"
          />
        </div>
        <span class="total-count">
          <i class="fas fa-list"></i> Total Ulasan: {{ filteredReports.length }}
        </span>
      </div>

      <!-- Report Table -->
      <div class="table-responsive">
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Penumpang</th>
              <th>Driver</th>
              <th>Penilaian</th>
              <th>Ulasan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in paginatedReports" :key="index">
              <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td>
                <div class="user-info">
                  <div class="avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  {{ report.passengerName }}
                </div>
              </td>
              <td>
                <div class="user-info">
                  <div class="avatar driver">
                    <i class="fas fa-id-card"></i>
                  </div>
                  {{ report.driverName }}
                </div>
              </td>
              <td>
                <div class="rating-container">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="star"
                    :class="{ filled: n <= report.rating }"
                  >
                    &#9733;
                  </span>
                  <span class="rating-number">({{ report.rating }})</span>
                </div>
              </td>
              <td>
                <div class="review-text">
                  {{ report.review || "-" }}
                </div>
              </td>
            </tr>
            <tr v-if="!paginatedReports.length">
              <td colspan="5" class="no-data">
                <i class="fas fa-exclamation-circle"></i> Tidak ada data yang ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="btn-pagination"
        >
          <i class="fas fa-chevron-left"></i> Sebelumnya
        </button>
        <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="btn-pagination"
        >
          Selanjutnya <i class="fas fa-chevron-right"></i>
        </button>
      </div>
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
          "https://mikronet.systems/api/dashboard/reviews",
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.report-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  background-color: #f5f7fa;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.header-section h1 {
  flex: 1;
  text-align: center;
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.header-section h1 i {
  margin-right: 10px;
  color: #f39c12;
}

.card-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin: 0 auto;
  max-width: 1200px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
  background-color: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: white;
}

.total-count {
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 5px;
}

.table-responsive {
  overflow-x: auto;
  margin-bottom: 20px;
}

.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.report-table th {
  background-color: #3498db;
  color: white;
  font-weight: 500;
  padding: 15px;
  text-align: left;
  position: sticky;
  top: 0;
}

.report-table th:first-child {
  border-top-left-radius: 8px;
}

.report-table th:last-child {
  border-top-right-radius: 8px;
}

.report-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.report-table tr:last-child td {
  border-bottom: none;
}

.report-table tr:hover td {
  background-color: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.avatar.driver {
  background-color: #d4edff;
  color: #2980b9;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.star {
  color: #e0e0e0;
  font-size: 16px;
}

.star.filled {
  color: #f39c12;
}

.rating-number {
  color: #7f8c8d;
  font-size: 13px;
}

.review-text {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.review-text:hover {
  white-space: normal;
  overflow: visible;
  position: relative;
  z-index: 10;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 5px;
  border-radius: 4px;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.no-data i {
  margin-right: 8px;
  font-size: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
  flex-wrap: wrap;
}

.pagination span {
  color: #7f8c8d;
  font-size: 14px;
}

.btn-pagination {
  padding: 10px 18px;
  font-size: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-pagination:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-pagination:not(:disabled):hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.btn-back {
  padding: 10px 18px;
  font-size: 14px;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  position: absolute;
  left: 0;
}

.btn-back:hover {
  background-color: #636e72;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .header-section h1 {
    font-size: 20px;
    margin-left: 50px;
  }
  
  .report-table th, .report-table td {
    padding: 10px;
    font-size: 13px;
  }
  
  .btn-pagination {
    padding: 8px 12px;
  }
}
</style>