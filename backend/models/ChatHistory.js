const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  userMessages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  aiMessages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
