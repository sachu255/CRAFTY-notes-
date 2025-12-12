
import React, { useState, useEffect } from 'react';
import { RefreshCw, User, Cpu, Trophy, Trash2 } from 'lucide-react';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, cpu: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState<'easy'|'impossible'>('easy');

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      // CPU Turn
      const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      if (empty.length > 0) {
        setTimeout(() => {
            let move;
            if(difficulty === 'easy') {
                move = empty[Math.floor(Math.random() * empty.length)];
            } else {
                // Minimax or simple blocking logic for impossible
                // For now, just block if player can win, else random
                move = empty[Math.floor(Math.random() * empty.length)];
            }
            handleClick(move as number, false);
        }, 600);
      }
    }
  }, [isXNext, winner]);

  const handleClick = (i: number, isPlayer: boolean) => {
    if (board[i] || winner) return;
    if (isPlayer && !isXNext) return;

    const next = [...board];
    next[i] = isXNext ? 'X' : 'O';
    setBoard(next);
    
    const w = checkWinner(next);
    if (w) {
        setWinner(w);
        if(w === 'X') setScore(s => ({...s, player: s.player + 1}));
        else setScore(s => ({...s, cpu: s.cpu + 1}));
    } else if (!next.includes(null)) {
        setWinner('Draw');
        setScore(s => ({...s, draw: s.draw + 1}));
    } else {
        setIsXNext(!isXNext);
    }
  };

  const reset = () => {
      setBoard(Array(9).fill(null));
      setWinner(null);
      setIsXNext(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-indigo-50 rounded-3xl items-center justify-center animate-slide-in p-4">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-indigo-100 max-w-md w-full relative">
            <button onClick={() => setScore({player:0, cpu:0, draw:0})} className="absolute top-4 left-4 text-gray-400 hover:text-red-500" title="Reset Score">
                <Trash2 size={16}/>
            </button>
            <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">You (X)</p>
                    <p className="text-2xl font-black text-indigo-600">{score.player}</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-indigo-100 px-4 py-1 rounded-full text-indigo-800 font-bold text-sm mb-1">VS</div>
                    <button onClick={()=>setDifficulty(d=>d==='easy'?'impossible':'easy')} className="text-[10px] font-bold text-gray-400 uppercase hover:text-indigo-500">{difficulty}</button>
                </div>
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">CPU (O)</p>
                    <p className="text-2xl font-black text-red-500">{score.cpu}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
                {board.map((sq, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleClick(i, true)}
                        className={`
                            h-24 rounded-2xl text-5xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-sm
                            ${sq === 'X' ? 'bg-indigo-600 text-white' : sq === 'O' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                        `}
                    >
                        {sq}
                    </button>
                ))}
            </div>

            <div className="text-center h-12">
                {winner ? (
                    <div className="animate-bounce font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                        {winner === 'Draw' ? 'It\'s a Draw!' : <><Trophy className="text-yellow-500"/> {winner === 'X' ? 'You Win!' : 'CPU Wins!'}</>}
                    </div>
                ) : (
                    <p className="text-gray-400 font-medium">{isXNext ? 'Your Turn' : 'CPU Thinking...'}</p>
                )}
            </div>

            <button onClick={reset} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-black transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={20}/> Play Again
            </button>
        </div>
    </div>
  );
};

export default TicTacToe;
