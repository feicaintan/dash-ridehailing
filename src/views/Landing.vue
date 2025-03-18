<template>
    <div id="app" class="start-container">
      <div class="content">
        <h1>
          <span class="text">Ride</span>
          <span class="text">Hailing</span>
          <img :src="logo" alt="Logo" class="logo-inline" />
        </h1>
        <p>{{ subtitle }}</p>
        <div class="button">
          <button @click="continueAction">{{ buttonText }}</button>
          <router-link to="/loginform" class="button-link">
            <button>{{ secondButtonText }}</button>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import logoRideHailing from "@/assets/logoridehailing.png";
  export default {
    data() {
      return {
        title: "Mikronet",
        subtitle: '"Yuk, Jelajahi Mikrolet dengan Lebih Mudah!"',
        buttonText: "Continue as Government",
        secondButtonText: "Continue as Admin",
        logo: logoRideHailing,
      };
    },
    methods: {
      continueAction() {
        this.$router.push({ name: "govdash" });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Container utama */
  .start-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
    color: #fff;
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
  }
  
  /* Konten di tengah */
  .content {
    text-align: center;
  }
  
  /* Logo */
  .logo img {
    height: 80px; /* Ukuran logo */
    margin-bottom: 20px; /* Spasi antara logo dan judul */
  }
  
  /* Judul */
  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin: 0;
    font-family: "Poppins", sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  /* Subtitle */
  p {
    font-size: 1.1rem;
    margin-top: 10px;
    font-style: italic;
    color: #e0e0e0;
  }
  
  /* Tombol */
  .button {
    margin-top: 30px;
    display: flex;
    gap: 20px; /* Jarak antara tombol */
    justify-content: center;
  }
  
  .button button {
    font-size: 1rem;
    background-color: #e0f3ff;
    border: none;
    padding: 10px 30px;
    border-radius: 25px;
    cursor: pointer;
    color: #1e3c72;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
  
  .button button:hover {
    background-color: #d0eaff;
    transform: scale(1.1);
  }
  
  .button-link {
    text-decoration: none;
  }
  </style>
  