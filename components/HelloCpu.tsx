
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Search, Chrome, Terminal, Settings, Image, Minus, Square, X, Wifi, Volume2, Battery, Calendar, Power } from 'lucide-react';

const HelloCpu: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (appName: string) => {
    if (!openWindows.includes(appName)) {
      setOpenWindows([...openWindows, appName]);
    }
    setActiveWindow(appName);
    setStartMenuOpen(false);
  };

  const closeApp = (appName: string) => {
    setOpenWindows(prev => prev.filter(w => w !== appName));
    if (activeWindow === appName) setActiveWindow(null);
  };

  const renderWindowContent = (app: string) => {
      switch(app) {
          case 'Edge':
              return (
                  <div className="flex-1 flex flex-col bg-white">
                      <div className="bg-gray-100 p-2 flex gap-2 border-b border-gray-200">
                          <div className="flex gap-2 text-gray-400">
                              <button>←</button> <button>→</button> <button>↻</button>
                          </div>
                          <div className="flex-1 bg-white rounded-full px-4 text-sm flex items-center shadow-sm">
                              https://bing.com
                          </div>
                      </div>
                      <iframe src="https://www.bing.com" className="flex-1 w-full h-full border-none" title="Edge"></iframe>
                  </div>
              );
          case 'Terminal':
              return (
                  <div className="flex-1 bg-black text-white p-4 font-mono text-sm">
                      <p>Microsoft Windows [Version 10.0.22000.1]</p>
                      <p>(c) Microsoft Corporation. All rights reserved.</p>
                      <br/>
                      <p className="text-green-400">C:\Users\HelloCPU{'>'} <span className="animate-pulse">_</span></p>
                  </div>
              );
          case 'Settings':
              return (
                   <div className="flex-1 bg-[#f0f3f9] p-6 flex gap-6">
                       <div className="w-48 space-y-1">
                           <div className="p-2 bg-white rounded flex items-center gap-2 font-bold shadow-sm"><Settings size={16}/> System</div>
                           <div className="p-2 text-gray-500 flex items-center gap-2"><Wifi size={16}/> Network</div>
                       </div>
                       <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                           <h2 className="text-2xl font-bold mb-4">About</h2>
                           <div className="flex items-center gap-4 mb-4">
                               <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white text-2xl font-bold">W</div>
                               <div>
                                   <p className="font-bold">Windows 11 Pro (Sim)</p>
                                   <p className="text-sm text-gray-500">22H2</p>
                               </div>
                           </div>
                           <div className="space-y-2 text-sm">
                               <div className="flex justify-between border-b py-2"><span>Processor</span> <span className="text-gray-600">Hello CPU Virtual Core</span></div>
                               <div className="flex justify-between border-b py-2"><span>Installed RAM</span> <span className="text-gray-600">16.0 GB</span></div>
                           </div>
                       </div>
                   </div>
              );
          default:
              return <div className="flex-1 flex items-center justify-center font-bold text-gray-400">App Content</div>;
      }
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full bg-[url('https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 select-none">
      
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 grid gap-4">
          <div onClick={() => openApp('Recycle Bin')} className="flex flex-col items-center gap-1 w-20 p-2 hover:bg-white/10 rounded cursor-pointer group">
              <div className="text-4xl">🗑️</div>
              <span className="text-xs text-white text-shadow-sm group-hover:bg-blue-600/50 px-1 rounded">Recycle Bin</span>
          </div>
          <div onClick={() => openApp('Edge')} className="flex flex-col items-center gap-1 w-20 p-2 hover:bg-white/10 rounded cursor-pointer group">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500"><Chrome size={24}/></div>
              <span className="text-xs text-white text-shadow-sm group-hover:bg-blue-600/50 px-1 rounded">Edge</span>
          </div>
      </div>

      {/* Windows */}
      {openWindows.map((app) => (
          <div 
            key={app}
            className={`
                absolute top-10 left-10 w-[70%] h-[60%] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200
                ${activeWindow === app ? 'z-20 ring-1 ring-black/10' : 'z-10 opacity-90'}
            `}
            style={{ 
                top: activeWindow === app ? '10%' : '12%', 
                left: activeWindow === app ? '15%' : '17%' 
            }}
            onClick={() => setActiveWindow(app)}
          >
              {/* Window Bar */}
              <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-3">
                  <span className="text-xs font-medium">{app}</span>
                  <div className="flex items-center gap-4">
                      <button onClick={() => {}} className="hover:bg-gray-200 p-1 rounded"><Minus size={12}/></button>
                      <button className="hover:bg-gray-200 p-1 rounded"><Square size={10}/></button>
                      <button onClick={(e) => { e.stopPropagation(); closeApp(app); }} className="hover:bg-red-500 hover:text-white p-1 rounded transition-colors"><X size={12}/></button>
                  </div>
              </div>
              {renderWindowContent(app)}
          </div>
      ))}

      {/* Start Menu */}
      {startMenuOpen && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[600px] h-[650px] bg-[#f3f3f3]/95 backdrop-blur-xl rounded-t-lg shadow-2xl p-6 flex flex-col animate-in slide-in-from-bottom-10 z-50 border border-white/20">
              <div className="mb-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                      <input type="text" placeholder="Type here to search" className="w-full bg-white pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm text-gray-700">Pinned</h3>
                      <button className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">All apps &gt;</button>
                  </div>
                  <div className="grid grid-cols-6 gap-4">
                      {[
                          { name: 'Edge', icon: <Chrome className="text-blue-500"/> },
                          { name: 'Word', icon: <div className="bg-blue-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold">W</div> },
                          { name: 'Excel', icon: <div className="bg-green-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold">X</div> },
                          { name: 'Settings', icon: <Settings className="text-gray-500"/> },
                          { name: 'Terminal', icon: <Terminal className="text-black"/> },
                          { name: 'Photos', icon: <Image className="text-blue-400"/> },
                      ].map(app => (
                          <button key={app.name} onClick={() => openApp(app.name)} className="flex flex-col items-center gap-2 p-2 hover:bg-white/50 rounded transition-colors">
                              <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center">
                                  {app.icon}
                              </div>
                              <span className="text-xs text-gray-700">{app.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
              <div className="h-16 border-t border-gray-300 -mx-6 -mb-6 px-8 flex items-center justify-between bg-[#e6e6e6]/50">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                       <span className="text-sm font-medium">Crafter User</span>
                   </div>
                   <button className="p-2 hover:bg-white rounded"><Power size={18}/></button>
              </div>
          </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-12 bg-[#f3f3f3]/85 backdrop-blur-md flex justify-between items-center px-4 z-50 border-t border-white/20">
         {/* Widgets placeholder */}
         <div className="w-32 hidden sm:flex items-center gap-2 pl-2">
             <div className="flex flex-col leading-none">
                 <span className="text-xs font-bold text-blue-600">72°F</span>
                 <span className="text-[10px] text-gray-500">Sunny</span>
             </div>
         </div>

         {/* Center Apps */}
         <div className="flex-1 flex justify-center items-center gap-1">
             <button onClick={() => setStartMenuOpen(!startMenuOpen)} className="p-2 hover:bg-white/50 rounded-md transition-colors">
                 <LayoutGrid className="text-blue-600 fill-blue-600" size={24}/>
             </button>
             <button onClick={() => openApp('Edge')} className="p-2 hover:bg-white/50 rounded-md transition-colors relative">
                 <Chrome className="text-gray-700" size={24}/>
                 {openWindows.includes('Edge') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>}
             </button>
             <button onClick={() => openApp('Terminal')} className="p-2 hover:bg-white/50 rounded-md transition-colors relative">
                 <Terminal className="text-gray-700" size={24}/>
                 {openWindows.includes('Terminal') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>}
             </button>
             <button onClick={() => openApp('Settings')} className="p-2 hover:bg-white/50 rounded-md transition-colors relative">
                 <Settings className="text-gray-700" size={24}/>
                 {openWindows.includes('Settings') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>}
             </button>
         </div>

         {/* System Tray */}
         <div className="flex items-center gap-2 text-xs">
             <div className="flex items-center gap-1 hover:bg-white/50 p-1 rounded transition-colors">
                 <ChevronUp size={14}/>
             </div>
             <div className="flex items-center gap-2 hover:bg-white/50 p-1 rounded transition-colors px-2">
                 <Wifi size={14}/>
                 <Volume2 size={14}/>
                 <Battery size={14}/>
             </div>
             <div className="flex flex-col items-end leading-none hover:bg-white/50 p-1 rounded transition-colors px-2 cursor-default">
                 <span>{currentTime}</span>
                 <span className="text-[10px]">{currentDate}</span>
             </div>
         </div>
      </div>
    </div>
  );
};

const ChevronUp = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export default HelloCpu;
