import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../config';

const socket = io(API_URL, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false,
});

export default function Chat({ gigId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`${API_URL}/api/messages?gigId=${gigId}`);
      setMessages(res?.data);
    };
    fetchMessages();

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      gigId,
      senderId: currentUser.id,
      text: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white rounded-lg shadow-lg h-96 flex flex-col">
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender._id === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-xl text-sm shadow ${
                msg.sender._id === currentUser.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-700 bg-gray-900 rounded-b-lg">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-r-lg text-white font-semibold transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}