
import React, { useState } from 'react';
import { X } from 'lucide-react';

const CommandBlock: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [blockType, setBlockType] = useState<'impulse' | 'chain' | 'repeat'>('impulse');
  const [condition, setCondition] = useState<'unconditional' | 'conditional'>('unconditional');
  const [redstone, setRedstone] = useState<'needs_redstone' | 'always_active'>('needs_redstone');
  const [isHovered, setIsHovered] = useState(false);

  const getBlockColor = () => {
      switch(blockType) {
          case 'impulse': return 'bg-[#C67843]'; // Orangeish
          case 'chain': return 'bg-[#7E968D]'; // Blueish Green
          case 'repeat': return 'bg-[#6D548E]'; // Purple
      }
  };

  const handleRun = () => {
      let response = '';
      const cmd = command.trim().toLowerCase();

      if (cmd.startsWith('/time set')) {
          if (cmd.includes('day')) response = 'Set the time to 1000';
          else if (cmd.includes('night')) response = 'Set the time to 13000';
          else response = 'Set the time to ' + (cmd.split(' ')[2] || '0');
      } else if (cmd.startsWith('/give')) {
          const parts = cmd.split(' ');
          const player = parts[1] || '@p';
          const item = parts[2] || 'air';
          const amount = parts[3] || '1';
          response = `Given [${item}] * ${amount} to ${player}`;
      } else if (cmd.startsWith('/gamemode')) {
          const mode = cmd.split(' ')[1];
          response = `Set own game mode to ${mode}`;
      } else if (cmd.startsWith('/kill')) {
          const target = cmd.split(' ')[1] || '@e';
          response = `Killed ${target}`;
      } else if (cmd.startsWith('/xp') || cmd.startsWith('/experience')) {
          const amount = cmd.split(' ')[1] || '0';
          response = `Given ${amount} experience to @p`;
      } else if (cmd.startsWith('/say')) {
          response = `[Server] ${cmd.replace('/say ', '')}`;
      } else if (cmd === '') {
          response = '-';
      } else {
          response = `Unknown command: ${cmd.split(' ')[0]}. Please check that the command exists and that you have permission to use it.`;
      }

      // Add timestamp
      const time = new Date().toLocaleTimeString('en-US', {hour12: false});
      setOutput(`[${time}] ${response}`);
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in zoom-in-95 font-mono overflow-y-auto custom-scrollbar">
        
        {/* Minecraft Dialog Box */}
        <div className="w-full max-w-3xl bg-[#C6C6C6] border-4 border-white outline outline-4 outline-black shadow-2xl relative text-[#3F3F3F] my-auto">
            
            {/* Header */}
            <div className="p-2 px-4 flex justify-between items-center bg-[#C6C6C6] border-b-4 border-[#808080]">
                <span className="font-bold text-lg">Command Block</span>
                <button className="w-6 h-6 flex items-center justify-center bg-[#C6C6C6] border-2 border-white hover:bg-[#808080] active:border-[#808080]">
                    <X size={16} className="text-[#3F3F3F]"/>
                </button>
            </div>

            <div className="p-4 sm:p-6 bg-[#C6C6C6] grid gap-4">
                
                {/* Command Input */}
                <div>
                    <label className="block font-bold mb-1">Console Command</label>
                    <input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="w-full bg-black text-white border-2 border-[#808080] p-2 font-mono outline-none focus:border-white"
                        spellCheck={false}
                        placeholder="/"
                    />
                </div>

                {/* Output Log */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block font-bold mb-1">Previous Output</label>
                        <div className="w-full h-24 bg-black text-[#AAAAAA] border-2 border-[#808080] p-2 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
                            {output}
                        </div>
                    </div>
                    
                    {/* Visual Block Representation */}
                    <div className="w-full sm:w-32 flex flex-col items-center justify-center gap-2 py-4 sm:py-0 bg-[#bdbdbd] sm:bg-transparent rounded sm:rounded-none border sm:border-none border-[#808080]">
                        <div 
                            className={`w-20 h-20 border-4 border-black/20 shadow-inner flex items-center justify-center relative ${getBlockColor()}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="w-12 h-12 border-4 border-black/10 grid grid-cols-2 gap-1 p-1">
                                <div className="bg-black/10"></div><div className="bg-black/10"></div>
                                <div className="bg-black/10"></div><div className="bg-black/10"></div>
                            </div>
                            {isHovered && <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 z-10 whitespace-nowrap">Minecraft 1.20</div>}
                        </div>
                    </div>
                </div>

                {/* Settings Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-2">
                    <button 
                        onClick={() => setBlockType(prev => prev === 'impulse' ? 'chain' : prev === 'chain' ? 'repeat' : 'impulse')}
                        className="bg-[#8B8B8B] text-white border-2 border-b-4 border-r-4 border-black border-t-white border-l-white py-2 px-4 active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-sm sm:text-base"
                    >
                        {blockType === 'impulse' ? 'Impulse' : blockType === 'chain' ? 'Chain' : 'Repeat'}
                    </button>

                    <button 
                        onClick={() => setCondition(prev => prev === 'unconditional' ? 'conditional' : 'unconditional')}
                        className="bg-[#8B8B8B] text-white border-2 border-b-4 border-r-4 border-black border-t-white border-l-white py-2 px-4 active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-sm sm:text-base"
                    >
                        {condition === 'unconditional' ? 'Unconditional' : 'Conditional'}
                    </button>

                    <button 
                        onClick={() => setRedstone(prev => prev === 'needs_redstone' ? 'always_active' : 'needs_redstone')}
                        className="bg-[#8B8B8B] text-white border-2 border-b-4 border-r-4 border-black border-t-white border-l-white py-2 px-4 active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-sm sm:text-base"
                    >
                        {redstone === 'needs_redstone' ? 'Needs Redstone' : 'Always Active'}
                    </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-[#555555]">Universal Edition</div>
                    <div className="flex gap-4">
                        <button onClick={handleRun} className="bg-[#8B8B8B] text-white border-2 border-b-4 border-r-4 border-black border-t-white border-l-white py-2 px-8 active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold">
                            Done
                        </button>
                        <button className="bg-[#8B8B8B] text-white border-2 border-b-4 border-r-4 border-black border-t-white border-l-white py-2 px-8 active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold">
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default CommandBlock;
