import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { getCurrentUser } from '../utils/auth';

export default function DialogflowChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your ArtisanHQ assistant. Ask me anything.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const user = getCurrentUser();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const res = await axios.post(`${API_URL}/api/dialogflow/detect-intent`, {
        message: input,
        userId: user.id
      });

      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your request.",
        sender: 'bot'
      }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-purple-700 p-3 rounded-t-lg">
            <h3 className="font-bold text-lg">ArtisanHQ Assistant</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-xl max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-right'
                      : 'bg-gray-700 text-left'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-600 bg-[#1a1a2e]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-purple-500"
            />
          </form>
        </div>
      )}
    </>
  );
}