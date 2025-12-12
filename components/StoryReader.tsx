
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { MarketItem } from '../services/types';

interface StoryReaderProps {
  story: MarketItem | null;
  onClose: () => void;
}

const StoryReader: React.FC<StoryReaderProps> = ({ story, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
      if(contentRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
          const p = (scrollTop / (scrollHeight - clientHeight)) * 100;
          setProgress(p);
      }
  };

  // Content for different stories
  const storiesDB: Record<string, { title: string, chapters: {title: string, content: string}[] }> = {
      'story-magical-word': {
          title: "The First Magical Word",
          chapters: [
            {
                title: "Chapter 1: The Portal to the Amazing World",
                content: `In the heart of Amchal village, there lived a young boy named Sachu. Sachu was not like the other children in the village. He was curious, always asking questions, exploring, and dreaming of a world beyond the fields, rivers, and houses of his village. He loved reading about distant lands and magical creatures, his favorite books filled with stories of enchanted forests, flying creatures, and worlds filled with light.\n\nOne peaceful afternoon, while Sachu was playing near the edge of his house, something extraordinary happened. As he wandered near a large, ancient tree that grew beside his family’s house, he noticed something strange—an odd shimmer in the air, like a mirage on a hot day. But it wasn’t heat—it was a portal, glowing with soft blue and golden light, swirling like a whirlpool.\n\nSachu stood frozen, his heart pounding in his chest. The shimmering light beckoned to him, as if calling him to step inside. Without thinking, he took a hesitant step forward. His foot crossed the invisible boundary, and the world around him shifted.`
            },
            {
                title: "Chapter 2: A World of Wonders",
                content: `As soon as Sachu crossed the portal, he was no longer in Amchal village. Instead, he found himself standing in an entirely new world—a magical world that seemed like something from his wildest dreams. The sky above him was painted in hues of orange, pink, and purple. The trees were tall and magnificent, their trunks glowing with an ethereal light.\n\nThe ground beneath his feet felt soft, like walking on clouds. It wasn’t made of regular soil, but something more magical—like sparkling dust that twinkled as he moved.\n\n“This is... amazing,” Sachu whispered in awe.\n\nBut in the midst of this enchantment, Sachu felt a strange sense of urgency. He looked around for a sign, something to guide him, and that’s when he saw it. A large stone tablet stood in the middle of a glade. The tablet was covered in glowing symbols, none of which Sachu recognized, except for one: a single word glowing brightly at the top.\n\n“Elarion,” the word glowed. And as it did, the wind swirled around Sachu, carrying whispers that felt like secrets from the very heart of the world.`
            },
            {
                title: "Chapter 3: The Guardian of the World",
                content: `Suddenly, a figure appeared before Sachu, emerging from the trees like a spirit made of light and nature. It was the Guardian of the World.\n\n"Welcome, Sachu," the Guardian spoke. "You have been chosen by the word Elarion. You are here to protect this world and unlock its true potential."\n\nSachu stood still. "Chosen? But why me? I’m just a regular boy from Amchal."\n\nThe Guardian smiled. "There is nothing ‘regular’ about you, Sachu. Every world needs a protector. You were always meant to find this world, for the fate of both worlds lies in your hands."\n\nThe Guardian gestured to the stone tablet. “The word Elarion is the key to this world’s power. You must learn to understand its power.”`
            },
             {
                title: "Chapter 4: The First Magical Word",
                content: `The Guardian led Sachu to a crystal-clear lake. There, submerged in the water, was a glowing gem. "This is the Heart of Magic," the Guardian said. "To unlock the true power of Elarion, you must speak the First Magical Word."\n\nSachu reached out hesitantly. The moment he did, a voice echoed inside his mind.\n\n“Elarion,” the voice whispered.\n\nSachu spoke the word aloud. “Elarion.”\n\nA blinding light exploded from the gem, engulfing the lake and the surrounding forest. When the light faded, Sachu found himself standing in the same place, but everything felt different. The world seemed more alive.`
            },
            {
                title: "Chapter 5: The Test of Courage",
                content: `But all was not peaceful. "Dark forces have learned of this world," the Guardian warned.\n\nDark creatures emerged from the forest. They had come to steal the Heart of Magic.\n\nSachu’s heart raced, but he stood firm. “I won’t let them take this world.”\n\nHe uttered the word Elarion again, and a magical barrier formed around him, glowing like the stars themselves.`
            },
             {
                title: "Chapter 6: A New Beginning",
                content: `As the dark creatures vanished, the world around Sachu began to brighten. He had learned that with the First Magical Word, he could shape reality itself.\n\n"You have done it, Sachu," the Guardian said. "But this is just the beginning."\n\nAnd so, Sachu’s journey began. With the First Magical Word, he would protect the magical world and learn its deepest mysteries.`
            },
            {
                title: "Chapter 7: The Dark Island",
                content: `Sachu stood at the edge of the shimmering world. "There is something far worse," the Guardian said. "In the heart of this world lies Dark Island, home to ancient monsters."\n\nSachu's eyes widened. "Dark Island?"\n\n"It is a cursed land. You must journey there and restore the seals before the monsters escape."`
            },
            {
                title: "Chapter 8: The Sea of Shadows",
                content: `Sachu set off on a ship of light, crafted from magic. The Sea of Shadows was vast and eerie. Dark shapes moved beneath the surface.\n\nA low growl echoed. Shadowy figures emerged from the depths. Sachu raised his hand. "Elarion!"\n\nThe light from the ship brightened, repelling the monsters.`
            },
            {
                title: "Chapter 9: Heart of Darkness",
                content: `Sachu reached Dark Island. At its center, he found the Heart of Darkness, a crystal pulsing with dark energy. The Dark King emerged from the shadows.\n\n"You are too late," the Dark King growled.`
            },
            {
                title: "Chapter 10: Restoring the Balance",
                content: `Sachu raised his staff. "Elarion!"\n\nThe light exploded outward, consuming the Dark King and sealing the Heart of Darkness once more. The island was saved.`
            },
            {
                title: "Chapter 11: Bady Ghot",
                content: `But the true evil revealed itself. Bady Ghot, a monster of stone and dark magic, stepped forward. "I am the Master of Darkness," he boomed.\n\nSachu stood his ground. "I will stop you."`
            },
            {
                title: "Chapter 12: The Final Battle",
                content: `The battle raged. Bady Ghot was powerful, but Sachu channeled the balance of light and darkness.\n\n"Elarion!" he shouted with all his might. A wave of energy collided with Bady Ghot, overpowering him.`
            },
             {
                title: "Bonus: Flying Lesson",
                content: `Princess Lira taught Sachu how to fly. "Trust in the magic," she said.\n\nSachu closed his eyes and felt himself lift off the ground. He was flying! They soared over the kingdom, free as birds.`
            }
          ]
      },
      'story-lost-city': {
          title: "The Lost City",
          chapters: [
              { title: "Chapter 1: The Map", content: "In the dusty attic of his grandfather's house, Leo found a map. It wasn't just any map; it glowed with a faint green light..." },
              { title: "Chapter 2: The Jungle", content: "The jungle was dense and loud. Monkeys chattered overhead as Leo hacked through the vines..." },
              { title: "Chapter 3: The Golden Temple", content: "There it stood. The Lost City of Gold. It was more magnificent than the legends..." }
          ]
      },
      'story-space-voyage': {
          title: "Voyage to Andromeda",
          chapters: [
              { title: "Chapter 1: Blast Off", content: "The countdown reached zero. The engines roared to life, shaking the entire ship..." },
              { title: "Chapter 2: Zero Gravity", content: "Floating was fun, until you tried to drink water. Globules of liquid floated everywhere..." },
              { title: "Chapter 3: The Alien Signal", content: "Beep. Beep. A signal appeared on the radar. It wasn't from Earth..." }
          ]
      }
  };

  const activeStoryContent = story ? storiesDB[story.id] : null;
  
  if (!story || !activeStoryContent) {
      // Fallback if story ID not found in DB
      return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl items-center justify-center">
             <p className="text-gray-500">Story content not available.</p>
             <button onClick={onClose} className="mt-4 text-blue-500 underline">Close</button>
        </div>
      )
  }

  const activeChapter = activeStoryContent.chapters[currentChapter];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden font-serif animate-slide-in relative text-stone-900">
        {/* Header */}
        <div className="p-4 bg-[#f8f5f0] border-b border-stone-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                 <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                     <ChevronLeft size={24}/>
                 </button>
                 <div>
                     <h2 className="font-bold text-lg leading-tight">{activeStoryContent.title}</h2>
                     <p className="text-xs text-stone-500">Chapter {currentChapter + 1} of {activeStoryContent.chapters.length}</p>
                 </div>
            </div>
            <div className="flex gap-2">
                 <button className="p-2 hover:bg-stone-200 rounded-full transition-colors"><BookOpen size={20}/></button>
            </div>
        </div>
        
        <div className="w-full h-1 bg-stone-200">
            <div className="h-full bg-orange-400 transition-all duration-300" style={{width: `${progress}%`}}></div>
        </div>

        {/* Content */}
        <div 
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-8 md:p-12 max-w-3xl mx-auto custom-scrollbar"
        >
            <h3 className="text-3xl font-bold mb-8 text-center text-stone-800">{activeChapter.title}</h3>
            <div className="prose prose-lg prose-stone mx-auto leading-loose text-justify whitespace-pre-wrap">
                {activeChapter.content}
            </div>
            
            <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center text-stone-500 font-sans text-sm">
                <button 
                  onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
                  disabled={currentChapter === 0}
                  className="flex items-center gap-2 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                >
                    <ArrowLeft size={16}/> Previous Chapter
                </button>
                <span>{currentChapter + 1} / {activeStoryContent.chapters.length}</span>
                <button 
                  onClick={() => setCurrentChapter(c => Math.min(activeStoryContent.chapters.length - 1, c + 1))}
                  disabled={currentChapter === activeStoryContent.chapters.length - 1}
                  className="flex items-center gap-2 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                >
                    Next Chapter <ArrowRight size={16}/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default StoryReader;
