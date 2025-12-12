
import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Map, Fuel, DollarSign, Truck, ShoppingCart, Play, Home, AlertTriangle } from 'lucide-react';

const EuroTruckPixel: React.FC = () => {
  const [screen, setScreen] = useState<'menu' | 'drive' | 'shop' | 'map'>('menu');
  const [money, setMoney] = useState(500);
  const [fuel, setFuel] = useState(100);
  const [playerX, setPlayerX] = useState(50); // percentage 0-100
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentLoad, setCurrentLoad] = useState<{name: string, reward: number} | null>(null);
  const [myTruck, setMyTruck] = useState('red');
  
  // Game Loop State using Refs for performance
  const gameState = useRef({
    traffic: [] as {x: number, y: number, type: 'car'|'truck', speed: number}[],
    items: [] as {x: number, y: number, type: 'fuel'|'coin'}[],
    roadOffset: 0,
    lastTime: 0
  });
  
  const requestRef = useRef<number>(0);

  // Available Trucks in Shop
  const trucks = [
    { id: 'red', name: 'Scania Pixel', price: 0, color: 'bg-red-600' },
    { id: 'blue', name: 'Volvo Box', price: 1500, color: 'bg-blue-600' },
    { id: 'black', name: 'Merc Tank', price: 3000, color: 'bg-gray-900' },
    { id: 'gold', name: 'King Hauler', price: 5000, color: 'bg-yellow-500' },
  ];

  const jobs = [
    { name: 'Wood Logs', reward: 200, dist: 500 },
    { name: 'Electronics', reward: 500, dist: 1200 },
    { name: 'Fuel Tanker', reward: 800, dist: 2000 },
  ];

  // Game Loop
  const animate = (time: number) => {
    if (screen !== 'drive') return;
    
    if (gameState.current.lastTime === 0) gameState.current.lastTime = time;
    const delta = time - gameState.current.lastTime;
    gameState.current.lastTime = time;

    // Update Road
    if (speed > 0) {
        gameState.current.roadOffset += speed * 0.5;
        if (gameState.current.roadOffset > 20) gameState.current.roadOffset = 0;
        setDistance(prev => prev + (speed * 0.05));
        setFuel(prev => Math.max(0, prev - (speed * 0.005)));
    }

    // Spawn Traffic
    if (Math.random() < 0.02 && speed > 0) {
        gameState.current.traffic.push({
            x: Math.random() * 80 + 10,
            y: -10,
            type: Math.random() > 0.7 ? 'truck' : 'car',
            speed: Math.random() * 2 + 1
        });
    }

    // Spawn Items (Fuel/Coins)
    if (Math.random() < 0.005 && speed > 0) {
        gameState.current.items.push({
            x: Math.random() * 80 + 10,
            y: -10,
            type: Math.random() > 0.5 ? 'fuel' : 'coin'
        });
    }

    // Update Traffic Position
    gameState.current.traffic.forEach(t => {
        t.y += (speed * 0.5) - (t.speed * 0.2); // Relative speed
    });
    
    // Update Items Position
    gameState.current.items.forEach(i => {
        i.y += speed * 0.5;
    });

    // Cleanup off-screen
    gameState.current.traffic = gameState.current.traffic.filter(t => t.y < 120);
    gameState.current.items = gameState.current.items.filter(i => i.y < 120);

    // Collision Detection
    // Simple box collision approximation
    // Player is roughly at y=80, width=10%
    gameState.current.traffic.forEach(t => {
        if (t.y > 75 && t.y < 90 && Math.abs(t.x - playerX) < 10) {
            setSpeed(0); // Crash
            // Optional: Penalty
        }
    });

    gameState.current.items = gameState.current.items.filter(i => {
        if (i.y > 75 && i.y < 90 && Math.abs(i.x - playerX) < 10) {
            if (i.type === 'fuel') setFuel(prev => Math.min(100, prev + 20));
            if (i.type === 'coin') setMoney(prev => prev + 50);
            return false; // Remove item
        }
        return true;
    });

    if (fuel <= 0) {
        setSpeed(0);
        alert("Out of Fuel! Towing to service station (-$100)");
        setFuel(100);
        setMoney(m => Math.max(0, m - 100));
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (screen === 'drive') {
        requestRef.current = requestAnimationFrame(animate);
    } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [screen, speed, playerX, fuel]);

  const handleDrive = () => {
      setScreen('drive');
      setSpeed(0);
      gameState.current.traffic = [];
      gameState.current.items = [];
  };

  const buyTruck = (truck: any) => {
      if (money >= truck.price) {
          setMoney(m => m - truck.price);
          setMyTruck(truck.id);
          alert(`Bought ${truck.name}!`);
      } else {
          alert("Not enough money!");
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 rounded-3xl shadow-2xl overflow-hidden relative font-mono select-none">
      
      {/* Top Bar (HUD) */}
      <div className="bg-gray-800 p-2 flex justify-between items-center text-white z-20 border-b-4 border-gray-700">
          <div className="flex gap-4">
              <div className="flex items-center gap-1 text-green-400"><DollarSign size={16}/> {money}</div>
              <div className="flex items-center gap-1 text-yellow-400"><Fuel size={16}/> {Math.floor(fuel)}%</div>
          </div>
          <div className="flex gap-2">
              <button onClick={() => setScreen('menu')} className="p-1 hover:bg-gray-700 rounded"><Home size={20}/></button>
              <button onClick={() => setScreen('map')} className="p-1 hover:bg-gray-700 rounded"><Map size={20}/></button>
          </div>
      </div>

      {/* --- MENU SCREEN --- */}
      {screen === 'menu' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1596561148810-7063da599026?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
              <div className="bg-black/80 p-8 rounded-xl backdrop-blur-sm text-center border-4 border-white/20">
                  <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md tracking-tighter">EURO TRUCK</h1>
                  <h2 className="text-xl text-yellow-400 mb-8 tracking-widest">PIXEL EDITION</h2>
                  
                  <div className="space-y-4 w-64">
                      <button onClick={handleDrive} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                          <Play size={20}/> DRIVE
                      </button>
                      <button onClick={() => setScreen('shop')} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                          <ShoppingCart size={20}/> TRUCK DEALER
                      </button>
                      <button onClick={() => setScreen('map')} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                          <Map size={20}/> JOBS MAP
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- SHOP SCREEN --- */}
      {screen === 'shop' && (
          <div className="flex-1 bg-gray-800 p-6 overflow-y-auto">
              <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2"><ShoppingCart/> Truck Dealership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trucks.map(truck => (
                      <div key={truck.id} className="bg-gray-700 p-4 rounded-xl border-2 border-gray-600 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 ${truck.color} rounded-lg border-4 border-black/30 shadow-lg`}></div>
                              <div>
                                  <h3 className="text-white font-bold">{truck.name}</h3>
                                  <p className="text-green-400 text-sm font-mono">${truck.price}</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => buyTruck(truck)}
                            disabled={money < truck.price && myTruck !== truck.id}
                            className={`px-4 py-2 rounded font-bold ${myTruck === truck.id ? 'bg-gray-500 text-white cursor-default' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}
                          >
                              {myTruck === truck.id ? 'OWNED' : 'BUY'}
                          </button>
                      </div>
                  ))}
              </div>
              <button onClick={() => setScreen('menu')} className="mt-8 text-gray-400 hover:text-white flex items-center gap-2"><ChevronLeft/> Back</button>
          </div>
      )}

      {/* --- MAP/JOBS SCREEN --- */}
      {screen === 'map' && (
           <div className="flex-1 bg-gray-800 p-6">
               <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2"><Map/> Job Market</h2>
               <div className="space-y-4">
                   {jobs.map((job, idx) => (
                       <div key={idx} className="bg-gray-700 p-4 rounded-xl border-l-4 border-orange-500 flex justify-between items-center hover:bg-gray-600 cursor-pointer" onClick={() => { setCurrentLoad(job); setScreen('menu'); }}>
                           <div>
                               <h3 className="text-white font-bold">{job.name}</h3>
                               <p className="text-gray-400 text-xs">Distance: {job.dist} km</p>
                           </div>
                           <div className="text-right">
                               <p className="text-green-400 font-bold font-mono text-xl">${job.reward}</p>
                               {currentLoad?.name === job.name && <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">ACTIVE</span>}
                           </div>
                       </div>
                   ))}
               </div>
               <button onClick={() => setScreen('menu')} className="mt-8 text-gray-400 hover:text-white flex items-center gap-2"><ChevronLeft/> Back</button>
           </div>
      )}

      {/* --- DRIVE SCREEN --- */}
      {screen === 'drive' && (
          <div className="flex-1 relative bg-green-800 overflow-hidden flex flex-col">
              {/* World */}
              <div className="absolute inset-0 flex justify-center">
                   {/* Road */}
                   <div className="w-full md:w-1/2 bg-gray-600 h-full relative border-l-8 border-r-8 border-white/20 overflow-hidden">
                       {/* Moving Lines */}
                       <div className="absolute inset-0 flex flex-col items-center" style={{ transform: `translateY(${gameState.current.roadOffset}%)` }}>
                            {Array.from({length: 10}).map((_, i) => (
                                <div key={i} className="w-2 h-16 bg-yellow-400 my-8 opacity-70"></div>
                            ))}
                       </div>

                       {/* Traffic */}
                       {gameState.current.traffic.map((t, i) => (
                           <div 
                             key={i} 
                             className={`absolute w-12 h-20 rounded shadow-lg border-2 border-black/20 ${t.type === 'truck' ? 'bg-orange-600' : 'bg-blue-400'}`}
                             style={{ left: `${t.x}%`, top: `${t.y}%` }}
                           >
                              {/* Lights */}
                              <div className="w-full h-2 bg-red-500 mt-auto opacity-80"></div>
                           </div>
                       ))}

                       {/* Items */}
                       {gameState.current.items.map((item, i) => (
                           <div 
                             key={`item-${i}`}
                             className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg animate-pulse ${item.type === 'fuel' ? 'bg-yellow-600' : 'bg-green-600'}`}
                             style={{ left: `${item.x}%`, top: `${item.y}%` }}
                           >
                               {item.type === 'fuel' ? <Fuel size={20}/> : '$'}
                           </div>
                       ))}

                       {/* Player Truck */}
                       <div 
                         className={`absolute bottom-20 w-14 h-24 rounded-lg shadow-2xl z-10 transition-transform duration-100 ${trucks.find(t => t.id === myTruck)?.color || 'bg-red-600'}`}
                         style={{ left: `calc(${playerX}% - 28px)` }}
                       >
                           {/* Roof */}
                           <div className="w-full h-1/2 bg-black/20 rounded-t-lg"></div>
                           {/* Headlights */}
                           <div className="flex justify-between px-1 mt-1">
                               <div className="w-3 h-2 bg-yellow-200 rounded-full blur-[1px]"></div>
                               <div className="w-3 h-2 bg-yellow-200 rounded-full blur-[1px]"></div>
                           </div>
                           {/* Load Indicator */}
                           {currentLoad && (
                               <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-16 bg-stone-400 border-2 border-stone-600 rounded">
                                   <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>
                               </div>
                           )}
                       </div>
                   </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end z-30 pointer-events-none">
                  <div className="pointer-events-auto flex gap-4">
                      <button 
                        onMouseDown={() => setPlayerX(x => Math.max(10, x - 5))} 
                        className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center active:bg-white/40 border-2 border-white/30"
                      >
                          <ChevronLeft size={32} className="text-white"/>
                      </button>
                      <button 
                        onMouseDown={() => setPlayerX(x => Math.min(90, x + 5))} 
                        className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center active:bg-white/40 border-2 border-white/30"
                      >
                          <ChevronRight size={32} className="text-white"/>
                      </button>
                  </div>

                  <div className="flex flex-col items-center pointer-events-auto gap-4">
                       <div className="text-white font-mono text-xl font-bold bg-black/50 px-3 py-1 rounded">
                           {Math.floor(speed * 10)} km/h
                       </div>
                       <div className="flex gap-4">
                            <button 
                                onMouseDown={() => setSpeed(s => Math.max(0, s - 1))} 
                                className="w-16 h-16 bg-red-500/50 backdrop-blur rounded-xl flex items-center justify-center active:bg-red-500 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                <ChevronDown size={32} className="text-white"/>
                            </button>
                            <button 
                                onMouseDown={() => setSpeed(s => Math.min(15, s + 0.5))} 
                                className="w-16 h-24 bg-green-500/50 backdrop-blur rounded-xl flex items-center justify-center active:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                <ChevronUp size={32} className="text-white"/>
                            </button>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default EuroTruckPixel;
