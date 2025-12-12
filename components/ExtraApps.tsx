import React, { useState, useEffect, useRef } from 'react';
import { ViewMode } from '../services/types';
import { CheckSquare, Activity, Gamepad2, Music, QrCode, PenTool, FileJson, Clock, Calculator, Quote, Smile, Palette, Wind, Play, Pause, RotateCcw, Plus, Trash2, Save, Terminal, Volume2, Shuffle, Type, Zap, Box, Calendar as CalendarIcon, Hash, Copy, Check, Heart, Droplets, Mic2, Guitar, Radio, Code2, Grid, Keyboard, Brain, Bomb, PartyPopper, FastForward, Link, Eraser, Download, Youtube, Search, Bell, ThumbsUp, User, Share2, MessageCircle, BarChart2, Shield, Settings, AlertTriangle, LogOut, Award, Gift, Star, Trophy, ArrowLeft, Truck, Moon, Image, ChevronRight, Video, Plug, Users, Lock, Unlock, MapPin, Smartphone, Hourglass, GraduationCap, Book, FileText, ClipboardList, MoreVertical, Globe, Wallet, Languages, MousePointer2, Loader2, Send, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TodoListApp = () => {
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [input, setInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const addTodo = () => {
      if(input.trim()) { setTodos([...todos, {id: Date.now(), text: input, done: false}]); setInput(''); }
  };
  const toggleDone = (id: number) => {
      const todo = todos.find(t => t.id === id);
      if(todo && !todo.done) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
      }
      setTodos(todos.map(i => i.id === id ? {...i, done: !i.done} : i));
  };
  const clearCompleted = () => setTodos(prev => prev.filter(t => !t.done));
  
  return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-sm h-full flex flex-col relative overflow-hidden">
          {showConfetti && <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce z-10"><PartyPopper size={64} className="text-yellow-500"/></div>}
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><CheckSquare className="text-blue-500"/> Todo List</h2>
          <div className="flex gap-2 mb-4">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTodo()} className="flex-1 border p-2 rounded-xl" placeholder="Add task..."/>
              <button onClick={addTodo} className="bg-blue-600 text-white px-4 rounded-xl"><Plus/></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
              {todos.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} className="w-5 h-5 accent-green-500"/>
                      <span className={`flex-1 ${t.done ? 'line-through text-gray-400' : ''}`}>{t.text}</span>
                      <button onClick={() => setTodos(todos.filter(i => i.id !== t.id))} className="text-red-500"><Trash2 size={16}/></button>
                  </div>
              ))}
          </div>
          {todos.some(t => t.done) && (
              <button onClick={clearCompleted} className="mt-4 text-xs text-red-500 font-bold hover:underline">Clear Completed</button>
          )}
      </div>
  );
};

const HabitTrackerApp = () => {
  const [habits, setHabits] = useState([{id: 1, name: 'Drink Water', days: [false,false,true,true,false,false,false]}]);
  const resetAll = () => setHabits(prev => prev.map(h => ({...h, days: [false,false,false,false,false,false,false]})));
  return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm h-full">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-green-500"/> Habit Tracker</h2>
              <button onClick={resetAll} className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Reset</button>
          </div>
          {habits.map(h => (
              <div key={h.id} className="mb-6">
                  <h3 className="font-bold mb-2">{h.name}</h3>
                  <div className="flex justify-between gap-1">
                      {['M','T','W','T','F','S','S'].map((d, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-400">{d}</span>
                              <button 
                                onClick={() => {
                                    const newDays = [...h.days];
                                    newDays[i] = !newDays[i];
                                    setHabits(habits.map(hab => hab.id === h.id ? {...hab, days: newDays} : hab));
                                }}
                                className={`w-10 h-10 rounded-lg ${h.days[i] ? 'bg-green-500' : 'bg-gray-100'} transition-colors`}
                              />
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>
  );
};

const PluginStoreApp = () => {
    const plugins = [
        { id: 1, name: 'Dark Reader', desc: 'Force dark mode on all apps.', installed: false, icon: <Moon className="text-purple-500"/> },
        { id: 2, name: 'AdBlock Plus', desc: 'Block annoying popups.', installed: true, icon: <Shield className="text-red-500"/> },
        { id: 3, name: 'React DevTools', desc: 'Inspect component hierarchy.', installed: false, icon: <Code2 className="text-blue-500"/> },
        { id: 4, name: 'Emmet', desc: 'Faster HTML/CSS coding.', installed: false, icon: <Zap className="text-yellow-500"/> },
        { id: 5, name: 'Grammarly', desc: 'Fix spelling errors.', installed: true, icon: <Type className="text-green-500"/> },
        { id: 6, name: 'Color Picker Pro', desc: 'Advanced color tools.', installed: false, icon: <Palette className="text-pink-500"/> },
    ];
    
    const [localPlugins, setLocalPlugins] = useState(plugins);

    const toggleInstall = (id: number) => {
        setLocalPlugins(prev => prev.map(p => p.id === id ? {...p, installed: !p.installed} : p));
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Plug className="text-blue-600"/> Plugin Store</h2>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">v1.0</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localPlugins.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div className="bg-gray-50 p-2 rounded-lg">{p.icon}</div>
                            {p.installed ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Installed</span> : null}
                        </div>
                        <h3 className="font-bold text-gray-800">{p.name}</h3>
                        <p className="text-xs text-gray-500 mb-4">{p.desc}</p>
                        <button 
                            onClick={() => toggleInstall(p.id)}
                            className={`mt-auto w-full py-2 rounded-lg text-xs font-bold transition-colors ${p.installed ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {p.installed ? 'Uninstall' : 'Install'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FamilyCenterApp = () => {
    const [tab, setTab] = useState<'dashboard' | 'limits' | 'location'>('dashboard');
    const [screenTime] = useState([2, 4, 3, 5, 2, 6, 3]);

    return (
        <div className="h-full flex flex-col bg-blue-50 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center gap-2 mb-1">
                    <Users size={24}/>
                    <h2 className="text-2xl font-bold">Crafter Family Center</h2>
                </div>
                <p className="text-blue-100 text-sm">Parental Supervision & Safety</p>
            </div>
            
            <div className="flex border-b border-blue-200 bg-white">
                {[
                    {id: 'dashboard', label: 'Dashboard', icon: Activity},
                    {id: 'limits', label: 'App Limits', icon: Hourglass},
                    {id: 'location', label: 'Location', icon: MapPin}
                ].map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => setTab(t.id as any)}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${tab === t.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <t.icon size={16}/> {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Smartphone size={18}/> Screen Time Today</h3>
                            <div className="text-4xl font-black text-blue-600 mb-2">3h 45m</div>
                            <div className="flex items-end gap-1 h-24 mt-4">
                                {screenTime.map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group">
                                        <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all" style={{ height: `${(h/8)*100}%` }}></div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">{h}h</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Mon</span><span>Sun</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CraftyClassApp = () => {
    const [role, setRole] = useState<'teacher' | 'student'>('teacher');
    const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream');
    const [assignments, setAssignments] = useState([
        { id: 1, title: 'React Basics Project', due: 'Tomorrow, 11:59 PM', posted: 'Yesterday' },
        { id: 2, title: 'JavaScript Quiz', due: 'Friday, 3:00 PM', posted: '2 days ago' },
    ]);

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-600"><GraduationCap size={24}/></div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Crafty Class</h1>
                        <p className="text-xs text-gray-500">CS101 - Intro to Coding</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Plus size={20}/></button>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">T</div>
                </div>
            </div>

            {/* Banner */}
            <div className="px-6 py-2">
                <div className="h-32 bg-green-600 rounded-xl relative overflow-hidden flex items-end p-6">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="relative z-10 text-white">
                        <h2 className="text-3xl font-bold">CS101 - Intro to Coding</h2>
                        <p className="opacity-90">Section A • Semester 2</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
                {['stream', 'classwork', 'people'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setActiveTab(t as any)}
                        className={`px-6 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === t ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {activeTab === 'stream' && (
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">T</div>
                            <p className="text-gray-500 text-sm flex-1">Announce something to your class...</p>
                        </div>

                        {assignments.map(a => (
                            <div key={a.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-center group cursor-pointer hover:border-green-200">
                                <div className="p-3 bg-green-100 rounded-full text-green-600"><ClipboardList size={20}/></div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-sm">New Assignment: {a.title}</p>
                                    <p className="text-xs text-gray-500">{a.posted}</p>
                                </div>
                                <MoreVertical size={16} className="text-gray-400 opacity-0 group-hover:opacity-100"/>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'classwork' && (
                    <div className="max-w-3xl mx-auto">
                        <button className="mb-6 bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-green-700 flex items-center gap-2"><Plus size={16}/> Create</button>
                        
                        <div className="space-y-4">
                            <h3 className="text-green-600 font-bold text-lg border-b border-green-200 pb-2">Unit 1: Introduction</h3>
                            {assignments.map(a => (
                                <div key={a.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm cursor-pointer flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><FileText size={20}/></div>
                                        <span className="font-medium text-gray-800">{a.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Due {a.due}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'people' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <h3 className="text-green-600 font-bold text-xl border-b border-green-200 pb-2 mb-4 flex justify-between items-center">
                                Teachers <User size={20}/>
                            </h3>
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">T</div>
                                <span className="font-medium text-gray-800">Crafter Teacher</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-green-600 font-bold text-xl border-b border-green-200 pb-2 mb-4 flex justify-between items-center">
                                Students <span className="text-sm font-normal text-gray-500">24 students</span>
                            </h3>
                            {Array.from({length: 5}).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>
                                    <span className="font-medium text-gray-800">Student {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (BreathingApp, CrafterStudioApp, Placeholder Apps)

const BreathingApp = () => {
  const [scale, setScale] = useState(1);
  const [text, setText] = useState('Inhale');
  const [speed, setSpeed] = useState(4000);
  useEffect(() => {
      const interval = setInterval(() => {
          setText(t => t === 'Inhale' ? 'Exhale' : 'Inhale');
          setScale(s => s === 1 ? 1.5 : 1);
      }, speed);
      return () => clearInterval(interval);
  }, [speed]);
  return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-sm h-full flex flex-col items-center justify-center relative">
          <h2 className="text-2xl font-bold mb-12 flex items-center gap-2"><Wind className="text-cyan-500"/> Breathe</h2>
          <div 
            className="w-48 h-48 rounded-full bg-cyan-100 flex items-center justify-center transition-all ease-in-out"
            style={{ transform: `scale(${scale})`, transitionDuration: `${speed}ms` }}
          >
              <div className="text-2xl font-bold text-cyan-600">{text}</div>
          </div>
          <div className="absolute bottom-8 flex gap-2">
              <button onClick={()=>setSpeed(4000)} className={`px-4 py-1 rounded-full text-xs font-bold ${speed===4000 ? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}>Normal</button>
              <button onClick={()=>setSpeed(2000)} className={`px-4 py-1 rounded-full text-xs font-bold ${speed===2000 ? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}>Fast</button>
              <button onClick={()=>setSpeed(6000)} className={`px-4 py-1 rounded-full text-xs font-bold ${speed===6000 ? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}>Slow</button>
          </div>
      </div>
  );
};

const CrafterStudioApp = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'community' | 'games' | 'profile'>('home');
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState({ name: 'Crafter Fan', points: 100, subscribed: false });

    // Dummy Data
    const videos = [
        { id: 1, title: 'Building a Web OS in React', views: '1.2M', date: '2 days ago', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60' },
        { id: 2, title: 'AI Integration Tutorial', views: '800K', date: '1 week ago', thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60' },
        { id: 3, title: 'New Gaming Setup Tour', views: '2.5M', date: '2 weeks ago', thumb: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&auto=format&fit=crop&q=60' },
        { id: 4, title: 'Coding Challenge: 1 Hour', views: '500K', date: '3 weeks ago', thumb: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&auto=format&fit=crop&q=60' },
    ];

    return (
        <div className={`h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
            
            {/* Header */}
            {selectedVideo ? null : (
                <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-[#0f0f0f]' : 'bg-white'} sticky top-0 z-10`}>
                    <div className="flex items-center gap-2">
                        <Youtube className="text-red-600" size={28}/>
                        <span className="font-bold text-xl tracking-tight">Crafter Studio</span>
                    </div>
                    <div className="flex gap-4">
                        <Search size={24}/>
                        <Bell size={24}/>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {selectedVideo && (
                    <div className="absolute inset-0 bg-black z-20 flex flex-col">
                        <div className="relative aspect-video bg-gray-900 flex items-center justify-center group">
                            <img src={selectedVideo.thumb} className="w-full h-full object-cover opacity-50"/>
                            <button className="absolute p-4 bg-red-600 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                                <Play fill="white" size={32}/>
                            </button>
                            <button onClick={()=>setSelectedVideo(null)} className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white"><ArrowLeft/></button>
                        </div>
                        <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
                            <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
                            <div className="flex justify-between text-sm opacity-70 mb-4">
                                <span>{selectedVideo.views} views • {selectedVideo.date}</span>
                            </div>
                            <div className="flex justify-around mb-6 border-b pb-4 border-gray-700">
                                <div className="flex flex-col items-center gap-1"><ThumbsUp/><span className="text-xs">12K</span></div>
                                <div className="flex flex-col items-center gap-1"><Share2/><span className="text-xs">Share</span></div>
                                <div className="flex flex-col items-center gap-1"><Download/><span className="text-xs">Download</span></div>
                                <div className="flex flex-col items-center gap-1"><Gift/><span className="text-xs">Gift</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div>
                        <div className="h-32 bg-gradient-to-r from-red-600 to-black relative">
                            <div className="absolute bottom-[-24px] left-4 w-16 h-16 bg-red-600 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
                        </div>
                        <div className="pt-8 px-4 pb-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold">Crafter Channel</h2>
                            <p className="text-sm opacity-70">@crafter_studio • 1.5M subscribers</p>
                            <button className="w-full mt-4 bg-gray-100 text-black py-2 rounded-full font-bold text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-white">More about this channel</button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">Latest Video</h3>
                            <div onClick={()=>setSelectedVideo(videos[0])} className="cursor-pointer">
                                <img src={videos[0].thumb} className="w-full rounded-xl aspect-video object-cover mb-2"/>
                                <div className="flex justify-between">
                                    <h4 className="font-medium line-clamp-2">{videos[0].title}</h4>
                                    <span className="text-xs opacity-70 whitespace-nowrap ml-2">{videos[0].views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`h-16 border-t flex items-center justify-around ${darkMode ? 'bg-[#0f0f0f] border-gray-800' : 'bg-white border-gray-200'}`}>
                <button onClick={()=>setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab==='home' ? 'text-red-600' : 'opacity-50'}`}><Youtube size={20}/><span className="text-[10px]">Home</span></button>
                <button onClick={()=>setActiveTab('videos')} className={`flex flex-col items-center gap-1 ${activeTab==='videos' ? 'text-red-600' : 'opacity-50'}`}><Video size={20}/><span className="text-[10px]">Videos</span></button>
                <button onClick={()=>setActiveTab('community')} className={`flex flex-col items-center gap-1 ${activeTab==='community' ? 'text-red-600' : 'opacity-50'}`}><MessageCircle size={20}/><span className="text-[10px]">Community</span></button>
                <button onClick={()=>setActiveTab('games')} className={`flex flex-col items-center gap-1 ${activeTab==='games' ? 'text-red-600' : 'opacity-50'}`}><Gamepad2 size={20}/><span className="text-[10px]">Games</span></button>
                <button onClick={()=>setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab==='profile' ? 'text-red-600' : 'opacity-50'}`}><User size={20}/><span className="text-[10px]">Profile</span></button>
            </div>
        </div>
    )
}

const MultiplayerApp = () => {
    const [status, setStatus] = useState<'lobby' | 'connecting' | 'connected'>('lobby');
    const [roomCode, setRoomCode] = useState('');
    const [users, setUsers] = useState(['You']);
    const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
    const [input, setInput] = useState('');
    const [cursors, setCursors] = useState<{id: number, x: number, y: number, color: string}[]>([]);

    useEffect(() => {
        if(status === 'connected') {
            const interval = setInterval(() => {
                setCursors(prev => prev.map(c => ({
                    ...c,
                    x: Math.max(0, Math.min(100, c.x + (Math.random() - 0.5) * 10)),
                    y: Math.max(0, Math.min(100, c.y + (Math.random() - 0.5) * 10))
                })));
            }, 100);
            return () => clearInterval(interval);
        }
    }, [status]);

    const joinRoom = () => {
        setStatus('connecting');
        setTimeout(() => {
            setStatus('connected');
            setUsers(['You', 'Alice', 'Bob']);
            setCursors([
                { id: 1, x: 20, y: 30, color: 'bg-red-500' },
                { id: 2, x: 80, y: 60, color: 'bg-blue-500' }
            ]);
            setMessages([{user: 'System', text: 'Connected to Room ' + (roomCode || 'Public')}]);
        }, 1500);
    };

    const sendMessage = () => {
        if(!input) return;
        setMessages(p => [...p, {user: 'You', text: input}]);
        setInput('');
        setTimeout(() => {
            setMessages(p => [...p, {user: 'Alice', text: 'Hey there! Working on the new note?'}]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-indigo-50 rounded-3xl overflow-hidden relative">
            {status === 'lobby' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                        <Users size={48} className="text-indigo-600"/>
                    </div>
                    <h2 className="text-3xl font-black text-indigo-900 mb-2">Crafty Multiplayer</h2>
                    <p className="text-indigo-600 mb-8">Collaborate on notes, code, and sketches in real-time.</p>
                    
                    <div className="w-full max-w-xs space-y-4">
                        <input 
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            placeholder="Enter Room Code" 
                            className="w-full p-4 rounded-xl border-none outline-none shadow-sm text-center font-mono text-lg uppercase tracking-widest"
                        />
                        <button onClick={joinRoom} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                            Join Room
                        </button>
                        <button onClick={joinRoom} className="w-full py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:bg-indigo-50 transition-colors">
                            Create New Room
                        </button>
                    </div>
                </div>
            )}

            {status === 'connecting' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4"/>
                    <p className="text-indigo-900 font-bold">Connecting to servers...</p>
                </div>
            )}

            {status === 'connected' && (
                <div className="flex-1 flex flex-col relative">
                    <div className="bg-white p-4 flex justify-between items-center shadow-sm z-10">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-bold text-indigo-900">Room: {roomCode || 'X92B'}</span>
                        </div>
                        <div className="flex -space-x-2">
                            {users.map((u, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold" title={u}>
                                    {u.charAt(0)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-white m-4 rounded-2xl shadow-inner border border-indigo-100 p-8 relative overflow-hidden">
                        <h1 className="text-4xl font-bold text-gray-200">Shared Canvas</h1>
                        <p className="text-gray-300 mt-2">Start typing or drawing...</p>
                        
                        {cursors.map(c => (
                            <div 
                                key={c.id} 
                                className="absolute transition-all duration-300 ease-linear z-20 flex flex-col gap-1"
                                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                            >
                                <MousePointer2 className={`${c.color.replace('bg-', 'text-')} fill-current`} size={24}/>
                                <span className={`text-[10px] text-white px-2 py-0.5 rounded-full ${c.color}`}>{c.id === 1 ? 'Alice' : 'Bob'}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-48 bg-white border-t border-indigo-100 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {messages.map((m, i) => (
                                <div key={i} className="text-sm">
                                    <span className="font-bold text-indigo-900">{m.user}: </span>
                                    <span className="text-gray-600">{m.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-indigo-50 flex gap-2">
                            <input 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                className="flex-1 p-2 bg-indigo-50 rounded-lg outline-none text-sm"
                                placeholder="Chat..."
                            />
                            <button onClick={sendMessage} className="p-2 bg-indigo-600 text-white rounded-lg"><Send size={16}/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const WebPublishingApp = () => {
    const [step, setStep] = useState(1);
    const [url, setUrl] = useState('');
    
    const handlePublish = () => {
        setStep(2);
        setTimeout(() => {
            setStep(3);
            setUrl(`https://crafter.site/note-${Math.floor(Math.random()*10000)}`);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden text-center relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 transform rotate-3">
                    <Globe size={48} className="text-emerald-600"/>
                </div>

                <h1 className="text-3xl font-black text-emerald-900 mb-2">Web Publisher</h1>
                <p className="text-emerald-700 mb-8 max-w-xs">Turn your notes and apps into live websites instantly.</p>

                {step === 1 && (
                    <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                            <FileText className="text-gray-400"/>
                            <div className="text-left flex-1">
                                <p className="font-bold text-sm">Project Alpha.note</p>
                                <p className="text-xs text-gray-400">Last edited 2m ago</p>
                            </div>
                            <button className="text-emerald-600 text-xs font-bold">Change</button>
                        </div>
                        <button onClick={handlePublish} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                            <Upload size={18}/> Publish to Web
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-emerald-600 animate-spin mb-4"/>
                        <p className="font-bold text-emerald-800">Building & Deploying...</p>
                        <p className="text-xs text-emerald-600 mt-2">Optimizing assets...</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg animate-in zoom-in">
                        <div className="text-green-500 mb-4 flex justify-center"><Check size={48}/></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Published Successfully!</h2>
                        
                        <div className="bg-gray-100 p-3 rounded-xl flex items-center justify-between mb-4">
                            <span className="text-xs font-mono text-gray-600 truncate mr-2">{url}</span>
                            <button onClick={() => { navigator.clipboard.writeText(url); alert('Copied!'); }} className="text-emerald-600"><Copy size={16}/></button>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-200">
                                View Site
                            </button>
                            <button className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
                                QR Code
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlaceholderApp = ({name, icon}: {name: string, icon?: React.ReactNode}) => (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl shadow-sm text-center p-8">
        <div className="text-4xl mb-4 grayscale opacity-50">{icon || '📱'}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-500">This app is currently under development.</p>
    </div>
);

const BmiCalcApp = () => <PlaceholderApp name="BMI Calculator" />;
const DiscountCalcApp = () => <PlaceholderApp name="Discount Calculator" />;
const TipCalcApp = () => <PlaceholderApp name="Tip Calculator" />;
const QrGenApp = () => <PlaceholderApp name="QR Generator" />;
const WhiteboardApp = () => <PlaceholderApp name="Whiteboard" />;
const ColorPickerApp = () => <PlaceholderApp name="Color Picker" />;
const JsonFormatterApp = () => <PlaceholderApp name="JSON Formatter" />;
const PianoApp = () => <PlaceholderApp name="Piano" />;
const DrumPadApp = () => <PlaceholderApp name="Drum Pad" />;
const WorldClockApp = () => <PlaceholderApp name="World Clock" />;
const StopwatchApp = () => <PlaceholderApp name="Stopwatch" />;
const TimerApp = () => <PlaceholderApp name="Timer" />;
const QuotesApp = () => <PlaceholderApp name="Quotes" />;
const JokesApp = () => <PlaceholderApp name="Jokes" />;
const SnakeGameApp = () => <PlaceholderApp name="Snake Game" />;
const PongGameApp = () => <PlaceholderApp name="Pong Game" />;
const Game2048App = () => <PlaceholderApp name="2048 Game" />;
const DevSuiteApp = () => <PlaceholderApp name="Dev Suite" />;
const FocusSuiteApp = () => <PlaceholderApp name="Focus Suite" />;
const RandomSuiteApp = () => <PlaceholderApp name="Random Suite" />;
const TextSuiteApp = () => <PlaceholderApp name="Text Suite" />;
const MathPlusApp = () => <PlaceholderApp name="Math Plus" />;
const PeriodTrackerApp = () => <PlaceholderApp name="Period Tracker" />;
const WaterIntakeApp = () => <PlaceholderApp name="Water Intake" />;
const MetronomeApp = () => <PlaceholderApp name="Metronome" />;
const GuitarTunerApp = () => <PlaceholderApp name="Guitar Tuner" />;
const MorseCodeApp = () => <PlaceholderApp name="Morse Code" />;
const UnixTimeApp = () => <PlaceholderApp name="Unix Time" />;
const GradientGenApp = () => <PlaceholderApp name="Gradient Generator" />;
const ReactionTestApp = () => <PlaceholderApp name="Reaction Test" />;
const TypingTestApp = () => <PlaceholderApp name="Typing Test" />;
const MemoryGameApp = () => <PlaceholderApp name="Memory Game" />;
const SudokuApp = () => <PlaceholderApp name="Sudoku" />;
const MinesweeperApp = () => <PlaceholderApp name="Minesweeper" />;
const AsciiArtApp = () => <PlaceholderApp name="ASCII Art" />;
const HackerTyperApp = () => <PlaceholderApp name="Hacker Typer" />;
const DrawGuessApp = () => <PlaceholderApp name="Draw Guess" />;

const StocksApp = () => <PlaceholderApp name="Stocks" icon={<Activity size={48}/>} />;
const NewsApp = () => <PlaceholderApp name="News" icon={<FileJson size={48}/>} />;
const MapsApp = () => <PlaceholderApp name="Maps" icon={<MapPin size={48}/>} />;
const PhotosApp = () => <PlaceholderApp name="Photos" icon={<Image size={48}/>} />;
const WalletApp = () => <PlaceholderApp name="Wallet" icon={<Wallet size={48}/>} />;
const HealthApp = () => <PlaceholderApp name="Health" icon={<Heart size={48}/>} />;
const PasswordsApp = () => <PlaceholderApp name="Passwords" icon={<Lock size={48}/>} />;
const TranslateApp = () => <PlaceholderApp name="Translate" icon={<Languages size={48}/>} />;
const PodcastsApp = () => <PlaceholderApp name="Podcasts" icon={<Mic2 size={48}/>} />;

interface ExtraAppsProps {
  view: ViewMode;
}

const ExtraApps: React.FC<ExtraAppsProps> = ({ view }) => {
  switch (view) {
    case ViewMode.TodoList: return <TodoListApp />;
    case ViewMode.HabitTracker: return <HabitTrackerApp />;
    case ViewMode.Breathing: return <BreathingApp />;
    case ViewMode.BmiCalc: return <BmiCalcApp />;
    case ViewMode.DiscountCalc: return <DiscountCalcApp />;
    case ViewMode.TipCalc: return <TipCalcApp />;
    case ViewMode.QrGen: return <QrGenApp />;
    case ViewMode.Whiteboard: return <WhiteboardApp />;
    case ViewMode.ColorPicker: return <ColorPickerApp />;
    case ViewMode.JsonFormatter: return <JsonFormatterApp />;
    case ViewMode.Piano: return <PianoApp />;
    case ViewMode.DrumPad: return <DrumPadApp />;
    case ViewMode.WorldClock: return <WorldClockApp />;
    case ViewMode.Stopwatch: return <StopwatchApp />;
    case ViewMode.Timer: return <TimerApp />;
    case ViewMode.Quotes: return <QuotesApp />;
    case ViewMode.Jokes: return <JokesApp />;
    case ViewMode.SnakeGame: return <SnakeGameApp />;
    case ViewMode.PongGame: return <PongGameApp />;
    case ViewMode.Game2048: return <Game2048App />;
    case ViewMode.DevSuite: return <DevSuiteApp />;
    case ViewMode.FocusSuite: return <FocusSuiteApp />;
    case ViewMode.RandomSuite: return <RandomSuiteApp />;
    case ViewMode.TextSuite: return <TextSuiteApp />;
    case ViewMode.MathPlus: return <MathPlusApp />;
    case ViewMode.PeriodTracker: return <PeriodTrackerApp />;
    case ViewMode.WaterIntake: return <WaterIntakeApp />;
    case ViewMode.Metronome: return <MetronomeApp />;
    case ViewMode.GuitarTuner: return <GuitarTunerApp />;
    case ViewMode.MorseCode: return <MorseCodeApp />;
    case ViewMode.UnixTime: return <UnixTimeApp />;
    case ViewMode.GradientGen: return <GradientGenApp />;
    case ViewMode.ReactionTest: return <ReactionTestApp />;
    case ViewMode.TypingTest: return <TypingTestApp />;
    case ViewMode.MemoryGame: return <MemoryGameApp />;
    case ViewMode.Sudoku: return <SudokuApp />;
    case ViewMode.Minesweeper: return <MinesweeperApp />;
    case ViewMode.AsciiArt: return <AsciiArtApp />;
    case ViewMode.HackerTyper: return <HackerTyperApp />;
    case ViewMode.DrawGuess: return <DrawGuessApp />;
    case ViewMode.CrafterStudio: return <CrafterStudioApp />;
    case ViewMode.PluginStore: return <PluginStoreApp />;
    case ViewMode.FamilyCenter: return <FamilyCenterApp />;
    case ViewMode.CraftyClass: return <CraftyClassApp />;
    case ViewMode.WebPublish: return <WebPublishingApp />;
    case ViewMode.Multiplayer: return <MultiplayerApp />;
    case ViewMode.Stocks: return <StocksApp />;
    case ViewMode.News: return <NewsApp />;
    case ViewMode.Maps: return <MapsApp />;
    case ViewMode.Photos: return <PhotosApp />;
    case ViewMode.Wallet: return <WalletApp />;
    case ViewMode.Health: return <HealthApp />;
    case ViewMode.Passwords: return <PasswordsApp />;
    case ViewMode.Translate: return <TranslateApp />;
    case ViewMode.Podcasts: return <PodcastsApp />;
    default: return <div className="p-10 text-center text-gray-500">Select an App</div>;
  }
};

export default ExtraApps;