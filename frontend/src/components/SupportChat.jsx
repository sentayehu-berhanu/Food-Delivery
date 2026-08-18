import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm FoodGo's virtual assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock bot response delay
    setTimeout(() => {
      generateBotResponse(userMessage.text.toLowerCase());
    }, 1500);
  };

  const generateBotResponse = (query) => {
    let botResponseText = "I'm sorry, I don't quite understand. Could you please rephrase?";

    if (query.includes('order') || query.includes('track') || query.includes('where')) {
      botResponseText = "You can track your active orders by navigating to the 'Orders' page from the main menu. Would you like a link to that page?";
    } else if (query.includes('cancel') || query.includes('refund')) {
      botResponseText = "I see you're asking about cancellations or refunds. Please note that orders can only be cancelled within 5 minutes of placing them. If you need a refund, I can connect you to a human agent.";
    } else if (query.includes('menu') || query.includes('food') || query.includes('hungry') || query.includes('pizza') || query.includes('burger') || query.includes('sushi') || query.includes('taco')) {
      botResponseText = `Oh, you're looking for ${query.includes('pizza') ? 'pizza' : query.includes('burger') ? 'burgers' : query.includes('sushi') ? 'sushi' : 'something delicious'}! We have lots of great options. Try searching in the top bar or use our AI Matchmaker on the home page!`;
    } else if (query.includes('hello') || query.includes('hi')) {
      botResponseText = "Hello! How can I assist you with your FoodGo experience today?";
    } else if (query.includes('human') || query.includes('agent')) {
      botResponseText = "Transferring you to a human agent... (Just kidding, this is a mock interface!)";
    }

    const botMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot'
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right" style={{ height: '500px', maxHeight: '80vh' }}>
          
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">FoodGo Support</h3>
                <p className="text-xs text-orange-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SupportChat;
