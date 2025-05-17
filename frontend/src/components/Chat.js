import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../config';
const socket = io(API_URL, {
  transports: ['websocket'], 
  withCredentials: true,
  autoConnect: false 
});

export default function Chat({ gigId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`${API_URL}/api/messages?gigId=${gigId}`);
      setMessages(res?.data);
    };
    fetchMessages();

    // Socket.IO setup
    socket.connect();
    socket.emit('join_gig', gigId);
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [gigId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      gigId: gigId,
      senderId: currentUser.id,
      text: newMessage
    };

    // Emit to server
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="border rounded-lg h-96 flex flex-col">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`mb-3 ${msg.sender._id === currentUser.id ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-block p-2 rounded-lg ${msg.sender._id === currentUser.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {`${msg.sender.name} ${new Date(msg.createdAt).toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-l"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 rounded-r"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}