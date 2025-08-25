import React, { useState } from 'react';
import { getAIResponse } from '../services/chatService';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newChat = { user: userInput, ai: '' };
    setChatHistory((prev) => [...prev, newChat]);
    setUserInput('');

    try {
      const aiResponse = await getAIResponse(userInput);
      newChat.ai = aiResponse;
      setChatHistory((prev) => [...prev.slice(0, -1), newChat]); // Update the last chat entry with AI response
    } catch (error) {
      toast.error('Error fetching AI response. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <div className="user-message">{chat.user}</div>
            <div className="ai-message">{chat.ai}</div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask me anything..."
        className="chat-input"
      />
      <button onClick={handleSend} className="send-button">Send</button>
    </div>
  );
};

export default Chat;
