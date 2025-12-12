
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Loader2, Bot, Trash2, CheckCircle } from 'lucide-react';
import { chatWithDocument } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const CrafterBoy: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileData, setFileData] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'model',
                text: "Hi! I'm Crafter Boy! 🧒👓\nDrag and drop a PDF file here, and I'll read it for you. Then you can ask me anything about it!"
            }]);
        }
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && selected.type === 'application/pdf') {
            processFile(selected);
        } else {
            alert("Please upload a PDF file.");
        }
    };

    const processFile = (f: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(f);
            setFileData(reader.result as string);
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'model',
                text: `Awesome! I've loaded "${f.name}". What do you want to know?`
            }]);
        };
        reader.readAsDataURL(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const selected = e.dataTransfer.files?.[0];
        if (selected && selected.type === 'application/pdf') {
            processFile(selected);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!fileData) {
            alert("Please upload a PDF first!");
            return;
        }

        const userMsg: Message = { id: uuidv4(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Convert history to format expected by service if needed, 
            // but for now we rely on the service to construct the context from the array we pass
            const history = messages.map(m => ({ role: m.role, text: m.text }));
            const responseText = await chatWithDocument(userMsg.text, fileData, history);
            
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'model',
                text: responseText
            }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'model',
                text: "My brain hurts! I couldn't answer that right now."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl shadow-xl overflow-hidden border border-indigo-200 animate-slide-in">
            
            {/* Header */}
            <div className="bg-white p-4 border-b border-indigo-100 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg border-2 border-indigo-200">
                        👦
                    </div>
                    <div>
                        <h2 className="font-black text-indigo-900 text-lg">Crafter Boy</h2>
                        <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">PDF Genius AI</p>
                    </div>
                </div>
                {file && (
                    <button onClick={() => { setFile(null); setFileData(null); setMessages([]); }} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-full flex items-center gap-1 font-bold transition-colors">
                        <Trash2 size={12}/> Clear PDF
                    </button>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* File Drop / View */}
                {!fileData ? (
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="flex-1 m-4 border-4 border-dashed border-indigo-200 rounded-3xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                    >
                        <div className="bg-indigo-100 p-6 rounded-full mb-4 animate-bounce">
                            <Upload size={48} className="text-indigo-600"/>
                        </div>
                        <h3 className="text-xl font-bold text-indigo-800 mb-2">Drop PDF Here</h3>
                        <p className="text-indigo-400 text-sm mb-6">or click to browse</p>
                        <label className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">
                            Select Document
                            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange}/>
                        </label>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${msg.role === 'user' ? 'bg-indigo-900 text-white' : 'bg-white text-indigo-600 border border-indigo-100'}`}>
                                        {msg.role === 'user' ? 'You' : 'CB'}
                                    </div>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-indigo-900 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-indigo-400 text-xs ml-12 animate-pulse">
                                    <Loader2 size={14} className="animate-spin"/> Reading document...
                                </div>
                            )}
                            <div ref={scrollRef}></div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-indigo-50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold text-indigo-600">
                                    <FileText size={12}/> {file?.name}
                                    <CheckCircle size={12} className="text-green-500 fill-current"/>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask Crafter Boy about this PDF..."
                                    className="flex-1 bg-indigo-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200 text-indigo-900 placeholder-indigo-300"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={isLoading || !input}
                                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                                >
                                    <Send size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrafterBoy;
