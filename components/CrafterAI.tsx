
import React, { useState, useRef, useEffect } from 'react';
import { chatWithCrafter, generateCrafterGif } from '../services/geminiService';
import { ChatMessage } from '../services/types';
import { Send, Image as ImageIcon, Loader2, Copy, Code2, Calculator, BookOpen, Bot, BrainCircuit, Check, ChefHat, Plane, Dumbbell, Gamepad, Video, Film, Wand2, Sigma, Globe, BookA, Languages, Volume2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CrafterAIProps {
    persona?: {
        name: string;
        role: string;
        avatar: string;
    };
    onUse?: () => void;
}

const CrafterAI: React.FC<CrafterAIProps> = ({ persona, onUse }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'chat' | 'code' | 'image' | 'gif' | 'math' | 'malayalam' | 'grammar' | 'translator'>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (messages.length === 0) {
          let greeting = "Hello! I am Crafter AI by Crafter Studio. I can generate images, write code, create GIFs, solve math problems, or just chat.";
          if (persona) {
              greeting = `Hello! I am ${persona.name}. ${persona.role}. How can I help you today?`;
          }
          setMessages([{
            id: 'welcome',
            role: 'model',
            text: greeting,
            timestamp: Date.now()
          }]);
      }
  }, [persona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        if (mode !== 'image') setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    
    if (onUse) onUse();

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const tempImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      if (mode === 'gif') {
          const videoData = await generateCrafterGif(userMsg.text);
          const botMsg: ChatMessage = {
              id: uuidv4(),
              role: 'model',
              text: videoData ? "I've created a GIF for you!" : "Sorry, I couldn't generate the GIF.",
              video: videoData || undefined,
              timestamp: Date.now()
          };
          setMessages(prev => [...prev, botMsg]);
      } else {
          let contextMessage = userMsg.text;
          if (persona && mode === 'chat') {
              contextMessage = `Act as ${persona.name}, who is ${persona.role}. Response to: ${userMsg.text}`;
          }

          const response = await chatWithCrafter(contextMessage, tempImage || undefined, mode);

          const botMsg: ChatMessage = {
            id: uuidv4(),
            role: 'model',
            text: response.text,
            image: response.image,
            timestamp: Date.now()
          };

          setMessages(prev => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
          id: uuidv4(),
          role: 'model',
          text: "An error occurred while processing your request.",
          timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
      }
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const content = part.slice(3, -3).replace(/^[a-z]+\n/, ''); 
        const uniqueId = `code-${index}-${content.substring(0, 10)}`;
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-lg">
             <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs text-gray-400">
                <span className="font-mono font-semibold text-gray-300">Snippet</span>
                <button 
                  onClick={() => handleCopy(content, uniqueId)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
                >
                    {copiedId === uniqueId ? (
                        <>
                            <Check size={12} className="text-green-400" /> <span className="text-green-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} /> Copy
                        </>
                    )}
                </button>
             </div>
             <pre className="p-4 text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {content}
             </pre>
          </div>
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  const getPersonaIcon = () => {
      if (!persona) return <BrainCircuit className={mode === 'code' ? 'text-green-400' : 'text-purple-600'} size={24} />;
      if (persona.name.includes('Chef')) return <ChefHat className="text-orange-500" size={24} />;
      if (persona.name.includes('Travel')) return <Plane className="text-blue-500" size={24} />;
      if (persona.name.includes('Fitness')) return <Dumbbell className="text-red-500" size={24} />;
      if (persona.name.includes('Gamer')) return <Gamepad className="text-purple-500" size={24} />;
      if (persona.name.includes('Mather')) return <Sigma className="text-indigo-500" size={24} />;
      return <Bot className="text-pink-500" size={24} />;
  }

  const getModeLabel = () => {
      switch(mode) {
          case 'code': return 'Dev Mode';
          case 'image': return 'Image Studio';
          case 'gif': return 'GIF Maker';
          case 'math': return 'Math Solver';
          case 'malayalam': return 'Malayalam Mode';
          case 'grammar': return 'Grammar Tutor';
          case 'translator': return 'Universal Translator';
          default: return 'Assistant Online';
      }
  }

  const getModeColor = () => {
      switch(mode) {
          case 'code': return 'bg-green-500';
          case 'image': return 'bg-pink-500';
          case 'gif': return 'bg-orange-500';
          case 'math': return 'bg-indigo-500';
          case 'malayalam': return 'bg-teal-500';
          case 'grammar': return 'bg-blue-500';
          case 'translator': return 'bg-yellow-500';
          default: return 'bg-purple-500';
      }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-xl shadow-sm transition-colors ${mode !== 'chat' ? 'bg-gray-900' : 'bg-white'}`}>
             {getPersonaIcon()}
           </div>
           <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                {persona ? persona.name : 'Crafter AI'}
                {mode !== 'chat' && <span className={`px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-mono tracking-wider uppercase border border-gray-700`}>{getModeLabel()}</span>}
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                 <span className={`w-2 h-2 rounded-full animate-pulse ${getModeColor()}`}></span>
                 {persona ? persona.role.substring(0, 30) + '...' : getModeLabel()}
              </p>
           </div>
        </div>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {!persona && (
                <>
                    <button onClick={() => setMode(mode === 'code' ? 'chat' : 'code')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'code' ? 'bg-gray-900 text-green-400 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Code Mode"><Code2 size={20}/></button>
                    <button onClick={() => setMode(mode === 'image' ? 'chat' : 'image')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'image' ? 'bg-pink-100 text-pink-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Image Generator"><Wand2 size={20}/></button>
                    <button onClick={() => setMode(mode === 'gif' ? 'chat' : 'gif')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'gif' ? 'bg-orange-100 text-orange-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="GIF Maker"><Film size={20}/></button>
                    <button onClick={() => setMode(mode === 'math' ? 'chat' : 'math')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'math' ? 'bg-indigo-100 text-indigo-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Math Solver"><Calculator size={20}/></button>
                    <button onClick={() => setMode(mode === 'malayalam' ? 'chat' : 'malayalam')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'malayalam' ? 'bg-teal-100 text-teal-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Malayalam Mode"><Globe size={20}/></button>
                    <button onClick={() => setMode(mode === 'grammar' ? 'chat' : 'grammar')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'grammar' ? 'bg-blue-100 text-blue-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Grammar Teacher"><BookA size={20}/></button>
                    <button onClick={() => setMode(mode === 'translator' ? 'chat' : 'translator')} className={`p-2 rounded-xl transition-all duration-300 ${mode === 'translator' ? 'bg-yellow-100 text-yellow-600 shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'}`} title="Translator"><Languages size={20}/></button>
                </>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#FDFDFD]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-in`}>
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-transparent overflow-hidden
              ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gradient-to-tr from-secondary to-primary text-white shadow-sm'}
            `}>
              {msg.role === 'user' ? 'U' : (persona ? <img src={persona.avatar} alt="AI" className="w-full h-full object-cover"/> : <Bot size={20} />)}
            </div>

            <div className={`
               max-w-[85%] rounded-2xl p-4 shadow-sm transition-all relative group
               ${msg.role === 'user' 
                 ? 'bg-gray-900 text-white rounded-tr-none' 
                 : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-md'}
            `}>
               {msg.role === 'model' && (
                   <button onClick={() => speakText(msg.text)} className="absolute -top-2 -right-2 p-1.5 bg-gray-100 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600 shadow-sm">
                       <Volume2 size={12}/>
                   </button>
               )}
               {msg.image && (
                 <div className="mb-3 relative group">
                    <img src={msg.image} alt="Upload/Generated" className="rounded-lg max-w-full border border-gray-200" />
                    <button onClick={() => { const link = document.createElement('a'); link.href = msg.image!; link.download = `crafter-ai-${Date.now()}.png`; link.click(); }} className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Wand2 size={16}/>
                    </button>
                 </div>
               )}
               {msg.video && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 bg-black">
                      <video src={msg.video} autoPlay loop muted playsInline className="w-full h-auto max-w-full" />
                  </div>
               )}
               <div className="text-sm leading-relaxed">
                 {renderMessageContent(msg.text)}
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500 text-sm ml-12 bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-gray-100 animate-pulse">
            <Loader2 className="animate-spin text-primary" size={16} />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
         {selectedImage && (
             <div className="mb-2 relative inline-block animate-slide-in">
                 <img src={selectedImage} alt="Preview" className="h-20 rounded-xl border border-gray-200 shadow-sm" />
                 <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"><Check size={12}/></button>
             </div>
         )}
         <div className={`flex gap-2 items-end bg-gray-50 p-2 rounded-2xl border transition-all duration-300 focus-within:ring-2 
            ${mode === 'code' ? 'focus-within:ring-green-500/20 border-green-500/30' : 
              mode === 'translator' ? 'focus-within:ring-yellow-500/20 border-yellow-500/30' :
              'focus-within:ring-primary/20 border-gray-200'}`}>
            
            <label className="p-2.5 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-200 rounded-xl transition-colors">
               <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
               <ImageIcon size={20} />
            </label>
            <textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
               placeholder={mode === 'translator' ? 'Enter text to translate...' : "Message Crafter AI..."}
               className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-2.5 text-gray-700 font-medium"
               rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`p-2.5 text-white rounded-xl disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-95 bg-black`}
            >
               {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
         </div>
         <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">Crafter AI powered by CRAFTER STODIO</p>
      </div>
    </div>
  );
};

export default CrafterAI;
