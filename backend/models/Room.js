const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    hostName: String,
    hostImage: String,
    roomName: String,
    roomCode: String,
    roomPassword: String,
    members: [
      {
        userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        name: { type: String, required: true },
        image: { type: String }, // Optional, can be empty or a placeholder,
        isOnline: { type: Boolean, default: false },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
