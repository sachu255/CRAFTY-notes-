
import React, { useState } from 'react';
import { ViewMode } from '../services/types';
import { Youtube, GraduationCap, Users, Box, Sparkles, Cloud, Palette, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';

interface Taskbar2Props {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  isOpen: boolean;
}

const Taskbar2: React.FC<Taskbar2Props> = ({ currentView, setView, isOpen }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) return null;

  const items = [
    { id: ViewMode.CrafterStudio, label: 'Creator Studio', icon: Youtube, color: 'text-red-500', bg: 'hover:bg-red-50' },
    { id: ViewMode.CraftyClass, label: 'Crafty Class', icon: GraduationCap, color: 'text-green-600', bg: 'hover:bg-green-50' },
    { id: ViewMode.AndroidStudio, label: 'Crafter IDE', icon: Box, color: 'text-indigo-500', bg: 'hover:bg-indigo-50' },
    { id: ViewMode.CrafterAI, label: 'Studio AI', icon: Sparkles, color: 'text-amber-500', bg: 'hover:bg-amber-50' },
    { id: ViewMode.CrafterCloud, label: 'Crafter Cloud', icon: Cloud, color: 'text-blue-500', bg: 'hover:bg-blue-50' },
    { id: ViewMode.ThemeStudio, label: 'Theme Studio', icon: Palette, color: 'text-purple-500', bg: 'hover:bg-purple-50' },
    { id: ViewMode.FamilyCenter, label: 'Family Center', icon: Users, color: 'text-cyan-600', bg: 'hover:bg-cyan-50' },
  ];

  return (
    <div className="fixed right-0 top-0 h-full z-40 flex flex-col justify-center items-end pr-2 pointer-events-none">
      
      {/* Toggle Handle (Visible when collapsed) */}
      {!isExpanded && (
          <div className="pointer-events-auto mr-[-8px]">
              <button 
                onClick={() => setIsExpanded(true)} 
                className="bg-white/80 backdrop-blur-md p-3 rounded-l-xl shadow-lg border border-gray-200 hover:bg-white transition-all group"
                title="Open Taskbar 2"
              >
                  <ChevronLeft size={24} className="text-gray-600 group-hover:text-blue-500 group-hover:scale-110 transition-transform"/>
              </button>
          </div>
      )}

      {/* Floating Dock Container */}
      <div className={`
          bg-white/90 backdrop-blur-xl border border-gray-200/50 p-2 rounded-2xl shadow-2xl flex flex-col gap-3 pointer-events-auto ring-1 ring-black/5 transition-all duration-300 transform origin-right
          ${isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 hidden'}
      `}>
        
        {/* Dock Header / Close Button */}
        <div className="flex justify-center py-1">
            <button 
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
                title="Hide Dock"
            >
                <ChevronRight size={16}/>
            </button>
        </div>

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
              relative group p-3 rounded-xl transition-all duration-300
              ${currentView === item.id 
                ? 'bg-gray-100 shadow-inner scale-100' 
                : `bg-transparent ${item.bg} hover:scale-110 hover:shadow-lg`}
            `}
            title={item.label}
          >
            <item.icon size={24} className={`${item.color} drop-shadow-sm transition-transform group-hover:rotate-6`} />
            
            {/* Label Tooltip (Appears on Hover) */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap shadow-xl z-50 pointer-events-none">
              {item.label}
              {/* Arrow */}
              <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>

            {/* Active Dot */}
            {currentView === item.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-r-full"></div>
            )}
          </button>
        ))}
        
        <div className="w-8 h-[2px] bg-gray-200 mx-auto my-1 rounded-full"></div>
        
        {/* Pro Badge */}
        <div className="p-2 flex justify-center group cursor-default">
            <div className="relative">
                <LayoutGrid size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors"/>
                <div className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar2;
