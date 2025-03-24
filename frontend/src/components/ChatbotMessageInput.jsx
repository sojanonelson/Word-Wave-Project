import React, { useState } from 'react';
import {  Send } from 'lucide-react';

const ChatbotMessageInput = ({ onSendChatMessage }) => {
  const [message, setMessage] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendChatMessage(message);
      setMessage('');
    }
  };


  return (
    <div className="p-4 bg-white border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Asking any thing..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
          />
         
        
        </div>
        <button
          type="submit"
          className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors flex items-center justify-center w-12 h-12"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatbotMessageInput;