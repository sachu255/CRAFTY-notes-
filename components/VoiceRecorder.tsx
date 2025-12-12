
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Save, MoreVertical, AudioWaveform, Edit2 } from 'lucide-react';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{id: string, url: string, date: string, name: string}[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [timer, setTimer] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(20).fill(10));

  useEffect(() => {
      let interval: any;
      if (isRecording) {
          interval = setInterval(() => {
              setTimer(t => t + 1);
              // Simulate visualizer
              setVisualizerData(prev => prev.map(() => Math.random() * 40 + 10));
          }, 100);
      } else {
          setVisualizerData(new Array(20).fill(5));
      }
      return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder.current = new MediaRecorder(stream);
          audioChunks.current = [];
          
          mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
          mediaRecorder.current.onstop = () => {
              const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              setRecordings(prev => [{
                  id: Date.now().toString(),
                  url,
                  date: new Date().toLocaleString(),
                  name: `Recording ${prev.length + 1}`
              }, ...prev]);
          };
          
          mediaRecorder.current.start();
          setIsRecording(true);
          setTimer(0);
      } catch (e) {
          alert("Microphone access denied.");
      }
  };

  const stopRecording = () => {
      mediaRecorder.current?.stop();
      setIsRecording(false);
  };

  const renameRecording = (id: string, oldName: string) => {
      const newName = prompt("Rename Recording:", oldName);
      if(newName) {
          setRecordings(prev => prev.map(r => r.id === id ? {...r, name: newName} : r));
      }
  };

  const formatTime = (t: number) => {
      const sec = Math.floor(t / 10);
      const min = Math.floor(sec / 60);
      return `${min}:${(sec % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden text-white relative">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h2 className="text-gray-400 font-medium uppercase tracking-widest mb-8">Voice Recorder</h2>
            
            <div className="text-6xl font-thin font-mono mb-12 tabular-nums">
                {formatTime(timer)}
            </div>

            {/* Visualizer */}
            <div className="h-24 flex items-center justify-center gap-1 mb-16 w-full max-w-sm">
                {visualizerData.map((h, i) => (
                    <div 
                        key={i} 
                        className="w-2 bg-red-500 rounded-full transition-all duration-75"
                        style={{ height: `${h}%`, opacity: isRecording ? 1 : 0.2 }}
                    ></div>
                ))}
            </div>

            <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`
                    w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                    ${isRecording ? 'bg-white text-red-600 scale-110' : 'bg-red-600 text-white hover:bg-red-500'}
                `}
            >
                {isRecording ? <Square fill="currentColor" size={32}/> : <Mic size={32}/>}
            </button>
            <p className="mt-4 text-gray-500 text-sm">{isRecording ? 'Recording...' : 'Tap to Record'}</p>
        </div>

        {/* List */}
        <div className="bg-gray-800 h-1/3 overflow-y-auto p-4 rounded-t-3xl border-t border-gray-700">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 px-2">Recent Recordings</h3>
            {recordings.length === 0 && <p className="text-gray-600 text-center text-sm py-4">No recordings yet.</p>}
            {recordings.map(rec => (
                <div key={rec.id} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-xl mb-2">
                    <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                        <Play size={16} fill="currentColor"/>
                    </button>
                    <div className="flex-1 cursor-pointer" onClick={() => renameRecording(rec.id, rec.name)}>
                        <p className="font-medium text-sm flex items-center gap-2">{rec.name} <Edit2 size={10} className="text-gray-500"/></p>
                        <p className="text-gray-400 text-[10px]">{rec.date}</p>
                    </div>
                    <button onClick={() => setRecordings(prev => prev.filter(r => r.id !== rec.id))} className="text-gray-500 hover:text-red-500">
                        <Trash2 size={18}/>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default VoiceRecorder;
