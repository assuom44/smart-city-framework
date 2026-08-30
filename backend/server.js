const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");
const { startKafkaConsumer, stopKafkaConsumer } = require("./kafka/consumer");

const app = express();
app.disable("x-powered-by");

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const allowedOrigins = corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] }
});

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(`[API] ${req.method} ${req.originalUrl}:`, err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on("disconnect", (reason) => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
  });
});

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  await connectDB();
  await startKafkaConsumer(io);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[API] Smart City backend listening on port ${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`[API] Received ${signal}; shutting down gracefully...`);
  await stopKafkaConsumer();
  await new Promise((resolve) => server.close(resolve));
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

bootstrap().catch((error) => {
  console.error("[API] Startup failed:", error);
  process.exit(1);
});
