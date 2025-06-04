<template>
    <div class="login-page">
      <!-- Bagian Kiri: Teks dan Logo -->
      <div class="left-section">
        <h1 class="header-title">
  <span class="text">Ride</span>
  <span class="text">Hailing</span>
  <img :src="logo" alt="Logo" class="logo-inline" />
</h1>
        <p class="subtitle">Yuk, jelajahi mikrolet dengan lebih mudah!</p>
      </div>
  
      <!-- Bagian Kanan: Form Login -->
      <div class="login-container">
        <div class="login-card">
          <h2>Masuk sebagai <span class="highlight">Administrator</span></h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="contohemail@gmail.com"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Kata Sandi</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="togglePassword"
                >
                </button>
              </div>
            </div>
            <button type="submit" class="login-button" @click="handleLogin">Masuk</button>
          </form>
          <div v-if="showToast" class="toast" @animationend="showToast = false">
  <p>Email atau kata sandi salah. Coba lagi!</p>
</div>

        </div>
      </div>
    </div>
  </template>
  
  <script>
  import logoRideHailing from "@/assets/logoridehailing.png";
  export default {
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
        logo: logoRideHailing,
        showToast: false,
      };
    },
    methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        const response = await fetch("https://mikronet.systems/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("access_token", data.data.access_token);
          this.$router.push("/admin-dash");
        } else {
          this.showToast = true;
        }
      } catch (error) {
        this.showToast = true;
      }
    },
  },
};
  </script>
  
  <style scoped>
  /* Container Halaman */
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
    font-family: "Poppins", sans-serif;
    color: #fff;
  }
  
  /* Bagian Kiri: Logo dan Teks */
  .left-section {
    flex: 1;
    text-align: center;
    padding: 20px;
  }
  
  .left-section h1 {
    font-size: 3rem;
    margin: 0;
    font-weight: bold;
  }
  
  .left-section .text {
    display: block;
  }
  
  .logo-inline {
    width: 100px;
    margin-top: 20px;
  }
  
  .subtitle {
    margin-top: 20px;
    font-size: 1.2rem;
    color: #eef;
    font-style: italic;
  }
  
  /* Bagian Kanan: Form Login */
  .login-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-card {
    background: white;
    padding: 30px 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    text-align: center;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    font-weight: bold;
  }
  
  h2 .highlight {
    color: #2c5364;
  }
  
  /* Form Group */
  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }
  
  label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
  
  /* Password Wrapper */
  .password-wrapper {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #888;
  }
  
  .toggle-password:hover {
    color: #333;
  }
  
  /* Link Lupa Password */
  .forgot-password {
    display: block;
    margin: 10px 0;
    font-size: 12px;
    color: #0f2027;
    text-decoration: none;
  }
  
  .forgot-password:hover {
    text-decoration: underline;
  }
  
  /* Tombol Login */
  .login-button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #0f2027, #0056b3);
    border: none;
    color: white;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }
  
  .login-button:hover {
    background: linear-gradient(135deg, #0056b3, #0f2027);
    transform: translateY(-2px);
  }
  
  /* Prompt Daftar */
  .register-prompt {
    margin-top: 15px;
    font-size: 14px;
    color: #555;
  }
  
  .register-prompt a {
    color: #0f2027;
    font-weight: bold;
    text-decoration: none;
  }
  
  .register-prompt a:hover {
    text-decoration: underline;
  }

  .header-title {
  display: flex;
  align-items: center; /* Vertikal sejajar */
  gap: 10px; /* Spasi antara elemen teks dan logo */
  justify-content: center; /* Pusatkan secara horizontal */
  font-size: 3rem;
  margin: 0;
  font-weight: bold;
}

.header-title .text {
  margin: 0;
}

.logo-inline {
  width: 75px; /* Atur ukuran logo sesuai kebutuhan */
  height: auto; /* Pertahankan rasio aspek */
}
.toast {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background:rgb(197, 32, 32);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation: fadeInOut 4s;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

  </style>
  