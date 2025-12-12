
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Zap, Trash2, CheckCircle, Activity, Search, RefreshCw, Lock, Battery, Thermometer, FileX, Wind, History } from 'lucide-react';

const FlashClear: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'deep' | 'battery' | 'cpu' | 'history'>('scan');
  const [status, setStatus] = useState<'safe' | 'at_risk' | 'scanning' | 'cleaning'>('safe');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [junkSize, setJunkSize] = useState(0);
  const [threats, setThreats] = useState(0);
  const [scanHistory, setScanHistory] = useState<{date: string, type: string, result: string}[]>([]);
  
  // New States
  const [cpuTemp, setCpuTemp] = useState(45);
  const [batteryHealth, setBatteryHealth] = useState(85);

  const startScan = (type: 'scan' | 'deep' | 'battery' | 'cpu') => {
    setStatus('scanning');
    setProgress(0);
    setJunkSize(0);
    setThreats(0);

    let dummyFiles: string[] = [];
    if (type === 'scan') {
        dummyFiles = ['/sys/cache/tmp.log', '/user/data/cookies.dat', '/browser/history/cache'];
    } else if (type === 'deep') {
        dummyFiles = ['/root/old_kernel.sys', '/var/log/syslog.1', '/usr/bin/unused_lib.so', 'shredding_deleted_files...'];
    } else if (type === 'battery') {
        dummyFiles = ['analyzing_background_apps...', 'optimizing_brightness...', 'killing_bloatware...'];
    } else {
        dummyFiles = ['checking_thermal_paste...', 'adjusting_fan_speed...', 'throttling_background_process...'];
    }

    let p = 0;
    const interval = setInterval(() => {
      p += type === 'deep' ? 1 : 2;
      setProgress(p);
      setCurrentFile(dummyFiles[Math.floor(Math.random() * dummyFiles.length)]);
      
      if (Math.random() > 0.8) setJunkSize(prev => prev + Math.floor(Math.random() * 50));
      if (type === 'scan' && Math.random() > 0.96 && threats < 3) setThreats(prev => prev + 1);
      if (type === 'cpu') setCpuTemp(t => Math.min(90, t + 1));

      if (p >= 100) {
        clearInterval(interval);
        setStatus('at_risk');
      }
    }, 50);
  };

  const cleanSystem = () => {
    setStatus('cleaning');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (activeTab === 'cpu') setCpuTemp(t => Math.max(35, t - 2));
      if (p >= 100) {
        clearInterval(interval);
        setStatus('safe');
        // Add to history
        setScanHistory(prev => [{
            date: new Date().toLocaleString(),
            type: activeTab as string,
            result: activeTab === 'cpu' ? 'Cooled Down' : `Cleaned ${junkSize}MB`
        }, ...prev]);
        setJunkSize(0);
        setThreats(0);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-slide-in">
      
      {/* Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-sm flex overflow-x-auto gap-2">
          {[
              { id: 'scan', label: 'Quick Scan', icon: ShieldCheck },
              { id: 'deep', label: 'Deep Clean', icon: FileX },
              { id: 'battery', label: 'Battery Saver', icon: Battery },
              { id: 'cpu', label: 'CPU Cooler', icon: Thermometer },
              { id: 'history', label: 'History', icon: History },
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); if(tab.id !== 'history') setStatus('safe'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                    ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
                `}
              >
                  <tab.icon size={18}/> {tab.label}
              </button>
          ))}
      </div>

      {activeTab === 'history' ? (
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><History/> Scan History</h2>
              {scanHistory.length === 0 ? <p className="text-gray-400">No logs yet.</p> : (
                  <div className="space-y-3">
                      {scanHistory.map((log, i) => (
                          <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                  <p className="font-bold text-gray-700 capitalize">{log.type}</p>
                                  <p className="text-xs text-gray-400">{log.date}</p>
                              </div>
                              <span className="text-green-600 font-bold text-sm">{log.result}</span>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      ) : (
        <>
            {/* Main Status Card */}
            <div className={`
                relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl border transition-all duration-500 flex flex-col items-center justify-center text-center flex-1 min-h-[300px]
                ${status === 'safe' ? 'bg-gradient-to-b from-green-500 to-green-600 border-green-400' : ''}
                ${status === 'at_risk' ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-400' : ''}
                ${status === 'scanning' ? 'bg-gradient-to-b from-blue-500 to-blue-600 border-blue-400' : ''}
                ${status === 'cleaning' ? 'bg-gradient-to-b from-purple-500 to-purple-600 border-purple-400' : ''}
            `}>
                
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Animation Icon */}
                <div className="relative z-10 text-white">
                    <div className={`
                    w-40 h-40 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-2xl border-4 border-white/30
                    ${status === 'scanning' || status === 'cleaning' ? 'animate-pulse' : ''}
                    `}>
                        {status === 'safe' && <CheckCircle size={80} className="drop-shadow-md"/>}
                        {status === 'at_risk' && <Zap size={80} className="drop-shadow-md animate-bounce"/>}
                        {(status === 'scanning' || status === 'cleaning') && (
                        <div className="relative flex items-center justify-center">
                            {activeTab === 'cpu' ? <Wind size={80} className={`animate-spin ${status === 'cleaning' ? 'duration-75' : 'duration-1000'}`}/> :
                            activeTab === 'deep' ? <FileX size={80} className="animate-pulse"/> :
                            <Activity size={80} className="animate-pulse"/>}
                        </div>
                        )}
                    </div>

                    <h2 className="text-4xl font-black tracking-tight mb-2 uppercase drop-shadow-sm">
                    {status === 'safe' && (activeTab === 'cpu' ? "Optimal Temp" : "Optimized")}
                    {status === 'at_risk' && (activeTab === 'cpu' ? "Overheating!" : "Issues Found")}
                    {status === 'scanning' && "Analyzing..."}
                    {status === 'cleaning' && "Fixing..."}
                    </h2>
                    
                    <p className="text-white/80 font-medium text-lg max-w-md mx-auto h-6">
                    {status === 'safe' && "System is running at peak performance."}
                    {status === 'at_risk' && activeTab === 'cpu' && `CPU Temp: ${cpuTemp}°C`}
                    {status === 'at_risk' && activeTab !== 'cpu' && `${junkSize}MB needed to clear.`}
                    {(status === 'scanning' || status === 'cleaning') && currentFile}
                    </p>

                    {(status === 'scanning' || status === 'cleaning') && (
                    <div className="mt-8 w-full max-w-sm mx-auto bg-black/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/10">
                        <div className="h-full bg-white shadow-glow transition-all duration-75 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    )}
                    
                    <div className="mt-10">
                    {status === 'safe' && (
                        <button 
                        onClick={() => startScan(activeTab as any)}
                        className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all"
                        >
                        Start {activeTab === 'cpu' ? 'Cooling' : 'Scan'}
                        </button>
                    )}
                    {status === 'at_risk' && (
                        <button 
                        onClick={cleanSystem}
                        className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 hover:bg-red-50 transition-all animate-pulse"
                        >
                        <Zap size={18} className="inline mr-2 fill-current"/>
                        {activeTab === 'cpu' ? 'Cool Down' : 'Clean Now'}
                        </button>
                    )}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="text-orange-500 font-black text-2xl">{junkSize}MB</div>
                    <div className="text-gray-400 text-xs font-bold uppercase">Junk</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className={`font-black text-2xl ${cpuTemp > 70 ? 'text-red-500' : 'text-blue-500'}`}>{cpuTemp}°C</div>
                    <div className="text-gray-400 text-xs font-bold uppercase">CPU Temp</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="text-green-500 font-black text-2xl">{batteryHealth}%</div>
                    <div className="text-gray-400 text-xs font-bold uppercase">Battery</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="text-purple-500 font-black text-2xl">4GB</div>
                    <div className="text-gray-400 text-xs font-bold uppercase">RAM Free</div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default FlashClear;
