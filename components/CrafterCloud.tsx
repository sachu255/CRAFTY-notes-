
import React, { useState } from 'react';
import { UserProfile, Note } from '../services/types';
import { Cloud, HardDrive, Mail, Image, FileCode, FileText, Upload, Send, Check, Crown, Lock, Video, Plus, Play, Trash2 } from 'lucide-react';

interface CrafterCloudProps {
  profile: UserProfile;
  notes: Note[];
  onUpdateProfile: (p: UserProfile) => void;
  onDeleteNote?: (id: string, e: React.MouseEvent) => void;
}

const CrafterCloud: React.FC<CrafterCloudProps> = ({ profile, notes, onUpdateProfile, onDeleteNote }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'mail'>('files');
  const [fileCategory, setFileCategory] = useState<'all' | 'photos' | 'videos' | 'code' | 'notes'>('all');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Email State
  const [emailView, setEmailView] = useState<'inbox' | 'compose'>('inbox');
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  // Storage Logic
  const isMax = profile.storagePlan === 'max';
  const totalStorage = isMax ? 13 : 2; // TB
  const noteUsage = (notes.length * 0.0001); // Simulated usage
  const mediaUsage = isMax ? 1.2 : 0.5; // Mock existing files
  const usedStorage = noteUsage + mediaUsage;
  const usedPercentage = (usedStorage / totalStorage) * 100;

  const handleUpgrade = () => {
    onUpdateProfile({ ...profile, storagePlan: 'max' });
    setShowUpgradeModal(false);
    alert("Welcome to Crafter Studio MAX! You now have 13TB of storage.");
  };

  const sendEmail = () => {
    if (!composeData.to || !composeData.subject) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setComposeData({ to: '', subject: '', body: '' });
      setEmailView('inbox');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in relative">
      
      {/* Sidebar / Navigation */}
      <div className="flex h-full">
         <div className="w-20 md:w-64 bg-gray-50 border-r border-gray-100 flex flex-col p-4">
             <div className="flex items-center gap-2 mb-8 text-blue-600 font-black text-xl px-2">
                 <Cloud size={28} className="fill-current"/> <span className="hidden md:inline">Cloud</span>
             </div>

             <div className="space-y-2">
                 <button 
                    onClick={() => setActiveTab('files')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'files' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                     <HardDrive size={20}/> <span className="hidden md:inline font-medium">My Files</span>
                 </button>
                 <button 
                    onClick={() => setActiveTab('mail')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'mail' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                     <Mail size={20}/> <span className="hidden md:inline font-medium">Crafter Mail</span>
                 </button>
             </div>

             {/* Storage Widget */}
             <div className="mt-auto bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold text-gray-500">Storage</span>
                     <span className="text-xs font-bold text-blue-600">{usedStorage.toFixed(2)} TB / {totalStorage} TB</span>
                 </div>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                     <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${usedPercentage}%` }}></div>
                 </div>
                 {!isMax && (
                     <button 
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1"
                     >
                        <Crown size={12}/> Upgrade to Max
                     </button>
                 )}
                 {isMax && (
                     <div className="text-[10px] text-center text-purple-600 font-bold bg-purple-50 py-1 rounded">
                         CRAFTER STUDIO MAX ACTIVE
                     </div>
                 )}
             </div>
         </div>

         {/* Main Content */}
         <div className="flex-1 bg-white overflow-hidden flex flex-col">
             
             {/* FILES TAB */}
             {activeTab === 'files' && (
                 <>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">My Files</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
                            <Upload size={16}/> Upload
                        </button>
                    </div>
                    
                    {/* Categories */}
                    <div className="px-6 py-4 flex gap-2 overflow-x-auto custom-scrollbar">
                        {[
                            { id: 'all', label: 'All Files', icon: HardDrive },
                            { id: 'photos', label: 'Photos', icon: Image },
                            { id: 'videos', label: 'Videos', icon: Video },
                            { id: 'code', label: 'Code', icon: FileCode },
                            { id: 'notes', label: 'Synced Notes', icon: FileText },
                        ].map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setFileCategory(cat.id as any)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors
                                    ${fileCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                `}
                            >
                                <cat.icon size={16}/> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Dummy Content Generation based on filters */}
                            {(fileCategory === 'all' || fileCategory === 'notes') && notes.filter(n => !n.deleted).map(note => (
                                <div key={note.id} className="aspect-square bg-yellow-50 rounded-2xl p-4 border border-yellow-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer group relative">
                                    <FileText className="text-yellow-500 mb-2" size={24}/>
                                    <p className="font-bold text-gray-800 line-clamp-2 text-sm">{note.title || 'Untitled'}</p>
                                    <p className="text-xs text-gray-400 mt-auto">{new Date(note.updatedAt).toLocaleDateString()}</p>
                                    <div className="absolute top-2 right-2 text-green-500 opacity-0 group-hover:opacity-100"><Check size={16}/></div>
                                    {onDeleteNote && (
                                        <button 
                                            onClick={(e) => { onDeleteNote(note.id, e); }}
                                            className="absolute bottom-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Move to Bin"
                                        >
                                            <Trash2 size={12}/>
                                        </button>
                                    )}
                                </div>
                            ))}

                            {(fileCategory === 'all' || fileCategory === 'photos') && Array.from({length: 5}).map((_, i) => (
                                <div key={`p-${i}`} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                                    <img src={`https://picsum.photos/seed/${i + 100}/300/300`} className="w-full h-full object-cover" alt="Cloud Photo"/>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <span className="font-bold text-sm">IMG_{1000+i}.PNG</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('File deleted (Simulated)'); }}
                                        className="absolute bottom-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                        title="Delete"
                                    >
                                        <Trash2 size={12}/>
                                    </button>
                                </div>
                            ))}

                             {(fileCategory === 'all' || fileCategory === 'videos') && Array.from({length: 3}).map((_, i) => (
                                <div key={`v-${i}`} className="aspect-square bg-black rounded-2xl overflow-hidden relative group flex items-center justify-center">
                                    <Video className="text-white/50" size={48}/>
                                    <div className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">00:1{i}</div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Play className="fill-current"/>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('File deleted (Simulated)'); }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                        title="Delete"
                                    >
                                        <Trash2 size={12}/>
                                    </button>
                                </div>
                            ))}

                            {(fileCategory === 'all' || fileCategory === 'code') && Array.from({length: 4}).map((_, i) => (
                                <div key={`c-${i}`} className="aspect-square bg-gray-900 rounded-2xl p-4 flex flex-col group hover:ring-2 ring-blue-500 relative">
                                    <FileCode className="text-blue-400 mb-2" size={24}/>
                                    <p className="font-mono text-gray-300 text-xs line-clamp-4">function app() {'{'} console.log('Hello Cloud'); return true; {'}'}</p>
                                    <p className="text-xs text-gray-500 mt-auto">script_{i}.js</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('File deleted (Simulated)'); }}
                                        className="absolute bottom-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                        title="Delete"
                                    >
                                        <Trash2 size={12}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                 </>
             )}

             {/* MAIL TAB */}
             {activeTab === 'mail' && (
                 <div className="flex flex-col h-full">
                     <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                        <div className="flex items-center gap-2">
                             <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                 <Mail size={20}/>
                             </div>
                             <div>
                                 <h2 className="font-bold text-gray-800">Crafter Mail</h2>
                                 <p className="text-xs text-gray-500">{profile.name.toLowerCase().replace(' ', '')}@crafter-studio.com</p>
                             </div>
                        </div>
                        <button 
                            onClick={() => setEmailView(emailView === 'inbox' ? 'compose' : 'inbox')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {emailView === 'inbox' ? <><Plus size={16}/> New Message</> : 'Back to Inbox'}
                        </button>
                     </div>

                     {emailView === 'inbox' && (
                         <div className="flex-1 overflow-y-auto">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="p-4 border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer flex gap-4">
                                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                                         C
                                     </div>
                                     <div className="flex-1">
                                         <div className="flex justify-between mb-1">
                                             <h4 className="font-bold text-gray-800">Crafter Studio Team</h4>
                                             <span className="text-xs text-gray-400">10:4{i} AM</span>
                                         </div>
                                         <p className="text-sm font-medium text-gray-700">Welcome to Crafter Cloud!</p>
                                         <p className="text-xs text-gray-500 line-clamp-1">Your 2TB storage is active. Upgrade to Max for free to unlock 13TB...</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}

                     {emailView === 'compose' && (
                         <div className="flex-1 p-6 flex flex-col gap-4">
                             {sentSuccess ? (
                                 <div className="flex-1 flex flex-col items-center justify-center text-green-600 animate-in zoom-in">
                                     <Check size={48} className="mb-4 bg-green-100 p-2 rounded-full"/>
                                     <h3 className="text-2xl font-bold">Sent Successfully!</h3>
                                     <p className="text-gray-500">Your email has been delivered via Crafter Mail.</p>
                                 </div>
                             ) : (
                                 <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                                        <input 
                                            type="email" 
                                            placeholder="recipient@example.com"
                                            value={composeData.to}
                                            onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                                        <input 
                                            type="text" 
                                            placeholder="Hello there..."
                                            value={composeData.subject}
                                            onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1 flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                        <textarea 
                                            placeholder="Write your email..."
                                            value={composeData.body}
                                            onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                                            className="flex-1 w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={sendEmail}
                                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <Send size={18}/> Send Email
                                        </button>
                                    </div>
                                 </>
                             )}
                         </div>
                     )}
                 </div>
             )}
         </div>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                  <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
                      <Crown size={64} className="text-white drop-shadow-md"/>
                  </div>
                  <div className="p-8 text-center">
                      <h2 className="text-3xl font-black text-gray-900 mb-2">Crafter Studio MAX</h2>
                      <p className="text-gray-500 mb-8">Unlock the full potential of your cloud.</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-50">
                              <p className="text-xs font-bold text-gray-400 uppercase">Current</p>
                              <h3 className="text-2xl font-bold text-gray-800">2 TB</h3>
                              <p className="text-xs text-gray-500">Storage</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 ring-2 ring-purple-500">
                              <p className="text-xs font-bold text-purple-600 uppercase">Upgrade</p>
                              <h3 className="text-2xl font-bold text-gray-900">13 TB</h3>
                              <p className="text-xs text-gray-600">Storage</p>
                          </div>
                      </div>

                      <ul className="text-left space-y-3 mb-8 text-gray-600 text-sm mx-auto max-w-xs">
                          <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Priority AI Generation</li>
                          <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Advanced Code Sandbox</li>
                          <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> 4K Video Streaming Support</li>
                      </ul>

                      <div className="flex gap-3">
                          <button onClick={() => setShowUpgradeModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                          <button onClick={handleUpgrade} className="flex-1 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                              Upgrade for Free
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CrafterCloud;
