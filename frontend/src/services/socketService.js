import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL; // Ensure the variable is defined
console.log("🚀 ~ file: socketService.js ~ line 5 ~ SOCKET_URL", SOCKET_URL);

if (!SOCKET_URL) {
  console.error("❌ WebSocket URL is missing in environment variables.");
}

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false, // Prevent auto connection
});

const socketService = {
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  on: (event, callback) => {
    socket.on(event, callback);
  },
  off: (event) => {
    socket.off(event);
  },
  emit: (event, data, callback) => {
    console.log(`🚀 Emitting event: ${event}`, data);
    socket.emit(event, data, (response) => {
      console.log(`📩 Response received for ${event}:`, response);
      if (callback) {
        callback(response);
      } else {
        console.warn(`⚠️ Callback function missing for event: ${event}`);
      }
    });
  },
  isConnected: () => socket.connected,
};

// Listen for connection events to track status
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server");
});
socket.on("disconnect", () => {
  console.log("❌ Disconnected from WebSocket server");
});

export default socketService;
