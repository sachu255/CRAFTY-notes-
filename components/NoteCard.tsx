
import React from 'react';
import { Note } from '../services/types';
import { Trash2, Pin, Tag, RotateCcw, XCircle, Lock, Heart, Copy, Volume2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onPin: (id: string, e: React.MouseEvent) => void;
  onRestore?: (id: string, e: React.MouseEvent) => void;
  onDuplicate?: (note: Note) => void;
  isDeleted?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete, onPin, onRestore, onDuplicate, isDeleted }) => {
  // Format date
  const dateStr = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const wordCount = (note.content?.trim().split(/\s+/).filter(w => w.length > 0).length) || 0;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 

    if (isDeleted) return;

    if (note.locked) {
        setTimeout(() => {
            const password = prompt("This note is locked. Enter password:");
            if (password === note.password) {
                onClick(note);
            } else {
                if (password !== null) alert("Incorrect password! Access Denied.");
            }
        }, 50);
    } else {
        onClick(note);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(note.content || "");
      alert("Note copied!");
  };

  const handleSpeak = (e: React.MouseEvent) => {
      e.stopPropagation();
      const utterance = new SpeechSynthesisUtterance(note.content || "");
      window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-black/5
        ${note.color}
        ${isDeleted ? 'opacity-80 grayscale-[0.3] cursor-default' : 'cursor-pointer'}
        flex flex-col h-auto min-h-[140px] break-inside-avoid mb-4
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-bold text-lg text-gray-800 line-clamp-2 ${!note.title && 'text-gray-400 italic'} ${note.locked ? 'blur-sm select-none' : ''}`}>
          {note.locked ? 'Secret Note' : (note.title || 'Untitled')}
        </h3>
        {!isDeleted && (
          <div className="flex gap-1">
              {note.isFavorite && <Heart size={16} className="text-red-500 fill-current" />}
              <button
                onClick={(e) => onPin(note.id, e)}
                className={`
                  p-1.5 rounded-full transition-colors 
                  ${note.pinned ? 'bg-black/10 text-gray-800' : 'text-gray-400 hover:bg-black/5 hover:text-gray-600 opacity-0 group-hover:opacity-100'}
                `}
              >
                <Pin size={16} className={note.pinned ? 'fill-current' : ''} />
              </button>
          </div>
        )}
      </div>

      {note.locked ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 py-4">
              <Lock size={32} className="mb-2 opacity-50"/>
              <p className="text-xs font-bold uppercase tracking-wider">Locked</p>
          </div>
      ) : (
        <>
            <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-5 flex-grow font-medium leading-relaxed mb-4">
                {note.content || <span className="opacity-50">No content</span>}
            </p>
            {/* Stickers */}
            {note.stickers && note.stickers.length > 0 && (
                <div className="flex gap-1 mb-2 overflow-hidden h-10">
                    {note.stickers.slice(0, 3).map((s, i) => (
                        <img key={i} src={s} alt="sticker" className="h-full object-contain"/>
                    ))}
                    {note.stickers.length > 3 && <span className="text-xs text-gray-400 self-end">+{note.stickers.length - 3}</span>}
                </div>
            )}
        </>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && !note.locked && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-black/5 text-gray-600 rounded-md text-[10px] font-medium flex items-center gap-1">
              <Tag size={8} /> {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-black/5">
        <span className="text-xs text-gray-500 font-medium flex items-center gap-2">
            {isDeleted ? 'Deleted' : dateStr}
            {!note.locked && <span className="text-[10px] opacity-70">({wordCount} words)</span>}
        </span>
        
        <div className="flex items-center gap-1">
            {!isDeleted && (
                <>
                    <button onClick={handleSpeak} className="p-2 text-gray-400 hover:bg-black/5 rounded-full transition-all opacity-0 group-hover:opacity-100" title="Read Aloud">
                        <Volume2 size={14}/>
                    </button>
                    <button onClick={handleCopy} className="p-2 text-gray-400 hover:bg-black/5 rounded-full transition-all opacity-0 group-hover:opacity-100" title="Copy">
                        <Copy size={14}/>
                    </button>
                    {onDuplicate && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDuplicate(note); }}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            title="Duplicate Note"
                        >
                            <Copy size={14} />
                        </button>
                    )}
                </>
            )}

            {isDeleted && onRestore && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRestore(note.id, e); }}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-all"
                    title="Restore Note"
                >
                    <RotateCcw size={16} />
                </button>
            )}
            
            <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id, e); }}
            className={`p-2 rounded-full transition-all ${isDeleted ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'}`}
            title={isDeleted ? "Delete Forever" : "Move to Bin"}
            >
             {isDeleted ? <XCircle size={16} /> : <Trash2 size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
