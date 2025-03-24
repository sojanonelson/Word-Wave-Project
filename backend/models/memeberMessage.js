const mongoose = require("mongoose");

const memberMessageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const MemberMessage = mongoose.model("MemberMessage", memberMessageSchema);

module.exports = MemberMessage;
