
import React from 'react';
import { AppSettings, MarketItem } from '../services/types';
import { Palette, Trash2, Download, Shuffle } from 'lucide-react';
import { SupermanCapeIcon, ShieldIcon, StarIcon, RocketIcon, BoltIcon, CrownIcon, SantaIcon } from '../constants';

interface ThemeStudioProps {
  settings: AppSettings;
  updateSettings: (s: AppSettings) => void;
  isStandalone?: boolean;
  installedItems?: MarketItem[];
  onUninstall?: (id: string) => void;
}

const ThemeStudio: React.FC<ThemeStudioProps> = ({ 
    settings, updateSettings, isStandalone = false, 
    installedItems = [], onUninstall 
}) => {

  const downloadedThemes = installedItems.filter(i => i.category === 'Theme' || i.category === 'Wallpaper');
  const downloadedFonts = installedItems.filter(i => i.category === 'Font');
  const downloadedLogos = installedItems.filter(i => i.category === 'Logo');

  const setRandomTheme = () => {
      const themes = ['light', 'dark', 'christmas', 'bw', 'win11', 'superman', 'forest', 'ocean', 'cyberpunk', 'sunset', 'lavender', 'terminal', 'retro', 'matrix', 'coffee'];
      const random = themes[Math.floor(Math.random() * themes.length)];
      updateSettings({...settings, theme: random});
  };

  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ${isStandalone ? 'animate-slide-in h-full overflow-y-auto custom-scrollbar' : ''}`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <Palette className="text-secondary"/> Theme Studio
            </h2>
            <button onClick={setRandomTheme} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors">
                <Shuffle size={14}/> Shuffle
            </button>
        </div>
        
        <div className="space-y-8">
            {/* THEMES */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">System Themes</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                        { id: 'light', label: 'Default', class: 'bg-white border-gray-200' },
                        { id: 'dark', label: 'Dark', class: 'bg-gray-800 text-white border-gray-700' },
                        { id: 'christmas', label: 'Christmas', class: 'bg-red-600 text-white border-green-600' },
                        { id: 'bw', label: 'B&W', class: 'bg-black text-white border-gray-900 grayscale' },
                        { id: 'win11', label: 'Windows 11', class: 'bg-[#f9f9f9] text-[#202020] border-gray-300' },
                        { id: 'matrix', label: 'Matrix', class: 'bg-black text-green-500 font-mono border-green-800' },
                        { id: 'coffee', label: 'Coffee', class: 'bg-[#3C2A21] text-[#E5E5CB] border-[#E5E5CB]' },
                        { id: 'superman', label: 'Superman', class: 'bg-blue-600 text-white' },
                        { id: 'forest', label: 'Nature', class: 'bg-green-100 text-green-900' },
                        { id: 'ocean', label: 'Ocean', class: 'bg-cyan-100 text-cyan-900' },
                        { id: 'cyberpunk', label: 'Cyberpunk', class: 'bg-black text-green-400' },
                        { id: 'sunset', label: 'Sunset', class: 'bg-orange-100 text-red-900' },
                        { id: 'lavender', label: 'Lavender', class: 'bg-purple-50 text-purple-900' },
                        { id: 'terminal', label: 'Terminal', class: 'bg-gray-900 text-green-500 font-mono' },
                        { id: 'retro', label: 'Retro', class: 'bg-amber-100 text-amber-900' }
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => updateSettings({...settings, theme: t.id as any})}
                            className={`
                                p-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition-all relative overflow-hidden
                                ${settings.theme === t.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                                ${t.id === 'dark' || t.id === 'cyberpunk' || t.id === 'superman' || t.id === 'terminal' || t.id === 'bw' || t.id === 'christmas' || t.id === 'matrix' || t.id === 'coffee' ? 'text-white' : 'text-gray-800'}
                            `}
                            style={{
                                backgroundColor: t.id === 'superman' ? '#2563EB' : t.id === 'dark' ? '#1F2937' : t.id === 'bw' ? '#000000' : t.id === 'cyberpunk' ? '#000000' : t.id === 'forest' ? '#DCFCE7' : t.id === 'ocean' ? '#CFFAFE' : t.id === 'sunset' ? '#ffedd5' : t.id === 'lavender' ? '#faf5ff' : t.id === 'terminal' ? '#111827' : t.id === 'retro' ? '#fef3c7' : t.id === 'win11' ? '#f9f9f9' : t.id === 'christmas' ? '#D42426' : t.id === 'matrix' ? '#000000' : t.id === 'coffee' ? '#3C2A21' : '#ffffff',
                                color: t.id === 'coffee' ? '#E5E5CB' : t.id === 'matrix' ? '#22c55e' : undefined
                            }}
                        >
                            {t.id === 'christmas' && <div className="absolute inset-0 bg-gradient-to-tr from-green-800/30 to-transparent pointer-events-none"></div>}
                            {t.label}
                        </button>
                    ))}
                </div>

                {downloadedThemes.length > 0 && (
                    <>
                        <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-1"><Download size={14}/> Downloaded Themes</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {downloadedThemes.map(t => (
                                <div key={t.id} className="relative group">
                                     <button
                                        onClick={() => updateSettings({...settings, theme: t.id as any})}
                                        className={`
                                            w-full p-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition-all relative overflow-hidden h-10
                                            ${settings.theme === t.id ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200'}
                                        `}
                                    >
                                        <img src={t.image} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
                                        <span className="relative z-10 text-gray-800">{t.title.split(' ')[0]}</span>
                                    </button>
                                    {onUninstall && (
                                        <button 
                                            onClick={() => onUninstall(t.id)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                            title="Move to Bin"
                                        >
                                            <Trash2 size={12}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* LOGOS */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">App Logo</label>
                <div className="flex gap-4 flex-wrap mb-4">
                    {['cape', 'shield', 'star', 'rocket', 'bolt', 'crown', 'santa'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => updateSettings({...settings, logoType: type as any})}
                            className={`p-3 rounded-xl border-2 transition-all ${settings.logoType === type ? 'border-primary bg-primary/5' : 'border-transparent bg-gray-50'}`}
                        >
                            {type === 'cape' && <SupermanCapeIcon className="w-6 h-6 text-primary"/>}
                            {type === 'shield' && <ShieldIcon className="w-6 h-6 text-secondary"/>}
                            {type === 'star' && <StarIcon className="w-6 h-6 text-accent"/>}
                            {type === 'rocket' && <RocketIcon className="w-6 h-6 text-primary"/>}
                            {type === 'bolt' && <BoltIcon className="w-6 h-6 text-accent"/>}
                            {type === 'crown' && <CrownIcon className="w-6 h-6 text-amber-500"/>}
                            {type === 'santa' && <SantaIcon className="w-6 h-6 text-red-600"/>}
                        </button>
                    ))}
                </div>
                
                {downloadedLogos.length > 0 && (
                    <>
                         <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-1"><Download size={14}/> Downloaded Logos</label>
                         <div className="flex gap-4 flex-wrap">
                            {downloadedLogos.map(logo => (
                                <div key={logo.id} className="relative group">
                                    <button 
                                        onClick={() => updateSettings({...settings, logoType: logo.id as any})}
                                        className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${settings.logoType === logo.id ? 'border-primary' : 'border-gray-200'}`}
                                    >
                                        <img src={logo.image} alt="logo" className="w-full h-full object-cover"/>
                                    </button>
                                    {onUninstall && (
                                        <button 
                                            onClick={() => onUninstall(logo.id)}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            <Trash2 size={10}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                         </div>
                    </>
                )}
            </div>

            {/* FONTS */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Font Style</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                     {['sans', 'serif', 'mono', 'playfair', 'oswald', 'handwriting'].map(f => (
                         <button key={f} onClick={() => updateSettings({...settings, font: f})} className={`px-2 py-2 rounded-lg text-xs border capitalize font-${f} ${settings.font === f ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                             {f}
                         </button>
                     ))}
                </div>
                
                {downloadedFonts.length > 0 && (
                     <>
                        <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-1"><Download size={14}/> Downloaded Fonts</label>
                        <div className="grid grid-cols-3 gap-2">
                             {downloadedFonts.map(font => (
                                 <div key={font.id} className="relative group">
                                     <button
                                        onClick={() => updateSettings({...settings, font: font.id as any})}
                                        className={`w-full px-2 py-2 rounded-lg text-xs border ${settings.font === font.id ? 'bg-gray-800 text-white' : 'bg-white'}`}
                                     >
                                        {font.title.split(' ')[0]}
                                     </button>
                                     {onUninstall && (
                                        <button 
                                            onClick={() => onUninstall(font.id)}
                                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            <Trash2 size={10}/>
                                        </button>
                                     )}
                                 </div>
                             ))}
                        </div>
                     </>
                )}
            </div>
        </div>
    </div>
  );
};

export default ThemeStudio;
