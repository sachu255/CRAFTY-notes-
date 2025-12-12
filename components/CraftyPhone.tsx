
import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Signal, ChevronLeft, Search, Camera, Settings as SettingsIcon, MessageSquare, Phone, Chrome, Music, Bell, Play, Pause, SkipBack, SkipForward, User, Gamepad2, Clock, Zap, Timer, CloudSun, CloudRain, Sun, Image } from 'lucide-react';
import HelloNumbers from './HelloNumbers';

const CraftyPhone: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [activeApp, setActiveApp] = useState<'home' | 'calculator' | 'settings' | 'camera' | 'browser' | 'music' | 'messages' | 'flappy' | 'clock' | 'weather' | 'gallery'>('home');
  
  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(30);

  // Clock State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  // Flappy State
  const [birdPos, setBirdPos] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number>(0);
  const gravity = 3;
  const jumpStrength = -10;
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      let interval: any;
      if (isStopwatchRunning) {
          interval = setInterval(() => setStopwatchTime(t => t + 10), 10);
      }
      return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Flappy Logic
  useEffect(() => {
      if (activeApp === 'flappy' && gameStarted && !gameOver) {
          const loop = () => {
              setBirdPos(pos => {
                  const newPos = pos + velocity;
                  if (newPos > 500 || newPos < 0) setGameOver(true);
                  return newPos;
              });
              setVelocity(v => v + 0.5); // Gravity
              gameLoopRef.current = requestAnimationFrame(loop);
          };
          gameLoopRef.current = requestAnimationFrame(loop);
      }
      return () => cancelAnimationFrame(gameLoopRef.current);
  }, [activeApp, gameStarted, gameOver, velocity]);

  const jump = () => {
      if (!gameStarted) {
          setGameStarted(true);
          setGameOver(false);
          setBirdPos(250);
          setScore(0);
          setVelocity(jumpStrength);
      } else if (gameOver) {
          setGameStarted(false);
          setGameOver(false);
          setBirdPos(250);
      } else {
          setVelocity(jumpStrength);
      }
  };

  const openApp = (app: typeof activeApp) => {
    setActiveApp(app);
  };

  const goHome = () => {
    setActiveApp('home');
    setGameStarted(false);
  };

  const formatStopwatch = (ms: number) => {
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      const millis = Math.floor((ms % 1000) / 10);
      return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${millis < 10 ? '0' : ''}${millis}`;
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      {/* Phone Frame */}
      <div className="relative w-[340px] h-[680px] bg-black rounded-[50px] border-[8px] border-gray-900 shadow-2xl overflow-hidden ring-4 ring-gray-300/50">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[28px] w-[110px] bg-black z-20 rounded-b-3xl"></div>

        {/* Status Bar */}
        <div className="absolute top-0 w-full px-6 py-3 flex justify-between items-center text-white z-10 text-xs font-medium">
           <span className="ml-2">{currentTime}</span>
           <div className="flex gap-1.5 items-center">
             <Signal size={12} fill="currentColor"/>
             <Wifi size={12}/>
             <Battery size={16} fill="currentColor"/>
           </div>
        </div>

        {/* Screen Content */}
        <div className={`w-full h-full bg-cover bg-center transition-all duration-300 ${activeApp === 'home' ? 'bg-[url(https://images.unsplash.com/photo-1695504236952-1d7d07c0823a?q=80&w=1000&auto=format&fit=crop)]' : 'bg-white'}`}>
            
            {/* APP: Home Screen */}
            {activeApp === 'home' && (
              <div className="w-full h-full pt-16 px-4 flex flex-col justify-between pb-8">
                  <div className="grid grid-cols-4 gap-4 mt-4">
                     <AppIcon icon={<div className="bg-gray-200 text-gray-800"><SettingsIcon size={24}/></div>} label="Settings" onClick={() => openApp('settings')}/>
                     <AppIcon icon={<div className="bg-green-500 text-white"><Phone size={24} fill="currentColor"/></div>} label="Phone" onClick={() => {}}/>
                     <AppIcon icon={<div className="bg-blue-500 text-white"><MessageSquare size={24} fill="currentColor"/></div>} label="Messages" onClick={() => openApp('messages')}/>
                     <AppIcon icon={<div className="bg-gradient-to-tr from-yellow-400 to-orange-500 text-white"><Camera size={24}/></div>} label="Camera" onClick={() => openApp('camera')}/>
                     <AppIcon icon={<div className="bg-black text-white"><span className="text-xl font-bold">C1</span></div>} label="Crafty OS" onClick={() => {}}/>
                     <AppIcon icon={<div className="bg-orange-500 text-white"><span className="text-xl">±</span></div>} label="Calc" onClick={() => openApp('calculator')}/>
                     <AppIcon icon={<div className="bg-white text-blue-500"><Chrome size={24}/></div>} label="Browser" onClick={() => openApp('browser')}/>
                     <AppIcon icon={<div className="bg-pink-500 text-white"><Music size={24}/></div>} label="Music" onClick={() => openApp('music')}/>
                     <AppIcon icon={<div className="bg-cyan-400 text-white"><Gamepad2 size={24}/></div>} label="Flappy" onClick={() => openApp('flappy')}/>
                     <AppIcon icon={<div className="bg-black text-white border border-gray-600"><Clock size={24}/></div>} label="Clock" onClick={() => openApp('clock')}/>
                     <AppIcon icon={<div className="bg-blue-300 text-white"><CloudSun size={24}/></div>} label="Weather" onClick={() => openApp('weather')}/>
                     <AppIcon icon={<div className="bg-white text-purple-500"><Image size={24}/></div>} label="Gallery" onClick={() => openApp('gallery')}/>
                  </div>

                  {/* Dock */}
                  <div className="bg-white/20 backdrop-blur-md rounded-[30px] p-3 grid grid-cols-4 gap-4">
                     <AppIcon icon={<div className="bg-green-500 text-white"><Phone size={24} fill="currentColor"/></div>} onClick={() => {}}/>
                     <AppIcon icon={<div className="bg-white text-blue-500"><Chrome size={24}/></div>} onClick={() => openApp('browser')}/>
                     <AppIcon icon={<div className="bg-blue-500 text-white"><MessageSquare size={24} fill="currentColor"/></div>} onClick={() => openApp('messages')}/>
                     <AppIcon icon={<div className="bg-red-500 text-white"><Music size={24}/></div>} onClick={() => openApp('music')}/>
                  </div>
              </div>
            )}

            {/* APP: Calculator */}
            {activeApp === 'calculator' && (
              <div className="w-full h-full bg-black pt-8">
                 <button onClick={goHome} className="absolute top-12 left-4 text-white p-2 z-20"><ChevronLeft/></button>
                 <div className="scale-[0.8] origin-top h-full overflow-hidden -mt-4">
                   <HelloNumbers />
                 </div>
              </div>
            )}

            {/* APP: Weather */}
            {activeApp === 'weather' && (
              <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 pt-12 flex flex-col text-white px-6">
                 <button onClick={goHome} className="absolute top-12 left-4 text-white"><ChevronLeft/></button>
                 <div className="mt-10 text-center">
                     <h2 className="text-3xl font-light">New York</h2>
                     <h1 className="text-8xl font-thin mt-2">72°</h1>
                     <p className="text-lg mt-2">Sunny</p>
                     <div className="flex justify-center mt-4 gap-8 text-sm">
                         <span>H:75°</span>
                         <span>L:60°</span>
                     </div>
                 </div>
                 <div className="mt-12 bg-white/20 backdrop-blur-md rounded-2xl p-4">
                     <p className="text-xs uppercase mb-4 opacity-70">Hourly Forecast</p>
                     <div className="flex justify-between text-sm">
                         <div className="flex flex-col items-center"><span>Now</span><Sun size={16} className="my-2"/><span>72°</span></div>
                         <div className="flex flex-col items-center"><span>1PM</span><Sun size={16} className="my-2"/><span>73°</span></div>
                         <div className="flex flex-col items-center"><span>2PM</span><CloudSun size={16} className="my-2"/><span>74°</span></div>
                         <div className="flex flex-col items-center"><span>3PM</span><CloudRain size={16} className="my-2"/><span>70°</span></div>
                     </div>
                 </div>
              </div>
            )}

            {/* APP: Gallery */}
            {activeApp === 'gallery' && (
              <div className="w-full h-full bg-white pt-12 flex flex-col">
                 <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                     <button onClick={goHome} className="text-blue-500 flex items-center"><ChevronLeft/> Albums</button>
                     <span className="font-bold">Recents</span>
                     <button className="text-blue-500">Select</button>
                 </div>
                 <div className="grid grid-cols-3 gap-1 p-1 overflow-y-auto">
                     {Array.from({length: 24}).map((_, i) => (
                         <div key={i} className="aspect-square bg-gray-200">
                             <img src={`https://picsum.photos/seed/${i + 50}/200/200`} className="w-full h-full object-cover" alt="photo"/>
                         </div>
                     ))}
                 </div>
              </div>
            )}

            {/* APP: Flappy Game */}
            {activeApp === 'flappy' && (
                <div className="w-full h-full bg-cyan-300 relative overflow-hidden" onMouseDown={jump} onTouchStart={jump}>
                    <button onClick={(e) => { e.stopPropagation(); goHome(); }} className="absolute top-12 left-4 bg-white/50 p-2 rounded-full z-30"><ChevronLeft/></button>
                    
                    {/* Clouds */}
                    <div className="absolute top-20 left-10 text-white/50"><CloudIcon size={64}/></div>
                    <div className="absolute top-40 right-20 text-white/50"><CloudIcon size={48}/></div>

                    {/* Bird */}
                    <div 
                        className="absolute w-8 h-8 bg-yellow-400 rounded-lg border-2 border-black flex items-center justify-center transition-transform"
                        style={{ top: birdPos, left: '50%', transform: 'translateX(-50%) rotate(' + (velocity * 3) + 'deg)' }}
                    >
                        <div className="w-2 h-2 bg-black rounded-full absolute top-1 right-1"></div>
                        <div className="w-4 h-2 bg-orange-500 rounded-r-lg absolute right-[-8px] border border-black"></div>
                        <div className="w-3 h-2 bg-white rounded-full absolute top-2 right-4 -rotate-12 opacity-80"></div>
                    </div>

                    {/* Ground */}
                    <div className="absolute bottom-0 w-full h-24 bg-[#ded895] border-t-4 border-[#73bf2e] flex items-end overflow-hidden">
                         <div className="w-full h-4 bg-[#73bf2e]"></div>
                         {Array.from({length: 10}).map((_, i) => (
                             <div key={i} className="w-8 h-8 border-r-2 border-[#d0c874] -skew-x-12 opacity-50"></div>
                         ))}
                    </div>

                    {(!gameStarted || gameOver) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col z-20">
                            <div className="bg-white p-6 rounded-xl text-center shadow-xl">
                                <h2 className="text-2xl font-black text-gray-800 mb-2">{gameOver ? 'GAME OVER' : 'FLAPPY CRAFT'}</h2>
                                {gameOver && <p className="text-xl font-bold text-orange-500 mb-4">Score: {Math.floor(score)}</p>}
                                <p className="text-gray-500 text-sm animate-pulse">Tap to {gameOver ? 'Restart' : 'Start'}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* APP: Clock */}
            {activeApp === 'clock' && (
                <div className="w-full h-full bg-black text-white pt-12 flex flex-col">
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                         <button onClick={goHome}><ChevronLeft size={24}/></button>
                         <h2 className="font-bold text-lg">World Clock</h2>
                    </div>
                    
                    <div className="p-6 border-b border-gray-800">
                        <p className="text-gray-400 text-sm font-bold uppercase">Local Time</p>
                        <h1 className="text-6xl font-light font-mono">{currentTime}</h1>
                        <p className="text-orange-500 mt-2">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}</p>
                    </div>

                    <div className="flex-1 p-6 flex flex-col items-center justify-center">
                        <div className="w-64 h-64 rounded-full border-4 border-gray-800 flex items-center justify-center relative mb-8">
                            <span className="text-4xl font-mono font-bold">{formatStopwatch(stopwatchTime)}</span>
                            {/* Decorative marks */}
                            <div className="absolute top-2 w-1 h-3 bg-gray-600"></div>
                            <div className="absolute bottom-2 w-1 h-3 bg-gray-600"></div>
                            <div className="absolute left-2 w-3 h-1 bg-gray-600"></div>
                            <div className="absolute right-2 w-3 h-1 bg-gray-600"></div>
                        </div>
                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg ${isStopwatchRunning ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'}`}
                            >
                                {isStopwatchRunning ? 'Stop' : 'Start'}
                            </button>
                            <button 
                                onClick={() => { setIsStopwatchRunning(false); setStopwatchTime(0); }}
                                className="flex-1 py-4 bg-gray-800 text-gray-300 rounded-xl font-bold text-lg"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* APP: Camera Dummy */}
            {activeApp === 'camera' && (
               <div className="w-full h-full bg-black relative flex flex-col items-center justify-end pb-12">
                   <button onClick={goHome} className="absolute top-12 left-4 text-white z-20 bg-black/50 rounded-full p-2"><ChevronLeft/></button>
                   <p className="text-white absolute top-1/2 -translate-x-1/2">Camera access simulator</p>
                   <div className="w-16 h-16 rounded-full border-4 border-white bg-white/20"></div>
               </div>
            )}

            {/* APP: Settings Dummy */}
             {activeApp === 'settings' && (
               <div className="w-full h-full bg-gray-100 pt-12">
                    <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                        <button onClick={goHome} className="text-blue-500"><ChevronLeft/></button>
                        <h2 className="font-bold text-lg">Settings</h2>
                    </div>
                    <div className="p-4 space-y-4">
                         <div className="bg-white p-3 rounded-xl flex items-center gap-3">
                             <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                             <div>
                                 <p className="font-bold">Crafter User</p>
                                 <p className="text-xs text-gray-500">Apple ID, iCloud, Media & Purchases</p>
                             </div>
                         </div>
                         <div className="bg-white rounded-xl overflow-hidden">
                             <div className="p-3 border-b border-gray-100 flex justify-between"><span>Airplane Mode</span> <div className="w-10 h-6 bg-gray-300 rounded-full"></div></div>
                             <div className="p-3 border-b border-gray-100 flex justify-between"><span>Wi-Fi</span> <span className="text-gray-500">CrafterNet 5G</span></div>
                             <div className="p-3 flex justify-between"><span>Bluetooth</span> <span className="text-gray-500">On</span></div>
                         </div>
                    </div>
               </div>
            )}

            {/* APP: Browser Dummy */}
            {activeApp === 'browser' && (
                 <div className="w-full h-full bg-white pt-12 flex flex-col">
                     <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                         <button onClick={goHome}><ChevronLeft size={20}/></button>
                         <div className="flex-1 bg-white rounded-lg px-2 py-1 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                             <div className="w-3 h-3 rounded-full bg-green-500"></div> crafter-studio.com
                         </div>
                     </div>
                     <div className="flex-1 flex items-center justify-center flex-col text-gray-400 gap-2">
                         <Chrome size={48} className="text-gray-200"/>
                         <p>Crafty Browser C1</p>
                     </div>
                 </div>
            )}

            {/* APP: Messages */}
            {activeApp === 'messages' && (
                <div className="w-full h-full bg-white pt-12 flex flex-col">
                     <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                         <button onClick={goHome} className="text-blue-500 font-bold flex items-center"><ChevronLeft size={20}/> Back</button>
                         <span className="font-bold">Messages</span>
                         <div className="w-5"></div>
                     </div>
                     <div className="flex-1 overflow-y-auto">
                        {[
                            { name: 'Sachu', msg: 'Did you check the new update?', time: '2m ago' },
                            { name: 'Crafter Team', msg: 'Welcome to Crafter OS!', time: '1h ago' },
                            { name: 'Mom', msg: 'Call me when free.', time: 'Yesterday' },
                        ].map((msg, i) => (
                            <div key={i} className="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={20}/></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-sm">{msg.name}</h4>
                                        <span className="text-xs text-gray-400">{msg.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{msg.msg}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {/* APP: Music */}
            {activeApp === 'music' && (
                <div className="w-full h-full bg-gradient-to-b from-purple-800 to-black pt-12 flex flex-col text-white">
                    <div className="px-4 py-2 flex items-center justify-between">
                         <button onClick={goHome}><ChevronLeft size={24}/></button>
                         <span className="text-xs font-bold tracking-widest uppercase">Now Playing</span>
                         <div className="w-6"></div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-64 h-64 bg-gray-800 rounded-2xl shadow-2xl mb-8 overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Album Art"/>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Music size={64} className="drop-shadow-lg"/>
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-1">Crafter Beats</h2>
                            <p className="text-gray-400">Crafter Studio Original</p>
                        </div>

                        {/* Progress */}
                        <div className="w-full mb-8">
                             <div className="w-full h-1 bg-gray-700 rounded-full mb-2">
                                 <div className="h-full bg-white rounded-full" style={{ width: `${trackProgress}%` }}></div>
                             </div>
                             <div className="flex justify-between text-xs text-gray-500">
                                 <span>1:20</span>
                                 <span>3:45</span>
                             </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-8">
                            <button className="text-gray-400 hover:text-white"><SkipBack size={32}/></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                {isPlaying ? <Pause size={32} fill="black"/> : <Play size={32} fill="black" className="ml-1"/>}
                            </button>
                            <button className="text-gray-400 hover:text-white"><SkipForward size={32}/></button>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Home Bar */}
        <button onClick={goHome} className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-50 hover:bg-white transition-colors"></button>
      </div>
    </div>
  );
};

interface AppIconProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity">
     <div className="w-14 h-14 rounded-[14px] overflow-hidden shadow-sm flex items-center justify-center [&>*]:w-full [&>*]:h-full [&>*]:flex [&>*]:items-center [&>*]:justify-center">
       {icon}
     </div>
     {label && <span className="text-[10px] font-medium text-white drop-shadow-md">{label}</span>}
  </button>
);

const CloudIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 9C17 6.24 14.76 4 12 4C9.77 4 7.89 5.43 7.25 7.42C4.34 7.81 2 10.3 2 13.5C2 17.09 4.91 20 8.5 20H16.5C19.54 20 22 17.54 22 14.5C22 11.58 19.72 9.21 17 9Z"/>
    </svg>
);

export default CraftyPhone;
