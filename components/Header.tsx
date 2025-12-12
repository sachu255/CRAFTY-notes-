
import React, { useState, useEffect } from 'react';
import { Search, Menu, Timer, Play, Pause, RotateCcw, Shield, Sword, User, Battery, Zap, Maximize, Minimize } from 'lucide-react';
import { UserProfile } from '../services/types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  title: string;
  combatMode?: boolean;
  profile?: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, toggleSidebar, title, combatMode, profile }) => {
  // Pomodoro State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [showPomo, setShowPomo] = useState(false);
  // Battery State
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
      // Simulate battery drain and charging
      const timer = setInterval(() => {
          setBatteryLevel(prev => {
              if (isCharging) return Math.min(100, prev + 1);
              return Math.max(0, prev - 1);
          });
      }, 600000); // very slow sim
      
      // Use real battery API if available
      // @ts-ignore
      if (navigator.getBattery) {
          // @ts-ignore
          navigator.getBattery().then(battery => {
              const update = () => {
                  setBatteryLevel(Math.floor(battery.level * 100));
                  setIsCharging(battery.charging);
              };
              update();
              battery.addEventListener('levelchange', update);
              battery.addEventListener('chargingchange', update);
          });
      }

      return () => {
          clearInterval(timer);
      };
  }, [isCharging]);

  // Fullscreen Listener
  useEffect(() => {
      const handleFsChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFsChange);
      return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
      let interval: any;
      if (isPomoRunning && pomoTime > 0) {
          interval = setInterval(() => {
              setPomoTime(t => t - 1);
          }, 1000);
      } else if (pomoTime === 0) {
          setIsPomoRunning(false);
          alert("Focus session complete!");
          setPomoTime(25 * 60);
      }
      return () => clearInterval(interval);
  }, [isPomoRunning, pomoTime]);

  const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (err) {
        console.error("Fullscreen error:", err);
    }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const expPercentage = profile ? ((profile.exp || 0) % 100) : 0;

  return (
    <header className={`sticky top-0 z-30 bg-opacity-80 backdrop-blur-sm px-4 sm:px-8 py-4 flex items-center justify-between gap-4 border-b border-transparent ${combatMode ? 'bg-black/80 text-white' : ''}`}>
      
      <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className={`p-2 -ml-2 rounded-xl transition-all lg:hidden ${combatMode ? 'hover:bg-red-900 text-white' : 'hover:bg-black/5'}`}
          >
            <Menu size={24} />
          </button>
          
          {combatMode && profile ? (
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center border-2 border-yellow-500 shadow-lg relative group">
                      <span className="text-xl font-black">{profile.level || 1}</span>
                      <div className="absolute -bottom-2 bg-black text-[8px] px-1 rounded border border-gray-700">LVL</div>
                  </div>
                  <div>
                      <h1 className="text-lg font-black tracking-tighter uppercase text-red-500 drop-shadow-sm flex items-center gap-2">
                          <User size={16}/> {profile.rank || 'Rookie'}
                      </h1>
                      {/* Health / XP Bar */}
                      <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                          <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500" style={{ width: `${expPercentage}%` }}></div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">EXP: {profile.exp} / {((profile.level || 1) * 100)}</p>
                  </div>
              </div>
          ) : (
              <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          )}
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
          {(title === 'Crafty Notes' || title === 'Marketplace' || title === 'Recycle Bin') && !combatMode && (
            <div className="flex-1 max-w-md hidden sm:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-white/50 focus:bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm transition-all text-sm"
                        placeholder={`Search ${title.toLowerCase()}...`}
                    />
                </div>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition-all ${combatMode ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
            title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
          </button>

          <div className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${batteryLevel < 20 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
              {isCharging ? <Zap size={14} className="fill-current"/> : <Battery size={16} fill={batteryLevel > 20 ? 'currentColor' : 'none'}/>} 
              {batteryLevel}%
          </div>

          {/* Pomodoro Widget */}
          <div className="relative">
              <button 
                onClick={() => setShowPomo(!showPomo)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isPomoRunning ? 'bg-red-100 text-red-600' : (combatMode ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
              >
                  <Timer size={18}/>
                  <span className="font-mono font-bold text-sm hidden md:inline">{formatTime(pomoTime)}</span>
              </button>
              
              {showPomo && (
                  <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-48 animate-in fade-in zoom-in-95 z-50">
                      <div className="text-center mb-4">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Focus Timer</p>
                          <p className="text-3xl font-mono font-bold text-gray-800">{formatTime(pomoTime)}</p>
                      </div>
                      <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => setIsPomoRunning(!isPomoRunning)}
                            className={`p-2 rounded-full text-white transition-colors ${isPomoRunning ? 'bg-yellow-500' : 'bg-green-500'}`}
                          >
                              {isPomoRunning ? <Pause size={16}/> : <Play size={16}/>}
                          </button>
                          <button 
                            onClick={() => { setIsPomoRunning(false); setPomoTime(25*60); }}
                            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                          >
                              <RotateCcw size={16}/>
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </header>
  );
};

export default Header;
