
import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, SkipForward, SkipBack, Volume2, Music2, Disc } from 'lucide-react';

const RadioApp: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [station, setStation] = useState(0);
    const [visualizer, setVisualizer] = useState<number[]>(new Array(10).fill(20));

    const stations = [
        { name: "Lo-Fi Beats", freq: "88.5 FM", color: "text-purple-400" },
        { name: "Crafter Pop", freq: "92.1 FM", color: "text-pink-400" },
        { name: "Jazz Café", freq: "101.3 FM", color: "text-orange-400" },
        { name: "Tech News", freq: "105.7 FM", color: "text-blue-400" },
    ];

    useEffect(() => {
        let interval: any;
        if(isPlaying) {
            interval = setInterval(() => {
                setVisualizer(prev => prev.map(() => Math.random() * 80 + 20));
            }, 100);
        } else {
            setVisualizer(new Array(10).fill(10));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 rounded-3xl shadow-2xl border-4 border-gray-800 overflow-hidden text-white relative items-center justify-center p-8">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50 pointer-events-none"></div>
            
            {/* Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-sm">
                <Radio size={16}/> Crafty Radio
            </div>

            {/* Station Display */}
            <div className="z-10 text-center mb-12">
                <div className={`text-6xl font-black mb-2 transition-colors duration-500 ${stations[station].color} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                    {stations[station].freq}
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                    {stations[station].name}
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex gap-2 h-32 items-center mb-16">
                {visualizer.map((h, i) => (
                    <div 
                        key={i} 
                        className={`w-4 rounded-full transition-all duration-100 ${stations[station].color.replace('text-', 'bg-')}`}
                        style={{ height: `${h}%`, opacity: 0.8 }}
                    ></div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 z-10 bg-gray-800/50 p-4 rounded-full backdrop-blur-md border border-white/10">
                <button 
                    onClick={() => setStation(s => s === 0 ? stations.length - 1 : s - 1)}
                    className="p-4 rounded-full hover:bg-white/10 transition-colors"
                >
                    <SkipBack size={24}/>
                </button>
                
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all ${isPlaying ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
                >
                    {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-1"/>}
                </button>

                <button 
                    onClick={() => setStation(s => (s + 1) % stations.length)}
                    className="p-4 rounded-full hover:bg-white/10 transition-colors"
                >
                    <SkipForward size={24}/>
                </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 flex items-center gap-2 text-xs text-gray-600 font-mono">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
                {isPlaying ? 'LIVE' : 'OFFLINE'}
            </div>
        </div>
    );
};

export default RadioApp;
