
import React, { useState, useRef, useEffect } from 'react';
import { chatWithCrafter } from '../services/geminiService';
import { ChatMessage } from '../services/types';
import { Send, HelpCircle, Loader2, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const HelperAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Greeting
    if (messages.length === 0) {
        setMessages([{
            id: 'welcome',
            role: 'model',
            text: "Hi! I am the Helper AI. I can tell you everything about Crafty Notes.\n\nAsk me about:\n- How to install Apps\n- Changing Themes (like the Christmas Theme!)\n- Using the Cloud\n- Buying things in Marketplace",
            timestamp: Date.now()
        }]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepend context about the app
    const context = `
      You are Helper AI, a dedicated guide for Crafty Notes.
      Your knowledge base:
      - Crafty Notes is a powerful OS-like note app by Crafter Studio (Sachu/Rahul V).
      - Sidebar: Contains Notes, Cloud, Theme Studio, Bin, Helper AI, Games, etc.
      - Marketplace: You can "Get" free AI personas, Themes, Fonts, Logos, Games.
      - Installing: Click "Get" in Marketplace. It appears on the Sidebar.
      - Uninstalling: Click the trash icon next to the app in Sidebar or Marketplace.
      - Theme Studio: Change themes (Christmas, Cyberpunk, etc.), Fonts, and Logos (Superman, Santa).
      - Cloud: 2TB free storage. Upgrade to 13TB "Max" for free.
      - Crafter AI: Can generate images, code, GIFs, and solve math.
      - Christmas Event: Go to Theme Studio > Select "Christmas" theme for Snowfall effect!
      - Games: Euro Truck Pixel, San Andreas Mini.
      
      User Question: ${userMsg.text}
    `;

    try {
      const response = await chatWithCrafter(context, undefined, 'chat');
      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: response.text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
          id: uuidv4(),
          role: 'model',
          text: "I'm having trouble connecting to the manual. Try again!",
          timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-4 bg-cyan-50 border-b border-cyan-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-600 text-white rounded-xl">
                    <HelpCircle size={24}/>
                </div>
                <div>
                    <h2 className="font-bold text-gray-800">Helper AI</h2>
                    <p className="text-xs text-gray-500">Your Guide to Crafty Notes</p>
                </div>
            </div>
            <button className="p-2 hover:bg-white rounded-full transition-colors text-cyan-600">
                <Info size={20}/>
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-transparent
                        ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-cyan-600 text-white'}
                    `}>
                        {msg.role === 'user' ? 'U' : <HelpCircle size={16}/>}
                    </div>
                    <div className={`
                        max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}
                    `}>
                        {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs ml-12">
                    <Loader2 size={12} className="animate-spin"/> Checking the manual...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-cyan-200 transition-all">
                 <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="How do I change the theme?"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 font-medium"
                 />
                 <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                 >
                     <Send size={16}/>
                 </button>
             </div>
        </div>
    </div>
  );
};

export default HelperAI;
