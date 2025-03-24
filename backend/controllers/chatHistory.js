const { Room } = require("../models/Room"); // Import your models
const { MemberMessage } = require("../models/memeberMessage"); // Import your models
const { AiMessage } = require("../models/aiMessage"); // Import your models


const saveMessages = async () => {
  try {
    const { roomId, aiMessages, memberMessages } = req.body;
    const aiMessageCollection = await AiMessage.create({
      roomId: roomId,
      messages: aiMessages,
    });

    // Create and save the member messages
    const memberMessageCollection = await MemberMessage.create({
      roomId: roomId,
      messages: memberMessages,
    });

    // Update the room with the new message IDs
    const room = await Room.findById(roomId);
    room.ai_message_id = aiMessageCollection._id;
    room.member_message_id = memberMessageCollection._id;

    await room.save();
    console.log("Messages saved successfully!");
  } catch (error) {
    console.error("Error saving messages:", error);
    throw error; // Rethrow to be handled in the route handler
  }
};

module.exports = { saveMessages };
