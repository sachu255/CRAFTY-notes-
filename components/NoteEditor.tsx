
import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteColor, AITask, MarketItem, AppSettings } from '../services/types';
import { COLORS } from '../constants';
import { processTextWithAI } from '../services/geminiService';
import { 
  X, Palette, Sparkles, Clock, Calendar, MoreVertical, Check, ChevronDown, Loader2, Tag, Plus, Copy, AlignLeft, Lock, Unlock, Maximize2, Minimize2, Smile, Mic, Volume2, Quote, CheckSquare, AlignJustify, Heart, Download, PenTool, Eraser, Trash2, Printer, FileText, Search, Zap, Flame, StopCircle, Play, Mic2, Highlighter, Grid, Code, Save, Eye, EyeOff, FileCode, Wand2
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
  settings?: AppSettings;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onClose, onSave, settings }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [stickers, setStickers] = useState<string[]>(note.stickers || []);
  const [drawings, setDrawings] = useState<string[]>(note.drawings || []);
  const [audioClips, setAudioClips] = useState<string[]>(note.audio || []);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite || false);
  const [noteType, setNoteType] = useState<'text' | 'checklist'>(note.type || 'text');
  const [texture, setTexture] = useState<'none'|'grid'|'lines'|'dots'>(note.texture || 'none');
  const [isSaving, setIsSaving] = useState(false);
  const [readMode, setReadMode] = useState(false);
  
  // Lock State
  const [isLocked, setIsLocked] = useState(note.locked || false);
  const [password, setPassword] = useState(note.password || '');
  
  // AI States
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showSmartTools, setShowSmartTools] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // Drawing State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // View State
  const [isMaximized, setIsMaximized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const stickerPickerRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<any>(null);

  // Sync state with prop updates (Important for fixes)
  useEffect(() => {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setTags(note.tags || []);
      setStickers(note.stickers || []);
      setDrawings(note.drawings || []);
      setAudioClips(note.audio || []);
      setIsFavorite(note.isFavorite || false);
      setNoteType(note.type || 'text');
      setTexture(note.texture || 'none');
      setIsLocked(note.locked || false);
      setPassword(note.password || '');
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) setShowAIMenu(false);
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) setShowColorPicker(false);
      if (stickerPickerRef.current && !stickerPickerRef.current.contains(event.target as Node)) setShowStickerPicker(false);
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) setShowSmartTools(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto Save Logic
  useEffect(() => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (readMode) return;
      setIsSaving(true);
      autoSaveTimerRef.current = setTimeout(() => {
          setIsSaving(false);
      }, 1000);
  }, [title, content, color, tags, readMode]);

  const handleSave = () => {
    onSave({
      ...note,
      title,
      content,
      color,
      tags,
      stickers,
      drawings,
      audio: audioClips,
      updatedAt: Date.now(),
      locked: isLocked,
      password: password,
      isFavorite,
      type: noteType,
      texture
    });
    onClose();
  };

  const handleToggleLock = () => {
      if (isLocked) {
          const inputPass = prompt("Enter current password to unlock:");
          if (inputPass === password) {
              setIsLocked(false); setPassword(''); alert("Note unlocked!");
          } else if (inputPass !== null) alert("Incorrect password.");
      } else {
          const newPass = prompt("Create a password for this note:");
          if (newPass && newPass.trim() !== '') {
              setPassword(newPass); setIsLocked(true); alert("Note locked!");
          }
      }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleAIAction = async (task: AITask) => {
    if (!content.trim()) return;
    setIsProcessingAI(true);
    setShowAIMenu(false);
    setSummary(null); 
    try {
      const result = await processTextWithAI(content, task);
      if (task === AITask.Summarize) setSummary(result);
      else setContent(result);
    } catch (error) { alert("AI Error"); } finally { setIsProcessingAI(false); }
  };

  const handleMagicExpand = async () => {
      const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
      if(!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) {
          alert("Please select some text to expand.");
          return;
      }
      const selected = content.substring(start, end);
      setIsProcessingAI(true);
      try {
          const result = await processTextWithAI(selected, AITask.ContinueWriting);
          const before = content.substring(0, start);
          const after = content.substring(end);
          setContent(before + result + after);
      } catch(e) { alert("AI Error"); } finally { setIsProcessingAI(false); }
  };

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          const rect = canvas.getBoundingClientRect();
          // Need to account for scaling if CSS size != attribute size
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          ctx.beginPath();
          ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      }
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
          ctx.stroke();
      }
  };
  const stopDrawing = () => setIsDrawing(false);
  const saveDrawing = () => {
      if (canvasRef.current) {
          setDrawings([...drawings, canvasRef.current.toDataURL()]);
          setShowDrawModal(false);
      }
  };

  // Audio Logic
  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];
          
          recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
          recorder.onstop = () => {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                  setAudioClips([...audioClips, reader.result as string]);
              };
          };
          recorder.start();
          setIsRecording(true);
      } catch (e) {
          alert("Microphone access denied.");
      }
  };
  const stopRecording = () => {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
  };

  // Smart Tools
  const analyzeSentiment = () => {
      const positiveWords = ['good', 'happy', 'great', 'awesome', 'love', 'best'];
      const negativeWords = ['bad', 'sad', 'hate', 'worst', 'awful', 'angry'];
      let score = 0;
      const words = content.toLowerCase().split(/\s+/);
      words.forEach(w => {
          if (positiveWords.includes(w)) score++;
          if (negativeWords.includes(w)) score--;
      });
      alert(`Sentiment: ${score > 0 ? 'Positive 😊' : score < 0 ? 'Negative 😔' : 'Neutral 😐'}`);
  };

  const autoTag = () => {
      const words = content.split(/\s+/);
      const newTags = [...tags];
      if (words.length > 5 && !newTags.includes('Long')) newTags.push('Long');
      if (content.includes('TODO') && !newTags.includes('Task')) newTags.push('Task');
      if (content.includes('http') && !newTags.includes('Link')) newTags.push('Link');
      setTags(newTags);
      alert("Auto-tagged based on content!");
  };

  const selfDestruct = () => {
      if(confirm("This note will be deleted when you close it. Are you sure?")) {
          onSave({...note, deleted: true});
          onClose();
      }
  };

  const handleVoiceInput = () => {
      // @ts-ignore
      if (!('webkitSpeechRecognition' in window)) { alert("Not supported"); return; }
      if (isListening) return;
      setIsListening(true);
      // @ts-ignore
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false; 
      recognition.lang = 'en-US';
      recognition.onresult = (e:any) => { setContent(prev => prev + ' ' + e.results[0][0].transcript); setIsListening(false); };
      recognition.start();
  };

  const handleReadAloud = () => {
      if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(content || title);
          window.speechSynthesis.speak(utterance);
      } else {
          alert("Text-to-speech not supported.");
      }
  };

  const insertTimestamp = () => {
      setContent(c => c + ` [${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}] `);
  };

  const insertCodeBlock = () => {
      setContent(c => c + '\n```\n// Code here\n```\n');
  };

  const highlightText = (color: string) => {
      const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;
      const selectedText = content.substring(start, end);
      const before = content.substring(0, start);
      const after = content.substring(end);
      setContent(before + ` **${selectedText}** ` + after);
  };

  const toggleTexture = () => {
      const textures: ('none'|'grid'|'lines'|'dots')[] = ['none', 'grid', 'lines', 'dots'];
      const currentIdx = textures.indexOf(texture);
      setTexture(textures[(currentIdx + 1) % textures.length]);
  };

  const getTextureStyle = () => {
      switch(texture) {
          case 'grid': return { backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)', backgroundSize: '20px 20px' };
          case 'lines': return { backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px)', backgroundSize: '100% 24px', lineHeight: '24px', paddingTop: '2px' };
          case 'dots': return { backgroundImage: 'radial-gradient(#00000020 1px, transparent 1px)', backgroundSize: '20px 20px' };
          default: return {};
      }
  };

  const playTypeSound = () => {
      if(settings?.sounds) {
          // Simulated mechanical key sound using Web Audio API would be complex, just placeholder function
      }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if(readMode) return;
      const newText = e.target.value;
      
      // Quick Math Feature: Check for equation like "5*5="
      if (newText.endsWith('=') && newText.length > content.length) {
          const match = newText.match(/(\d+[\+\-\*\/]\d+)=$/);
          if (match) {
              try {
                  // eslint-disable-next-line no-eval
                  const res = eval(match[1]);
                  setContent(newText + res);
                  return;
              } catch(e) {}
          }
      }
      
      playTypeSound();
      setContent(newText);
  };

  const formatCode = () => {
      // Simple indenter for code blocks
      const formatted = content.replace(/```([\s\S]*?)```/g, (match) => {
          return match.replace(/\n\s*/g, '\n  '); 
      });
      setContent(formatted);
  }

  const savedItems: MarketItem[] = JSON.parse(localStorage.getItem('crafty-installed-items') || '[]');
  const availableStickers = savedItems.filter(i => i.category === 'Sticker' && i.installed);
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const textSizeClass = settings?.fontSize === 'sm' ? 'text-sm' : settings?.fontSize === 'lg' ? 'text-xl' : settings?.fontSize === 'xl' ? 'text-2xl' : 'text-base';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isMaximized ? 'p-0' : 'p-4'} bg-black/60 backdrop-blur-sm transition-all duration-300`}>
      <div className={`relative flex flex-col shadow-2xl overflow-hidden ${color} transition-colors duration-300 ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-2xl max-h-[90vh] rounded-3xl'}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/5">
            <div className="flex items-center gap-2">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 text-gray-600"><X size={24} /></button>
                <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 rounded-full hover:bg-black/5 text-gray-600 hidden sm:block">
                    {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button onClick={() => setIsFavorite(!isFavorite)} className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-black/5'}`}>
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'}/>
                </button>
                {isSaving ? <span className="text-xs text-gray-400 flex items-center gap-1"><Save size={10}/> Saving...</span> : <span className="text-xs text-gray-400">Saved</span>}
            </div>
            <div className="flex gap-2">
                 <button onClick={() => setReadMode(!readMode)} className={`p-2 rounded-full font-bold shadow-sm flex items-center gap-1 ${readMode ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`} title="Read Mode">
                     {readMode ? <Eye size={16}/> : <EyeOff size={16}/>}
                 </button>
                 <button onClick={() => setShowSmartTools(!showSmartTools)} className="p-2 bg-yellow-100 text-yellow-700 rounded-full font-bold shadow-sm flex items-center gap-1 hover:bg-yellow-200" title="Smart Tools"><Zap size={16}/><span className="hidden sm:inline">Tools</span></button>
                 <button onClick={handleSave} className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-gray-800">Done</button>
            </div>
        </div>

        {/* Smart Tools Dropdown */}
        {showSmartTools && (
            <div ref={toolsRef} className="absolute top-16 right-4 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-48 animate-in zoom-in-95 origin-top-right">
                <button onClick={analyzeSentiment} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Smile size={16}/> Sentiment Check</button>
                <button onClick={autoTag} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Tag size={16}/> Auto-Tag</button>
                <button onClick={formatCode} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Code size={16}/> Format Code</button>
                <button onClick={() => setShowSearch(!showSearch)} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Search size={16}/> Find & Replace</button>
                <button onClick={selfDestruct} className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600"><Flame size={16}/> Self Destruct</button>
                <button onClick={insertTimestamp} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Clock size={16}/> Insert Time</button>
                <button onClick={() => window.print()} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><Printer size={16}/> Print</button>
                <button onClick={() => { const b = new Blob([content], {type:'text/plain'}); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href=u; a.download='note.txt'; a.click(); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700"><FileText size={16}/> Export TXT</button>
            </div>
        )}

        {/* Editor Area */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar relative">
          <input disabled={readMode} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-3xl font-bold text-gray-900 placeholder-gray-400 outline-none mb-4 disabled:opacity-80"/>
          
          {/* Tag Area */}
          <div className="flex flex-wrap gap-2 mb-4">
             {tags.map(tag => (
               <span key={tag} className="bg-black/5 text-gray-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 group">
                 <Tag size={10} /> {tag}
                 {!readMode && <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500"><X size={10}/></button>}
               </span>
             ))}
             {!readMode && (
                 showTagInput ? (
                    <input autoFocus type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onBlur={() => { handleAddTag(); setShowTagInput(false); }} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} className="bg-white/50 rounded-md border border-black/10 px-2 text-xs w-20 py-1" placeholder="New tag..."/>
                 ) : (
                    <button onClick={() => setShowTagInput(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 py-1 px-2 hover:bg-black/5 rounded-md"><Plus size={10} /> Add Tag</button>
                 )
             )}
          </div>

          {showSearch && (
              <div className="mb-4 p-2 bg-white/50 rounded-xl flex items-center gap-2 border border-black/5">
                  <input value={findText} onChange={e => setFindText(e.target.value)} placeholder="Find..." className="bg-transparent text-sm p-1 outline-none"/>
                  <button onClick={() => setContent(content.split(findText).join(prompt('Replace with:') || findText))} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Replace All</button>
              </div>
          )}

          {/* Main Input with Texture Support */}
          {noteType === 'checklist' ? (
              <div className="space-y-2">
                  {content.split('\n').map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1.5 accent-gray-900 cursor-pointer" disabled={readMode}/>
                          <p className={`flex-1 ${textSizeClass} text-gray-800 outline-none border-b border-transparent focus:border-gray-200`}>{line}</p>
                      </div>
                  ))}
                  {!readMode && <textarea id="note-textarea" value={content} onChange={handleContentChange} className={`w-full bg-transparent ${textSizeClass} text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed mt-4 border-t border-black/10 pt-4`} placeholder="Add items..." rows={5}/>}
              </div>
          ) : (
            <textarea 
                id="note-textarea" 
                placeholder="Start crafting..." 
                value={content} 
                onChange={handleContentChange}
                readOnly={readMode}
                className={`w-full h-auto min-h-[200px] bg-transparent ${textSizeClass} text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed transition-all ${readMode ? 'cursor-text select-text' : ''}`} 
                style={{ 
                    minHeight: isMaximized ? 'calc(100vh - 400px)' : '200px',
                    ...getTextureStyle() 
                }}
            />
          )}
          
          {/* Attachments Display */}
          <div className="mt-8 space-y-4">
              {drawings.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                      {drawings.map((d, i) => (
                          <div key={i} className="relative group shrink-0">
                              <img src={d} alt="sketch" className="h-32 bg-white rounded-lg shadow-sm border border-gray-200"/>
                              {!readMode && <button onClick={() => setDrawings(drawings.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>}
                          </div>
                      ))}
                  </div>
              )}
              {stickers.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                      {stickers.map((s, i) => (
                          <div key={i} className="relative group shrink-0">
                              <img src={s} alt="sticker" className="h-24 object-contain"/>
                              {!readMode && <button onClick={() => setStickers(stickers.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>}
                          </div>
                      ))}
                  </div>
              )}
              {audioClips.length > 0 && (
                  <div className="space-y-2">
                      {audioClips.map((clip, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-black/5">
                              <audio src={clip} controls className="h-8"/>
                              {!readMode && <button onClick={() => setAudioClips(audioClips.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>}
                          </div>
                      ))}
                  </div>
              )}
          </div>

          {summary && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100 shadow-sm animate-slide-in">
                  <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-purple-700 flex items-center gap-2"><AlignLeft size={16}/> AI Summary</h4>
                      <button onClick={() => setSummary(null)} className="text-purple-600"><X size={14}/></button>
                  </div>
                  <p className="text-sm text-gray-700">{summary}</p>
              </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-6 py-1 text-[10px] text-gray-400 flex justify-end gap-3 border-t border-black/5 bg-white/10">
            <span>{content.length} chars</span>
            <span>{wordCount} words</span>
            <span>{Math.ceil(wordCount / 200)} min read</span>
        </div>

        {/* Footer Toolbar */}
        {!readMode && (
            <div className="p-3 border-t border-black/5 bg-white/30 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                    <button onClick={() => setNoteType(t => t === 'text' ? 'checklist' : 'text')} className={`p-2 rounded-full hover:bg-black/5 ${noteType === 'checklist' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}><CheckSquare size={20}/></button>
                    <button onClick={handleVoiceInput} className={`p-2 rounded-full hover:bg-black/5 ${isListening ? 'text-red-600 animate-pulse bg-red-100' : 'text-gray-600'}`}><Mic size={20}/></button>
                    <button onClick={handleReadAloud} className="p-2 rounded-full hover:bg-black/5 text-gray-600" title="Read Aloud"><Volume2 size={20}/></button>
                    
                    {/* Audio Recorder */}
                    <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 rounded-full hover:bg-black/5 ${isRecording ? 'text-red-600 bg-red-100 animate-pulse' : 'text-gray-600'}`} title="Record Audio">
                        {isRecording ? <StopCircle size={20}/> : <Mic2 size={20}/>}
                    </button>

                    {/* Texture Toggle */}
                    <button onClick={toggleTexture} className={`p-2 rounded-full hover:bg-black/5 ${texture !== 'none' ? 'text-blue-600' : 'text-gray-600'}`} title="Paper Style"><Grid size={20}/></button>

                    {/* Highlight Sim */}
                    <button onClick={() => highlightText('yellow')} className="p-2 rounded-full hover:bg-black/5 text-gray-600" title="Highlight"><Highlighter size={20}/></button>

                    {/* Magic Expand */}
                    <button onClick={handleMagicExpand} className="p-2 rounded-full hover:bg-purple-100 text-purple-600" title="Magic Expand"><Wand2 size={20}/></button>

                    {/* Code Block */}
                    <button onClick={insertCodeBlock} className="p-2 rounded-full hover:bg-black/5 text-gray-600" title="Insert Code"><FileCode size={20}/></button>

                    {/* Draw Button */}
                    <button onClick={() => setShowDrawModal(true)} className="p-2 rounded-full hover:bg-black/5 text-gray-600" title="Sketch"><PenTool size={20}/></button>

                    <div className="relative" ref={stickerPickerRef}>
                        <button onClick={() => setShowStickerPicker(!showStickerPicker)} className={`p-2 rounded-full hover:bg-black/5 text-gray-600 ${showStickerPicker ? 'text-pink-500' : ''}`}><Smile size={20}/></button>
                        {showStickerPicker && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 h-48 overflow-y-auto">
                                <div className="grid grid-cols-4 gap-2">
                                    {availableStickers.map(s => (<button key={s.id} onClick={() => { setStickers([...stickers, s.image]); setShowStickerPicker(false); }} className="w-12 h-12 p-1 border rounded hover:bg-gray-50"><img src={s.image} className="w-full h-full object-contain"/></button>))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={handleToggleLock} className={`p-2 rounded-full hover:bg-black/5 ${isLocked ? 'text-red-500' : 'text-gray-600'}`}>{isLocked ? <Lock size={18}/> : <Unlock size={18}/>}</button>

                    {/* AI Menu */}
                    <div className="relative" ref={aiMenuRef}>
                        <button onClick={() => setShowAIMenu(!showAIMenu)} className={`flex items-center gap-1 px-3 py-2 rounded-full font-medium ${isProcessingAI ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-purple-100'}`} disabled={isProcessingAI}>
                            {isProcessingAI ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>} <span className="hidden sm:inline">AI</span>
                        </button>
                        {showAIMenu && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                                {[AITask.Summarize, AITask.FixGrammar, AITask.ContinueWriting, AITask.MakeFun].map(t => (
                                    <button key={t} onClick={() => handleAIAction(t)} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50">{t.replace('_', ' ')}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className="relative" ref={colorPickerRef}>
                        <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded-full hover:bg-black/5 text-gray-600"><Palette size={20}/></button>
                        {showColorPicker && (
                            <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-5 gap-2 w-64 z-10">
                                {COLORS.map((c) => (
                                    <button 
                                        key={c.value} 
                                        onClick={() => { setColor(c.value); setShowColorPicker(false); }} 
                                        className={`w-8 h-8 rounded-full border ${color === c.value ? 'ring-2 ring-black' : ''}`} 
                                        style={{backgroundColor: c.hex === '#ffffff' ? 'white' : c.hex}}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* DRAWING MODAL */}
        {showDrawModal && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold">Sketch</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setShowDrawModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                        <button onClick={saveDrawing} className="px-4 py-2 bg-black text-white rounded-lg">Attach</button>
                    </div>
                </div>
                <div className="flex-1 bg-white relative cursor-crosshair">
                    <canvas 
                        ref={canvasRef} 
                        width={600} 
                        height={600} 
                        className="w-full h-full object-contain"
                        onMouseDown={startDrawing} 
                        onMouseMove={draw} 
                        onMouseUp={stopDrawing} 
                        onMouseLeave={stopDrawing}
                    />
                </div>
                <div className="p-2 bg-gray-50 flex justify-center gap-4 text-xs text-gray-500">
                    <span>Draw freely. Click Attach to save.</span>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default NoteEditor;
