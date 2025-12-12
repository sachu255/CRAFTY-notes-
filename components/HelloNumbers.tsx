
import React, { useState } from 'react';
import { History, ChevronUp, ChevronDown } from 'lucide-react';

const HelloNumbers: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scientificMode, setScientificMode] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(display.charAt(0) === '-' ? display.substr(1) : '-' + display);
  };

  const percent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(String(inputValue));
    } else if (operator) {
      const currentValue = prevValue ? parseFloat(prevValue) : 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(String(newValue));
      setDisplay(String(newValue));
      setHistory(h => [`${currentValue} ${operator} ${inputValue} = ${newValue}`, ...h].slice(0, 10));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '×': return prev * next;
      case '÷': return prev / next;
      default: return next;
    }
  };

  // Scientific functions
  const sciFunc = (func: string) => {
      const val = parseFloat(display);
      let res = 0;
      switch(func) {
          case 'sin': res = Math.sin(val); break;
          case 'cos': res = Math.cos(val); break;
          case 'tan': res = Math.tan(val); break;
          case 'sqrt': res = Math.sqrt(val); break;
          case 'log': res = Math.log10(val); break;
          case 'ln': res = Math.log(val); break;
      }
      setDisplay(String(res));
      setWaitingForOperand(true);
  };

  const buttons = [
    { label: 'AC', type: 'special', action: clear },
    { label: '±', type: 'special', action: toggleSign },
    { label: '%', type: 'special', action: percent },
    { label: '÷', type: 'operator', action: () => performOperation('÷') },
    { label: '7', type: 'number', action: () => inputDigit('7') },
    { label: '8', type: 'number', action: () => inputDigit('8') },
    { label: '9', type: 'number', action: () => inputDigit('9') },
    { label: '×', type: 'operator', action: () => performOperation('×') },
    { label: '4', type: 'number', action: () => inputDigit('4') },
    { label: '5', type: 'number', action: () => inputDigit('5') },
    { label: '6', type: 'number', action: () => inputDigit('6') },
    { label: '-', type: 'operator', action: () => performOperation('-') },
    { label: '1', type: 'number', action: () => inputDigit('1') },
    { label: '2', type: 'number', action: () => inputDigit('2') },
    { label: '3', type: 'number', action: () => inputDigit('3') },
    { label: '+', type: 'operator', action: () => performOperation('+') },
    { label: '0', type: 'number', width: 'col-span-2', action: () => inputDigit('0') },
    { label: '.', type: 'number', action: inputDot },
    { label: '=', type: 'operator', action: () => performOperation('=') },
  ];

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="bg-black w-full max-w-sm rounded-[3rem] shadow-2xl p-6 border-4 border-gray-800 relative overflow-hidden flex flex-col">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[2.5rem]"></div>
        
        {/* History Toggle */}
        <div className="absolute top-6 left-6 z-10">
            <button onClick={() => setShowHistory(!showHistory)} className="text-gray-500 hover:text-white"><History/></button>
        </div>
        
        {/* Sci Mode Toggle */}
        <div className="absolute top-6 right-6 z-10">
            <button onClick={() => setScientificMode(!scientificMode)} className="text-gray-500 hover:text-white text-xs font-bold border border-gray-600 px-2 py-1 rounded">
                {scientificMode ? 'BASIC' : 'SCI'}
            </button>
        </div>

        {/* History Panel */}
        {showHistory && (
            <div className="absolute inset-x-4 top-16 bg-gray-900/90 backdrop-blur-md rounded-xl p-4 z-20 h-40 overflow-y-auto text-right">
                {history.map((h, i) => <div key={i} className="text-gray-300 border-b border-gray-800 py-1 text-sm font-mono">{h}</div>)}
                {history.length === 0 && <div className="text-gray-600 text-center">No history</div>}
            </div>
        )}

        {/* Display */}
        <div className="flex flex-col justify-end h-32 mb-4 px-2 mt-8">
            <div className="text-white text-6xl font-light text-right break-all transition-all duration-200">
                {Number(display).toLocaleString('en-US', { maximumFractionDigits: 6 })}
            </div>
        </div>

        {/* Sci Keypad */}
        {scientificMode && (
            <div className="grid grid-cols-4 gap-2 mb-2">
                {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pi', 'e'].map(f => (
                    <button key={f} onClick={() => sciFunc(f)} className="bg-gray-800 text-gray-400 text-xs py-2 rounded-lg hover:bg-gray-700">{f}</button>
                ))}
            </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn) => (
                <button
                    key={btn.label}
                    onClick={btn.action}
                    className={`
                        h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-2xl font-medium transition-transform active:scale-90
                        ${btn.width === 'col-span-2' ? 'col-span-2 w-full text-left pl-8' : ''}
                        ${btn.type === 'special' ? 'bg-gray-300 text-black hover:bg-gray-200' : ''}
                        ${btn.type === 'operator' ? 'bg-orange-500 text-white hover:bg-orange-400' : ''}
                        ${btn.type === 'number' ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}
                    `}
                >
                    {btn.label}
                </button>
            ))}
        </div>
        
        {/* Home Indicator */}
        <div className="mt-6 mx-auto w-32 h-1 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default HelloNumbers;
