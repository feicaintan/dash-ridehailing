const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

server.on("connection", (ws) => {
  console.log("Client connected");

  setInterval(() => {
    // Simulasi data pengguna dan pengemudi aktif dalam 24 jam terakhir
    const usersData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    const driversData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50));

    ws.send(JSON.stringify({ usersData, driversData }));
  }, 10000); // Kirim data setiap 10 detik

  ws.on("close", () => console.log("Client disconnected"));
});
