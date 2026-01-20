import React from 'react';
import { Activity, Wifi, Battery, Trophy, ChevronsRight } from 'lucide-react';
import { ConnectionStatus } from '../types';

interface HeaderProps {
  status: ConnectionStatus;
  credits: number;
  rankName: string;
  nextRankCredits: number;
}

export const Header: React.FC<HeaderProps> = ({ status, credits, rankName, nextRankCredits }) => {
  const progressPercent = Math.min(100, Math.max(0, (credits / nextRankCredits) * 100));

  return (
    <header className="mb-8 border-b border-neon-cyan/20 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-mono font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            NEON LEDGER
          </h1>
          <p className="text-neon-cyan/60 text-xs tracking-[0.2em] mt-1">
            FINANCIAL OPERATIONS INTERFACE v4.05
          </p>
        </div>

        {/* Status & Rank Module */}
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          
          <div className="flex items-center gap-6 text-xs font-mono text-neon-cyan/70">
             <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className={status === ConnectionStatus.PROCESSING ? 'animate-pulse text-neon-pink' : ''} />
                  <span>{status === ConnectionStatus.PROCESSING ? 'AI COMPUTING...' : 'SYSTEM STABLE'}</span>
                </div>
                <div className="flex items-center gap-1.5"><Wifi size={14} /> <span>NET: ONLINE</span></div>
             </div>
          </div>

          {/* Rank System Bar */}
          <div className="w-full md:w-80 bg-black/40 border border-gray-800 p-2 relative group">
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <div className="flex items-center gap-2 text-white">
                    <Trophy size={12} className="text-neon-yellow" />
                    <span className="font-bold tracking-wider">{rankName}</span>
                </div>
                <div className="text-gray-500">
                    {credits} / {nextRankCredits} XP
                </div>
            </div>
            
            {/* Progress Bar Container */}
            <div className="h-2 w-full bg-gray-900 relative overflow-hidden">
                {/* Fill */}
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                ></div>
                {/* Glitch Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
            </div>

            {/* Next Rank Hint */}
            <div className="absolute -bottom-5 right-0 text-[9px] text-gray-600 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                NEXT RANK <ChevronsRight size={10} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};