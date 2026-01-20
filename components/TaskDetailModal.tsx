import React from 'react';
import { Task } from '../types';
import { X, Check, Trash2, Calendar, Cpu, AlertTriangle, Activity, CreditCard } from 'lucide-react';
import { CyberButton } from './CyberButton';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onToggle, onDelete }) => {
  const isCompleted = task.status === 'completed';
  
  const priorityColor = {
    low: 'text-gray-400 border-gray-600',
    med: 'text-neon-yellow border-neon-yellow',
    high: 'text-neon-pink border-neon-pink'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg bg-neon-dark border border-neon-cyan shadow-[0_0_50px_rgba(0,243,255,0.15)] p-1 overflow-hidden group">
        
        {/* Inner Border Container */}
        <div className="relative bg-neon-panel p-6 border border-neon-cyan/30 h-full">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                    <div className="text-[10px] text-neon-cyan/60 tracking-[0.2em] mb-1">
                        DATA_PACKET // ID: {task.id}
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={14} className={isCompleted ? "text-gray-500" : "text-neon-pink animate-pulse"} />
                        <span className={`text-xs font-bold ${isCompleted ? "text-gray-500" : "text-neon-pink"}`}>
                            STATUS: {task.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-white hover:rotate-90 transition-all duration-300"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Title */}
            <h2 className={`text-2xl md:text-3xl font-mono font-bold mb-6 leading-tight
                ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}
            `}>
                {task.title}
            </h2>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`border p-3 ${priorityColor[task.priority]} bg-opacity-5 bg-current`}>
                    <div className="text-[10px] uppercase opacity-70 mb-1 flex items-center gap-2">
                        <AlertTriangle size={12} /> Priority
                    </div>
                    <div className="text-lg font-bold tracking-wider">{task.priority.toUpperCase()}</div>
                </div>
                
                <div className="border border-neon-cyan/50 p-3 text-neon-cyan bg-neon-cyan/5">
                    <div className="text-[10px] uppercase opacity-70 mb-1 flex items-center gap-2">
                        <CreditCard size={12} /> Bounty
                    </div>
                    <div className="text-lg font-bold tracking-wider">{task.credits} CR</div>
                </div>

                <div className="border border-gray-700 p-3 text-gray-300 col-span-2 flex items-center gap-4">
                    <div className="text-[10px] uppercase opacity-70 flex items-center gap-2 min-w-[80px]">
                        <Calendar size={12} /> Deadline
                    </div>
                    <div className="text-lg font-bold tracking-wider">
                        {task.deadline ? task.deadline : "NO_DEADLINE_SET"}
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="mb-8 relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-pink to-transparent"></div>
                <div className="pl-4">
                    <div className="text-[10px] text-neon-pink mb-1 flex items-center gap-2">
                         <Cpu size={12} /> AI_ANALYSIS_LOG
                    </div>
                    <p className="text-sm text-gray-300 italic font-mono leading-relaxed">
                        "{task.insight || "No analysis data available."}"
                    </p>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-4 pt-4 border-t border-gray-800">
                <CyberButton 
                    variant="cyan" 
                    onClick={() => { onToggle(task.id); onClose(); }}
                    className="flex-1"
                >
                    <div className="flex items-center gap-2">
                        <Check size={16} />
                        {isCompleted ? 'REACTIVATE' : 'COMPLETE'}
                    </div>
                </CyberButton>
                
                <CyberButton 
                    variant="pink" 
                    onClick={() => { onDelete(task.id); onClose(); }}
                    className="w-16 flex items-center justify-center !px-0"
                >
                    <Trash2 size={18} />
                </CyberButton>
            </div>
            
            {/* Decor */}
            <div className="absolute bottom-2 right-2 text-[8px] text-gray-700 select-none">
                SECURE_CONNECTION_ESTABLISHED
            </div>
        </div>
      </div>
    </div>
  );
};