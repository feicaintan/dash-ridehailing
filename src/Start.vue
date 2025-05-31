<template>
  <div class="landing-page">
    <!-- Header: Logo dan Teks di Atas Tengah -->
    <div class="header-section">
      <h1 class="header-title">
        <span class="text">Ride</span>
        <span class="text">Hailing</span>
        <img :src="logo" alt="Logo" class="logo-inline" />
      </h1>
      <p class="subtitle">Yuk, jelajahi mikrolet dengan lebih mudah!</p>
    </div>

    <!-- Bagian Bawah: Tombol Login di Tengah -->
    <div class="login-container">
      <div class="button-container">
        <h2>Pilih <span class="highlight">Jenis Login</span></h2>
        <button 
          class="login-option-button government-button"
          @click="handleGovernmentLogin"
        >
          Login as Government
        </button>
        <button 
          class="login-option-button admin-button"
          @click="handleAdminLogin"
        >
          Login as Admin
        </button>
        <p class="description">
          Silakan pilih jenis akun yang sesuai dengan peran Anda dalam sistem
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import logoRideHailing from "@/assets/logoridehailing.png";

export default {
  data() {
    return {
      logo: logoRideHailing,
    };
  },
  methods: {
    handleGovernmentLogin() {
      this.$router.push('/govdash');
    },
    handleAdminLogin() {
      this.$router.push('/loginform');
    }
  }
};
</script>

<style scoped>
/* Container Halaman */
.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 40px 20px;
}

/* Header: Logo dan Teks di Atas Tengah */
.header-section {
  text-align: center;
  margin-bottom: 60px;
}

.header-section h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: bold;
}

.header-section .text {
  display: block;
}

.logo-inline {
  width: 75px;
  height: auto;
}

.subtitle {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #eef;
  font-style: italic;
}

/* Bagian Bawah: Tombol Login di Tengah */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  text-align: center;
  max-width: 400px;
}

h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #fff;
  font-weight: bold;
}

h2 .highlight {
  color: #4fc3f7;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  font-size: 3rem;
  margin: 0;
  font-weight: bold;
}

.header-title .text {
  margin: 0;
}

/* Tombol Login Options */
.login-option-button {
  width: 100%;
  padding: 15px 20px;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
  margin-bottom: 15px;
  min-width: 300px;
}

.government-button {
  background: linear-gradient(135deg, #2c5364, #0f2027);
}

.government-button:hover {
  background: linear-gradient(135deg, #0f2027, #2c5364);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(44, 83, 100, 0.3);
}

.admin-button {
  background: linear-gradient(135deg, #0f2027, #0056b3);
}

.admin-button:hover {
  background: linear-gradient(135deg, #0056b3, #0f2027);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 86, 179, 0.3);
}

/* Deskripsi */
.description {
  font-size: 14px;
  color: #ccc;
  line-height: 1.4;
  margin: 20px 0 0 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .landing-page {
    padding: 20px;
  }

  .header-section {
    margin-bottom: 40px;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .header-title {
    flex-direction: column;
    gap: 10px;
  }

  .button-container {
    width: 100%;
    max-width: 300px;
  }

  .login-option-button {
    min-width: auto;
  }
}
</style>