const Room = require("../models/Room");
const User = require("../models/User");

const rooms = {}; // Tracks active socket connections per room
const socketToUser = new Map(); 

const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ New WebSocket Connection: ${socket.id}`);

    const updateRoomMembers = async (roomCode) => {
        try {
          const room = await Room.findOne({ roomCode }).populate("members.userID", "name image");
          if (!room) return;
      
          const members = room.members.map(member => ({
            _id: member.userID._id,
            name: member.userID.name,
            image: member.userID.image,
            isOnline: true,
            isHost: room.hostID.toString() === member.userID._id.toString()
          }));
          io.to(roomCode).emit("updateMembers", members);
        } catch (error) {
          console.error("❌ Error updating members:", error);
        }
      };

    socket.on("createRoom", async ({ roomName, roomPassword, userID }, callback) => {
        try {
          console.log("🔵 Received createRoom event:", { roomName, roomPassword, userID });
      
          const host = await User.findById(userID);
          if (!host) {
            console.log("❌ Host not found");
            if (typeof callback === "function") {
              return callback({ success: false, message: "Host not found" });
            }
            return;
          }
      
          const roomCode = Math.random().toString(36).substr(2, 6);
          console.log("🟢 Room code generated:", roomCode);
      
          const newRoom = new Room({
            hostID: host._id,
            hostName: host.name,
            hostImage: host.image || "",
            roomName,
            roomCode,
            roomPassword,
            members: [{ userID: host._id, name: host.name, image: host.image }]
          });
      
          await newRoom.save();
          rooms[roomCode] = { users: [socket.id] };
      
          socket.join(roomCode);
      
          console.log("✅ Room created successfully. Sending callback...");
      
          if (typeof callback === "function") {
            callback({ success: true, roomCode, roomName, roomPassword });
          }
        } catch (error) {
          console.error("❌ Error creating room:", error);
          if (typeof callback === "function") {
            callback({ success: false, message: "Failed to create room" });
          }
        }
      });

    socket.on("GetRoomDetails", async ({ roomCode }, callback) => {
      try {
        const roomDetails = await Room.findOne({ roomCode });

        if (!roomDetails) {
          if (typeof callback === "function") {
            return callback({ success: false, message: "Room not found" });
          }
          return;
        }

        if (typeof callback === "function") {
          callback({ success: true, roomDetails });
        }
      } catch (error) {
        console.error("❌ Error fetching room details:", error);
        if (typeof callback === "function") {
          callback({ success: false, message: "Failed to fetch room details" });
        }
      }
    });

    socket.on("join-room", async ({ roomCode, password, userID }, callback) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (!room || room.password !== password) {
          if (typeof callback === "function") {
            return callback({ success: false, message: "Invalid room or password" });
          }
          return;
        }

        const user = await User.findById(userID);
        if (!user) {
          if (typeof callback === "function") {
            return callback({ success: false, message: "User not found" });
          }
          return;
        }

        socketToUser.set(socket.id, userID);

        const isUserInRoom = room.members.some(member => member.userID.toString() === userID);
        if (!isUserInRoom) {
          room.members.push({ userID: user._id, name: user.name, image: user.image || "" });
          await room.save();
        }

        socket.join(roomCode);
        rooms[roomCode] = rooms[roomCode] || { users: [] };
        rooms[roomCode].users.push(socket.id);

        if (typeof callback === "function") {
          callback({ success: true, message: "Joined room" });
        }

        // Notify other members that a new user has joined
        io.to(roomCode).emit("user-joined", { name: user.name });

        await updateRoomMembers(roomCode);
      } catch (error) {
        console.error("❌ Error joining room:", error);
        if (typeof callback === "function") {
          callback({ success: false, message: "Failed to join room" });
        }
      }
    });

    socket.on("ping", (data, callback) => {
        console.log("Received ping:", data);
        if (typeof callback === "function") {
          callback({ success: true, message: "Pong!" });
        }
      });

    socket.on("leave-room", ({ roomCode, userID }) => {
        socket.leave(roomCode);
      
        if (rooms[roomCode]) {
          rooms[roomCode].users = rooms[roomCode].users.filter(id => id !== userID);
          if (rooms[roomCode].users.length === 0) delete rooms[roomCode];
        }
      
        updateRoomMembers(roomCode);
      });

      socket.on("disconnect", async () => {
        console.log(`⚡ User Disconnected: ${socket.id}`);
  
        // Get the userID associated with this socket
        const userID = socketToUser.get(socket.id);
        
        // Clean up the socket-to-user mapping
        socketToUser.delete(socket.id);
  
        for (const roomCode in rooms) {
          if (rooms[roomCode]) {
            const roomUsers = rooms[roomCode].users;
            
            if (Array.isArray(roomUsers)) {
              const socketIndex = roomUsers.indexOf(socket.id);
              
              if (socketIndex !== -1) {
                roomUsers.splice(socketIndex, 1);
  
                if (roomUsers.length === 0) {
                  delete rooms[roomCode];
                }
  
                // Only update the room members if we have a valid userID
                if (userID) {
                  try {
                    const user = await User.findById(userID);
                    if (user) {
                        io.to(roomCode).emit("user-left", { name: user.name });
                    }
                    // Update room members in database if needed
                    await Room.updateOne(
                      { roomCode },
                      { $pull: { members: { userID: userID } } }
                    );
  
                    // Notify other members
                    await updateRoomMembers(roomCode);
                  } catch (error) {
                    console.error("❌ Error updating room members on disconnect:", error);
                  }
                }
              }
            }
          }
        }
      });
      socket.on("send-image", async ({ roomCode, userID, imageUrl }) => {
        try {
          const user = await User.findById(userID);
          if (!user) return;
      
          const imageMessage = {
            userID,
            name: user.name,
            image: user.image,
            content: null, // No text, only image
            imageUrl,
            timestamp: new Date(),
          };
      
          io.to(roomCode).emit("new-message", imageMessage);
        } catch (error) {
          console.error("❌ Error sending image:", error);
        }
      });
      
      socket.on("send-message", async ({ roomCode, userID, message }) => {
        try {
          const user = await User.findById(userID);
          if (!user) return;
  
          const messageData = {
            userID,
            name: user.name,
            image: user.image,
            content: message,
            timestamp: new Date(),
            isChatbot: false
          };

          io.to(roomCode).emit("new-message", messageData);
        } catch (error) {
          console.error("❌ Error sending message:", error);
        }
      });
  
      socket.on("typing", ({ roomCode, userID, isTyping }) => {
        socket.to(roomCode).emit("user-typing", { userID, isTyping });
      });
      socket.on("send-chatbot-message", async ({ roomCode, message,botresponse, userID }) => {
        try {
          const user = await User.findById(userID);
          if (!user) return;
      
          // Emit the host's message to the chatbot to the room
          const hostMessage = {
            userID,
            name: user.name,
            image: user.image,
            content: message,
            timestamp: new Date(),
            isChatbot: false, // This is the host's message to the chatbot
            isChatbotMessage: true, // Mark this as a chatbot-related message
          };
      
          io.to(roomCode).emit("new-message", hostMessage);
      
          // Simulate a chatbot response (you can replace this with actual AI logic)
          const chatbotResponse = {
            userID: "chatbot",
            name: "Word Wave AI",
            image: "https://i.ibb.co/LdSxzLLz/image.png", // Chatbot avatar
            content: `You said: "${message}". ${botresponse}`, // Replace with actual AI response
            timestamp: new Date(),
            isChatbot: true, // This is a chatbot message
            isChatbotMessage: true, // Mark this as a chatbot-related message
          };
      
          // Emit the chatbot's response to the room
          io.to(roomCode).emit("new-message", chatbotResponse);
        } catch (error) {
          console.error("❌ Error sending chatbot message:", error);
        }
      });

  });
};

module.exports = socketController;
