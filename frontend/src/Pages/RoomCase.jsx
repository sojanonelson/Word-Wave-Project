import React, { useState } from "react";

const RoomCase = ({ onCreateRoom, onJoinRoom }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  // Dummy data for created rooms
  const dummyRooms = [
    { roomCode: "ABC123", roomName: "Fun Chat Room", members: 5 },
    { roomCode: "XYZ789", roomName: "Study Group", members: 3 },
    { roomCode: "LMN456", roomName: "Gaming Squad", members: 8 },
    { roomCode: "QWE987", roomName: "Tech Talk", members: 12 },
  ];

  // Filter rooms based on search query
  const filteredRooms = dummyRooms.filter(
    (room) =>
      room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create room
  const handleCreateRoom = () => {
    if (!roomName.trim()) return alert("Room name is required");
    onCreateRoom({ roomName, roomPassword });
    setShowCreateModal(false);
    setRoomName("");
    setRoomPassword("");
  };

  // Handle join room
  const handleJoinRoom = () => {
    if (!roomCode.trim()) return alert("Room code is required");
    if (!roomPassword.trim()) return alert("Room password is required");
    onJoinRoom({ roomCode, roomPassword });
    setShowJoinModal(false);
    setRoomCode("");
    setRoomPassword("");
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* Room List */}
      <div className="space-y-4">
        {filteredRooms.map((room, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{room.roomName}</h3>
              <p className="text-sm text-gray-600">Code: {room.roomCode}</p>
              <p className="text-sm text-gray-600">{room.members} members</p>
            </div>
            <button
              onClick={() => {
                setRoomCode(room.roomCode);
                setShowJoinModal(true);
              }}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
            >
              Join
            </button>
          </div>
        ))}
      </div>

      {/* Create Room and Join Room Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          Create Room
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          Join Room
        </button>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create Room</h3>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Room Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleCreateRoom}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Join Room</h3>
            <input
              type="text"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Room Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleJoinRoom}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
              >
                Join
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCase;