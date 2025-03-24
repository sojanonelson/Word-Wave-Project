const Room = require('../models/Room'); // Use correct model import

const getRoomDetails = async (req, res) => {
  try {
    const {roomcode} = req.params; // Ensure correct parameter is being passed
    const roomDetails = await Room.findOne({ roomCode: roomcode }); // Ensure Room model is correctly referenced
    return res.status(200).json(roomDetails);
  } catch (error) {
    console.log(
        `Error in getRoomDetails controller: ${error.message}`
    )
  }
};

const checkUserIn = async (req, res) => {
  try {
    const {roomcode, userID} = req.params; // Ensure correct parameters are being passed
    const roomDetails = await Room.findOne({ roomCode: roomcode }); // Ensure Room model is correctly referenced    

    if (!roomDetails) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isMember = roomDetails.members.some((member) => member.userID.toString() === userID);
    if (!isMember) {
      return res.status(404).json({ message: "User not found in Room" , sucess: false});
    }

    return res.status(200).json({ message: "User is a member of this room", sucess: true });
    } catch (error) {
    console.log(
        `Error in checkUserIn controller: ${error.message}`
    )
    }
}

module.exports = { getRoomDetails,checkUserIn };
