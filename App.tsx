
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Taskbar2 from './components/Taskbar2';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import CrafterAI from './components/CrafterAI';
import Settings from './components/Settings';
import HelloNumbers from './components/HelloNumbers';
import DigitalCalendar from './components/DigitalCalendar';
import CraftyPhone from './components/CraftyPhone';
import CodeRunner from './components/CodeRunner';
import XmlRunner from './components/XmlRunner';
import AndroidStudio from './components/AndroidStudio';
import FlashClear from './components/FlashClear';
import Marketplace from './components/Marketplace';
import WhatsNew from './components/WhatsNew';
import ThemeStudio from './components/ThemeStudio';
import EuroTruckPixel from './components/EuroTruckPixel';
import SanAndreasMini from './components/SanAndreasMini';
import CrafterCloud from './components/CrafterCloud';
import MathStudio from './components/MathStudio';
import HelperAI from './components/HelperAI';
import CraftyBug from './components/CraftyBug';
import HelloCpu from './components/HelloCpu';
import StoryReader from './components/StoryReader';
import Achievements from './components/Achievements';
import StickerMaker from './components/StickerMaker';
import VoiceRecorder from './components/VoiceRecorder';
import UnitConverter from './components/UnitConverter';
import TicTacToe from './components/TicTacToe';
import CommandBlock from './components/CommandBlock';
import CrafterBoy from './components/CrafterBoy';
import RadioApp from './components/RadioApp';
import ExtraApps from './components/ExtraApps';
import { Note, NoteColor, ViewMode, AppSettings, UserProfile, MarketItem, Achievement } from './services/types';
import { Plus, Trash2, RotateCcw, Box, Layers, Palette, Type, Minimize2, Copy, Search, ArrowRight, Zap, Sword, SortAsc, SortDesc, ListFilter, StickyNote } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const MasonryGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 pb-20">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  // --- STATE ---
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Notes);
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'date-desc'|'date-asc'|'title-asc'|'title-desc'>('date-desc');
  const [stickyNote, setStickyNote] = useState<{content: string, visible: boolean}>({content: '', visible: false});
  const [keySequence, setKeySequence] = useState<string[]>([]);
  
  // App Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // App Store State
  const [installedItems, setInstalledItems] = useState<MarketItem[]>([]);
  const [binItems, setBinItems] = useState<MarketItem[]>([]);
  const [activeDynamicApp, setActiveDynamicApp] = useState<MarketItem | null>(null);
  const [activeStory, setActiveStory] = useState<MarketItem | null>(null);

  // Settings & Profile
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    font: 'sans',
    fontSize: 'md',
    logoType: 'cape',
    zenMode: false,
    combatMode: false,
    developerMode: false,
    wallpaper: '',
    sounds: true,
    blueLight: false
  });
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Crafter',
    age: '20',
    avatarUrl: '',
    storagePlan: 'basic',
    coins: 0,
    unlockedAchievements: [],
    exp: 0,
    level: 1,
    rank: 'Rookie',
    streak: 0,
    lastLogin: Date.now()
  });

  const [allAchievements] = useState<Achievement[]>([
      { id: 'first-note', title: 'First Words', description: 'Write your first note', reward: 50, icon: '📝' },
      { id: 'first-ai', title: 'AI Explorer', description: 'Use Crafter AI for the first time', reward: 100, icon: '🤖' },
      { id: 'rich', title: 'Big Spender', description: 'Buy a Premium item in Marketplace', reward: 200, icon: '💎' },
      { id: 'gamer', title: 'Gamer', description: 'Install a game', reward: 50, icon: '🎮' },
      { id: 'cloud-user', title: 'Cloud Native', description: 'Visit Crafter Cloud', reward: 50, icon: '☁️' },
      { id: 'sticker-artist', title: 'Sticker Artist', description: 'Create a custom sticker', reward: 100, icon: '🎨' },
      { id: 'sticky-note', title: 'Sticky Note', description: 'Use a sticker in a note', reward: 20, icon: '🖼️' },
      { id: 'math-whiz', title: 'Math Whiz', description: 'Use Math Studio', reward: 50, icon: '📐' },
      { id: 'coder', title: 'Coder', description: 'Run code in Code Runner', reward: 50, icon: '💻' },
      { id: 'xml-expert', title: 'XML Expert', description: 'Run XML code', reward: 50, icon: '📄' },
      { id: 'bug-hunter', title: 'Bug Hunter', description: 'Report a bug', reward: 100, icon: '🐛' },
      { id: 'secure', title: 'Secure', description: 'Lock a note with password', reward: 30, icon: '🔒' },
      { id: 'social', title: 'Social', description: 'Open Messages on Phone', reward: 20, icon: '💬' },
      { id: 'dj', title: 'DJ', description: 'Open Music on Phone', reward: 20, icon: '🎵' },
      { id: 'clean-freak', title: 'Clean Freak', description: 'Run Flash Clear', reward: 50, icon: '🧹' },
      { id: 'night-owl', title: 'Night Owl', description: 'Switch to Dark Mode', reward: 20, icon: '🌙' },
      { id: 'customizer', title: 'Customizer', description: 'Change Font Style', reward: 20, icon: '🔠' },
      { id: 'branded', title: 'Branded', description: 'Change App Logo', reward: 50, icon: '🏷️' },
      { id: 'wealthy', title: 'Wealthy', description: 'Earn 1000 CNC', reward: 100, icon: '💰' },
      { id: 'millionaire', title: 'Millionaire', description: 'Earn 5000 CNC', reward: 500, icon: '🏛️' },
      { id: 'reader', title: 'Reader', description: 'Open a Story', reward: 50, icon: '📖' },
      { id: 'trucker', title: 'Trucker', description: 'Play Euro Truck', reward: 50, icon: '🚛' },
      { id: 'gangster', title: 'Gangster', description: 'Play San Andreas Mini', reward: 50, icon: '🔫' },
      { id: 'scientist', title: 'Scientist', description: 'Use Calculator', reward: 20, icon: '🧮' },
      { id: 'organized', title: 'Organized', description: 'Pin a note', reward: 20, icon: '📌' },
      { id: 'hoarder', title: 'Hoarder', description: 'Create 10 notes', reward: 100, icon: '📦' },
      { id: 'master-hoarder', title: 'Master Hoarder', description: 'Create 50 notes', reward: 300, icon: '🏢' },
      { id: 'deleted', title: 'Deleted', description: 'Delete a note', reward: 10, icon: '🗑️' },
      { id: 'undead', title: 'Undead', description: 'Restore a deleted note', reward: 20, icon: '🧟' },
      { id: 'polyglot', title: 'Polyglot', description: 'Use Malayalam Mode in AI', reward: 50, icon: '🗣️' },
      { id: 'grammarian', title: 'Grammarian', description: 'Use Grammar Mode in AI', reward: 50, icon: '✍️' },
      { id: 'photographer', title: 'Photographer', description: 'Open Camera on Phone', reward: 20, icon: '📸' },
      { id: 'developer', title: 'Developer', description: 'Use Dev Mode in AI', reward: 50, icon: '🛠️' },
      { id: 'voice-artist', title: 'Voice Artist', description: 'Record a voice note', reward: 30, icon: '🎤' },
      { id: 'converter-master', title: 'Unit Master', description: 'Convert a unit', reward: 30, icon: '⚖️' },
      { id: 'sketch-artist', title: 'Sketch Artist', description: 'Open Sketchpad', reward: 30, icon: '✏️' },
      { id: 'tic-tac-champ', title: 'Tic Tac Champ', description: 'Play Tic Tac Toe', reward: 30, icon: '⭕' },
      { id: 'deep-cleaner', title: 'Deep Cleaner', description: 'Run Deep Clean in Flash Clear', reward: 60, icon: '🧽' },
      { id: 'battery-saver', title: 'Battery Saver', description: 'Run Battery Saver in Flash Clear', reward: 40, icon: '🔋' },
      { id: 'cpu-cooler', title: 'Cooler', description: 'Run CPU Cooler in Flash Clear', reward: 40, icon: '🧊' },
      { id: 'sci-calc', title: 'Math Pro', description: 'Use Scientific Mode in Calculator', reward: 40, icon: '➗' },
  ]);

  // --- PERSISTENCE & INITIALIZATION ---
  useEffect(() => {
    // PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
        console.log("Install prompt captured");
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const savedNotes = localStorage.getItem('crafty-notes-data');
    if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
    } else {
        const welcomeNote: Note = {
            id: 'welcome-1',
            title: 'Welcome to Crafty Notes! 🚀',
            content: `Hello there! Welcome to the Crafter OS experience.\n\nHere are some cool things you can do:\n\n1. Visit the Marketplace 🛍️ to get Themes, AI, and Tools.\n2. Use Crafter AI 🤖 to generate code, math solutions, and images.\n3. Check out the Games 🎮 in the Sidebar.\n4. Use Crafter Cloud ☁️ to simulate file storage.\n5. Try "Zen Mode" in Settings for focus.\n\nEnjoy exploring!\n- Crafter Studio`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            color: NoteColor.Blue,
            pinned: true,
            isFavorite: true,
            tags: ['Welcome', 'Guide'],
            stickers: []
        };
        setNotes([welcomeNote]);
    }

    const savedSettings = localStorage.getItem('crafty-settings');
    const savedProfile = localStorage.getItem('crafty-profile');
    const savedItems = localStorage.getItem('crafty-installed-items');
    const savedBinItems = localStorage.getItem('crafty-bin-items');
    const savedSticky = localStorage.getItem('crafty-sticky');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        const now = Date.now();
        const last = parsedProfile.lastLogin || 0;
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        let newStreak = parsedProfile.streak || 0;
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 0;

        setProfile({
            ...parsedProfile, 
            exp: parsedProfile.exp || 0, 
            level: parsedProfile.level || 1, 
            rank: parsedProfile.rank || 'Rookie',
            streak: newStreak,
            lastLogin: now
        });
    }
    if (savedItems) setInstalledItems(JSON.parse(savedItems));
    if (savedBinItems) setBinItems(JSON.parse(savedBinItems));
    if (savedSticky) setStickyNote(JSON.parse(savedSticky));

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    localStorage.setItem('crafty-notes-data', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('crafty-settings', JSON.stringify(settings));
    localStorage.setItem('crafty-profile', JSON.stringify(profile));
    localStorage.setItem('crafty-installed-items', JSON.stringify(installedItems));
    localStorage.setItem('crafty-bin-items', JSON.stringify(binItems));
    localStorage.setItem('crafty-sticky', JSON.stringify(stickyNote));
  }, [settings, profile, installedItems, binItems, stickyNote]);

  const gainExp = (amount: number) => {
      setProfile(prev => {
          const newExp = (prev.exp || 0) + amount;
          const currentLevel = prev.level || 1;
          const nextLevelExp = currentLevel * 100;
          let newLevel = currentLevel;
          let newRank = prev.rank || 'Rookie';

          if (newExp >= nextLevelExp) {
              newLevel += 1;
              playSound('success'); 
              if (newLevel >= 5) newRank = 'Scout';
              if (newLevel >= 10) newRank = 'Warrior';
              if (newLevel >= 20) newRank = 'Commander';
              if (newLevel >= 50) newRank = 'Warlord';
              if (newLevel >= 100) newRank = 'Legend';
          }

          return { ...prev, exp: newExp, level: newLevel, rank: newRank };
      });
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Command Palette
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
              e.preventDefault();
              setShowCmdPalette(prev => !prev);
          }
          // Global Note Shortcut
          if (e.shiftKey && e.key === 'N') {
              handleCreateNote();
          }

          // Secret Code: "sachu"
          const key = e.key.toLowerCase();
          setKeySequence(prev => {
              const newSeq = [...prev, key].slice(-5);
              const secretCode = ['s', 'a', 'c', 'h', 'u'];
              if (JSON.stringify(newSeq) === JSON.stringify(secretCode)) {
                  alert("GOD MODE UNLOCKED: 1,000,000 Coins Added!");
                  setProfile(p => ({...p, coins: p.coins + 1000000, exp: (p.exp||0) + 10000}));
                  playSound('success');
              }
              return newSeq;
          });
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const playSound = (type: 'click' | 'pop' | 'success') => {
      if (settings.sounds && navigator.vibrate) navigator.vibrate(50);
  };

  const handleDownloadApp = () => {
      if (installPrompt) {
          installPrompt.prompt();
          installPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the install prompt');
              } else {
                  console.log('User dismissed the install prompt');
              }
              setInstallPrompt(null);
          });
      } else {
          // Instructions for iOS or manual install if prompt is not available
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
          if (isIOS) {
              alert("To install 'Crafty Notes' on iOS:\n\n1. Tap the Share button below.\n2. Scroll down and tap 'Add to Home Screen'.");
          } else {
              alert("Installation isn't available right now. \n\nIf you are on Android, tap the browser menu (three dots) and select 'Install App' or 'Add to Home Screen'.");
          }
      }
  };

  const handleCreateNote = () => {
    playSound('click');
    const newNote: Note = { id: uuidv4(), title: '', content: '', tags: [], stickers: [], createdAt: Date.now(), updatedAt: Date.now(), color: NoteColor.White, pinned: false, deleted: false };
    setSelectedNote(newNote);
    setIsEditing(true);
    if (settings.combatMode) gainExp(10);
  };

  const handleReset = () => { if(window.confirm("Delete all data?")) { localStorage.clear(); window.location.reload(); } };
  const unlockAchievement = (id: string) => {
      if (!profile.unlockedAchievements.includes(id)) {
          const achievement = allAchievements.find(a => a.id === id);
          if (achievement) {
              setProfile(prev => ({...prev, coins: prev.coins + achievement.reward, unlockedAchievements: [...prev.unlockedAchievements, id]}));
              playSound('success');
              alert(`🏆 Achievement Unlocked: ${achievement.title}\n+${achievement.reward} CNC`);
          }
      }
  };
  const handleInstallItem = (item: MarketItem) => {
      if (item.priceType === 'cnc' && item.price > 0) {
          if (profile.coins < item.price) { alert(`Not enough CNC!`); return; }
          setProfile(prev => ({ ...prev, coins: prev.coins - item.price }));
          unlockAchievement('rich');
      }
      if (item.category === 'Game') unlockAchievement('gamer');
      setBinItems(prev => prev.filter(a => a.id !== item.id));
      setInstalledItems(prev => [...prev, { ...item, installed: true }]);
      playSound('success');
      if (settings.combatMode) gainExp(50);
  };
  const handleInstallUserApp = (app: MarketItem) => {
      setInstalledItems(prev => [...prev, app]);
      playSound('success');
      if(settings.combatMode) gainExp(100);
  };
  const handleUninstallItem = (itemId: string) => {
      const item = installedItems.find(a => a.id === itemId);
      if (item) {
          if (settings.theme === item.id) setSettings(s => ({...s, theme: 'light'}));
          setInstalledItems(prev => prev.filter(a => a.id !== itemId));
          setBinItems(prev => [...prev, { ...item, installed: false }]);
      }
  };
  const handleRestoreItem = (itemId: string) => {
      const item = binItems.find(a => a.id === itemId);
      if (item) { setBinItems(prev => prev.filter(a => a.id !== itemId)); setInstalledItems(prev => [...prev, { ...item, installed: true }]); }
  };
  const handlePermanentDeleteItem = (itemId: string) => { setBinItems(prev => prev.filter(a => a.id !== itemId)); };
  
  const openDynamicApp = (app: MarketItem) => {
      playSound('click');
      
      // If app has user code (Publish to OS feature)
      if (app.code) {
          setActiveDynamicApp(app);
          setCurrentView(ViewMode.UserApp);
          return;
      }

      switch(app.id) {
          case 'game-euro-truck': setCurrentView(ViewMode.EuroTruck); unlockAchievement('trucker'); break;
          case 'game-san-andreas': setCurrentView(ViewMode.SanAndreas); unlockAchievement('gangster'); break;
          case 'game-hello-cpu': setCurrentView(ViewMode.HelloCpu); break;
          case 'app-todo': setCurrentView(ViewMode.TodoList); break;
          case 'app-habit': setCurrentView(ViewMode.HabitTracker); break;
          case 'game-snake': setCurrentView(ViewMode.SnakeGame); break;
          case 'game-pong': setCurrentView(ViewMode.PongGame); break;
          case 'game-2048': setCurrentView(ViewMode.Game2048); break;
          case 'app-piano': setCurrentView(ViewMode.Piano); break;
          case 'app-drum': setCurrentView(ViewMode.DrumPad); break;
          case 'app-breath': setCurrentView(ViewMode.Breathing); break;
          case 'app-qr': setCurrentView(ViewMode.QrGen); break;
          case 'app-color': setCurrentView(ViewMode.ColorPicker); break;
          case 'app-bmi': setCurrentView(ViewMode.BmiCalc); break;
          case 'app-discount': setCurrentView(ViewMode.DiscountCalc); break;
          case 'app-tip': setCurrentView(ViewMode.TipCalc); break;
          case 'app-stopwatch': setCurrentView(ViewMode.Stopwatch); break;
          case 'app-timer': setCurrentView(ViewMode.Timer); break;
          case 'app-world': setCurrentView(ViewMode.WorldClock); break;
          case 'app-json': setCurrentView(ViewMode.JsonFormatter); break;
          case 'app-whiteboard': setCurrentView(ViewMode.Whiteboard); break;
          case 'app-quotes': setCurrentView(ViewMode.Quotes); break;
          case 'app-jokes': setCurrentView(ViewMode.Jokes); break;
          case 'suite-dev': setCurrentView(ViewMode.DevSuite); break;
          case 'suite-focus': setCurrentView(ViewMode.FocusSuite); break;
          case 'suite-random': setCurrentView(ViewMode.RandomSuite); break;
          case 'suite-text': setCurrentView(ViewMode.TextSuite); break;
          case 'suite-math': setCurrentView(ViewMode.MathPlus); break;
          default:
              setActiveDynamicApp(app);
              setCurrentView(ViewMode.DynamicApp);
      }

      if (settings.combatMode) gainExp(5);
  };

  const handleReadStory = (story: MarketItem) => { setActiveStory(story); setCurrentView(ViewMode.StoryReader); unlockAchievement('reader'); if (settings.combatMode) gainExp(20); };
  const handleSaveSticker = (stickerData: string) => {
      const newSticker: MarketItem = { id: uuidv4(), title: 'My Sticker', description: 'Custom Sticker', category: 'Sticker', originalPrice: 0, price: 0, priceType: 'free', image: stickerData, rating: 5, downloads: '1', installed: true };
      setInstalledItems(prev => [...prev, newSticker]);
      unlockAchievement('sticker-artist');
      if (settings.combatMode) gainExp(30);
  };
  const handleSaveNote = (updatedNote: Note) => {
    playSound('success');
    unlockAchievement('first-note');
    if (updatedNote.locked) unlockAchievement('secure');
    if (updatedNote.pinned) unlockAchievement('organized');
    setNotes(prev => {
      const exists = prev.find(n => n.id === updatedNote.id);
      if (exists) return prev.map(n => n.id === updatedNote.id ? updatedNote : n);
      else return [updatedNote, ...prev];
    });
    setIsEditing(false);
    setSelectedNote(null);
    if (settings.combatMode) gainExp(20);
  };
  const handleDeleteNote = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setNotes(prev => prev.map(n => n.id === id ? { ...n, deleted: true } : n)); unlockAchievement('deleted'); };
  const handleRestoreNote = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setNotes(prev => prev.map(n => n.id === id ? { ...n, deleted: false } : n)); unlockAchievement('undead'); };
  const handlePermanentDelete = (id: string, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm('Delete forever?')) setNotes(prev => prev.filter(n => n.id !== id)); };
  const handlePinNote = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)); unlockAchievement('organized'); };
  const handleDuplicateNote = (note: Note) => { const newNote = { ...note, id: uuidv4(), title: `${note.title} (Copy)`, createdAt: Date.now(), updatedAt: Date.now() }; setNotes(prev => [newNote, ...prev]); };
  
  const handleEmptyBin = () => {
      if(window.confirm("Empty Recycle Bin? This cannot be undone.")) {
          setNotes(prev => prev.filter(n => !n.deleted));
          setBinItems([]); 
      }
  };

  const filteredNotes = notes
    .filter(n => !n.deleted && (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        switch(sortOrder) {
            case 'date-asc': return a.updatedAt - b.updatedAt;
            case 'title-asc': return (a.title||'').localeCompare(b.title||'');
            case 'title-desc': return (b.title||'').localeCompare(a.title||'');
            default: return b.updatedAt - a.updatedAt;
        }
    });
    
  const binNotes = notes.filter(n => n.deleted && (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))).sort((a, b) => b.updatedAt - a.updatedAt);

  const getFontClass = () => { switch(settings.font) { case 'serif': return 'font-serif'; case 'mono': return 'font-mono'; case 'playfair': return 'font-playfair'; case 'oswald': return 'font-oswald'; case 'handwriting': return 'font-handwriting'; default: return 'font-sans'; } };
  const getSizeClass = () => { switch(settings.fontSize) { case 'sm': return 'text-sm'; case 'lg': return 'text-lg'; case 'xl': return 'text-xl'; default: return 'text-base'; } };
  const getThemeClasses = () => { switch(settings.theme) { case 'dark': return 'bg-gray-900 text-white'; case 'superman': return 'bg-blue-900 text-white'; case 'forest': return 'bg-stone-50 text-stone-900'; case 'ocean': return 'bg-cyan-50 text-cyan-900'; case 'cyberpunk': return 'bg-black text-green-400 font-mono'; case 'sunset': return 'bg-orange-50 text-red-900'; case 'lavender': return 'bg-[#faf5ff] text-purple-900'; case 'retro': return 'bg-amber-50 text-amber-900 font-serif'; case 'terminal': return 'bg-[#0d1117] text-[#00ff41] font-mono'; case 'bw': return 'bg-white text-black grayscale'; case 'win11': return 'bg-[#f9f9f9] text-[#202020] font-sans'; case 'christmas': return 'bg-[#D42426] text-white'; case 'matrix': return 'bg-black text-green-500 font-mono'; case 'coffee': return 'bg-[#3C2A21] text-[#E5E5CB]'; case 'glass': return 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white'; case 'neon': return 'bg-black text-neon font-mono'; default: return 'bg-[#F3F4F6] text-gray-900'; } };
  const getViewTitle = () => { if (currentView === ViewMode.DynamicApp && activeDynamicApp) return activeDynamicApp.title; if (currentView === ViewMode.UserApp && activeDynamicApp) return activeDynamicApp.title; switch(currentView) { case ViewMode.CrafterAI: return 'Crafter AI'; case ViewMode.HelperAI: return 'Helper AI'; case ViewMode.CrafterBoy: return 'Crafter Boy'; case ViewMode.Radio: return 'Crafty Radio'; case ViewMode.Settings: return 'Settings'; case ViewMode.ThemeStudio: return 'Theme Studio'; case ViewMode.Calculator: return 'Hello Numbers'; case ViewMode.Calendar: return 'Calendar'; case ViewMode.Phone: return 'Crafty Phone C1'; case ViewMode.CodeRunner: return 'Code Runner'; case ViewMode.XmlRunner: return 'XML Runner'; case ViewMode.AndroidStudio: return 'Crafter Studio'; case ViewMode.FlashClear: return 'Flash Clear'; case ViewMode.CraftyBug: return 'Crafty Bug Reporter'; case ViewMode.Marketplace: return 'Marketplace'; case ViewMode.Bin: return 'Recycle Bin'; case ViewMode.WhatsNew: return 'What\'s New'; case ViewMode.EuroTruck: return 'Euro Truck Pixel'; case ViewMode.SanAndreas: return 'San Andreas Mini'; case ViewMode.HelloCpu: return 'Hello CPU'; case ViewMode.CrafterCloud: return 'Crafter Cloud'; case ViewMode.MathStudio: return 'Math Studio'; case ViewMode.StoryReader: return activeStory?.title || 'Story Reader'; case ViewMode.Advancements: return 'Advancements'; case ViewMode.StickerMaker: return 'Sticker Maker'; case ViewMode.VoiceRecorder: return 'Voice Recorder'; case ViewMode.UnitConverter: return 'Unit Converter'; case ViewMode.Sketchpad: return 'Sketchpad'; case ViewMode.TicTacToe: return 'Tic Tac Toe'; case ViewMode.CommandBlock: return 'Command Block'; case ViewMode.HackerTyper: return 'Hacker Typer'; case ViewMode.DrawGuess: return 'Draw & Guess'; default: return currentView === ViewMode.Notes ? 'Crafty Notes' : currentView.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim(); } };

  const commands = [
      { label: 'Create New Note', action: () => handleCreateNote() },
      { label: 'Go to Home', action: () => setCurrentView(ViewMode.Notes) },
      { label: 'Open Settings', action: () => setCurrentView(ViewMode.Settings) },
      { label: 'Open AI', action: () => setCurrentView(ViewMode.CrafterAI) },
      { label: 'Open Marketplace', action: () => setCurrentView(ViewMode.Marketplace) },
      { label: 'Toggle Zen Mode', action: () => setSettings(s => ({...s, zenMode: !s.zenMode})) },
      { label: 'Switch to Dark Mode', action: () => setSettings(s => ({...s, theme: 'dark'})) },
      { label: 'Switch to Light Mode', action: () => setSettings(s => ({...s, theme: 'light'})) },
      { label: 'Show Sticky Note', action: () => setStickyNote(s => ({...s, visible: true})) },
  ];
  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  return (
    <div className={`flex h-screen overflow-hidden ${getFontClass()} ${getThemeClasses()} ${getSizeClass()} transition-colors duration-300 relative`}>
      
      {settings.wallpaper && (
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${settings.wallpaper})` }}></div>
      )}
      
      {settings.theme === 'glass' && (
          <div className="absolute inset-0 z-0 backdrop-blur-3xl bg-white/20 pointer-events-none"></div>
      )}
      
      {/* Blue Light Overlay */}
      {settings.blueLight && (
          <div className="absolute inset-0 z-[100] bg-orange-500/20 pointer-events-none mix-blend-multiply"></div>
      )}
      
      {settings.theme === 'christmas' && <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">{Array.from({length: 10}).map((_, i) => <div key={i} className="snowflake">❅</div>)}</div>}
      {settings.theme === 'matrix' && <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/17/Matrix_code.gif')] bg-cover"></div>}

      {!settings.zenMode && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            currentView={currentView}
            setView={setCurrentView}
            logoType={settings.logoType}
            profile={profile}
            installedApps={installedItems}
            onOpenApp={openDynamicApp}
            onUninstallApp={handleUninstallItem}
            onInstallApp={handleDownloadApp}
          />
      )}

      {/* Taskbar 2 (Right Dock) */}
      {!settings.zenMode && (
        <Taskbar2 currentView={currentView} setView={setCurrentView} isOpen={true} />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-10 pr-16">
        {!settings.zenMode ? (
            <Header 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                title={getViewTitle()}
                combatMode={settings.combatMode}
                profile={profile}
            />
        ) : (
            <button 
                onClick={() => setSettings({...settings, zenMode: false})}
                className="absolute top-4 right-4 z-50 p-2 bg-gray-200/50 backdrop-blur rounded-full hover:bg-white transition-colors"
                title="Exit Zen Mode"
            >
                <Minimize2 size={20}/>
            </button>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative">
            {/* Sticky Widget */}
            {stickyNote.visible && (
                <div className="absolute top-4 right-4 z-40 w-64 bg-yellow-100 rounded-xl shadow-lg border border-yellow-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="bg-yellow-200 p-2 flex justify-between items-center cursor-move">
                        <span className="text-xs font-bold text-yellow-800 flex items-center gap-1"><StickyNote size={12}/> Sticky</span>
                        <button onClick={()=>setStickyNote(s=>({...s, visible: false}))}><Trash2 size={12} className="text-yellow-700"/></button>
                    </div>
                    <textarea 
                        value={stickyNote.content} 
                        onChange={e=>setStickyNote(s=>({...s, content: e.target.value}))} 
                        className="w-full h-32 bg-transparent p-3 text-sm outline-none resize-none text-yellow-900" 
                        placeholder="Quick note..."
                    />
                </div>
            )}

            {currentView === ViewMode.Notes && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <ListFilter size={16}/> {filteredNotes.length} Notes
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 p-1 rounded-lg">
                            <button onClick={()=>setSortOrder('date-desc')} title="Newest" className={`p-1.5 rounded ${sortOrder==='date-desc'?'bg-white shadow':''}`}><RotateCcw className="rotate-180" size={16}/></button>
                            <button onClick={()=>setSortOrder('date-asc')} title="Oldest" className={`p-1.5 rounded ${sortOrder==='date-asc'?'bg-white shadow':''}`}><RotateCcw size={16}/></button>
                            <button onClick={()=>setSortOrder('title-asc')} title="A-Z" className={`p-1.5 rounded ${sortOrder==='title-asc'?'bg-white shadow':''}`}><SortAsc size={16}/></button>
                            <button onClick={()=>setSortOrder('title-desc')} title="Z-A" className={`p-1.5 rounded ${sortOrder==='title-desc'?'bg-white shadow':''}`}><SortDesc size={16}/></button>
                        </div>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 text-center opacity-60">
                            <h2 className="text-xl font-bold mb-2">It's quiet here...</h2>
                            <p>Start creating your masterpiece.</p>
                        </div>
                    ) : (
                        <MasonryGrid>
                            {filteredNotes.map(note => (
                                <NoteCard key={note.id} note={note} onClick={(n) => { setSelectedNote(n); setIsEditing(true); }} onDelete={handleDeleteNote} onPin={handlePinNote} onDuplicate={handleDuplicateNote} />
                            ))}
                        </MasonryGrid>
                    )}
                    <button onClick={handleCreateNote} className={`fixed bottom-8 right-24 lg:right-32 w-16 h-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-30 ${settings.combatMode ? 'bg-red-600 text-white animate-bounce border-4 border-black' : 'bg-gradient-to-r from-secondary to-primary text-white'}`}>
                        {settings.combatMode ? <Sword size={32} /> : <Plus size={32} />}
                    </button>
                </>
            )}

            {/* View Routing - Simplified for brevity */}
            {currentView === ViewMode.Bin && (
                <>
                     <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-center justify-between">
                         <div className="flex items-center gap-3"><Trash2 size={24}/><div><p className="font-bold">Recycle Bin</p><p className="text-xs">Manage deleted Notes, Themes, Fonts, and Apps.</p></div></div>
                         {(binNotes.length > 0 || binItems.length > 0) && (
                             <button onClick={handleEmptyBin} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Empty Bin</button>
                         )}
                     </div>
                     {binItems.length > 0 && (<div className="mb-8"><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Box size={18}/> Deleted Market Items</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{binItems.map(item => (<div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center opacity-75 grayscale hover:grayscale-0 transition-all"><div className="flex items-center gap-3"><img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover"/><div><p className="font-bold text-sm text-gray-800">{item.title}</p><span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.category}</span></div></div><div className="flex gap-2"><button onClick={() => handleRestoreItem(item.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><RotateCcw size={16}/></button><button onClick={() => handlePermanentDeleteItem(item.id)} className="p-2 bg-red-100 text-red-600" title="Delete Forever"><Trash2 size={16}/></button></div></div>))}</div></div>)}
                     
                     {binNotes.length === 0 && binItems.length === 0 ? (
                         <div className="text-center text-gray-400 mt-20"><p>Bin is empty</p></div>
                     ) : (
                         <MasonryGrid>
                             {binNotes.map(note => (
                                 <NoteCard key={note.id} note={note} onClick={() => {}} onDelete={handlePermanentDelete} onPin={() => {}} onRestore={handleRestoreNote} isDeleted />
                             ))}
                         </MasonryGrid>
                     )}
                </>
            )}

            {currentView === ViewMode.CrafterAI && <CrafterAI />}
            {currentView === ViewMode.HelperAI && <HelperAI />}
            {currentView === ViewMode.CrafterBoy && <CrafterBoy />}
            {currentView === ViewMode.Radio && <RadioApp />}
            {currentView === ViewMode.Settings && <Settings settings={settings} profile={profile} updateSettings={setSettings} updateProfile={setProfile} onResetApp={handleReset} installedItems={installedItems} onUninstallItem={handleUninstallItem} onInstallApp={handleDownloadApp} />}
            {currentView === ViewMode.ThemeStudio && <ThemeStudio settings={settings} updateSettings={setSettings} isStandalone={true} installedItems={installedItems} onUninstall={handleUninstallItem} />}
            {currentView === ViewMode.Calculator && <HelloNumbers />}
            {currentView === ViewMode.Calendar && <DigitalCalendar />}
            {currentView === ViewMode.Phone && <CraftyPhone />}
            {currentView === ViewMode.CodeRunner && <CodeRunner />}
            {currentView === ViewMode.XmlRunner && <XmlRunner />}
            {currentView === ViewMode.AndroidStudio && <AndroidStudio onInstallApp={handleInstallUserApp} />}
            {currentView === ViewMode.FlashClear && <FlashClear />}
            {currentView === ViewMode.CraftyBug && <CraftyBug />}
            {currentView === ViewMode.Marketplace && <Marketplace installedApps={installedItems} onInstall={handleInstallItem} onUninstall={handleUninstallItem} onReadStory={handleReadStory} userCoins={profile.coins} />}
            {currentView === ViewMode.WhatsNew && <WhatsNew />}
            {currentView === ViewMode.EuroTruck && <EuroTruckPixel />}
            {currentView === ViewMode.SanAndreas && <SanAndreasMini />}
            {currentView === ViewMode.HelloCpu && <HelloCpu />}
            {currentView === ViewMode.CrafterCloud && <CrafterCloud profile={profile} notes={notes} onUpdateProfile={setProfile} onDeleteNote={handleDeleteNote} />}
            {currentView === ViewMode.MathStudio && <MathStudio />}
            {currentView === ViewMode.StoryReader && <StoryReader story={activeStory} onClose={() => setCurrentView(ViewMode.Notes)} />}
            {currentView === ViewMode.Advancements && <Achievements profile={profile} achievements={allAchievements} />}
            {currentView === ViewMode.StickerMaker && <StickerMaker onSave={handleSaveSticker} />}
            {currentView === ViewMode.VoiceRecorder && <VoiceRecorder />}
            {currentView === ViewMode.UnitConverter && <UnitConverter />}
            {currentView === ViewMode.TicTacToe && <TicTacToe />}
            {currentView === ViewMode.CommandBlock && <CommandBlock />}
            
            {/* Dynamic / User Apps */}
            {currentView === ViewMode.UserApp && activeDynamicApp && (
                <AndroidStudio runMode={true} initialCode={activeDynamicApp.code} initialName={activeDynamicApp.title} initialIcon={activeDynamicApp.image} />
            )}
            
            {/* Extra Apps Handler (Crafty Class, Plugins, etc.) */}
            {![ViewMode.Notes, ViewMode.Bin, ViewMode.CrafterAI, ViewMode.HelperAI, ViewMode.CrafterBoy, ViewMode.Radio, ViewMode.Settings, ViewMode.ThemeStudio, ViewMode.Calculator, ViewMode.Calendar, ViewMode.Phone, ViewMode.CodeRunner, ViewMode.XmlRunner, ViewMode.AndroidStudio, ViewMode.FlashClear, ViewMode.CraftyBug, ViewMode.Marketplace, ViewMode.WhatsNew, ViewMode.EuroTruck, ViewMode.SanAndreas, ViewMode.HelloCpu, ViewMode.CrafterCloud, ViewMode.MathStudio, ViewMode.StoryReader, ViewMode.Advancements, ViewMode.StickerMaker, ViewMode.VoiceRecorder, ViewMode.UnitConverter, ViewMode.TicTacToe, ViewMode.CommandBlock, ViewMode.UserApp, ViewMode.DynamicApp].includes(currentView) && (
                <ExtraApps view={currentView} />
            )}
            
            {currentView === ViewMode.DynamicApp && activeDynamicApp && (
                 <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl">
                     <img src={activeDynamicApp.image} alt={activeDynamicApp.title} className="w-24 h-24 rounded-2xl mb-4 shadow-lg"/>
                     <h2 className="text-2xl font-bold">{activeDynamicApp.title}</h2>
                     <p className="text-gray-500">This app is installed but content is not available.</p>
                 </div>
            )}
        </main>
      </div>

      {isEditing && selectedNote && (
        <NoteEditor 
            note={selectedNote} 
            onClose={() => { setIsEditing(false); setSelectedNote(null); }} 
            onSave={handleSaveNote}
            settings={settings}
        />
      )}

      {showCmdPalette && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32" onClick={() => setShowCmdPalette(false)}>
              <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                      <Search size={20} className="text-gray-400"/>
                      <input 
                        autoFocus
                        value={cmdQuery}
                        onChange={e => setCmdQuery(e.target.value)}
                        placeholder="Type a command..."
                        className="flex-1 outline-none text-lg text-gray-800 placeholder-gray-400"
                      />
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                      {filteredCommands.map((cmd, i) => (
                          <button 
                            key={i}
                            onClick={() => { cmd.action(); setShowCmdPalette(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between group"
                          >
                              <span className="font-medium text-gray-700">{cmd.label}</span>
                              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Enter</span>
                          </button>
                      ))}
                      {filteredCommands.length === 0 && <div className="p-4 text-center text-gray-400">No commands found</div>}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;
