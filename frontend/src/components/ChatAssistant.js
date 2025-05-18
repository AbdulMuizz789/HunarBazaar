import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function ChatAssistant() {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (inputMode === 'voice') {
      if(!SpeechRecognition){
        alert('Your browser does not support text-to-speech');
        return () => recognitionRef.current?.stop();
      }
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (event.results[0].isFinal) {
          handleSend(transcript, 'text');
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

    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setInputText(''); // Clear input field

    // Stop listening while bot processes
    if (modeToUse === 'voice') {
      recognitionRef.current?.stop();
    }

    try {
      const response = await axios.post(API_URL + '/api/dialogflow', {
        query: message,
        mode: 'text', // Assuming you're using text now
        sessionId: 'user-session-1',
      });

      const botMessage = response.data.text;
      setMessages(prev => [...prev, { text: botMessage, sender: 'bot' }]);

      if (modeToUse === 'voice') {
        const utterance = new SpeechSynthesisUtterance(botMessage);
        utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Google') || v.name.includes('Wavenet'));

        utterance.onend = () => {
          // Restart recognition only after bot finishes speaking
          recognitionRef.current?.start();
        };

        window.speechSynthesis.cancel(); // Stop any ongoing speech
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: 'An error occurred.', sender: 'bot' }]);
    }
  };


  return (
    <div className="fixed bottom-6 right-6 w-96 rounded-2xl shadow-lg bg-white border border-gray-200">
      <div className="p-4 overflow-y-auto max-h-96 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-right ml-auto' : 'bg-gray-100 text-left mr-auto'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center border-t border-gray-300 p-2">
        <button
          onClick={() => setInputMode(mode => mode === 'text' ? 'voice' : 'text')}
          className={`text-xl px-2 ${inputMode === 'voice' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          {inputMode === 'text' ? '🎤' : '⌨️'}
        </button>

        {inputMode === 'text' ? (
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1 mx-2"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend(inputText);
                setInputText('');
              }
            }}
          />
        ) : (
          <div className="text-gray-500 italic ml-2">Listening...</div>
        )}
      </div>
    </div>
  );
};
