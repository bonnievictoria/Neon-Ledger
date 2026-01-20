import React from 'react';
import { Task } from '../types';
import { PieChart, TrendingUp, Target, Activity } from 'lucide-react';

interface StatsViewProps {
  tasks: Task[];
}

export const StatsView: React.FC<StatsViewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const medPriority = tasks.filter(t => t.priority === 'med').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  const totalCredits = tasks.reduce((acc, t) => acc + t.credits, 0);
  const earnedCredits = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.credits, 0);

  // Calculate bar heights for distribution (normalize to 100px max height)
  const maxCount = Math.max(highPriority, medPriority, lowPriority) || 1;
  const hHeight = (highPriority / maxCount) * 100;
  const mHeight = (medPriority / maxCount) * 100;
  const lHeight = (lowPriority / maxCount) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
      
      {/* Efficiency Module */}
      <div className="bg-neon-panel border border-neon-cyan/30 p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50">
          <Activity className="text-neon-cyan" size={20} />
        </div>
        <h3 className="text-neon-cyan text-xs tracking-[0.2em] mb-4">SYSTEM_EFFICIENCY</h3>
        
        <div className="flex items-center justify-between">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r="40" stroke="rgba(0, 243, 255, 0.1)" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#00f3ff" strokeWidth="8" fill="transparent" 
                            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * completionRate) / 100} 
                            className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute text-xl font-bold text-white">{completionRate}%</div>
            </div>
            <div className="flex-1 ml-6 space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="text-gray-500">TOTAL_PROTOCOLS</span>
                    <span className="text-white">{total}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="text-gray-500">EXECUTED</span>
                    <span className="text-neon-cyan">{completed}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">PENDING</span>
                    <span className="text-neon-pink">{pending}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Credit Yield Module */}
      <div className="bg-neon-panel border border-neon-pink/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-50">
          <TrendingUp className="text-neon-pink" size={20} />
        </div>
        <h3 className="text-neon-pink text-xs tracking-[0.2em] mb-4">CREDIT_YIELD</h3>
        
        <div className="flex flex-col justify-center h-full pb-2">
            <div className="text-3xl font-bold text-white mb-1">
                {earnedCredits.toLocaleString()} <span className="text-sm text-gray-500 font-normal">/ {totalCredits.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full mt-2 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-neon-pink to-purple-600 transition-all duration-1000"
                    style={{ width: `${totalCredits === 0 ? 0 : (earnedCredits/totalCredits) * 100}%` }}
                ></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
                Potential bounty available in pending tasks: <span className="text-neon-yellow">{(totalCredits - earnedCredits).toLocaleString()} CR</span>
            </p>
        </div>
      </div>

      {/* Priority Distribution - Full Width */}
      <div className="md:col-span-2 bg-neon-panel border border-gray-800 p-4 relative">
         <h3 className="text-gray-400 text-xs tracking-[0.2em] mb-6 flex items-center gap-2">
            <Target size={14} /> THREAT_LEVEL_DISTRIBUTION
         </h3>
         
         <div className="flex items-end justify-around h-32 px-4 gap-4">
            
            {/* Low */}
            <div className="flex flex-col items-center gap-2 group w-full">
                <div className="w-full bg-gray-900/50 relative h-full flex items-end justify-center rounded-sm overflow-hidden">
                    <div 
                        style={{ height: `${lHeight}%` }} 
                        className="w-full bg-gray-600 opacity-50 group-hover:opacity-100 transition-all duration-500 relative"
                    >
                         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>
                    </div>
                </div>
                <span className="text-[10px] text-gray-500">LOW ({lowPriority})</span>
            </div>

            {/* Med */}
            <div className="flex flex-col items-center gap-2 group w-full">
                <div className="w-full bg-gray-900/50 relative h-full flex items-end justify-center rounded-sm overflow-hidden">
                    <div 
                        style={{ height: `${mHeight}%` }} 
                        className="w-full bg-neon-yellow/50 group-hover:bg-neon-yellow/80 transition-all duration-500 relative shadow-[0_0_10px_rgba(252,238,10,0.2)]"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>
                        {/* Scanline effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>
                    </div>
                </div>
                <span className="text-[10px] text-neon-yellow">MED ({medPriority})</span>
            </div>

            {/* High */}
            <div className="flex flex-col items-center gap-2 group w-full">
                <div className="w-full bg-gray-900/50 relative h-full flex items-end justify-center rounded-sm overflow-hidden">
                    <div 
                        style={{ height: `${hHeight}%` }} 
                        className="w-full bg-neon-pink/50 group-hover:bg-neon-pink/80 transition-all duration-500 relative shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    </div>
                </div>
                <span className="text-[10px] text-neon-pink font-bold">HIGH ({highPriority})</span>
            </div>

         </div>
      </div>
    </div>
  );
};