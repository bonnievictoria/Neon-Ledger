import React from 'react';
import { Task } from '../types';
import { Check, Trash2, Cpu, CalendarClock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onSelect }) => {
  const isCompleted = task.status === 'completed';

  const priorityColor = {
    low: 'text-gray-400 border-gray-600',
    med: 'text-neon-yellow border-neon-yellow shadow-[0_0_5px_rgba(252,238,10,0.4)]',
    high: 'text-neon-pink border-neon-pink shadow-[0_0_8px_rgba(255,0,255,0.6)]'
  };

  // Basic check if deadline is passed (only if pending)
  const isOverdue = !isCompleted && task.deadline && new Date(task.deadline) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div className={`
      relative group mb-4 p-4 border-l-4 bg-neon-panel/80 backdrop-blur-sm
      transition-all duration-300 hover:translate-x-1
      ${isCompleted ? 'border-gray-700 opacity-60' : isOverdue ? 'border-red-500' : 'border-neon-cyan'}
    `}>
      {/* Background Grid Texture */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        
        {/* Checkbox Section */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
          className={`mt-1 w-6 h-6 border flex items-center justify-center transition-colors
            ${isCompleted ? 'bg-neon-cyan border-neon-cyan text-black' : 'border-neon-cyan/50 text-transparent hover:border-neon-cyan'}
          `}
        >
          <Check size={16} strokeWidth={4} />
        </button>

        {/* Content Section - Clickable for details */}
        <div 
          onClick={() => onSelect(task)}
          className="flex-1 font-mono cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className={`text-lg tracking-wide hover:text-neon-cyan transition-colors ${isCompleted ? 'line-through text-gray-500' : 'text-gray-100'}`}>
              {task.title}
            </h3>
            <span className={`text-[10px] uppercase px-1.5 py-0.5 border ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
            {task.deadline && (
              <div className={`flex items-center gap-1 text-[10px] uppercase border px-1.5 py-0.5 ${isOverdue ? 'text-red-500 border-red-500 animate-pulse' : 'text-neon-cyan border-neon-cyan/50'}`}>
                <CalendarClock size={10} />
                <span>{task.deadline}</span>
              </div>
            )}
          </div>
          
          {/* AI Insight */}
          {task.insight && !isCompleted && (
            <div className="flex items-center gap-2 text-xs text-neon-cyan/80 mt-1 animate-pulse">
              <Cpu size={12} />
              <span>// {task.insight}</span>
            </div>
          )}
          
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-4">
            <span>ID: {task.id.substring(0, 8)}</span>
            <span className="text-neon-yellow">CREDITS: {task.credits}</span>
          </div>
        </div>

        {/* Actions */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Decorative Lines */}
      <div className={`absolute bottom-0 right-0 w-16 h-[1px] ${isOverdue ? 'bg-red-500/50' : 'bg-neon-cyan/30'}`}></div>
    </div>
  );
};