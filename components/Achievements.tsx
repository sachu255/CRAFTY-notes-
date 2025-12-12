
import React from 'react';
import { Achievement, UserProfile } from '../services/types';
import { Medal, Coins, Lock, CheckCircle } from 'lucide-react';

interface AchievementsProps {
  profile: UserProfile;
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ profile, achievements }) => {
  return (
    <div className="max-w-3xl mx-auto pb-20 animate-slide-in">
        
        {/* Header / Coin Balance */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-[2rem] p-8 text-white shadow-xl mb-8 border-4 border-yellow-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
                <Coins size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-yellow-100 font-bold uppercase tracking-wider text-sm mb-1">Total Balance</p>
                <h1 className="text-5xl font-black flex items-center gap-3">
                   <Coins size={48} className="text-white"/> {profile.coins} CNC
                </h1>
                <p className="mt-4 text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
                    Complete Advancements to earn Crafty Notes Coins
                </p>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Medal className="text-orange-500"/> Advancements
        </h2>

        <div className="grid gap-4">
            {achievements.map((achievement) => {
                const isUnlocked = profile.unlockedAchievements.includes(achievement.id);
                return (
                    <div 
                        key={achievement.id}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl border transition-all duration-300
                            ${isUnlocked 
                                ? 'bg-white border-green-200 shadow-sm' 
                                : 'bg-gray-50 border-gray-200 opacity-80 grayscale-[0.5]'}
                        `}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm
                                ${isUnlocked ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white' : 'bg-gray-200 text-gray-400'}
                            `}>
                                {isUnlocked ? achievement.icon : <Lock size={24}/>}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {achievement.title}
                                </h3>
                                <p className="text-sm text-gray-500">{achievement.description}</p>
                            </div>

                            <div className="text-right">
                                {isUnlocked ? (
                                    <div className="flex flex-col items-end text-green-600">
                                        <CheckCircle size={24} className="mb-1"/>
                                        <span className="text-xs font-bold uppercase">Completed</span>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1">
                                        +{achievement.reward} CNC
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Achievements;
