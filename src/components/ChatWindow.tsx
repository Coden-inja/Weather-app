import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWindowProps {
  weatherData: any;
}

export default function ChatWindow({ weatherData }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you with weather-related questions and general assistance. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const typewriterEffect = (text: string, callback: () => void) => {
    setIsTyping(true);
    setTypewriterText('');
    let index = 0;
    
    // Minimal change: Buffer the first word or first 10 characters
    const firstSpaceIndex = text.indexOf(' ');
    const initialBufferLength = firstSpaceIndex !== -1 ? firstSpaceIndex + 1 : Math.min(text.length, 10);

    setTypewriterText(text.substring(0, initialBufferLength));
    index = initialBufferLength;

    const typeNext = () => {
      if (index < text.length) {
        setTypewriterText(prev => prev + text[index]);
        index++;
        setTimeout(typeNext, 30);
      } else {
        setIsTyping(false);
        callback();
      }
    };
    // Add a slight delay before starting the character-by-character typing
    setTimeout(typeNext, 100);
    
    typeNext();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get last 10 messages for context
      const recentMessages = messages.slice(-10);
      const conversationContext = recentMessages
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      const fullMessage = `Previous conversation:\n${conversationContext}\nUser: ${inputMessage}`;

      const response = await axios.post('/api/chat', {
        message: fullMessage,
        weatherData: weatherData
      });

      const aiResponse = response.data.response;
      
      // Add placeholder message for typewriter effect
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Start typewriter effect
      typewriterEffect(aiResponse, () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, text: aiResponse }
              : msg
          )
        );
        setTypewriterText('');
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-300" />
          AI Weather Assistant
        </h3>
        <p className="text-gray-300 mt-1">Ask me anything about the weather or general questions!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.isUser 
                ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                : 'bg-gradient-to-r from-purple-400 to-pink-500'
            }`}>
              {message.isUser ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              message.isUser
                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30'
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
            }`}>
              <p className="text-white leading-relaxed">
                {message.id === messages[messages.length - 1]?.id && isTyping && !message.isUser
                  ? typewriterText + '|'
                  : message.text}
              </p>
              <span className="text-gray-400 text-xs mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && !isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about the weather or anything else..."
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none min-h-[50px] max-h-[120px]"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-200 flex items-center justify-center min-w-[50px]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}