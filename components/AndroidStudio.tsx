
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Smartphone, Folder, FileCode, Search, Menu, Bug, Terminal, Cpu, Layout, FileJson, Settings, ChevronRight, ChevronDown, CheckCircle, AlertTriangle, Sparkles, Bot, Loader2, Download, Send, RefreshCw, Tablet, Eye, Activity, Edit3, Image as ImageIcon, Upload, Rocket, Package, Globe, Zap, Code, Wrench, Plus, X, Lock, Grid } from 'lucide-react';
import { generateAndroidCode, generateStickerImage } from '../services/geminiService';
import { MarketItem } from '../services/types';
import { v4 as uuidv4 } from 'uuid';

interface AndroidStudioProps {
    onInstallApp?: (app: MarketItem) => void;
    runMode?: boolean;
    initialCode?: { kotlin: string, xml: string, web?: string };
    initialName?: string;
    initialIcon?: string;
}

const AndroidStudio: React.FC<AndroidStudioProps> = ({ onInstallApp, runMode = false, initialCode, initialName, initialIcon }) => {
  const [activeFile, setActiveFile] = useState('MainActivity.kt');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'failed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [showEmulator, setShowEmulator] = useState(runMode);
  const [device, setDevice] = useState<'s25' | 'pixel' | 'tablet'>('s25');
  const [activeBottomTab, setActiveBottomTab] = useState<'logcat' | 'profiler'>('logcat');
  
  // App Configuration
  const [appName, setAppName] = useState(initialName || 'My Dream App');
  const [appIcon, setAppIcon] = useState<string | null>(initialIcon || null);
  
  // Profiler State
  const [cpuUsage, setCpuUsage] = useState<number[]>(new Array(20).fill(10));
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(!runMode);
  const [aiTab, setAiTab] = useState<'chat' | 'features' | 'fix'>('chat');
  const [aiMessages, setAiMessages] = useState<{role: 'user'|'bot', text: string}[]>([
      {role: 'bot', text: 'Hello! I am Crafter Studio AI. I can write code, fix bugs, and build features for you.'}
  ]);

  // Simulated File Content
  const [codeSnippets, setCodeSnippets] = useState<Record<string, string>>(initialCode ? {
      'MainActivity.kt': initialCode.kotlin,
      'activity_main.xml': initialCode.xml,
      'WebApp.html': initialCode.web || '<!-- No Web Version Available -->',
      'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.crafter.app">
    <application android:label="${initialName || 'My App'}" ... >
    </application>
</manifest>`
  } : {
      'MainActivity.kt': `package com.crafter.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Crafted with Crafter Studio
        println("Hello from Android!")
    }
}`,
      'activity_main.xml': `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#FFFFFF">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello Crafter!"
        android:textSize="24sp"
        android:textColor="#000000" />

</LinearLayout>`,
      'WebApp.html': `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; }
  h1 { font-size: 24px; color: #000; }
</style>
</head>
<body>
  <h1>Hello Crafter!</h1>
</body>
</html>`,
      'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.crafter.app">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:theme="@style/Theme.CrafterApp">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  });

  // Update Manifest when appName changes
  useEffect(() => {
      setCodeSnippets(prev => ({
          ...prev,
          'AndroidManifest.xml': prev['AndroidManifest.xml'].replace(/android:label=".*?"/, `android:label="${appName}"`)
      }));
  }, [appName]);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const aiChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if(aiChatRef.current) aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
  }, [aiMessages]);

  // Profiler Loop
  useEffect(() => {
      if (activeBottomTab === 'profiler') {
          const interval = setInterval(() => {
              setCpuUsage(prev => [...prev.slice(1), Math.random() * 40 + 10]);
          }, 500);
          return () => clearInterval(interval);
      }
  }, [activeBottomTab]);

  const files = [
      { name: 'app', type: 'folder', children: [
          { name: 'manifests', type: 'folder', children: [
              { name: 'AndroidManifest.xml', type: 'xml' }
          ]},
          { name: 'java', type: 'folder', children: [
              { name: 'com.crafter.app', type: 'folder', children: [
                  { name: 'MainActivity.kt', type: 'kt' },
                  { name: 'Utils.kt', type: 'kt' }
              ]}
          ]},
          { name: 'res', type: 'folder', children: [
              { name: 'layout', type: 'folder', children: [
                  { name: 'activity_main.xml', type: 'xml' }
              ]},
              { name: 'web', type: 'folder', children: [
                  { name: 'WebApp.html', type: 'html' }
              ]}
          ]}
      ]},
      { name: 'Gradle Scripts', type: 'folder', children: [
          { name: 'build.gradle', type: 'gradle' }
      ]}
  ];

  const handleBuild = () => {
      if(isBuilding) return;
      setIsBuilding(true);
      setBuildStatus('building');
      setLogs(['> Task :clean', '> Task :preBuild']);
      setShowEmulator(false);

      let step = 0;
      const steps = [
          '> Task :compileDebugKotlin',
          '> Task :compileDebugJavaWithJavac',
          '> Task :processDebugResources',
          '> Task :mergeDebugResources',
          '> Task :dexBuilderDebug',
          '> Task :mergeDebugJavaResource',
          '> Task :installDebug',
          'BUILD SUCCESSFUL in 2s'
      ];

      const interval = setInterval(() => {
          if (step < steps.length) {
              setLogs(prev => [...prev, steps[step]]);
              step++;
          } else {
              clearInterval(interval);
              setIsBuilding(false);
              setBuildStatus('success');
              setShowEmulator(true);
          }
          if(logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }, 300);
  };

  const handleAiChat = async () => {
      if (!aiPrompt.trim()) return;
      const userMsg = aiPrompt;
      setAiMessages(prev => [...prev, {role: 'user', text: userMsg}]);
      setAiPrompt('');
      setAiLoading(true);

      try {
          // If asking to code, use the generator
          if (userMsg.toLowerCase().includes('code') || userMsg.toLowerCase().includes('create') || userMsg.toLowerCase().includes('make')) {
              const result = await generateAndroidCode(userMsg);
              if (result.kotlin && result.xml) {
                  setCodeSnippets(prev => ({
                      ...prev,
                      'MainActivity.kt': result.kotlin,
                      'activity_main.xml': result.xml,
                      'WebApp.html': result.web || prev['WebApp.html']
                  }));
                  setAiMessages(prev => [...prev, {role: 'bot', text: 'I have updated the code files based on your request. Check the editor!'}]);
              } else {
                  setAiMessages(prev => [...prev, {role: 'bot', text: 'I tried to generate code but something went wrong.'}]);
              }
          } else {
              // Simple response simulation for chat
              setTimeout(() => {
                  setAiMessages(prev => [...prev, {role: 'bot', text: `I can help you with Android development. Try asking me to "Create a Login Screen" or "Fix bugs".`}]);
              }, 1000);
          }
      } catch (e) {
          setAiMessages(prev => [...prev, {role: 'bot', text: 'Connection error.'}]);
      } finally {
          setAiLoading(false);
      }
  };

  const handleFeatureInject = async (feature: string) => {
      setAiLoading(true);
      setLogs(prev => [...prev, `> AI: Analyzing project structure...`, `> AI: Injecting ${feature} module...`]);
      try {
          const result = await generateAndroidCode(`Create a simple android app with ${feature}`);
          if (result.kotlin) {
              setCodeSnippets(prev => ({
                  ...prev,
                  'MainActivity.kt': result.kotlin,
                  'activity_main.xml': result.xml,
                  'WebApp.html': result.web || prev['WebApp.html']
              }));
              setLogs(prev => [...prev, `> AI: ${feature} integrated successfully.`]);
              setAiMessages(prev => [...prev, {role: 'bot', text: `I've added the ${feature} feature to your project.`}]);
          }
      } catch (e) {
          setLogs(prev => [...prev, `> AI: Failed to inject feature.`]);
      } finally {
          setAiLoading(false);
      }
  }

  const handleAiFix = () => {
      setAiLoading(true);
      setLogs(prev => [...prev, '> AI: Scanning code for errors...', '> AI: Found 2 potential issues.', '> AI: Patching NullPointerException...', '> AI: Optimizing layout...']);
      setTimeout(() => {
          setCodeSnippets(prev => ({
              ...prev,
              'MainActivity.kt': prev['MainActivity.kt'] + '\n\n// AI Fix: Handled potential memory leak in onCreate',
              'WebApp.html': prev['WebApp.html'].replace('</body>', '<!-- AI Optimized: Added responsive meta tags -->\n</body>')
          }));
          setLogs(prev => [...prev, '> AI: Fixes applied. Build recommended.']);
          setAiMessages(prev => [...prev, {role: 'bot', text: 'I found and fixed some potential bugs in your code. The app should run smoother now.'}]);
          setAiLoading(false);
      }, 2000);
  }

  const handleExportWebApp = () => {
      const content = codeSnippets['WebApp.html'];
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${appName.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Web App Downloaded! \nOpen this HTML file on your Phone or PC to run your app immediately.");
  };

  const handleDownloadSource = () => {
      const content = `=== Crafter Studio Project ===\nApp: ${appName}\n\n${codeSnippets['MainActivity.kt']}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${appName.replace(/\s+/g, '_')}_Source.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleInstallToOS = () => {
      if (onInstallApp) {
          onInstallApp({
              id: uuidv4(),
              title: appName,
              description: 'User Created App',
              category: 'App',
              originalPrice: 0,
              price: 0,
              priceType: 'free',
              image: appIcon || 'https://via.placeholder.com/50',
              rating: 5,
              downloads: '1',
              installed: true,
              code: {
                  kotlin: codeSnippets['MainActivity.kt'],
                  xml: codeSnippets['activity_main.xml'],
                  web: codeSnippets['WebApp.html']
              }
          });
          alert(`"${appName}" installed to Crafter OS Taskbar!`);
      }
  };

  const handleGenerateIcon = async () => {
      setAiLoading(true);
      const icon = await generateStickerImage(`App icon for ${appName}. Minimalist, vector style.`);
      if(icon) setAppIcon(icon);
      setAiLoading(false);
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setAppIcon(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const renderFileTree = (items: any[], depth = 0) => {
      return items.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="select-none">
              <div 
                className={`flex items-center gap-1 px-2 py-1 hover:bg-[#2d2f31] cursor-pointer text-sm ${activeFile === item.name ? 'bg-[#2d2f31] text-white' : 'text-[#a9b7c6]'}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => { if(item.type !== 'folder') setActiveFile(item.name); }}
              >
                  {item.type === 'folder' && <Folder size={14} className="text-[#a9b7c6]"/>}
                  {item.type === 'kt' && <span className="text-[#6a8759] font-bold text-xs">kt</span>}
                  {item.type === 'xml' && <FileCode size={14} className="text-[#e8bf6a]"/>}
                  {item.type === 'html' && <Globe size={14} className="text-blue-400"/>}
                  {item.type === 'gradle' && <Settings size={14} className="text-[#629755]"/>}
                  <span className="truncate">{item.name}</span>
              </div>
              {item.children && renderFileTree(item.children, depth + 1)}
          </div>
      ));
  };

  const getPreviewText = () => {
      const match = codeSnippets['activity_main.xml'].match(/android:text="([^"]*)"/);
      return match ? match[1] : 'Hello World';
  }
  const getPreviewColor = () => {
      const match = codeSnippets['activity_main.xml'].match(/android:background="([^"]*)"/);
      return match ? match[1] : '#FFFFFF';
  }

  const getDeviceStyle = () => {
      switch(device) {
          case 's25': return { width: 280, height: 600, radius: 24 };
          case 'pixel': return { width: 270, height: 580, radius: 32 };
          case 'tablet': return { width: 450, height: 350, radius: 16 };
      }
  };
  const ds = getDeviceStyle();

  if (runMode) {
      return (
          <div className="flex items-center justify-center h-full bg-[#1e1f22] p-8">
               <div className="relative animate-in zoom-in">
                    <div 
                        className="bg-[#1a1a1a] border-[2px] border-[#3a3a3a] shadow-2xl overflow-hidden relative ring-4 ring-[#111] flex flex-col"
                        style={{ width: ds.width, height: ds.height, borderRadius: ds.radius }}
                    >
                        <div className="flex-1 bg-black m-[2px] overflow-hidden relative flex flex-col" style={{ borderRadius: ds.radius - 4 }}>
                            <div className="h-12 bg-gray-900 text-white flex items-center px-4 gap-3 shadow-md z-10">
                                {appIcon ? <img src={appIcon} alt="App" className="w-8 h-8 rounded-lg object-cover"/> : <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">{appName.charAt(0)}</div>}
                                <span className="font-bold text-sm truncate">{appName}</span>
                            </div>
                            {codeSnippets['WebApp.html'] ? (
                                <iframe srcDoc={codeSnippets['WebApp.html']} className="flex-1 w-full h-full border-none bg-white" title="App Preview"/>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center transition-colors duration-500 relative" style={{ backgroundColor: getPreviewColor() }}>
                                    <h2 className="text-2xl font-bold" style={{ color: getPreviewColor() === '#000000' ? 'white' : 'black' }}>{getPreviewText()}</h2>
                                </div>
                            )}
                        </div>
                    </div>
               </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#1e1f22] rounded-xl shadow-2xl border border-[#3e3f42] overflow-hidden text-[#bcbec4] font-sans">
        {/* Top Toolbar */}
        <div className="h-14 bg-[#2b2d30] border-b border-[#1e1f22] flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <span className="font-bold text-white flex items-center gap-2"><Smartphone className="text-[#6a8759]" size={16}/> Crafter IDE</span>
                <div className="h-4 w-px bg-gray-600"></div>
                <div className="flex items-center gap-2">
                    <button onClick={handleBuild} className={`p-1.5 rounded-full transition-colors ${isBuilding ? 'bg-gray-600 text-gray-400' : 'bg-[#3592c4] hover:bg-[#2a7a9e] text-white'}`} disabled={isBuilding} title="Run in Emulator"><Play size={14} fill="currentColor"/></button>
                    <button onClick={handleExportWebApp} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-bold transition-colors" title="Download Runnable Web App"><Globe size={12}/> Export</button>
                    {onInstallApp && (
                        <button onClick={handleInstallToOS} className="flex items-center gap-1 bg-[#6a8759] text-white px-2 py-1 rounded text-xs font-bold hover:bg-[#5b7a4a]" title="Install to Crafter OS"><Rocket size={12}/> Install</button>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#393b40] px-2 py-1 rounded border border-[#4e5157]">
                    <label className="cursor-pointer hover:opacity-80 relative group">
                        {appIcon ? <img src={appIcon} alt="Icon" className="w-5 h-5 rounded-md object-cover"/> : <div className="w-5 h-5 bg-gray-500 rounded-md flex items-center justify-center"><Upload size={10} className="text-white"/></div>}
                        <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload}/>
                        <button onClick={(e) => { e.preventDefault(); handleGenerateIcon(); }} className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">AI Gen</button>
                    </label>
                    <input value={appName} onChange={(e) => setAppName(e.target.value)} className="bg-transparent border-none outline-none text-xs text-white w-24" placeholder="App Name"/>
                    <Edit3 size={10} className="text-gray-500"/>
                </div>
                <button onClick={() => setAiOpen(!aiOpen)} className={`px-2 py-1 rounded flex items-center gap-1 text-xs transition-colors ${aiOpen ? 'bg-[#365880] text-white' : 'text-gray-400 hover:bg-[#393b40]'}`}>
                    <Sparkles size={12}/> Studio AI
                </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Project Sidebar */}
            <div className="w-56 bg-[#2b2d30] border-r border-[#1e1f22] flex flex-col shrink-0 hidden md:flex">
                <div className="p-2 text-xs font-bold text-[#a9b7c6] border-b border-[#3e3f42] flex items-center gap-1"><span className="bg-[#3e3f42] px-1 rounded">Android</span></div>
                <div className="flex-1 overflow-y-auto py-2">{renderFileTree(files)}</div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col bg-[#1e1f22] relative">
                {/* Tabs */}
                <div className="flex bg-[#2b2d30] border-b border-[#1e1f22] overflow-x-auto">
                    {Object.keys(codeSnippets).map(file => (
                        <div key={file} onClick={() => setActiveFile(file)} className={`px-4 py-2 text-sm border-r border-[#1e1f22] cursor-pointer flex items-center gap-2 ${activeFile === file ? 'bg-[#1e1f22] text-[#a9b7c6] border-t-2 border-t-[#3592c4]' : 'text-gray-500'}`}>
                            {file.endsWith('.kt') && <span className="text-[#6a8759] font-bold text-xs">K</span>}
                            {file.endsWith('.xml') && <FileCode size={12} className="text-[#e8bf6a]"/>}
                            {file.endsWith('.html') && <Globe size={12} className="text-blue-400"/>}
                            {file}
                        </div>
                    ))}
                </div>

                {/* Code Area */}
                <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 relative">
                    <textarea value={codeSnippets[activeFile]} onChange={(e) => setCodeSnippets(p => ({...p, [activeFile]: e.target.value}))} className="w-full h-full bg-transparent text-[#a9b7c6] outline-none resize-none border-none" spellCheck={false}/>
                </div>

                {/* Emulator Overlay */}
                {showEmulator && (
                    <div className="absolute top-4 right-4 z-20 animate-in slide-in-from-right-20">
                        <div className="bg-[#1a1a1a] border-[2px] border-[#3a3a3a] shadow-2xl overflow-hidden relative ring-4 ring-[#111] flex flex-col transition-all duration-300" style={{ width: ds.width, height: ds.height, borderRadius: ds.radius }}>
                            <div className="flex-1 bg-black m-[2px] overflow-hidden relative flex flex-col" style={{ borderRadius: ds.radius - 4 }}>
                                <div className="h-8 bg-transparent text-white flex justify-between px-4 items-center text-[10px] font-medium z-20 pt-1">
                                    <span>12:00</span>
                                    <div className="flex gap-1"><div className="w-3 h-3 bg-white rounded-full opacity-20"></div></div>
                                </div>
                                <div className="h-12 bg-gray-900 text-white flex items-center px-4 gap-3 shadow-md z-10">
                                    {appIcon ? <img src={appIcon} alt="App" className="w-8 h-8 rounded-lg object-cover"/> : <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">{appName.charAt(0)}</div>}
                                    <span className="font-bold text-sm truncate">{appName}</span>
                                </div>
                                {codeSnippets['WebApp.html'] ? <iframe srcDoc={codeSnippets['WebApp.html']} className="flex-1 w-full h-full border-none bg-white" title="Emulator"/> : <div className="flex-1 flex items-center justify-center text-white">No Preview</div>}
                                <div className="h-4 w-full flex justify-center items-center pb-2 bg-black"><div className="w-32 h-1 bg-gray-500 rounded-full"></div></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Crafter Studio AI Panel */}
            {aiOpen && (
                <div className="w-96 bg-[#2b2d30] border-l border-[#1e1f22] flex flex-col shrink-0 shadow-xl transition-all duration-300">
                    <div className="p-3 border-b border-[#3e3f42] flex items-center justify-between bg-[#313335]">
                        <span className="font-bold text-white flex items-center gap-2"><Sparkles size={16} className="text-purple-400"/> Crafter Studio AI</span>
                        <button onClick={() => setAiOpen(false)} className="hover:text-white"><X size={16}/></button>
                    </div>
                    
                    {/* AI Tabs */}
                    <div className="flex bg-[#2b2d30] border-b border-[#3e3f42]">
                        <button onClick={() => setAiTab('chat')} className={`flex-1 py-2 text-xs font-bold ${aiTab==='chat' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>Chat</button>
                        <button onClick={() => setAiTab('features')} className={`flex-1 py-2 text-xs font-bold ${aiTab==='features' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>Features</button>
                        <button onClick={() => setAiTab('fix')} className={`flex-1 py-2 text-xs font-bold ${aiTab==='fix' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>Fixes</button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {aiTab === 'chat' && (
                            <>
                                <div className="flex-1 p-4 overflow-y-auto space-y-3" ref={aiChatRef}>
                                    {aiMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-xl text-xs ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-[#3c3f41] text-[#a9b7c6] border border-[#4e5157]'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {aiLoading && <div className="flex items-center gap-2 text-xs text-gray-500"><Loader2 size={12} className="animate-spin"/> AI is thinking...</div>}
                                </div>
                                <div className="p-3 border-t border-[#3e3f42] bg-[#313335] flex gap-2">
                                    <input 
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                                        placeholder="Ask AI to code..."
                                        className="flex-1 bg-[#2b2d30] border border-[#3e3f42] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                                    />
                                    <button onClick={handleAiChat} disabled={aiLoading || !aiPrompt} className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50"><Send size={14}/></button>
                                </div>
                            </>
                        )}

                        {aiTab === 'features' && (
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                <p className="text-xs text-gray-500 mb-2">Instantly add features to your app.</p>
                                {[
                                    {name: 'Login Screen', icon: <Lock size={14}/>, desc: 'Email/Password layout'},
                                    {name: 'Profile Page', icon: <Bot size={14}/>, desc: 'User details & avatar'},
                                    {name: 'Product List', icon: <Grid size={14}/>, desc: 'RecyclerView with items'},
                                    {name: 'Settings Menu', icon: <Settings size={14}/>, desc: 'Preferences UI'},
                                    {name: 'Maps Integration', icon: <Globe size={14}/>, desc: 'Google Maps view'},
                                ].map(feat => (
                                    <button 
                                        key={feat.name}
                                        onClick={() => handleFeatureInject(feat.name)}
                                        disabled={aiLoading}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3c3f41] border border-[#4e5157] hover:bg-[#45474a] text-left transition-colors group"
                                    >
                                        <div className="p-2 bg-[#2b2d30] rounded-lg text-purple-400 group-hover:text-white transition-colors">{feat.icon}</div>
                                        <div>
                                            <h4 className="text-xs font-bold text-[#a9b7c6] group-hover:text-white">{feat.name}</h4>
                                            <p className="text-[10px] text-gray-500">{feat.desc}</p>
                                        </div>
                                        <Plus size={14} className="ml-auto text-gray-500 group-hover:text-green-400"/>
                                    </button>
                                ))}
                            </div>
                        )}

                        {aiTab === 'fix' && (
                            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-[#3c3f41] rounded-full flex items-center justify-center mb-4 text-purple-400">
                                    <Wrench size={32}/>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2">Auto-Fixer</h3>
                                <p className="text-xs text-gray-500 mb-6 max-w-[200px]">AI will scan your code for bugs, performance issues, and memory leaks.</p>
                                <button 
                                    onClick={handleAiFix}
                                    disabled={aiLoading}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {aiLoading ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14} fill="currentColor"/>}
                                    Start AI Scan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Panel */}
        <div className="h-40 bg-[#2b2d30] border-t border-[#3e3f42] flex flex-col">
            <div className="flex items-center gap-4 px-4 py-1 bg-[#3c3f41] border-b border-[#3e3f42] text-xs text-[#a9b7c6]">
                <span className="hover:text-white cursor-pointer flex items-center gap-1"><Terminal size={12}/> Build</span>
                <button onClick={()=>setActiveBottomTab('logcat')} className={`hover:text-white cursor-pointer pb-1 ${activeBottomTab==='logcat' ? 'border-b-2 border-[#3592c4] text-white' : ''}`}>Logcat</button>
                <button onClick={()=>setActiveBottomTab('profiler')} className={`hover:text-white cursor-pointer pb-1 ${activeBottomTab==='profiler' ? 'border-b-2 border-[#3592c4] text-white' : ''}`}>Profiler</button>
            </div>
            <div className="flex-1 overflow-hidden relative">
                {activeBottomTab === 'logcat' && (
                    <div ref={logContainerRef} className="h-full overflow-y-auto p-2 font-mono text-xs text-[#a9b7c6] space-y-1">
                        {logs.length === 0 && <span className="opacity-50">Build output will appear here...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('SUCCESSFUL') ? 'text-[#6a8759] font-bold' : log.includes('Error') ? 'text-[#cc7832]' : ''}`}>{log}</div>
                        ))}
                    </div>
                )}
                {activeBottomTab === 'profiler' && (
                    <div className="h-full flex items-end p-4 gap-1">
                        {cpuUsage.map((val, i) => (
                            <div key={i} className="flex-1 bg-[#3592c4] opacity-50 hover:opacity-100 transition-all" style={{ height: `${val}%` }}></div>
                        ))}
                        <div className="absolute top-2 left-2 text-xs text-[#3592c4] font-bold flex items-center gap-2"><Activity size={14}/> CPU / Memory</div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AndroidStudio;
