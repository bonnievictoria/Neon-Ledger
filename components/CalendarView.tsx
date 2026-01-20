import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Generate calendar grid cells
  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`blank-${i}`} className="h-24 bg-black/20 border border-gray-800/50 opacity-30"></div>
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.deadline === dateString);
    const isToday = new Date().toISOString().split('T')[0] === dateString;

    return (
      <div 
        key={dateString} 
        className={`relative h-24 p-1 border transition-all hover:bg-white/5 group
          ${isToday ? 'border-neon-pink bg-neon-pink/5 shadow-[inset_0_0_10px_rgba(255,0,255,0.2)]' : 'border-gray-800 bg-black/40 hover:border-neon-cyan/50'}
        `}
      >
        <span className={`text-xs font-mono absolute top-1 right-2 ${isToday ? 'text-neon-pink font-bold' : 'text-gray-500'}`}>
          {dayNum}
        </span>
        
        <div className="mt-4 flex flex-col gap-1 overflow-y-auto max-h-[calc(100%-1.5rem)] scrollbar-hide">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}
              className={`text-[9px] px-1 py-0.5 truncate border-l-2 cursor-pointer transition-transform hover:scale-105
                ${task.priority === 'high' ? 'border-neon-pink text-neon-pink' : 
                  task.priority === 'med' ? 'border-neon-yellow text-neon-yellow' : 'border-gray-500 text-gray-400'}
                ${task.status === 'completed' ? 'opacity-50 line-through' : ''}
              `}
              title={task.title}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="border border-neon-cyan/30 bg-neon-panel/90 backdrop-blur-sm p-4 relative overflow-hidden min-h-[500px]">
        {/* Background Grid Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-xl font-mono tracking-widest text-neon-cyan flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan animate-pulse"></span>
                TIMELINE_VIEW // {monthNames[month]} {year}
            </h2>
            <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1 hover:text-neon-pink transition-colors"><ChevronLeft /></button>
                <button onClick={nextMonth} className="p-1 hover:text-neon-pink transition-colors"><ChevronRight /></button>
            </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2 text-center text-[10px] text-gray-500 font-mono tracking-widest">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 relative z-10">
            {blanks}
            {days}
        </div>
    </div>
  );
};