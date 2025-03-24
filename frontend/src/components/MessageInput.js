import React, { useState, useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 bg-white border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600 pr-10"
          />
          <button
            type="button"
            onClick={handleAttachmentClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
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

export default MessageInput;