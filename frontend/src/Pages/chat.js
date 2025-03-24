import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SOCKET_URL}`);

const Chat = ({ roomCode, userID }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.emit('join-room', { roomCode, userID }, (response) => {
      if (response.success) {
        console.log('Joined room:', roomCode);
      } else {
        console.error('Failed to join room:', response.message);
      }
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('updateRoomMembers', (members) => {
      setMembers(members);
    });

    return () => {
      socket.emit('leave-room', { roomCode, userID });
      socket.off('receiveMessage');
      socket.off('updateRoomMembers');
    };
  }, [roomCode, userID]);

  const sendMessage = () => {
    socket.emit('sendMessage', { roomCode, message, userID }, (response) => {
      if (response.success) {
        setMessage('');
      } else {
        console.error('Failed to send message:', response.message);
      }
    });
  };

  return (
    <div>
      <div>
        <h2>Members</h2>
        <ul>
          {members.map((member) => (
            <li key={member._id}>
              {member.name} {member.isOnline ? '(Online)' : '(Offline)'}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.name}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
