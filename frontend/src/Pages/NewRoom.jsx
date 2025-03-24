import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socketService from "../services/socketService"; // Ensure this file correctly manages the socket connection

const StudyRoomInterface = () => {
  const { roomCode } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    // ✅ Join the room
    socketService.emit("join-room", { roomCode, password: "soj", userID: "67a36c9843b5e813d3e72c7b" }, (response) => {
      if (response.success) {
        console.log(`✅ Successfully joined room ${roomCode}`);
      } else {
        console.error(`❌ Failed to join room: ${response.message}`);
      }
    });

    // ✅ Listen for member updates
    const handleMemberUpdate = (memberList) => {
      console.log("📢 Updated Members:", memberList);
      setMembers(memberList);
    };

    socketService.on("updateMembers", handleMemberUpdate);

    return () => {
      // ✅ Leave room & clean up socket events when component unmounts
      socketService.emit("leave-room", { roomCode, userID: "67a36c9843b5e813d3e72c7b" });
      socketService.off("updateMembers", handleMemberUpdate);
    };
  }, [roomCode]); // Runs only when roomCode changes

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <h1 className="text-xl font-bold p-4">Room: {roomCode}</h1>
        <h2 className="text-lg font-semibold px-4">Members</h2>
        <ul className="px-4">
          {members.map((member) => (
            <li key={member._id} className="flex items-center gap-2 py-2">
              <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full" />
              <span className={member.isHost ? "font-bold text-blue-600" : ""}>{member.name}</span>
              {member.isHost && <span className="text-sm text-gray-500">(Host)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyRoomInterface;
