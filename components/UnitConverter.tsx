
import React, { useState } from 'react';
import { ArrowRightLeft, Ruler, Scale, Thermometer, Database, Zap, Clock, Gauge } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const categories: any = {
      length: { icon: Ruler, units: { m: 1, cm: 100, mm: 1000, km: 0.001, in: 39.3701, ft: 3.28084, yd: 1.09361, mi: 0.000621371 } },
      mass: { icon: Scale, units: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 } },
      time: { icon: Clock, units: { s: 1, min: 1/60, h: 1/3600, d: 1/86400 } },
      data: { icon: Database, units: { B: 1, KB: 1/1024, MB: 1/1048576, GB: 1/1073741824, TB: 1/1099511627776 } },
      speed: { icon: Gauge, units: { 'm/s': 1, 'km/h': 3.6, 'mph': 2.23694, 'knot': 1.94384 } },
      temp: { icon: Thermometer, units: { C: 1, F: 33.8, K: 274.15 }, special: true } 
  };

  const calculate = () => {
      // Special logic for Temp since it's not linear multiplication from 0
      if (category === 'temp') {
          let valInC = value;
          if (fromUnit === 'F') valInC = (value - 32) * 5/9;
          if (fromUnit === 'K') valInC = value - 273.15;
          
          if (toUnit === 'C') return valInC;
          if (toUnit === 'F') return (valInC * 9/5) + 32;
          if (toUnit === 'K') return valInC + 273.15;
          return valInC;
      }
      
      const rateFrom = categories[category].units[fromUnit];
      const rateTo = categories[category].units[toUnit];
      return (value / rateFrom) * rateTo;
  };

  const result = calculate();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-2 overflow-x-auto bg-gray-50">
            {Object.keys(categories).map(cat => {
                const Icon = categories[cat].icon;
                return (
                    <button 
                        key={cat}
                        onClick={() => { setCategory(cat); setFromUnit(Object.keys(categories[cat].units)[0]); setToUnit(Object.keys(categories[cat].units)[1]); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors whitespace-nowrap ${category === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Icon size={16}/> {cat}
                    </button>
                )
            })}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="w-full max-w-sm space-y-4">
                <input 
                    type="number" 
                    value={value} 
                    onChange={e => setValue(parseFloat(e.target.value))}
                    className="w-full text-5xl font-black text-center outline-none bg-transparent"
                />
                <select 
                    value={fromUnit} 
                    onChange={e => setFromUnit(e.target.value)}
                    className="w-full p-2 bg-gray-100 rounded-xl text-center font-bold text-gray-700 outline-none"
                >
                    {Object.keys(categories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                <ArrowRightLeft className="rotate-90"/>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <div className="text-5xl font-black text-blue-600 break-all">{isNaN(result) ? '-' : parseFloat(result.toFixed(4))}</div>
                <select 
                    value={toUnit} 
                    onChange={e => setToUnit(e.target.value)}
                    className="w-full p-2 bg-gray-100 rounded-xl text-center font-bold text-gray-700 outline-none"
                >
                    {Object.keys(categories[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
        </div>
    </div>
  );
};

export default UnitConverter;
