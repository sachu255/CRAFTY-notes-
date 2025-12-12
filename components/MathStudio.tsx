
import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Sigma, Activity, BookOpen, Trash2, FunctionSquare, X, Grid, Move, Box, Thermometer, Ruler, PieChart, Triangle, Divide, TrendingUp, Key } from 'lucide-react';

const MathStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'calc' | 'quad' | 'matrix' | 'stats' | 'vector' | 'geometry' | 'units' | 'trig' | 'calculus' | 'number' | 'algebra' | 'password'>('calc');
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tool Specific States
  const [quadABC, setQuadABC] = useState({ a: 1, b: 0, c: 0 });
  const [quadRoots, setQuadRoots] = useState<string | null>(null);

  const [matrixA, setMatrixA] = useState([1, 0, 0, 1]); 
  const [matrixDet, setMatrixDet] = useState<number | null>(null);

  const [statsInput, setStatsInput] = useState('');
  const [statsResult, setStatsResult] = useState<{mean: number, median: number, range: number} | null>(null);

  const [vectorA, setVectorA] = useState({x:0, y:0, z:0});
  const [vectorB, setVectorB] = useState({x:0, y:0, z:0});
  const [vectorDot, setVectorDot] = useState<number | null>(null);

  const [geoRadius, setGeoRadius] = useState(0);
  const [geoHeight, setGeoHeight] = useState(0);
  const [geoResult, setGeoResult] = useState<{sphereVol: string, cylinderVol: string} | null>(null);
  
  const [unitVal, setUnitVal] = useState(0);
  const [unitType, setUnitType] = useState<'CtoF' | 'KgToLbs' | 'MtoFt'>('CtoF');
  const [unitResult, setUnitResult] = useState<string>('');

  const [numberVal, setNumberVal] = useState(0);
  const [numberVal2, setNumberVal2] = useState(0); // For GCD/LCM
  const [numberResult, setNumberResult] = useState<string>('');
  
  const [slopePoints, setSlopePoints] = useState({x1:0, y1:0, x2:0, y2:0});
  const [algebraResult, setAlgebraResult] = useState<string>('');

  const [passLength, setPassLength] = useState(12);
  const [generatedPass, setGeneratedPass] = useState('');

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2);
    ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for(let x=0; x<canvas.width; x++) {
        const y = Math.sin((x - canvas.width/2) * 0.05) * 50 + canvas.height/2;
        if(x===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  useEffect(() => {
    if (activeTool === 'calc') drawGraph();
  }, [activeTool]);

  const calcQuad = () => {
      const { a, b, c } = quadABC;
      const d = b*b - 4*a*c;
      if (d < 0) setQuadRoots("Complex Roots");
      else {
          const r1 = (-b + Math.sqrt(d)) / (2*a);
          const r2 = (-b - Math.sqrt(d)) / (2*a);
          setQuadRoots(`x1 = ${r1.toFixed(2)}, x2 = ${r2.toFixed(2)}`);
      }
  };

  const calcMatrix = () => {
      const det = matrixA[0]*matrixA[3] - matrixA[1]*matrixA[2];
      setMatrixDet(det);
  };

  const calcStats = () => {
      const nums = statsInput.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
      if (nums.length === 0) return;
      const sum = nums.reduce((a,b)=>a+b, 0);
      const mean = sum / nums.length;
      const mid = Math.floor(nums.length/2);
      const median = nums.length % 2 !== 0 ? nums[mid] : (nums[mid-1] + nums[mid])/2;
      setStatsResult({ mean, median, range: nums[nums.length-1] - nums[0] });
  };

  const calcVector = () => {
      setVectorDot(vectorA.x*vectorB.x + vectorA.y*vectorB.y + vectorA.z*vectorB.z);
  };

  const calcGeo = () => {
      const r = parseFloat(geoRadius.toString());
      const h = parseFloat(geoHeight.toString());
      const sphere = (4/3) * Math.PI * Math.pow(r, 3);
      const cyl = Math.PI * r * r * h;
      setGeoResult({ sphereVol: sphere.toFixed(2), cylinderVol: cyl.toFixed(2) });
  };

  const calcUnit = () => {
      const v = parseFloat(unitVal.toString());
      if (unitType === 'CtoF') setUnitResult(`${(v * 9/5 + 32).toFixed(2)} °F`);
      if (unitType === 'KgToLbs') setUnitResult(`${(v * 2.20462).toFixed(2)} lbs`);
      if (unitType === 'MtoFt') setUnitResult(`${(v * 3.28084).toFixed(2)} ft`);
  };

  const calcNumber = () => {
      const n = Math.abs(parseInt(numberVal.toString()));
      let isPrime = true;
      if (n <= 1) isPrime = false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) isPrime = false;
      }
      let fact = 1;
      if (n <= 20) {
        for(let i = 1; i <= n; i++) fact *= i;
      }
      setNumberResult(`Prime: ${isPrime ? 'Yes' : 'No'} | Factorial: ${n > 20 ? 'Too Large' : fact}`);
  };

  const calcGcdLcm = () => {
      const a = Math.abs(parseInt(numberVal.toString()));
      const b = Math.abs(parseInt(numberVal2.toString()));
      if(!a || !b) return;
      const gcd = (x:number, y:number): number => !y ? x : gcd(y, x % y);
      const g = gcd(a,b);
      const l = (a*b)/g;
      setNumberResult(`GCD: ${g} | LCM: ${l}`);
  }

  const calcAlgebra = () => {
      const {x1, y1, x2, y2} = slopePoints;
      const slope = (y2-y1) / (x2-x1);
      const midX = (x1+x2)/2;
      const midY = (y1+y2)/2;
      setAlgebraResult(`Slope (m): ${slope.toFixed(2)} | Midpoint: (${midX}, ${midY})`);
  };

  const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let pass = "";
      for (let i = 0; i < passLength; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedPass(pass);
  };

  const input = (val: string) => setDisplay(prev => prev + val);
  const clear = () => setDisplay('');
  const calculate = () => {
      try {
          // eslint-disable-next-line no-eval
          const res = eval(display.replace('sin', 'Math.sin').replace('cos', 'Math.cos').replace('tan', 'Math.tan').replace('sqrt', 'Math.sqrt').replace('pi', 'Math.PI'));
          const resultStr = `${display} = ${res}`;
          setHistory(prev => [resultStr, ...prev]);
          setDisplay(String(res));
      } catch (e) {
          setDisplay('Error');
      }
  };

  const tools = [
      { id: 'calc', label: 'Scientific', icon: Calculator },
      { id: 'quad', label: 'Quadratic', icon: FunctionSquare },
      { id: 'matrix', label: 'Matrix', icon: Grid },
      { id: 'stats', label: 'Statistics', icon: PieChart },
      { id: 'vector', label: 'Vector', icon: Move },
      { id: 'geometry', label: 'Geometry', icon: Box },
      { id: 'number', label: 'Number Theory', icon: Divide },
      { id: 'algebra', label: 'Algebra', icon: TrendingUp },
      { id: 'units', label: 'Converter', icon: Ruler },
      { id: 'trig', label: 'Trigonometry', icon: Triangle },
      { id: 'calculus', label: 'Calculus', icon: Sigma },
      { id: 'password', label: 'Password Gen', icon: Key },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-700">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <Sigma size={24}/>
                </div>
                <div>
                    <h2 className="font-bold text-lg">Math Studio</h2>
                    <p className="text-xs opacity-70">Advanced Mathematics Suite</p>
                </div>
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-indigo-600 border border-indigo-200 uppercase">
                {tools.find(t => t.id === activeTool)?.label}
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            <div className="w-20 md:w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-2 gap-1 overflow-y-auto">
                {tools.map(tool => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as any)}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl transition-all
                            ${activeTool === tool.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}
                        `}
                    >
                        <tool.icon size={20} />
                        <span className="hidden md:inline font-medium text-sm">{tool.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-6">
                {activeTool === 'calc' && (
                     <div className="flex flex-col md:flex-row h-full gap-6">
                        <div className="flex-1 flex flex-col">
                            <div className="bg-gray-50 p-4 rounded-2xl shadow-inner border border-gray-200 mb-4 h-24 text-right flex flex-col justify-end">
                                <span className="text-gray-400 text-xs">{history[0]}</span>
                                <input value={display} readOnly className="bg-transparent text-3xl font-bold text-right outline-none text-gray-800" placeholder="0"/>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {['sin', 'cos', 'tan', '(', ')', '7', '8', '9', 'DEL', 'AC', '4', '5', '6', '*', '/', '1', '2', '3', '+', '-', '0', '.', 'pi', 'sqrt', '='].map(k => (
                                    <button 
                                        key={k} 
                                        onClick={() => { if(k==='AC') clear(); else if(k==='DEL') setDisplay(d=>d.slice(0,-1)); else if(k==='=') calculate(); else input(k); }}
                                        className={`p-3 rounded-lg font-bold ${k==='=' ? 'bg-indigo-600 text-white col-span-1' : k==='AC' || k==='DEL' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {k}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="bg-white border border-gray-200 rounded-xl p-2 h-64 mb-4">
                                <canvas ref={canvasRef} className="w-full h-full" width={400} height={250}></canvas>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold text-sm mb-2 text-gray-500">History</h3>
                                {history.map((h, i) => <div key={i} className="text-right text-xs font-mono text-gray-600 border-b border-gray-200 py-1">{h}</div>)}
                            </div>
                        </div>
                     </div>
                )}

                {activeTool === 'password' && (
                    <div className="max-w-md mx-auto space-y-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Secure Password Generator</h2>
                        <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                            <p className="font-mono text-2xl font-bold break-all">{generatedPass || 'Tap Generate'}</p>
                        </div>
                        <div className="flex items-center gap-4 justify-center">
                            <label className="font-bold text-gray-500">Length: {passLength}</label>
                            <input type="range" min="8" max="32" value={passLength} onChange={(e) => setPassLength(+e.target.value)} className="w-32"/>
                        </div>
                        <button onClick={generatePassword} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                            Generate
                        </button>
                    </div>
                )}

                {/* Other tools */}
                {activeTool === 'quad' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Quadratic Solver</h2>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 font-mono text-center text-lg text-indigo-800">
                            ax² + bx + c = 0
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">a</label><input type="number" value={quadABC.a} onChange={e=>setQuadABC({...quadABC, a: +e.target.value})} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">b</label><input type="number" value={quadABC.b} onChange={e=>setQuadABC({...quadABC, b: +e.target.value})} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">c</label><input type="number" value={quadABC.c} onChange={e=>setQuadABC({...quadABC, c: +e.target.value})} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                        <button onClick={calcQuad} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Solve</button>
                        {quadRoots && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center"><h3 className="font-bold text-green-700">Roots Found</h3><p className="font-mono text-lg">{quadRoots}</p></div>}
                    </div>
                )}
                
                {activeTool === 'number' && (
                     <div className="max-w-md mx-auto space-y-4 mt-4">
                        <h2 className="text-xl font-bold">Number Analysis</h2>
                        <input type="number" placeholder="Enter number..." value={numberVal} onChange={e=>setNumberVal(+e.target.value)} className="w-full p-2 border rounded-xl"/>
                        <button onClick={calcNumber} className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">Analyze (Prime/Factorial)</button>
                        
                        <div className="border-t pt-4 mt-4">
                            <h2 className="text-xl font-bold mb-2">GCD & LCM</h2>
                            <div className="flex gap-2 mb-2">
                                <input type="number" placeholder="A" value={numberVal} onChange={e=>setNumberVal(+e.target.value)} className="w-full p-2 border rounded-xl"/>
                                <input type="number" placeholder="B" value={numberVal2} onChange={e=>setNumberVal2(+e.target.value)} className="w-full p-2 border rounded-xl"/>
                            </div>
                            <button onClick={calcGcdLcm} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Calculate</button>
                        </div>
                        
                        <p className="font-bold p-4 bg-gray-50 rounded-xl text-center">{numberResult}</p>
                     </div>
                )}

                {activeTool === 'units' && (
                     <div className="max-w-md mx-auto space-y-4 mt-4">
                        <div className="flex gap-4"><input type="number" value={unitVal} onChange={e=>setUnitVal(+e.target.value)} className="flex-1 p-2 border rounded-xl"/><select value={unitType} onChange={(e) => setUnitType(e.target.value as any)} className="p-2 border rounded-xl bg-white"><option value="CtoF">°C to °F</option><option value="KgToLbs">Kg to Lbs</option><option value="MtoFt">M to Ft</option></select></div>
                        <button onClick={calcUnit} className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">Convert</button>
                        <p className="font-bold text-center text-xl">{unitResult}</p>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MathStudio;
