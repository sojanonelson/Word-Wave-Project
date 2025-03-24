import React, { useState } from "react";
import { getllamaResponse } from "../services/chatBotService";

const ChatMessages = ({ joinedRoom, MemberMessages, isLoading, setChatMode, updateMessages  }) => {
  const currentUserId = localStorage.getItem("userID");
  const [mode, setMode] = useState("member");
  const [inputMessage, setInputMessage] = useState("");

  const filteredMessages = MemberMessages.filter((message) => {
    if (mode === "chatbot") {
      return message.isChatbot || (message.userID === currentUserId && message.isChatbotMessage);
    } else {
      return !message.isChatbot && !message.isChatbotMessage;
    }
  });

  // const filteredMessages = mode === "chatbot"
  // ? MemberMessages.filter(msg => msg.isChatbot || msg.isChatbotMessage)
  // : MemberMessages.filter(msg => !msg.isChatbot && !msg.isChatbotMessage);



  const handleSetMode = (newMode) => {
    setMode(newMode);
    setChatMode(newMode);
  };

  const sendMessage = async () => {
    console.log("~sendMessage")
    if (!inputMessage.trim()) return;
  
    const userMessage = {
      userID: currentUserId,
      content: inputMessage,
      isChatbotMessage: true,
    };
  
    updateMessages((prev) => [...prev, userMessage]);
  
    // Show "Typing..." message before chatbot responds
    const typingMessage = {
      userID: "chatbot",
      content: "Typing...",
      isChatbot: true,
    };
    updateMessages((prev) => [...prev, typingMessage]);
  
    const chatbotResponse = await getllamaResponse(inputMessage);
  
    // Remove "Typing..." and add the actual response
    updateMessages((prev) => [
      ...prev.filter((msg) => msg.content !== "Typing..."),
      {
        userID: "chatbot",
        content: chatbotResponse,
        isChatbot: true,
      },
    ]);
  
    setInputMessage("");
  };
  



  return (
    <div className="flex flex-col h-full relative">
      {joinedRoom && (
        <div className="sticky top-0 z-10 bg-white pb-4 pt-2">
          <div className="flex justify-center">
            <button
              onClick={() => handleSetMode("chatbot")}
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                mode === "chatbot" ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Chatbot Mode
            </button>
            <button
              onClick={() => handleSetMode("member")}
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                mode === "member" ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Member Messages
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2 pb-4">
          {filteredMessages.map((message, index) => {
            const isCurrentUser = message.userID === currentUserId;

            if (message.system) {
              return (
                <div key={index} className="flex justify-center">
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm text-gray-500">{message.content}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isCurrentUser
                      ? "bg-violet-600 text-white"
                      : message.isChatbot
                      ? "bg-yellow-200 text-gray-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {!isCurrentUser && !message.isChatbot && <p className="text-sm font-semibold">{message.name}</p>}
                  <p>{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Box for Chatbot */}
      {/* {mode === "chatbot" && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button onClick={sendMessage} className="bg-violet-600 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ChatMessages;
