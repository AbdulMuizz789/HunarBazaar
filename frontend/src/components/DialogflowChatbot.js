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

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      // Get response from Dialogflow
      const res = await axios.post(`${API_URL}/api/dialogflow/detect-intent`, {
        message: input,
        userId: user.id // Replace with actual user ID
      });

      // Add bot reply
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
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-500 text-white p-3 rounded-t-lg">
            <h3 className="font-bold">ArtisanHQ Assistant</h3>
          </div>
          <div className="flex-1 p-3 overflow-y-auto h-64">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full border p-2 rounded"
            />
          </form>
        </div>
      )}
    </>
  );
}