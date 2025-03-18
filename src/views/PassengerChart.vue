<template>
    <canvas id="passenger-chart"></canvas>
  </template>
  
  <script>
  import { Chart } from 'chart.js';
  
  export default {
    props: {
      passengerStats: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      const ctx = document.getElementById('passenger-chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Harian', 'Mingguan', 'Bulanan'],
          datasets: [
            {
              label: 'Jumlah Penumpang',
              data: [
                this.passengerStats.daily,
                this.passengerStats.weekly,
                this.passengerStats.monthly,
              ],
              backgroundColor: ['#5B9BD5', '#4CAF50', '#FF9800'],
            },
          ],
        },
      });
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: 100px;
  }
  </style>
  