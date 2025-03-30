import { useState } from "react";
import defaultImage from '../Data/profile.png';

const MemberList = ({ roomName, roomCode, roomPassword, List }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      {/* Room Details */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Details</h2>
        <div className="space-y-2 text-gray-600">
          <p><strong>Room Name:</strong> {roomName}</p>
          <p><strong>Room Code:</strong> {roomCode}</p>
          <p>
            <strong>Room Password:</strong>
            {showPassword ? ` ${roomPassword}` : " *****"} 
            <button 
              className="ml-2 text-blue-500 underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </p>
        </div>
      </div>

      {/* Room Members */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Members</h2>
        <ul className="space-y-3">
          {List.length > 0 ? (
            List.map((member) => (
              <li key={member._id} className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
                <img
                  src={member.image || defaultImage}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">{member.name} {member.isHost && "👑 (Host)"}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No members yet...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MemberList;