import React, { useState , useEffect} from "react";
import { Crown, Copy, Bot, MessageCircle, ChevronDown, Check } from "lucide-react";
import NetworkStatus from "../components/NetworkStatus";
import MemberList from "../components/MemberList";
import ChatMessages from "../components/ChatMessages";
import MessageInput from "../components/MessageInput";
import { roomData } from "../Data/roomData";
import { llamaResponse } from "../services/chatBotService";
import { motion } from "framer-motion";
import { getRoomMemebrs } from "../services/roomService";

const StudyRoomInterface = () => {
  const [message, setMessage] = useState("");
  const [chatMode, setChatMode] = useState("ai"); // Track whether we're in AI or Member chat mode
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [members, setMembers] = useState([]);

  // State for AI messages
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: "AI Assistant",
      content: "Hello! How can I help with your machine learning study session today?",
    },
  ]);

  // State for Member messages
  const [memberMessages, setMemberMessages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRoomMemebrs()
        console.log("response", response);
        setMembers(response);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchData();
  }, []);


  // Function to handle AI and user message processing
  const handleResponse = async () => {
    
    if (!message.trim()) return;

    // Add the user message to state to render in the UI
    const updatedAiMessages = [
      ...aiMessages,
      { id: aiMessages.length + 1, sender: "User", image:roomData.host.image , content: message },
    ];
    setAiMessages(updatedAiMessages);

    // Log AI message state in real-time
    // console.log("AI Messages:", updatedAiMessages);
    
    if (chatMode === "ai") {
      // Only process AI response when in AI mode
      let botResponse = "This is an AI-generated response."; 

      if (selectedModel === "llama3.2") {
        setMessage('');
        setIsLoading(true);
        const llamaResp = await llamaResponse(message);
        botResponse = llamaResp.response;
        setResponse(botResponse);
        setIsLoading(false);
        // console.log("AI Response (llama3.2):", botResponse);
      } else {
        console.log("AI Response (gpt-3):", botResponse);
        setIsLoading(false);
      }

      // Update the AI messages with the response
      const updatedAiMessagesWithBot = [
        ...updatedAiMessages,
        { id: updatedAiMessages.length + 1, sender: "AI Assistant", content: botResponse },
      ];
      setAiMessages(updatedAiMessagesWithBot);

      // Log updated AI messages
      console.log("🤖AI Messages:", updatedAiMessagesWithBot);
    } else {
      // If in 'members' chat mode, just handle the member message
      handleMemberMessage(message);
    }

    // Clear the input field after sending a message
    setMessage("");
    setIsLoading(false);
  };

  // Function to handle member messages (for group chats, etc.)
  const handleMemberMessage = (message) => {
    if (!message.trim()) return;

    // Save member message to state
    const newMemberMessage = {
      id: memberMessages.length + 1,
      sender: "rahul", // This would be dynamically set based on the member sending the message
      content: message,
      image: roomData.members[2].image,
    };
    setMemberMessages([...memberMessages, newMemberMessage]);

    // Log the member message state in real-time
    console.log("💬Member Messages:", [...memberMessages, newMemberMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with member list */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Room Info */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold truncate">{roomData.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <span>Room Code:</span>
            <code className="bg-gray-100 px-2 py-1 rounded">{roomData.code}</code>
            <button className="text-blue-600 hover:text-blue-800">
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Host Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={roomData.host.image}
              alt={roomData.host.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{roomData.host.name}</span>
                <Crown size={16} className="text-yellow-500" />
              </div>
              <span className="text-sm text-gray-600">Host</span>
            </div>
          </div>
        </div>

        {/* Members List */}
        <MemberList members={members} />

        {/* Connection Status */}
        <NetworkStatus />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Toggle Header */}
        <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex justify-center gap-2">
        <motion.button
          onClick={() => setChatMode("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            chatMode === "ai"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Bot size={20} />
          AI Chat
        </motion.button>

        <motion.button
          onClick={() => setChatMode("members")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            chatMode === "members"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MessageCircle size={20} />
          Member Chat
        </motion.button>
      </div>
    </div>

        {/* Chat Messages */}
        <ChatMessages
          messages={chatMode === "ai" ? aiMessages : memberMessages}
          chatMode={chatMode}
          members={roomData.members}
          isLoading={isLoading}
        />

        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          chatMode={chatMode}
          isLoading={isLoading}
          handleResponse={handleResponse}
          handleMemberMessage={handleMemberMessage}
        />
      </div>
    </div>
  );
};

export default StudyRoomInterface;
