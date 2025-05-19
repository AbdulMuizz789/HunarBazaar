import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your ArtisanHQ assistant. Ask me anything.", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (inputMode === 'voice') {
      if (!SpeechRecognition) {
        alert('Your browser does not support text-to-speech');
        return () => recognitionRef.current?.stop();
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        if (event.results[event.results.length - 1].isFinal) {
          const finalTranscript = event.results[event.results.length - 1][0].transcript;
          recognitionRef.current.stop();
          handleSend(finalTranscript.trim(), 'voice');
        }
      };

      recognitionRef.current.start();
    } else {
      recognitionRef.current?.stop();
    }

    return () => recognitionRef.current?.stop();
  }, [inputMode]);

  const handleSend = async (message, overrideMode = null) => {
    if (!message.trim()) return;

    const modeToUse = overrideMode || inputMode;
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setInputText('');

    if (modeToUse === 'voice') {
      recognitionRef.current?.stop();
    }

    try {
      const response = await axios.post(API_URL + '/api/dialogflow', {
        query: message,
        mode: 'text',
        sessionId: 'user-session-1',
      });

      const botMessage = response.data.text;
      setMessages(prev => [...prev, { text: botMessage, sender: 'bot' }]);

      if (modeToUse === 'voice') {
        const utterance = new SpeechSynthesisUtterance(botMessage);
        utterance.voice = speechSynthesis.getVoices().find(v =>
          v.name.includes('Google') || v.name.includes('Wavenet')
        );
        utterance.onend = () => {
          recognitionRef.current?.start();
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: 'An error occurred.', sender: 'bot' }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-purple-700 p-3 rounded-t-lg">
            <h3 className="font-bold text-lg">ArtisanHQ Assistant</h3>
          </div>

          {/* Chat messages */}
          <div className="p-4 overflow-y-auto max-h-96 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 ml-auto text-right'
                    : 'bg-gray-700 mr-auto text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input section */}
          <div className="flex items-center border-t border-gray-600 p-2 bg-[#1a1a2e]">
            <button
              onClick={() => setInputMode((mode) => (mode === 'text' ? 'voice' : 'text'))}
              className={`text-2xl px-2 ${inputMode === 'voice' ? 'text-purple-400' : 'text-gray-400'} transition-colors`}
              title="Toggle input mode"
            >
              {inputMode === 'text' ? '🎤' : '⌨️'}
            </button>

            {inputMode === 'text' ? (
              <input
                type="text"
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1 mx-2 focus:outline-none focus:ring focus:ring-purple-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(inputText);
                    setInputText('');
                  }
                }}
                placeholder="Type a message"
              />
            ) : (
              <div className="text-gray-400 italic ml-2 animate-pulse">Listening...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}