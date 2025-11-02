import React from 'react';
import Chatbot from '../components/Chatbot';

const ChatbotPage = () => {
  return (
    <div className="chatbot-page">
      <h2>AI Health Assistant</h2>
      <p>Ask me anything about natural health, remedies, or general wellness questions!</p>
      <Chatbot />
    </div>
  );
};

export default ChatbotPage;
