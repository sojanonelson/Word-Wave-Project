// const Message = require('../models/Message');

// const saveMessages = async () => {
//   const {roomId, aiMessages, memberMessages} = req.body;
//   // Create the AI Message Collection
//   const aiMessageCollection = await AiMessage.create({
//     roomId: roomId,
//     messages: aiMessages,
//   });

//   // Create the Member Message Collection
//   const memberMessageCollection = await MemberMessage.create({
//     roomId: roomId,
//     messages: memberMessages,
//   });

//   // Update the room with the message IDs
//   const room = await Room.findById(roomId);
//   room.ai_message_id = aiMessageCollection._id;
//   room.member_message_id = memberMessageCollection._id;
  
//   // Save room data
//   await room.save();
// };


// module.exports = { saveMessages };
