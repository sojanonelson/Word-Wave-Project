const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const llamaChatRoutes = require("./routes/llamaChatRoutes");
const openaiChatRoutes = require("./routes/openaiChatRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const socketController = require("./controllers/socketController");
const uploadRoutes = require("./routes/uploadRoutes");
const settingsRoute =require('./routes/settingsRoute')
dotenv.config();
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Change this in production)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
console.log("ENC", process.env.CLOUDINARY_CLOUD_NAME);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/user", userRoutes);
app.use("/api/openai", chatRoutes);
app.use("/api/llama", llamaChatRoutes);
app.use("/api/chatHistory", chatHistoryRoutes);
app.use("/api/settings", settingsRoute);

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Initialize Socket Controller
socketController(io);

const PORT = process.env.PORT || 5000;

// Start the server using `server.listen()`
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
