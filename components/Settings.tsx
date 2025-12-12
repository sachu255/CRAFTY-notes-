
import React, { useState, useEffect } from 'react';
import { AppSettings, UserProfile, MarketItem } from '../services/types';
import { WINNING_COMBINATIONS } from '../constants';
import { User, Clock, Gamepad2, Trash, Scissors, Square, Hand, Zap, Gift, Moon, Type, Image, Volume2, Sword, Eye, RotateCcw, Code, Download, Smartphone } from 'lucide-react';
import ThemeStudio from './ThemeStudio';

interface SettingsProps {
  settings: AppSettings;
  profile: UserProfile;
  updateSettings: (s: AppSettings) => void;
  updateProfile: (p: UserProfile) => void;
  onResetApp: () => void;
  installedItems?: MarketItem[];
  onUninstallItem?: (id: string) => void;
  onInstallApp?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    settings, profile, updateSettings, updateProfile, onResetApp,
    installedItems = [], onUninstallItem, onInstallApp
}) => {
  // Kerala Time State
  const [keralaTime, setKeralaTime] = useState('');

  // Game State (XOX, RPS, Reflex) logic...
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [reflexStartTime, setReflexStartTime] = useState(0);
  const [reflexTime, setReflexTime] = useState(0);
  const [reflexTimeout, setReflexTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [giftClicks, setGiftClicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { 
            timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
        };
        setKeralaTime(new Intl.DateTimeFormat('en-US', options).format(date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bot Logic for XOX
  useEffect(() => {
    if (!isXNext && !winner) {
      const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      if (emptyIndices.length > 0) {
        const timeout = setTimeout(() => {
           const rand = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
           handleClick(rand, false);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [isXNext, winner, board]);

  const checkWinner = (squares: any[]) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleClick = (index: number, isUser: boolean) => {
    if (board[index] || winner) return;
    if (isUser && !isXNext) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const w = checkWinner(newBoard);
    if (w) setWinner(w); else setIsXNext(!isXNext);
  };

  const resetGame = () => { setBoard(Array(9).fill(null)); setIsXNext(true); setWinner(null); };

  const handleReflexClick = () => {
      if (reflexState === 'idle') {
          setReflexState('waiting');
          const randomTime = 2000 + Math.random() * 3000;
          const timeout = setTimeout(() => {
              setReflexState('ready');
              setReflexStartTime(Date.now());
          }, randomTime);
          setReflexTimeout(timeout);
      } else if (reflexState === 'waiting') {
          clearTimeout(reflexTimeout!);
          setReflexState('idle');
          alert("Too early!");
      } else if (reflexState === 'ready') {
          setReflexTime(Date.now() - reflexStartTime);
          setReflexState('finished');
      } else {
          setReflexState('idle');
      }
  };

  const handleSecretGift = () => {
      const newClicks = giftClicks + 1;
      setGiftClicks(newClicks);
      if (newClicks >= 7) {
          updateProfile({ ...profile, coins: profile.coins + 1000000 });
          alert("🎄 HO HO HO! 🎄\n+1,000,000 CNC added!");
          setGiftClicks(0);
      }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-slide-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings & Studio</h1>

        {/* Install App Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-lg border border-blue-400 text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black mb-1 flex items-center gap-2"><Smartphone size={24}/> Install App</h2>
                    <p className="text-blue-100 text-sm">Get the native experience on your device.</p>
                </div>
                {onInstallApp && (
                    <button 
                        onClick={onInstallApp}
                        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                    >
                        <Download size={20}/> Download APK
                    </button>
                )}
            </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <Moon className="text-purple-500" size={20}/> Zen Mode
                    </h2>
                    <p className="text-xs text-gray-500">Hide UI for focus.</p>
                </div>
                <button 
                    onClick={() => updateSettings({...settings, zenMode: !settings.zenMode})}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.zenMode ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.zenMode ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <Volume2 className="text-green-500" size={20}/> UI Sounds
                    </h2>
                    <p className="text-xs text-gray-500">Click & pop effects.</p>
                </div>
                <button 
                    onClick={() => updateSettings({...settings, sounds: !settings.sounds})}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.sounds ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.sounds ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>

            {/* Blue Light Filter */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div>
                    <h2 className="text-lg font-bold text-orange-700 flex items-center gap-2">
                        <Eye className="text-orange-500" size={20}/> Blue Light Filter
                    </h2>
                    <p className="text-xs text-orange-600">Reduce eye strain with a warm overlay.</p>
                </div>
                <button 
                    onClick={() => updateSettings({...settings, blueLight: !settings.blueLight})}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.blueLight ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.blueLight ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div>
                    <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                        <Code className="text-blue-500" size={20}/> Developer Mode
                    </h2>
                    <p className="text-xs text-blue-500">Unlock advanced logs & features.</p>
                </div>
                <button 
                    onClick={() => updateSettings({...settings, developerMode: !settings.developerMode})}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.developerMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.developerMode ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>

            {/* Combat Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 md:col-span-2">
                <div>
                    <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                        <Sword className="text-red-500" size={20}/> Combat Mode
                    </h2>
                    <p className="text-xs text-red-500">Gamify your experience. Earn XP, Level Up, and Unlock Ranks.</p>
                </div>
                <button 
                    onClick={() => updateSettings({...settings, combatMode: !settings.combatMode})}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.combatMode ? 'bg-red-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.combatMode ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <Type className="text-blue-500" size={20}/> Font Size
                    </h2>
                    <span className="text-xs font-bold uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{settings.fontSize || 'md'}</span>
                </div>
                <div className="flex gap-2">
                    {['sm', 'md', 'lg', 'xl'].map((size) => (
                        <button 
                            key={size}
                            onClick={() => updateSettings({...settings, fontSize: size as any})}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold border ${settings.fontSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                        >
                            {size === 'sm' ? 'A' : size === 'md' ? 'A+' : size === 'lg' ? 'A++' : 'A+++'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl md:col-span-2">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <Image className="text-orange-500" size={20}/> Custom Wallpaper
                </h2>
                <input 
                    type="text" 
                    placeholder="Enter Image URL..." 
                    value={settings.wallpaper || ''} 
                    onChange={(e) => updateSettings({...settings, wallpaper: e.target.value})}
                    className="w-full p-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
            </div>
        </section>

        {/* Profile Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <User className="text-primary"/> Crafter Studio Profile
                </h2>
                <button 
                    onClick={() => updateProfile({...profile, name: 'Crafter', age: '20', avatarUrl: ''})}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                >
                    <RotateCcw size={12}/> Reset Profile
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <input type="text" value={profile.name} onChange={(e) => updateProfile({...profile, name: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50 border border-gray-200 outline-none"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                    <input type="text" value={profile.age} onChange={(e) => updateProfile({...profile, age: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50 border border-gray-200 outline-none"/>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Photo URL</label>
                    <input type="text" value={profile.avatarUrl} onChange={(e) => updateProfile({...profile, avatarUrl: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50 border border-gray-200 outline-none"/>
                </div>
            </div>
        </section>

        <ThemeStudio settings={settings} updateSettings={updateSettings} installedItems={installedItems} onUninstall={onUninstallItem} />

        <section onClick={handleSecretGift} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer select-none">
             <div><h2 className="text-xl font-bold text-gray-700 flex items-center gap-2"><Clock className="text-accent"/> Kerala Time</h2></div>
             <div className="text-3xl font-kerala font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 shadow-inner">{keralaTime || "--:--:--"}</div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><Gamepad2 className="text-pink-500"/> XOX Bot</h2>
                <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-xl w-fit mx-auto">
                    {board.map((sq, i) => (
                        <button key={i} onClick={() => handleClick(i, true)} className="w-10 h-10 bg-white rounded-lg font-black text-gray-800">{sq}</button>
                    ))}
                </div>
                {winner && <div className="text-center mt-2 font-bold text-primary">{winner} Wins! <button onClick={resetGame} className="underline text-xs">Reset</button></div>}
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><Zap className="text-yellow-500"/> Reflex Tester</h2>
                <div onClick={handleReflexClick} className={`w-full h-32 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${reflexState === 'idle' ? 'bg-gray-100' : reflexState === 'waiting' ? 'bg-red-500' : reflexState === 'ready' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    <p className={`font-bold ${reflexState === 'idle' ? 'text-gray-600' : 'text-white'}`}>{reflexState === 'finished' ? `${reflexTime}ms` : reflexState === 'idle' ? 'Click Start' : reflexState === 'waiting' ? 'Wait...' : 'CLICK!'}</p>
                </div>
            </div>
        </section>

        <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
             <h2 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h2>
             <button onClick={onResetApp} className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors"><Trash size={16} /> Reset App Data</button>
        </section>
    </div>
  );
};

export default Settings;
