import React from "react";
import { Users, PlusCircle } from "lucide-react";

const RoomList = ({ rooms, onCreateRoomClick }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Rooms</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md p-6 border hover:border-violet-400 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-violet-800">{room.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  room.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {room.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <Users size={16} className="mr-2" />
              <span>{room.members} members</span>
            </div>
            <button className="w-full bg-violet-800 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors">
              Join Room
            </button>
          </div>
        ))}

        {/* Button to trigger the Create Room Modal */}
        <div
          onClick={onCreateRoomClick} // Trigger the modal opening
          className="bg-violet-50 rounded-lg border-2 border-dashed border-violet-200 p-6 flex flex-col items-center justify-center hover:border-violet-400 transition-all cursor-pointer"
        >
          <PlusCircle size={24} className="text-violet-400 mb-2" />
          <p className="text-violet-600 font-medium">Create New Room</p>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
