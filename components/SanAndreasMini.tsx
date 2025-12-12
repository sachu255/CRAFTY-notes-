import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MapPin, Shield, Zap, Skull, Car, Star, DollarSign, Crosshair, Menu, Play, X } from 'lucide-react';

const SanAndreasMini: React.FC = () => {
  const [screen, setScreen] = useState<'menu' | 'game' | 'wasted' | 'busted'>('menu');
  const [stats, setStats] = useState({
    health: 100,
    armor: 0,
    money: 350,
    wanted: 0,
    weapon: 'Fist',
    mission: 1,
    missionName: 'Big Smoke',
  });
  const [cheatMenuOpen, setCheatMenuOpen] = useState(false);
  const [player, setPlayer] = useState({ x: 50, y: 50, rot: 0, inVehicle: false });
  const [message, setMessage] = useState('');
  
  // Game Loop Refs
  const gameState = useRef({
    npcs: [] as {id: number, x: number, y: number, type: 'ped'|'cop'|'balla', hp: number}[],
    cars: [] as {id: number, x: number, y: number, color: string, speed: number, dir: number}[],
    bullets: [] as {x: number, y: number, dir: number}[],
    lastTime: 0,
    missionTarget: { x: 80, y: 80 }
  });
  const reqRef = useRef<number>(0);

  // Cheats
  const activateCheat = (code: string) => {
    switch(code) {
        case 'HESOYAM':
            setStats(s => ({ ...s, health: 100, armor: 100, money: s.money + 250000 }));
            showMessage("Cheat Activated: HESOYAM");
            break;
        case 'AEZAKMI':
            setStats(s => ({ ...s, wanted: 0 }));
            showMessage("Cheat Activated: AEZAKMI");
            break;
        case 'FULLCLIP':
            setStats(s => ({ ...s, weapon: 'M4' }));
            showMessage("Cheat Activated: FULLCLIP");
            break;
        case 'ROCKETMAN':
            showMessage("Jetpack not available in Mini :(");
            break;
    }
    setCheatMenuOpen(false);
  };

  const showMessage = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000);
  };

  const spawnNPCs = () => {
      if (gameState.current.npcs.length < 10) {
          gameState.current.npcs.push({
              id: Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              type: Math.random() > 0.8 ? 'cop' : (Math.random() > 0.8 ? 'balla' : 'ped'),
              hp: 100
          });
      }
      if (gameState.current.cars.length < 5) {
          const colors = ['bg-blue-500', 'bg-red-500', 'bg-black', 'bg-white', 'bg-yellow-500'];
          gameState.current.cars.push({
              id: Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: 0.5 + Math.random(),
              dir: Math.random() * 360
          });
      }
  };

  const gameLoop = (time: number) => {
      if (screen !== 'game') return;
      
      // Update Bullets
      gameState.current.bullets = gameState.current.bullets.map(b => ({
          x: b.x + Math.cos(b.dir * Math.PI / 180) * 2,
          y: b.y + Math.sin(b.dir * Math.PI / 180) * 2,
          dir: b.dir
      })).filter(b => b.x > 0 && b.x < 100 && b.y > 0 && b.y < 100);

      // Update Cars
      gameState.current.cars.forEach(c => {
          c.x += Math.cos(c.dir * Math.PI / 180) * (c.speed * 0.2);
          c.y += Math.sin(c.dir * Math.PI / 180) * (c.speed * 0.2);
          if (c.x < 0) c.x = 100; if (c.x > 100) c.x = 0;
          if (c.y < 0) c.y = 100; if (c.y > 100) c.y = 0;
      });

      // Update NPCs
      gameState.current.npcs.forEach(n => {
          n.x += (Math.random() - 0.5) * 0.2;
          n.y += (Math.random() - 0.5) * 0.2;
      });

      spawnNPCs();

      // Police Logic
      if (stats.wanted > 0) {
          if (Math.random() < 0.01 * stats.wanted) {
              // Cop spawn near player
              gameState.current.npcs.push({
                  id: Math.random(),
                  x: player.x + (Math.random() * 20 - 10),
                  y: player.y + (Math.random() * 20 - 10),
                  type: 'cop',
                  hp: 100
              });
          }
      }

      // Mission Logic (Simple Distance Check)
      const distToTarget = Math.sqrt(Math.pow(player.x - gameState.current.missionTarget.x, 2) + Math.pow(player.y - gameState.current.missionTarget.y, 2));
      if (distToTarget < 5) {
          completeMission();
      }

      reqRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
      if (screen === 'game') {
          reqRef.current = requestAnimationFrame(gameLoop);
      }
      return () => cancelAnimationFrame(reqRef.current);
  }, [screen, stats.wanted]); // dependencies for effect re-run

  const completeMission = () => {
      setStats(s => ({
          ...s,
          money: s.money + (s.mission * 100),
          mission: s.mission + 1,
          wanted: s.mission % 3 === 0 ? s.wanted + 1 : s.wanted // Increase wanted level every 3 missions
      }));
      showMessage("Mission Passed! Respect +");
      gameState.current.missionTarget = { x: Math.random() * 90 + 5, y: Math.random() * 90 + 5 };
  };

  const handleAction = (type: 'punch' | 'enter') => {
      if (type === 'punch') {
          // Check collision with NPCs
          gameState.current.npcs = gameState.current.npcs.filter(n => {
              const dist = Math.sqrt(Math.pow(player.x - n.x, 2) + Math.pow(player.y - n.y, 2));
              if (dist < 5) {
                  // Hit NPC
                  if (n.type === 'cop') setStats(s => ({ ...s, wanted: Math.min(6, s.wanted + 1) }));
                  if (n.type === 'ped') setStats(s => ({ ...s, money: s.money + 10 })); // Drop money
                  return false; // Kill
              }
              return true;
          });
          // Fire bullet if armed
          if (stats.weapon !== 'Fist') {
              gameState.current.bullets.push({ x: player.x, y: player.y, dir: player.rot });
          }
      } else {
          // Enter/Exit Car
          if (player.inVehicle) {
              setPlayer(p => ({ ...p, inVehicle: false }));
          } else {
              // Find nearest car
              const car = gameState.current.cars.find(c => {
                  return Math.sqrt(Math.pow(player.x - c.x, 2) + Math.pow(player.y - c.y, 2)) < 5;
              });
              if (car) {
                  setPlayer(p => ({ ...p, inVehicle: true }));
                  showMessage("Vehicle Stolen!");
                  setStats(s => ({ ...s, wanted: Math.min(6, s.wanted + 1) }));
              }
          }
      }
  };

  const movePlayer = (dx: number, dy: number) => {
      const speed = player.inVehicle ? 1.5 : 0.5;
      const newX = player.x + dx * speed;
      const newY = player.y + dy * speed;
      
      // Calculate rotation
      const rot = Math.atan2(dy, dx) * 180 / Math.PI;

      setPlayer(p => ({
          ...p,
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
          rot: (dx !== 0 || dy !== 0) ? rot : p.rot
      }));
  };

  const handleDeath = (type: 'wasted' | 'busted') => {
      setScreen(type);
      setTimeout(() => {
          setStats(s => ({ ...s, health: 100, wanted: 0, weapon: 'Fist', money: Math.max(0, s.money - 100) }));
          setPlayer({ x: 50, y: 50, rot: 0, inVehicle: false });
          setScreen('game');
      }, 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-black rounded-3xl overflow-hidden relative font-sans select-none border-4 border-gray-900 shadow-2xl">
        
        {/* --- MENU --- */}
        {screen === 'menu' && (
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Los_Angeles_City_Hall_2013.jpg/1200px-Los_Angeles_City_Hall_2013.jpg')] bg-cover bg-center flex flex-col items-center justify-center z-50">
                <div className="bg-black/70 p-8 rounded-xl text-center backdrop-blur-md border border-white/20">
                    <h1 className="text-5xl font-black text-white mb-2 font-serif tracking-tighter drop-shadow-lg" style={{ fontFamily: 'Old English Text MT, serif' }}>San Andreas</h1>
                    <h2 className="text-xl text-yellow-400 mb-8 font-bold tracking-widest uppercase">Mini Stories</h2>
                    <button onClick={() => setScreen('game')} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">Start Game</button>
                    <p className="text-white/50 mt-4 text-xs">103 Missions • Open World • Cheats</p>
                </div>
            </div>
        )}

        {/* --- HUD --- */}
        {screen === 'game' && (
            <div className="absolute top-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
                <div className="flex flex-col gap-1 items-end w-32">
                    <div className="text-green-400 font-mono text-2xl font-bold drop-shadow-md flex items-center gap-1">
                         <DollarSign size={16}/> {stats.money}
                    </div>
                    <div className="flex gap-1">
                        {Array.from({length: 6}).map((_, i) => (
                            <Star key={i} size={16} className={`${i < stats.wanted ? 'text-white fill-white animate-pulse' : 'text-white/20'}`} />
                        ))}
                    </div>
                    <div className="w-full h-3 bg-gray-800 border-2 border-gray-600 rounded-sm overflow-hidden">
                        <div className="h-full bg-red-600" style={{ width: `${stats.health}%` }}></div>
                    </div>
                    {stats.armor > 0 && (
                        <div className="w-full h-3 bg-gray-800 border-2 border-gray-600 rounded-sm overflow-hidden mt-1">
                            <div className="h-full bg-white" style={{ width: `${stats.armor}%` }}></div>
                        </div>
                    )}
                </div>
                
                <div className="bg-black/50 backdrop-blur p-2 rounded text-white text-xs">
                    <p className="text-yellow-400 font-bold uppercase mb-1">{stats.missionName}</p>
                    <p>{stats.mission} of 103</p>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="text-white font-bold text-xl uppercase font-mono">{stats.weapon}</div>
                    <div className="text-gray-400 text-xs">Current Weapon</div>
                </div>
            </div>
        )}

        {/* --- GAME WORLD --- */}
        {screen === 'game' && (
            <div className="flex-1 bg-[#2a2a2a] relative overflow-hidden">
                {/* Ground/Grass */}
                <div className="absolute inset-0 bg-[#3a5a40] opacity-20" style={{ backgroundImage: 'radial-gradient(#4a7a50 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Mission Target */}
                <div 
                    className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-400 animate-bounce z-10"
                    style={{ left: `calc(${gameState.current.missionTarget.x}% - 10px)`, top: `calc(${gameState.current.missionTarget.y}% - 30px)` }}
                ></div>
                <div 
                    className="absolute w-12 h-12 bg-yellow-400/30 rounded-full animate-ping"
                    style={{ left: `calc(${gameState.current.missionTarget.x}% - 24px)`, top: `calc(${gameState.current.missionTarget.y}% - 24px)` }}
                ></div>

                {/* NPCs */}
                {gameState.current.npcs.map(npc => (
                    <div 
                        key={npc.id}
                        className={`absolute w-3 h-3 rounded-full shadow-sm ${npc.type === 'cop' ? 'bg-blue-600' : npc.type === 'balla' ? 'bg-purple-600' : 'bg-gray-400'}`}
                        style={{ left: `${npc.x}%`, top: `${npc.y}%` }}
                    ></div>
                ))}

                {/* Cars */}
                {gameState.current.cars.map(car => (
                    <div 
                        key={car.id}
                        className={`absolute w-6 h-4 rounded-sm shadow-md ${car.color}`}
                        style={{ 
                            left: `${car.x}%`, top: `${car.y}%`, 
                            transform: `rotate(${car.dir}deg)` 
                        }}
                    ></div>
                ))}
                
                {/* Bullets */}
                {gameState.current.bullets.map((b, i) => (
                    <div key={i} className="absolute w-1 h-1 bg-yellow-300 rounded-full" style={{ left: `${b.x}%`, top: `${b.y}%` }}></div>
                ))}

                {/* Player */}
                <div 
                    className={`absolute w-4 h-4 z-10 transition-transform duration-100 ${player.inVehicle ? 'bg-blue-600 w-6 h-4 rounded-sm' : 'bg-white rounded-full border-2 border-black'}`}
                    style={{ left: `${player.x}%`, top: `${player.y}%`, transform: `rotate(${player.rot}deg)` }}
                >
                    {/* Direction Indicator */}
                    {!player.inVehicle && <div className="absolute top-1/2 right-0 w-3 h-1 bg-black -translate-y-1/2"></div>}
                </div>

                {/* Message Overlay */}
                {message && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-black/80 text-orange-400 font-bold px-6 py-2 rounded-full border-2 border-orange-600 animate-bounce z-30 whitespace-nowrap">
                        {message}
                    </div>
                )}
            </div>
        )}

        {/* --- WASTED / BUSTED --- */}
        {(screen === 'wasted' || screen === 'busted') && (
            <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center animate-in fade-in duration-500">
                <h1 className={`text-6xl font-black uppercase tracking-tighter drop-shadow-xl ${screen === 'wasted' ? 'text-gray-400' : 'text-blue-500'}`}>
                    {screen}
                </h1>
            </div>
        )}

        {/* --- CONTROLS --- */}
        {screen === 'game' && (
            <div className="absolute bottom-0 w-full h-48 pointer-events-none p-4 flex justify-between items-end z-30">
                {/* D-Pad */}
                <div className="pointer-events-auto relative w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                    <button className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-t-lg active:bg-white/60" onMouseDown={() => movePlayer(0, -1)}><ChevronUp className="mx-auto text-white"/></button>
                    <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-b-lg active:bg-white/60" onMouseDown={() => movePlayer(0, 1)}><ChevronDown className="mx-auto text-white"/></button>
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-l-lg active:bg-white/60" onMouseDown={() => movePlayer(-1, 0)}><ChevronLeft className="mx-auto text-white"/></button>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-r-lg active:bg-white/60" onMouseDown={() => movePlayer(1, 0)}><ChevronRight className="mx-auto text-white"/></button>
                </div>

                {/* Actions */}
                <div className="pointer-events-auto flex gap-4 items-end">
                    <button onClick={() => setCheatMenuOpen(true)} className="w-12 h-12 rounded-full bg-purple-600/80 text-white flex items-center justify-center border-2 border-white/20 font-bold text-xs">CHEAT</button>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleAction('enter')} className="w-16 h-16 rounded-full bg-blue-500/80 text-white flex items-center justify-center border-4 border-white/20 active:scale-90 transition-transform">
                            <Car size={24}/>
                        </button>
                        <button onClick={() => handleAction('punch')} className="w-16 h-16 rounded-full bg-red-500/80 text-white flex items-center justify-center border-4 border-white/20 active:scale-90 transition-transform">
                            {stats.weapon === 'Fist' ? <Zap size={24}/> : <Crosshair size={24}/>}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- CHEAT MENU --- */}
        {cheatMenuOpen && (
            <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center p-8 animate-in zoom-in-95">
                <div className="w-full max-w-md bg-gray-900 border-2 border-gray-700 rounded-2xl overflow-hidden">
                    <div className="bg-gray-800 p-4 flex justify-between items-center">
                        <h2 className="text-white font-bold uppercase tracking-wider">Cheat Codes</h2>
                        <button onClick={() => setCheatMenuOpen(false)} className="text-gray-400 hover:text-white"><X/></button>
                    </div>
                    <div className="p-4 space-y-2">
                        {[
                            { code: 'HESOYAM', desc: 'Health, Armor, $250k' },
                            { code: 'AEZAKMI', desc: 'Never Wanted' },
                            { code: 'FULLCLIP', desc: 'Infinite Ammo / M4' },
                            { code: 'ROCKETMAN', desc: 'Spawn Jetpack' },
                        ].map(cheat => (
                            <button 
                                key={cheat.code}
                                onClick={() => activateCheat(cheat.code)}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-left px-4 py-3 rounded-lg border border-gray-700 flex justify-between items-center group"
                            >
                                <span className="font-mono text-yellow-500 font-bold group-hover:tracking-widest transition-all">{cheat.code}</span>
                                <span className="text-gray-400 text-xs">{cheat.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default SanAndreasMini;
