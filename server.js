import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http"; // Import HTTP Server
import { Server } from "socket.io"; // Import Socket.io
import cors from "cors";
import proxyRoutes from "./routes/proxyRoutes.js";
import connectDB from "./config/db.js";
import { checkAndLogBandwidth, latestCronData } from "./utils/cronjob.js";

const app = express();
const server = createServer(app); // Create HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // Change this in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/proxies", proxyRoutes);

// API test route
app.get("/", (req, res) => {
  res.json({ message: "This is a testing message" });
});

// WebSocket connection event
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Send latest bandwidth data to client upon connection
  if (latestCronData) {
    socket.emit("data-update", latestCronData);
  }

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Export `io` for usage in cronjob.js
export { io };

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
