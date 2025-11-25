import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage, Gallery, ContactInfo, SiteContent } from '../types';
import { Send, X, Loader2, Sparkles } from 'lucide-react';

interface ChatWidgetProps {
  galleries: Gallery[];
  contactInfo: ContactInfo;
  siteContent: SiteContent;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ galleries, contactInfo, siteContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Welcome to the gallery. How may I assist you?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const geminiRef = useRef<GeminiService>(new GeminiService());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session when widget opens or data changes
  useEffect(() => {
    geminiRef.current.startChat(galleries, contactInfo, siteContent);
  }, [galleries, contactInfo, siteContent]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await geminiRef.current.sendMessage(userMsg.text);
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 ${
          isOpen ? 'bg-zinc-800 text-zinc-400 rotate-90 scale-0 opacity-0' : 'bg-white text-black scale-100 opacity-100 hover:scale-105'
        }`}
        aria-label="Open Chat"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Interface */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="text-zinc-100" size={18} />
            <h3 className="font-medium text-zinc-100">Gallery Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-100 text-black rounded-br-none' 
                    : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-2 border border-zinc-700">
                <Loader2 size={16} className="animate-spin text-zinc-400" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the art..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-white rounded-full text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
