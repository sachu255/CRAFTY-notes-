
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Download, Check, X, Play, Bot, Send, RotateCw, Trash2, Image, Palette, Type, Gamepad2, Monitor, BookOpen, Coins, Lock, Smile, Eye, Grid, Box, Volume2, Shuffle, Calculator, Terminal, Heart, Droplets, Mic2, Guitar, Radio, Code2, Keyboard, Brain, Bomb, Truck, MapPin, Cpu } from 'lucide-react';
import { MarketItem } from '../services/types';

interface MarketplaceProps {
    installedApps?: MarketItem[];
    onInstall?: (item: MarketItem) => void;
    onUninstall?: (id: string) => void;
    onReadStory?: (item: MarketItem) => void;
    userCoins?: number;
}

const Marketplace: React.FC<MarketplaceProps> = ({ installedApps = [], onInstall, onUninstall, onReadStory, userCoins = 0 }) => {
  // FULL STORE DATA RESTORED
  const [storeItems] = useState<MarketItem[]>([
    // --- STORIES (Restored) ---
    { id: 'story-magical-word', title: 'The First Magical Word', description: 'Sachu\'s adventure in a world of wonders. (Full Book)', category: 'Story', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=500', rating: 5.0, downloads: '10K', installed: false },
    { id: 'story-lost-city', title: 'The Lost City', description: 'An expedition into the unknown jungle.', category: 'Story', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '5K', installed: false },
    { id: 'story-space-voyage', title: 'Voyage to Andromeda', description: 'Sci-fi epic beyond the stars.', category: 'Story', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '3K', installed: false },

    // --- GAMES (Restored) ---
    { id: 'game-euro-truck', title: 'Euro Truck Pixel', description: 'Drive, deliver, and build your trucking empire.', category: 'Game', originalPrice: 500, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '50K', installed: false },
    { id: 'game-san-andreas', title: 'San Andreas Mini', description: 'Open world action. 103 Missions.', category: 'Game', originalPrice: 1000, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1605218427306-633ba30883b6?auto=format&fit=crop&q=80&w=500', rating: 5.0, downloads: '100K', installed: false },
    { id: 'game-hello-cpu', title: 'Hello CPU', description: 'Windows 11 Simulator.', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '20K', installed: false },
    
    // --- AI PERSONAS (Restored) ---
    { id: 'ai-chef', title: 'Chef Gusto', description: 'Culinary expert. Recipes and cooking tips.', category: 'AI', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '12K', installed: false },
    { id: 'ai-travel', title: 'Travel Buddy', description: 'Plan your trips and discover places.', category: 'AI', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '8K', installed: false },
    { id: 'ai-math', title: 'Mather AI', description: 'Advanced math solver.', category: 'AI', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '25K', installed: false },
    { id: 'ai-detective', title: 'Detective Holmes', description: 'Logic puzzles and mysteries.', category: 'AI', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '5K', installed: false },
    { id: 'ai-customer', title: 'Customer Service', description: 'Friendly support bot.', category: 'AI', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '2K', installed: false },
    { id: 'ai-all-in-one', title: 'All-in-One AI', description: 'Premium AI for everything.', category: 'AI', originalPrice: 2000, price: 500, priceType: 'cnc', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=500', rating: 5.0, downloads: '50', installed: false },

    // --- TOOLS (Restored) ---
    { id: 'tool-scale', title: 'Digital Scale', description: 'On-screen ruler.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1591178494297-5a3b90757731?auto=format&fit=crop&q=80&w=500', rating: 4.2, downloads: '15K', installed: false },
    { id: 'tool-compass', title: 'Compass', description: 'Find your direction.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1590522789422-9df722df1491?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '10K', installed: false },
    { id: 'tool-protractor', title: 'Protractor', description: 'Measure angles on screen.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?auto=format&fit=crop&q=80&w=500', rating: 4.4, downloads: '8K', installed: false },

    // --- THEMES & OTHERS (Restored) ---
    { id: 'dark', title: 'Midnight Pro Theme', description: 'Ultimate dark mode.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '100K', installed: false },
    { id: 'christmas', title: 'Christmas Theme', description: 'Snowfall and festive colors.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=500', rating: 5.0, downloads: '50K', installed: false },
    { id: 'win11', title: 'Windows 11 Theme', description: 'Clean mica aesthetics.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1633419461186-7d40a23933a7?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '30K', installed: false },
    { id: 'bw', title: 'Noir Theme', description: 'Black and White classy look.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '20K', installed: false },
    { id: 'matrix', title: 'Matrix Theme', description: 'Enter the Matrix.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '15K', installed: false },
    { id: 'coffee', title: 'Coffee Theme', description: 'Warm and cozy.', category: 'Theme', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '10K', installed: false },
    { id: 'font-neon', title: 'Neon Writer', description: 'Glowing text font.', category: 'Font', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '5K', installed: false },
    
    // --- UNIVERSE UPDATE APPS (13 New) ---
    { id: 'app-period', title: 'Period Tracker', description: 'Track your cycle and health.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1518611507436-e92214d88882?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '5K', installed: false },
    { id: 'app-water', title: 'Water Intake', description: 'Stay hydrated daily.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '8K', installed: false },
    { id: 'app-metronome', title: 'Metronome', description: 'Precise beats for musicians.', category: 'App', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '3K', installed: false },
    { id: 'app-tuner', title: 'Guitar Tuner', description: 'Tune your guitar instantly.', category: 'App', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '4K', installed: false },
    { id: 'app-morse', title: 'Morse Code', description: 'Text to Morse translator.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '2K', installed: false },
    { id: 'app-unix', title: 'Unix Time', description: 'Current timestamp for devs.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1501139083538-0139583c61ee?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '6K', installed: false },
    { id: 'app-gradient', title: 'Gradient Gen', description: 'Create beautiful CSS gradients.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '10K', installed: false },
    { id: 'game-reaction', title: 'Reaction Test', description: 'Test your reflexes.', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1533236897111-51979809939f?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '15K', installed: false },
    { id: 'game-typing', title: 'Typing Test', description: 'Check your WPM speed.', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '9K', installed: false },
    { id: 'game-memory', title: 'Memory Game', description: 'Flip cards and match.', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '7K', installed: false },
    { id: 'game-sudoku', title: 'Sudoku', description: 'Classic number puzzle.', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1619623637699-2a9127d49767?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '12K', installed: false },
    { id: 'game-mines', title: 'Minesweeper', description: 'Don\'t click the bomb!', category: 'Game', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1629239722763-71cc7a4a9499?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '8K', installed: false },
    { id: 'app-ascii', title: 'ASCII Art', description: 'Text to ASCII banner.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '5K', installed: false },

    // --- GALAXY UPDATE SUITES ---
    { id: 'suite-dev', title: 'Dev Suite', description: 'Ultimate developer toolkit: UUID, Base64, Lorem.', category: 'App', originalPrice: 500, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500', rating: 5.0, downloads: '1K', installed: false },
    { id: 'suite-focus', title: 'Focus Suite', description: 'Ambient sounds to boost productivity.', category: 'App', originalPrice: 300, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '500', installed: false },
    { id: 'suite-random', title: 'Random Suite', description: 'Coin flip, Dice, and Decisions.', category: 'App', originalPrice: 200, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '800', installed: false },
    { id: 'suite-text', title: 'Text Suite', description: 'Text manipulation tools.', category: 'App', originalPrice: 150, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '400', installed: false },
    { id: 'suite-math', title: 'Math+ Suite', description: 'Calculators for Age, Dates and more.', category: 'App', originalPrice: 400, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '600', installed: false },

    // --- MORE SPACE APPS ---
    { id: 'app-todo', title: 'Todo List Pro', description: 'Manage your daily tasks efficiently.', category: 'App', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '10K', installed: false },
    { id: 'app-habit', title: 'Habit Tracker', description: 'Build good habits, break bad ones.', category: 'App', originalPrice: 200, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '5K', installed: false },
    { id: 'app-whiteboard', title: 'Whiteboard', description: 'Infinite canvas for your ideas.', category: 'App', originalPrice: 500, price: 100, priceType: 'cnc', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '2K', installed: false },
    { id: 'app-qr', title: 'QR Generator', description: 'Create QR codes for any link.', category: 'Tool', originalPrice: 50, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '15K', installed: false },
    { id: 'game-snake', title: 'Snake Game', description: 'Classic snake game. Eat apples!', category: 'Game', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1628277613967-6ab58cf0673e?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '20K', installed: false },
    { id: 'game-pong', title: 'Pong', description: 'Retro arcade tennis game.', category: 'Game', originalPrice: 100, price: 50, priceType: 'cnc', image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=500', rating: 4.4, downloads: '8K', installed: false },
    { id: 'game-2048', title: '2048', description: 'Join the numbers to get to 2048 tile!', category: 'Game', originalPrice: 200, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '50K', installed: false },
    { id: 'app-piano', title: 'Pocket Piano', description: 'Play music on the go.', category: 'App', originalPrice: 300, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '12K', installed: false },
    { id: 'app-drum', title: 'Drum Pad', description: 'Make beats instantly.', category: 'App', originalPrice: 300, price: 100, priceType: 'cnc', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '9K', installed: false },
    { id: 'app-json', title: 'JSON Formatter', description: 'Validate and format JSON data.', category: 'Tool', originalPrice: 100, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500', rating: 4.9, downloads: '25K', installed: false },
    { id: 'app-color', title: 'Color Picker', description: 'Find the perfect HEX/RGB codes.', category: 'Tool', originalPrice: 50, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '18K', installed: false },
    { id: 'app-bmi', title: 'BMI Calculator', description: 'Check your Body Mass Index.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '5K', installed: false },
    { id: 'app-breath', title: 'Breathing', description: 'Relax and focus with breathing exercises.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '8K', installed: false },
    { id: 'app-discount', title: 'Discount Calc', description: 'Calculate sale prices easily.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=500', rating: 4.4, downloads: '3K', installed: false },
    { id: 'app-tip', title: 'Tip Calculator', description: 'Split bills and calculate tips.', category: 'Tool', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '4K', installed: false },
    { id: 'app-world', title: 'World Clock', description: 'Check time across different zones.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1508057198894-247b9861c353?auto=format&fit=crop&q=80&w=500', rating: 4.7, downloads: '10K', installed: false },
    { id: 'app-stopwatch', title: 'Stopwatch', description: 'Precise timing tool.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1563861826100-9cb868c62174?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '6K', installed: false },
    { id: 'app-timer', title: 'Countdown Timer', description: 'Set timers for your tasks.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=500', rating: 4.6, downloads: '7K', installed: false },
    { id: 'app-quotes', title: 'Daily Quotes', description: 'Get inspired every day.', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=500', rating: 4.8, downloads: '15K', installed: false },
    { id: 'app-jokes', title: 'Jokes Generator', description: 'Have a laugh!', category: 'App', originalPrice: 0, price: 0, priceType: 'free', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500', rating: 4.5, downloads: '9K', installed: false },
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [previewItem, setPreviewItem] = useState<MarketItem | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'bot', text: string}[]>([
      { role: 'bot', text: 'Hello! I am a preview of this AI persona. Ask me anything!' }
  ]);

  const isInstalled = (id: string) => {
      if (installedApps.some(app => app.id === id)) return true;
      return false; 
  };

  const handleGet = (item: MarketItem) => {
      if (onInstall) {
          onInstall(item);
          if (item.category === 'Tool') {
             handleOpen(item);
          }
      }
  };

  const handleOpen = (item: MarketItem) => {
    if (item.category === 'Story') {
        if (onReadStory) onReadStory(item);
    }
    else if (item.category === 'Theme' || item.category === 'Font' || item.category === 'Logo' || item.category === 'Wallpaper') {
        alert(`${item.title} is available in Theme Studio!`);
    } else if (item.category === 'Game' || item.category === 'App') {
        alert(`${item.title} is installed! Find it in your taskbar.`);
    } else if (item.category === 'Sticker') {
        alert(`${item.title} added! Use stickers in Note Editor.`);
    }
    else {
        alert(`${item.title} is ready!`);
    }
  };

  const openPreview = (item: MarketItem) => {
      setPreviewItem(item);
      if (item.category === 'AI') {
          setChatMessages([{ role: 'bot', text: `Hi! I'm ${item.title}. How can I assist you today?` }]);
      }
  };

  const filteredItems = activeCategory === 'All' ? storeItems : storeItems.filter(i => i.category === activeCategory);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50/50 rounded-3xl overflow-hidden relative">
      
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-medium z-20">
         <div className="flex items-center gap-2 mb-1 sm:mb-0">
            <span className="bg-yellow-400 text-black px-1.5 rounded font-bold text-[10px]">AD</span>
            <span className="font-bold tracking-wide">Crafty Notes Coming Soon to Play Store & App Store!</span>
         </div>
         <span className="opacity-70 text-[10px] sm:text-xs">Pre-register now to get exclusive rewards.</span>
      </div>

      <div className="p-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
         <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
             {['All', 'App', 'Game', 'Story', 'AI', 'Theme', 'Tool', 'Sticker', 'Font', 'Logo', 'Wallpaper'].map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                 >
                     {cat}
                 </button>
             ))}
         </div>
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                 <Coins size={14} className="fill-current"/>
                 <span className="font-bold">{userCoins} CNC</span>
             </div>
             <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                 <Check size={12} strokeWidth={3} />
                 <span>Free for Cloud</span>
             </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredItems.map(item => {
                 const installed = isInstalled(item.id);
                 return (
                 <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="h-48 overflow-hidden relative">
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                             {item.category.toUpperCase()}
                         </div>
                         {!installed && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); openPreview(item); }}
                                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-1"
                             >
                                 <Eye size={10} fill="currentColor"/> Preview
                             </button>
                         )}
                     </div>
                     
                     <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                                <Star size={10} fill="currentColor"/> {item.rating}
                            </div>
                         </div>
                         <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{item.description}</p>
                         
                         <div className="flex items-center justify-between mt-auto gap-2">
                             <div>
                                 <span className="text-xs text-gray-400 line-through mr-2">₹{item.originalPrice}.00</span>
                                 <span className="text-lg font-black text-green-600">FREE</span>
                             </div>
                             
                             {installed ? (
                                <div className="flex gap-2">
                                     {onUninstall && (
                                        <button 
                                            onClick={() => onUninstall(item.id)}
                                            className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            title="Uninstall"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                     )}
                                     <button 
                                        onClick={() => handleOpen(item)}
                                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${item.category === 'Story' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'}`}
                                     >
                                        {item.category === 'Story' ? 'Read' : 'Installed'}
                                     </button>
                                </div>
                             ) : (
                                <button 
                                    onClick={() => handleGet(item)}
                                    className={`px-4 py-2 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200 bg-black`}
                                >
                                    <Download size={14} /> Get
                                </button>
                             )}
                         </div>
                     </div>
                 </div>
             )})}
         </div>
      </div>

      {previewItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div className="flex items-center gap-3">
                          <img src={previewItem.image} className="w-10 h-10 rounded-lg object-cover" alt="icon"/>
                          <div>
                              <h3 className="font-bold text-gray-800">{previewItem.title}</h3>
                              <p className="text-xs text-gray-500">{previewItem.category} Preview</p>
                          </div>
                      </div>
                      <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="h-[300px] flex flex-col relative bg-gray-100 items-center justify-center">
                      {previewItem.category === 'AI' ? (
                          <div className="p-4 text-center">AI Chat Simulator Active</div>
                      ) : (
                          <img src={previewItem.image} className="max-h-full max-w-full object-contain" alt="preview"/>
                      )}
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center">
                      <button 
                        onClick={() => { handleGet(previewItem); setPreviewItem(null); }}
                        className="bg-black text-white px-6 py-2 rounded-xl font-bold shadow-lg w-full"
                      >
                          Get Now
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Marketplace;
