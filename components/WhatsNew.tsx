import React from 'react';
import { Rocket, Star, Code, ShieldCheck, ShoppingBag, Zap, Mic, Cloud, Download, Palette, Image, Bot, Clock, Gamepad2, Mail, Sigma, Film, Wand2, Gift, HelpCircle, FileCode, Sparkles, Terminal, Lock, Maximize2, Bug, Monitor, BookOpen, Globe, BookA, Medal, Coins, Smartphone, Music, Calculator, Layers, Smile, Eye, Volume2, Timer, Moon, Key, CheckSquare, Heart, Type, Copy, Mic2, PenTool, Search, Truck, Map, Crown, Sword, Crosshair, MapPin, Activity, Award, UserPlus, Server, BarChart, Bell, ArrowRightLeft, LayoutGrid, Battery, Thermometer, FileX, History, Divide, Watch, QrCode, Shuffle, EyeOff, Hash, Droplets, Guitar, Radio, Bomb, Grid, Keyboard, PartyPopper, Trash2, StickyNote, Flame, Box, Package, Youtube, Video, Users, Plug, CheckCircle, Wrench, GraduationCap, Clock3, Cpu, BrainCircuit } from 'lucide-react';

const WhatsNew: React.FC = () => {
  const updates = [
    {
        version: 'v27.5',
        date: 'Just Now',
        title: 'Neural Update',
        features: [
            { icon: <Sparkles className="text-amber-500"/>, text: 'Crafter Studio AI: Added to Taskbar 2 for instant access.' },
            { icon: <Box className="text-purple-500"/>, text: 'Taskbar 2: Quick dock for Creator Studio, Class, Family, IDE & AI.' },
            { icon: <BrainCircuit className="text-blue-500"/>, text: 'Neural Interface: Redesigned Hero Banner with advanced animations.' },
        ]
    },
    {
        version: 'Coming Soon',
        date: 'Future',
        title: 'The Innovation Wave',
        features: [
            { icon: <Users className="text-blue-500"/>, text: 'Multiplayer Mode: Collaborate on notes in real-time.' },
            { icon: <Mic className="text-purple-500"/>, text: 'Voice Assistant 2.0: Talk to Crafter AI naturally.' },
            { icon: <Cloud className="text-cyan-500"/>, text: 'Real-time Sync: Instant cross-device updates.' },
            { icon: <Globe className="text-green-500"/>, text: 'Web Publishing: Publish your notes as webpages.' },
        ]
    },
    {
        version: 'v27.0',
        date: 'Archive',
        title: 'Crafty Class & IDE',
        features: [
            { icon: <GraduationCap className="text-green-500"/>, text: 'Crafty Class: Manage courses, assignments, and students.' },
            { icon: <Wrench className="text-blue-500"/>, text: 'Auto-Fix: AI scans and patches bugs automatically.' },
        ]
    },
    {
        version: 'v26.0',
        date: 'Archive',
        title: 'Family & Plugin Update',
        features: [
            { icon: <Users className="text-blue-500"/>, text: 'Crafter Family Center: Manage screen time and digital safety.' },
            { icon: <Plug className="text-purple-500"/>, text: 'Plugin Store: Install extensions like Dark Reader, AdBlock, and more.' },
            { icon: <Youtube className="text-red-500"/>, text: 'Creator Studio: Professional tools for content creators.' },
        ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-slide-in">
      
      {/* Remade Hero Banner v27.5 - Neural Network */}
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-12 aspect-[2/1] group cursor-pointer bg-black border-4 border-gray-900">
         
         {/* Animated Background - Neural Grid */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40"></div>
         <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-purple-900/50 to-black"></div>
         
         {/* Floating Particles / Nodes */}
         <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
         <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-700"></div>
         <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-float"></div>
         
         {/* Central AI Core Animation */}
         <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
             <div className="w-[500px] h-[500px] border border-blue-500/20 rounded-full animate-spin-slow"></div>
             <div className="absolute w-[400px] h-[400px] border border-purple-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
             <div className="absolute w-[300px] h-[300px] border-2 border-dotted border-white/10 rounded-full animate-pulse"></div>
         </div>

         {/* Content */}
         <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 z-10">
             
             {/* Badge */}
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-sm font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-in slide-in-from-top duration-700">
                 <BrainCircuit size={16} className="text-blue-400 animate-pulse"/> Neural Update 27.5
             </div>
             
             {/* Title with Shimmer */}
             <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-2xl animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300">
                 Crafter Studio AI
             </h1>
             
             {/* Description */}
             <p className="max-w-xl text-lg md:text-xl font-medium text-gray-300 mb-8 leading-relaxed drop-shadow-md">
                 Integrated directly into Taskbar 2. Code, create, and solve faster than ever with our most advanced neural engine.
             </p>
             
             {/* Buttons */}
             <div className="flex gap-4">
                 <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 group-hover:bg-blue-50">
                     <Sparkles size={20} className="fill-current text-amber-500"/> Try AI Now
                 </button>
             </div>
         </div>
         
         {/* Bottom Glow */}
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Release Notes */}
          <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="fill-current text-yellow-400" /> Release Notes
              </h2>
              
              <div className="space-y-6">
                  {updates.map((update, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${update.version === 'Coming Soon' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}>{update.version} • {update.date}</span>
                              </div>
                          </div>
                          <div className="grid gap-3">
                              {update.features.map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                      {feat.icon}
                                      <span className="font-medium text-gray-700">{feat.text}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Rocket className="text-cyan-600" /> Roadmap
              </h2>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-3xl border border-cyan-100">
                  <p className="text-sm text-cyan-800 font-bold mb-4 uppercase tracking-wider opacity-70">Coming Soon</p>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white text-cyan-600 rounded-lg shadow-sm"><Cloud/></div>
                          <div><h4 className="font-bold text-gray-900">Real-time Sync</h4></div>
                      </div>
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white text-cyan-600 rounded-lg shadow-sm"><Code/></div>
                          <div><h4 className="font-bold text-gray-900">Plugin Dev Kit</h4></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white text-cyan-600 rounded-lg shadow-sm"><Clock3/></div>
                          <div><h4 className="font-bold text-gray-900">Time Travel Backups</h4></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default WhatsNew;