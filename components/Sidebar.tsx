import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile, MarketItem } from '../services/types';
import { SupermanCapeIcon, ShieldIcon, StarIcon, RocketIcon, BoltIcon, CrownIcon, SantaIcon } from '../constants';
import { StickyNote, Settings, X, BrainCircuit, Calculator, Calendar, Smartphone, Terminal, ShieldCheck, ShoppingBag, Trash2, Megaphone, Palette, Gamepad2, Cloud, Crown, FunctionSquare, HelpCircle, FileCode, Bug, Medal, Smile, Sun, CloudRain, CloudSun, Mic, ArrowRightLeft, PenTool, LayoutGrid, CheckSquare, Activity, Music, QrCode, FileJson, Clock, Quote, Divide, Watch, Globe, Wind, Search, Flame, Box, Code, Bot, Radio, Youtube, Video, Plug, Users, GraduationCap, Download, MapPin, Image, Wallet, Heart, Lock, Languages, Mic2, ChevronDown } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  logoType: 'cape' | 'shield' | 'star' | 'rocket' | 'bolt' | 'crown' | 'santa' | string;
  profile: UserProfile;
  installedApps?: MarketItem[];
  onOpenApp?: (app: MarketItem) => void;
  onUninstallApp?: (id: string) => void;
  onInstallApp?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose, currentView, setView, logoType, profile, 
    installedApps = [], onOpenApp, onUninstallApp, onInstallApp 
}) => {
  const [weather, setWeather] = useState({ temp: 24, condition: 'Sunny' });
  const [searchTerm, setSearchTerm] = useState('');
  const [compactMode, setCompactMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Essentials');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Essentials', 'Creative', 'Life']);

  useEffect(() => {
      const interval = setInterval(() => {
          const conditions = ['Sunny', 'Cloudy', 'Rainy'];
          setWeather({
              temp: Math.floor(Math.random() * 10) + 20,
              condition: conditions[Math.floor(Math.random() * conditions.length)]
          });
      }, 60000);
      return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
      if (weather.condition === 'Rainy') return <CloudRain size={16} className="text-blue-400"/>;
      if (weather.condition === 'Cloudy') return <CloudSun size={16} className="text-gray-400"/>;
      return <Sun size={16} className="text-yellow-500"/>;
  };

  const getLogo = () => {
    switch (logoType) {
      case 'shield': return <ShieldIcon className="w-10 h-10 text-secondary" />;
      case 'star': return <StarIcon className="w-10 h-10 text-accent" />;
      case 'rocket': return <RocketIcon className="w-10 h-10 text-primary" />;
      case 'bolt': return <BoltIcon className="w-10 h-10 text-accent" />;
      case 'crown': return <CrownIcon className="w-10 h-10 text-amber-500" />;
      case 'santa': return <SantaIcon className="w-10 h-10 text-red-600" />;
      case 'cape': return <SupermanCapeIcon className="w-10 h-10 text-primary" />;
      default: {
          const installedLogo = installedApps.find(a => a.id === logoType);
          if (installedLogo) {
              return <img src={installedLogo.image} alt="logo" className="w-10 h-10 rounded-lg object-cover" />;
          }
          return <SupermanCapeIcon className="w-10 h-10 text-primary" />;
      }
    }
  };

  const toggleCategory = (cat: string) => {
      setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const categories = [
      {
          name: 'Essentials',
          items: [
            { id: ViewMode.Notes, label: 'Notes', icon: StickyNote, color: 'text-yellow-500', badge: '3' },
            { id: ViewMode.CrafterCloud, label: 'Cloud', icon: Cloud, color: 'text-blue-500' },
            { id: ViewMode.Marketplace, label: 'Store', icon: ShoppingBag, color: 'text-pink-500' },
            { id: ViewMode.WebPublish, label: 'Publish', icon: Globe, color: 'text-green-500', isNew: true },
            { id: ViewMode.Multiplayer, label: 'Multiplayer', icon: Users, color: 'text-indigo-500', isNew: true },
          ]
      },
      {
          name: 'Creative',
          items: [
            { id: ViewMode.ThemeStudio, label: 'Themes', icon: Palette, color: 'text-purple-500' },
            { id: ViewMode.StickerMaker, label: 'Stickers', icon: Smile, color: 'text-pink-400' },
            { id: ViewMode.Sketchpad, label: 'Sketch', icon: PenTool, color: 'text-orange-500' },
            { id: ViewMode.CrafterAI, label: 'AI Studio', icon: BrainCircuit, color: 'text-amber-500' },
            { id: ViewMode.CodeRunner, label: 'Code', icon: Terminal, color: 'text-gray-700' },
          ]
      },
      {
          name: 'Life',
          items: [
            { id: ViewMode.Calendar, label: 'Calendar', icon: Calendar, color: 'text-red-500' },
            { id: ViewMode.Stocks, label: 'Stocks', icon: Activity, color: 'text-green-600', isNew: true },
            { id: ViewMode.News, label: 'News', icon: FileJson, color: 'text-blue-600', isNew: true },
            { id: ViewMode.Maps, label: 'Maps', icon: MapPin, color: 'text-green-500', isNew: true },
            { id: ViewMode.Photos, label: 'Photos', icon: Image, color: 'text-purple-500', isNew: true },
            { id: ViewMode.Wallet, label: 'Wallet', icon: Wallet, color: 'text-amber-600', isNew: true },
            { id: ViewMode.Health, label: 'Health', icon: Heart, color: 'text-red-500', isNew: true },
          ]
      },
      {
          name: 'Tools',
          items: [
            { id: ViewMode.Calculator, label: 'Calc', icon: Calculator, color: 'text-gray-600' },
            { id: ViewMode.Passwords, label: 'Passwords', icon: Lock, color: 'text-yellow-600', isNew: true },
            { id: ViewMode.Translate, label: 'Translate', icon: Languages, color: 'text-blue-400', isNew: true },
            { id: ViewMode.VoiceRecorder, label: 'Recorder', icon: Mic, color: 'text-red-500' },
            { id: ViewMode.UnitConverter, label: 'Convert', icon: ArrowRightLeft, color: 'text-orange-500' },
            { id: ViewMode.Podcasts, label: 'Podcasts', icon: Mic2, color: 'text-purple-600', isNew: true },
            { id: ViewMode.Radio, label: 'Radio', icon: Radio, color: 'text-pink-500' },
          ]
      },
      {
          name: 'System',
          items: [
            { id: ViewMode.Settings, label: 'Settings', icon: Settings, color: 'text-gray-500' },
            { id: ViewMode.Bin, label: 'Bin', icon: Trash2, color: 'text-red-500' },
            { id: ViewMode.FlashClear, label: 'Cleaner', icon: ShieldCheck, color: 'text-green-500' },
            { id: ViewMode.WhatsNew, label: 'Updates', icon: Megaphone, color: 'text-blue-500' },
          ]
      }
  ];

  const dynamicApps = installedApps.filter(app => 
      ['AI', 'Game', 'App', 'Tool'].includes(app.category) && 
      !categories.flatMap(c => c.items).some(n => n.label === app.title)
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div 
        onDoubleClick={() => setCompactMode(!compactMode)}
        className={`
        fixed top-0 left-0 h-full bg-white/90 backdrop-blur-2xl border-r border-white/20 shadow-2xl z-50 transition-all duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 flex flex-col
        ${compactMode ? 'w-20' : 'w-72'}
      `}>
        
        {/* Header with Glassmorphism */}
        <div className={`h-24 flex items-center ${compactMode ? 'justify-center' : 'justify-between px-6'} border-b border-gray-100/50 bg-gradient-to-b from-white/80 to-transparent`}>
          <div className="flex items-center gap-3">
             <div className="animate-float hover:animate-spin-slow transition-all duration-1000 p-1 rounded-full hover:bg-blue-50/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               {getLogo()}
             </div>
             {!compactMode && (
                 <div>
                     <span className="font-black text-xl tracking-tight text-gray-800 block drop-shadow-sm">Crafty</span>
                     <span className="text-[10px] text-blue-500 font-bold tracking-widest uppercase bg-blue-50 px-1 rounded">OS 6.0</span>
                 </div>
             )}
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Info Widget */}
        {!compactMode && (
            <div className="mx-4 mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between shadow-sm group hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {getWeatherIcon()}
                        <span className="text-xs font-bold text-gray-700">{weather.condition}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">San Francisco</span>
                </div>
                <span className="text-xl font-black text-blue-600">{weather.temp}°</span>
            </div>
        )}

        {/* Search */}
        {!compactMode && (
            <div className="px-4 mt-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search apps..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100/80 pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 transition-all border border-transparent focus:bg-white shadow-inner"
                    />
                </div>
            </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          
          {categories.map((cat) => (
              <div key={cat.name} className="mb-2">
                  {!compactMode && (
                      <button 
                        onClick={() => toggleCategory(cat.name)}
                        className="flex items-center justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 hover:text-gray-600 transition-colors mb-1"
                      >
                          {cat.name}
                          <ChevronDown size={12} className={`transition-transform ${expandedCategories.includes(cat.name) ? 'rotate-180' : ''}`}/>
                      </button>
                  )}
                  
                  {/* Category Items */}
                  {(compactMode || expandedCategories.includes(cat.name)) && (
                      <div className="space-y-1">
                          {cat.items.filter(i => i.label.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                    setView(item.id);
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden
                                    ${currentView === item.id 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 shadow-sm border border-blue-100' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}
                                    ${compactMode ? 'justify-center p-3' : ''}
                                `}
                                title={item.label}
                              >
                                {currentView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded-r-full"></div>}
                                <item.icon size={compactMode ? 24 : 18} className={`transition-transform group-hover:scale-110 ${item.color} ${currentView === item.id ? 'opacity-100' : 'opacity-80'}`} />
                                {!compactMode && (
                                    <>
                                        <span className="truncate flex-1 text-left text-sm">{item.label}</span>
                                        {/* Badges */}
                                        {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm">{item.badge}</span>}
                                        {item.isNew && <span className="bg-green-500 text-white text-[9px] font-bold px-1 rounded uppercase tracking-wide">New</span>}
                                    </>
                                )}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          ))}

          {dynamicApps.length > 0 && (
             <>
               {!compactMode && (
                   <div className="pt-2 pb-1 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                       <span>Installed</span>
                       <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{dynamicApps.length}</span>
                   </div>
               )}
               {compactMode && <div className="h-px bg-gray-200 my-2 mx-4"></div>}
               {dynamicApps.map(app => (
                   <div key={app.id} className="group relative animate-in slide-in-from-left-2">
                        <button
                            onClick={() => {
                                if (onOpenApp) onOpenApp(app);
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium
                                ${currentView === ViewMode.DynamicApp || (currentView as any) === app.id ? 'bg-purple-50 text-purple-900 border border-purple-100' : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'}
                                ${compactMode ? 'justify-center' : ''}
                            `}
                            title={app.title}
                        >
                            <img src={app.image} alt="icon" className="w-5 h-5 rounded-md object-cover shadow-sm"/>
                            {!compactMode && <span className="truncate text-sm">{app.title}</span>}
                        </button>
                        {onUninstallApp && !compactMode && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); onUninstallApp(app.id); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                title="Uninstall"
                             >
                                 <Trash2 size={12}/>
                             </button>
                        )}
                   </div>
               ))}
             </>
          )}
        </nav>

        {/* Install Button */}
        {!compactMode && onInstallApp && (
            <div className="px-4 pb-2">
                <button 
                    onClick={onInstallApp}
                    className="w-full bg-black text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-900 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-gray-800"
                >
                    <Download size={16} className="group-hover:animate-bounce"/> Download App (APK)
                </button>
            </div>
        )}

        {/* Profile Footer */}
        {!compactMode && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-sm">
                        {profile.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-gray-800 truncate">{profile.name}</p>
                            <div className={`w-2 h-2 rounded-full ${true ? 'bg-green-500' : 'bg-gray-300'} border border-white shadow-sm`}></div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            {profile.storagePlan === 'max' ? <Crown size={10} className="text-yellow-500 fill-current"/> : <Cloud size={10}/>}
                            {profile.storagePlan === 'max' ? 'Studio Max' : 'Free Plan'}
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </>
  );
};

export default Sidebar;