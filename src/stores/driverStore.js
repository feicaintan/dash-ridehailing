// stores/driverStore.js
import { defineStore } from 'pinia';

export const useDriverStore = defineStore('driver', {
  state: () => ({
    activeDrivers: [],
    token: localStorage.getItem('token'), // Ambil token dari localStorage
  }),
  actions: {
    setActiveDrivers(drivers) {
      this.activeDrivers = drivers;
    },
    addDriver(driver) {
      this.activeDrivers.push(driver);
    },
    removeDriver(driverId) {
      this.activeDrivers = this.activeDrivers.filter(d => d.id !== driverId);
    },
    async fetchActiveDrivers() {
      try {
        const response = await fetch('https://mikronet.systems/api/dashboard/drivers', {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data driver');
        }

        const data = await response.json();
        this.setActiveDrivers(data.data); // Sesuaikan dengan struktur respons
      } catch (error) {
        console.error('Error saat fetch driver:', error);
      }
    }
  },
});
