import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socketService from "../services/socketService";
import { getUserResponse } from "../services/generalService";
import MemberList from "../components/MemberList";
import ChatMessages from "../components/ChatMessages";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import MessageInput from "../components/MessageInput";
import ChatbotMessageInput from "../components/ChatbotMessageInput";
import { getRoomDetails } from "../services/roomService";
import { getllamaResponse } from "../services/chatBotService";
import { motion } from "framer-motion"
import joinedSound from "../Data/joined.wav"


const Room = () => {
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const { roomCode: urlRoomCode } = useParams();
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [roomCode, setRoomCode] = useState(urlRoomCode || "");
  const [members, setMembers] = useState([]);
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const { setIsSidebarOpen } = useOutletContext();
  const [imageToSend, setImageToSend] = useState(null);
  const [chatmode, setChatMode] = useState("member");
  const [hostID, setHostId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roomData, setRoomData] = useState([]);



  useEffect(() => {
    const handleNewMessage = (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    };

    // const audio = new Audio(joinedSound);
    // audio.play().catch((err) => console.error("Audio play failed:", err));

    socketService.on("new-message", handleNewMessage);

    return () => {
      socketService.off("new-message", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    const user = getUserResponse();
    setUserID(user.userId);

    if (!socketService.isConnected()) {
      socketService.connect();
    }

    const handleMemberUpdate = (memberList) => {
      // console.log("📢 Updated Members:", memberList);
      setMembers(memberList);
    };

    const handleUserJoined = ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { system: true, content: `${name} joined the room` },
      ]);
      const audio = new Audio(joinedSound);
      audio.play().catch((err) => console.error("Audio play failed:", err));
    };

    const handleUserLeft = ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { system: true, content: `${name} left the room` },
      ]);
    };

    socketService.on("updateMembers", handleMemberUpdate);
    socketService.on("user-joined", handleUserJoined);
    socketService.on("user-left", handleUserLeft);
    socketService.on("roomCreated", (response) => {
      setRoomCode(response.roomCode);
      setRoomName(response.roomName);
    });

    if (urlRoomCode) {
      socketService.emit(
        "join-room",
        {
          roomCode: urlRoomCode,
          roomPassword,
          userID,
        },
        (response) => {
          if (response.success) {
            // console.log("Joined room via URL:", urlRoomCode);
          } else {
            alert(response.message || "Failed to join room");
            navigate("/dashboard");
          }
        }
      );
    }

    const handleUserTyping = ({ userID, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userID);
        } else {
          newSet.delete(userID);
        }
        return newSet;
      });
    };

    socketService.on("user-typing", handleUserTyping);

    return () => {
      socketService.off("user-typing", handleUserTyping);
      socketService.off("user-joined", handleUserJoined);
      socketService.off("user-left", handleUserLeft);
      if (roomCode) {
        socketService.emit("leave-room", { roomCode, userID });
      }
      socketService.off("updateMembers", handleMemberUpdate);
    };
  }, [urlRoomCode, roomCode]);

  // console.log("💬PASS:", roomPassword);

  const handleCreateRoom = async () => {
    try {
      // Input validation
      if (!roomName.trim()) return alert("Room name is required");

      setIsSidebarOpen(false);
      setHostId(userID);

      // Emit the create room event
      socketService.emit(
        "createRoom",
        { roomName, roomPassword, userID },
        async (response) => {
          if (response && response.success) {
            setIsCreateRoomModalOpen(false);
            const room = await getRoomDetails(response.roomCode);
            setRoomCode(response.roomCode);
            setRoomName(response.roomName);

            // Emit to join the room after room creation
            socketService.emit("join-room", {
              roomCode: response.roomCode,
              roomPassword: response.roomPassword,
              userID,
            });

            // Wait for room details to be fetched

            setRoomData(room);
            setJoinedRoom(true); // Set this after successfully joining the room

            // Navigate to the room or perform other actions
            navigate(`/dashboard/room/${response.roomCode}`);
          } else {
            alert(response.message || "Unknown error occurred");
          }
        }
      );
    } catch (err) {
      console.error("Error creating room:", err);
      alert("An error occurred while creating the room. Please try again.");
    }
  };

  // console.log("RoomData:", roomData);
  const handleJoinRoom = async () => {
    try {
      // Input validation
      if (!roomCode.trim()) return alert("Room code is required");
      if (!roomPassword.trim()) return alert("Room password is required");

      // Get room details
      const room = await getRoomDetails(roomCode);
      setHostId(room.hostID);

      if (room) {
        // Proceed to join the room if room details are found
        socketService.emit(
          "join-room",
          {
            roomCode,
            roomPassword,
            userID,
          },
          (response) => {
            if (response && response.success) {
              setJoinedRoom(true);
              setIsSidebarOpen(false);
              navigate(`/dashboard/room/${roomCode}`);
            } else {
              alert(response.message || "Failed to join room");
            }
          }
        );
      } else {
        alert("Room not found. Please check the room code.");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert(
        "An error occurred while trying to join the room. Please try again."
      );
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    socketService.emit("send-message", {
      roomCode,
      userID,
      message: message.trim(),
    });
  };

  const handleChatBotMessage = async (message) => {
    if (!message.trim()) return; // Prevent empty messages
  
    const user = getUserResponse(); // Ensure this function works as expected
    if (!user || !user.userId) {
      console.error("User not found or userId missing.");
      return;
    }
  
    if (!hostID) {
      console.error("Host ID is undefined.");
      return;
    }
  
    if (user.userId !== hostID) {
      alert("Only the host can send messages to the chatbot.");
      return;
    }
  
    try {
      const bot = await getllamaResponse(message);
      if (!bot || !bot.response || !bot.response.trim()) {
        console.error("Invalid chatbot response:", bot);
        return;
      }
  
      // Emit chatbot message through socket
      socketService.emit("send-chatbot-message", {
        roomCode,
        userID: user.userId,
        botresponse: bot.response.trim(),
        message: message.trim(),
      });
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };
  

  const handleTyping = (message) => {
    setNewMessage(message);

    socketService.emit("typing", { roomCode, userID, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit("typing", { roomCode, userID, isTyping: false });
    }, 1000);
  };

  const handleFileUpload = async (file) => {
    setImageToSend(file);
  };

  const handleSendImage = async () => {
    if (!imageToSend) return;

    const formData = new FormData();
    formData.append("image", imageToSend);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/upload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        const imageUrl = data.imageUrl;
        socketService.emit("send-image", { roomCode, userID, imageUrl });
        setImageToSend(null);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  console.log("CHAT:", chatmode);
  return (
    <div className="flex h-screen poppins-regular bg-gray-50">
      {joinedRoom && (
        <div className="w-1/6 bg-white p-6 border-r">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <MemberList
            roomName={roomName}
            roomCode={roomCode}
            roomPassword={roomPassword}
            List={members}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
      
{!joinedRoom && (
  <div className="flex flex-col h-full bg-white rounded-lg shadow-sm m-4 overflow-hidden">
    <div className="bg-gradient-to-r from-violet-500 to-purple-600 py-6 px-8">
      <h1 className="text-2xl font-bold text-white">Room Overview</h1>
      <p className="text-violet-100 mt-2">Create a new chat room or join an existing one</p>
    </div>

    <div className="p-8 flex flex-col items-center justify-center flex-1">
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Create Room Button */}
        <motion.button
          onClick={() => setIsCreateRoomModalOpen(true)}
          className="flex-1 bg-violet-600 text-white py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 text-lg font-medium"
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(104, 58, 183, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Room
        </motion.button>

        {/* Join Room Button */}
        <motion.button
          onClick={() => setIsJoinRoomModalOpen(true)}
          className="flex-1 bg-white text-violet-600 border-2 border-violet-200 py-4 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 text-lg font-medium"
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(149, 114, 252, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Join Room
        </motion.button>
      </motion.div>
    </div>
  </div>
)}
        

        <div className="flex-1 p-0 overflow-y-auto">
        <ChatMessages
  joinedRoom={joinedRoom}
  setChatMode={setChatMode}
  MemberMessages={messages} // Ensure it's an array
  isLoading={false}
 Renamed for clarity
/>

          <div ref={messageEndRef} />
        </div>

        {typingUsers.size > 0 && (
          <div className="px-6 py-2 text-sm text-gray-500">
            {Array.from(typingUsers).length === 1
              ? "Someone is typing..."
              : "Multiple people are typing..."}
          </div>
        )}

        {joinedRoom && chatmode === "member" && (
          <MessageInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
          />
        
        )}
      

        {joinedRoom && chatmode === "chatbot" && (
          <ChatbotMessageInput onSendChatMessage={handleChatBotMessage} />
        )}

       

        {imageToSend && (
          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Image ready to send: {imageToSend.name}
              </span>
              <button
                onClick={handleSendImage}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
              >
                Send Image
              </button>
              <button
                onClick={() => setImageToSend(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg min-w-[30%]">
            <h3 className="text-2xl font-semibold text-violet-800 mb-4">
              Create Room
            </h3>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full p-3 border rounded mt-2"
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={handleCreateRoom}
                className="bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreateRoomModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isJoinRoomModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg min-w-[30%]">
            <h3 className="text-2xl font-semibold text-violet-800 mb-4">
              Join Room
            </h3>
            <input
              type="text"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full p-3 border rounded mt-2"
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={handleJoinRoom}
                className="bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700"
              >
                Join
              </button>
              <button
                onClick={() => setIsJoinRoomModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
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

export default Room;
