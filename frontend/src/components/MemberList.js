import { useState } from "react";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import defaultImage from '../Data/profile.png'

const QRCodeWithText = ({ value }) => {
  return (
    <div className="relative">
      <QRCodeCanvas 
        value={value} 
        size={256}
        level="M"
        includeMargin={true}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-white px-3 py-1 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-800">Word Wave</span>
        </div>
      </div>
    </div>
  );
};

const MemberList = ({ roomName, roomCode, roomPassword, List }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Room link
  const roomLink = `${window.location.origin}/room/${roomCode}`;
  console.log(roomLink);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Room Details */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Room Details</h2>
        <button
          onClick={() => setShowQR(true)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Show QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-2 space-y-2">
        <p><strong>Name:</strong> {roomName}</p>
        <p><strong>Code:</strong> {roomCode}</p>
        <p>
          <strong>Password:</strong> 
          {showPassword ? ` ${roomPassword}` : " *****"} 
          <button 
            className="ml-2 px-2 py-1 text-sm text-blue-500 border rounded hover:bg-gray-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </p>
      </div>

      {/* Room Members */}
      <h2 className="mt-4 text-lg font-semibold">Room Members</h2>
      <ul className="mt-2  space-y-2">
        {List.length > 0 ? (
          List.map((member) => (
            <li key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex flex-row items-center space-x-3">
              <img
                src={member.image || defaultImage}
                alt={member.name}
                className="rounded-full w-10 h-10 object-cover"
              />
              <span className="font-medium">
                {member.name} {member.isHost ? "👑 (Host)" : ""}
              </span>

              </div>
              

              {/* Online/Offline Indicator */}
              {/* <span className={`ml-auto text-sm px-2 py-1 rounded-full ${member.isOnline ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                {member.isOnline ? "Online" : "Offline"}
              </span> */}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No members yet...</p>
        )}
      </ul>

      {/* Modal for QR Code */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Room QR Code</h3>
            <div className="flex justify-center">
              <QRCodeWithText value={roomLink} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Scan this QR code to join the room
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;