const mongoose = require("mongoose");

const aiMessageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    messages: [
      {
        senderId: { type: String, required: true }, // AI or User
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const aiMessage = mongoose.model("aiMessage", aiMessageSchema);

module.exports = aiMessage;
