
import React, { useState, useRef, useEffect } from 'react';
import { Palette, Eraser, Download, Save, RefreshCw, Smile, Type, Sparkles, Loader2, Shuffle } from 'lucide-react';
import { generateStickerImage } from '../services/geminiService';

interface StickerMakerProps {
  onSave: (stickerData: string) => void;
}

const StickerMaker: React.FC<StickerMakerProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,0)' : color;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      alert("Sticker Saved! Use it in your notes.");
      clearCanvas();
    }
  };

  const addEmoji = (emoji: string) => {
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.globalCompositeOperation = 'source-over';
              ctx.font = '50px serif';
              ctx.fillText(emoji, canvas.width / 2 - 25, canvas.height / 2);
          }
      }
  };

  const generateAISticker = async () => {
      if (!aiPrompt.trim()) return;
      setIsAiLoading(true);
      const imageBase64 = await generateStickerImage(aiPrompt);
      if (imageBase64) {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (canvas && ctx) {
              const img = new Image();
              img.onload = () => {
                  ctx.globalCompositeOperation = 'source-over';
                  ctx.drawImage(img, 50, 50, 300, 300); // Draw generated sticker
              };
              img.src = imageBase64;
          }
      } else {
          alert("Failed to generate sticker. Try a different prompt.");
      }
      setIsAiLoading(false);
      setAiPrompt('');
  };

  const randomizeColor = () => {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      setColor(randomColor);
      setTool('brush');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="p-4 bg-pink-50 border-b border-pink-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-pink-500 text-white p-2 rounded-lg">
                    <Smile size={24}/>
                </div>
                <div>
                    <h2 className="font-bold text-lg text-gray-800">Sticker Maker</h2>
                    <p className="text-xs text-gray-500">Create custom stickers with AI</p>
                </div>
            </div>
            <button 
                onClick={handleSave}
                className="bg-pink-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
                <Save size={18}/> Save Sticker
            </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tools */}
            <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200 flex flex-col gap-6 overflow-y-auto">
                
                {/* AI Generator */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <label className="text-xs font-bold text-purple-500 uppercase mb-2 flex items-center gap-1"><Sparkles size={12}/> AI Generate</label>
                    <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. A cute cat coding"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs mb-2 outline-none border border-gray-100 focus:border-purple-300"
                    />
                    <button 
                        onClick={generateAISticker}
                        disabled={isAiLoading || !aiPrompt}
                        className="w-full py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                        {isAiLoading ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} Generate
                    </button>
                </div>

                {/* Tools */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tools</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setTool('brush')}
                            className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${tool === 'brush' ? 'bg-pink-100 text-pink-600 ring-2 ring-pink-300' : 'bg-white border border-gray-200 text-gray-600'}`}
                        >
                            <Palette size={20}/> <span className="text-xs font-bold">Brush</span>
                        </button>
                        <button 
                            onClick={() => setTool('eraser')}
                            className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${tool === 'eraser' ? 'bg-gray-200 text-gray-800 ring-2 ring-gray-400' : 'bg-white border border-gray-200 text-gray-600'}`}
                        >
                            <Eraser size={20}/> <span className="text-xs font-bold">Eraser</span>
                        </button>
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 flex justify-between">
                        Colors 
                        <button onClick={randomizeColor} title="Random Color" className="text-gray-500 hover:text-pink-500"><Shuffle size={12}/></button>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#A52A2A'].map(c => (
                            <button 
                                key={c}
                                onClick={() => { setColor(c); setTool('brush'); }}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <input 
                            type="color" 
                            value={color}
                            onChange={(e) => { setColor(e.target.value); setTool('brush'); }}
                            className="w-8 h-8 rounded-full overflow-hidden border-none p-0"
                        />
                    </div>
                </div>

                {/* Brush Size */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Size: {brushSize}</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full accent-pink-500"
                    />
                </div>

                {/* Emojis */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Add Emoji</label>
                    <div className="grid grid-cols-5 gap-2 text-2xl">
                        {['😀', '😂', '😍', '😎', '🤔', '👍', '🔥', '🎉', '❤️', '🌟'].map(e => (
                            <button key={e} onClick={() => addEmoji(e)} className="hover:scale-125 transition-transform">{e}</button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={clearCanvas}
                    className="mt-auto py-2 bg-gray-200 text-gray-600 rounded-lg font-bold hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={16}/> Clear Canvas
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] flex items-center justify-center p-8 bg-gray-100 overflow-auto relative">
                <div className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-300 bg-transparent">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                        className="bg-transparent cursor-crosshair touch-none"
                        style={{ background: 'transparent' }}
                    />
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-gray-400 opacity-50 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StickerMaker;
