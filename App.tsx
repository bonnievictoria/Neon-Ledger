import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Zap, Calendar, List, PieChart } from 'lucide-react';
import { Header } from './components/Header';
import { TaskItem } from './components/TaskItem';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { CyberButton } from './components/CyberButton';
import { TaskDetailModal } from './components/TaskDetailModal';
import { Task, ConnectionStatus } from './types';
import { processCommand } from './services/geminiService';

const getToday = () => new Date().toISOString().split('T')[0];

const INITIAL_TASKS: Task[] = [
  { id: 't-101', title: 'Rebalance Crypto Portfolio', insight: 'ETH staking yield up 2.1%', status: 'pending', priority: 'high', credits: 500, deadline: getToday() },
  { id: 't-102', title: 'Audit Monthly Subscriptions', insight: 'Possible 15% wastage detected', status: 'pending', priority: 'low', credits: 150 },
  { id: 't-103', title: 'Budget Tokyo Trip', insight: 'Yen currently weak against USD', status: 'completed', priority: 'med', credits: 300, deadline: '2023-12-01' },
];

// Rank Definitions
const RANKS = [
    { name: 'INITIATE', threshold: 0 },
    { name: 'SPLICER', threshold: 1000 },
    { name: 'DATA BROKER', threshold: 2500 },
    { name: 'FIXER', threshold: 5000 },
    { name: 'NETRUNNER', threshold: 10000 },
    { name: 'CYBER BARON', threshold: 25000 },
    { name: 'SYSTEM ARCHITECT', threshold: 50000 },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTED);
  const [systemMessage, setSystemMessage] = useState('System initialized. Awaiting input.');
  const [totalCredits, setTotalCredits] = useState(950);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'stats'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate Rank
  const currentRankIndex = RANKS.findIndex((r, i) => totalCredits >= r.threshold && (RANKS[i+1] ? totalCredits < RANKS[i+1].threshold : true));
  const currentRank = RANKS[currentRankIndex !== -1 ? currentRankIndex : RANKS.length - 1];
  const nextRank = RANKS[currentRankIndex + 1] || { name: 'MAX LEVEL', threshold: totalCredits * 2 };

  const handleCommand = async () => {
    if (!inputValue.trim()) return;

    const command = inputValue;
    setInputValue('');
    setStatus(ConnectionStatus.PROCESSING);
    setSystemMessage('Encrypting transmission... Uploading to Neural Net...');

    try {
      const response = await processCommand(command, tasks);
      
      setTasks(response.tasks);
      setSystemMessage(response.systemMessage);
      setStatus(ConnectionStatus.CONNECTED);
      
      // Calculate new credits based on completed/current tasks logic
      // In a real app, we'd want persistent history, but for now we sum completed + pending potential
      // Actually, let's keep it simple: Sum of all tasks' value (completed or not) represents "Potential XP"
      // But usually XP is only earned on completion. 
      // Let's make 'totalCredits' represent "Current Score" = Sum of Completed Task Credits.
      const score = response.tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.credits, 0);
      setTotalCredits(prev => Math.max(prev, score)); // Keep highest score

    } catch (error) {
      console.error(error);
      setSystemMessage('ERROR: Neural Link Severed. Retry connection.');
      setStatus(ConnectionStatus.CONNECTED);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
        const newTasks = prev.map(t => {
            if (t.id === id) {
                return { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } as Task;
            }
            return t;
        });
        
        // Recalculate score immediately
        const newScore = newTasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.credits, 0);
        setTotalCredits(newScore);
        
        return newTasks;
    });
    
    // Update selected task if it's currently open
    if (selectedTask && selectedTask.id === id) {
        setSelectedTask(prev => prev ? {...prev, status: prev.status === 'pending' ? 'completed' : 'pending'} : null);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommand();
    }
  };

  // Suggestions
  const injectPrompt = (text: string) => setInputValue(text);

  return (
    <div className="min-h-screen bg-neon-dark text-gray-200 font-mono selection:bg-neon-pink selection:text-white pb-24">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),rgba(0,0,0,0))]"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <Header 
            status={status} 
            credits={totalCredits} 
            rankName={currentRank.name}
            nextRankCredits={nextRank.threshold}
        />

        {/* System Message Log */}
        <div className="mb-6 p-3 border border-neon-cyan/30 bg-black/50 backdrop-blur-md flex items-start gap-3 rounded-sm">
          <Terminal size={16} className="text-neon-pink mt-1 shrink-0" />
          <div className="text-sm text-neon-cyan/80 animate-pulse">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {systemMessage}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Center Column: Tasks / Calendar / Stats */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-cyan inline-block"></span>
                ACTIVE PROTOCOLS
              </h2>
              
              {/* View Toggle */}
              <div className="flex border border-gray-800 bg-black/40">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <div className="w-[1px] bg-gray-800"></div>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 transition-colors ${viewMode === 'calendar' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                  title="Calendar View"
                >
                  <Calendar size={16} />
                </button>
                <div className="w-[1px] bg-gray-800"></div>
                <button 
                  onClick={() => setViewMode('stats')}
                  className={`p-2 transition-colors ${viewMode === 'stats' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                  title="Neural Analytics"
                >
                  <PieChart size={16} />
                </button>
              </div>
            </div>

            {viewMode === 'list' && (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                {tasks.length === 0 ? (
                  <div className="p-8 border border-dashed border-gray-800 text-center text-gray-600">
                    NO ACTIVE DIRECTIVES. INITIALIZE NEW GOALS.
                  </div>
                ) : (
                  tasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask}
                      onSelect={setSelectedTask} 
                    />
                  ))
                )}
              </div>
            )}
            
            {viewMode === 'calendar' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <CalendarView tasks={tasks} onSelectTask={setSelectedTask} />
                </div>
            )}

            {viewMode === 'stats' && (
                <StatsView tasks={tasks} />
            )}
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <div className="p-4 border border-gray-800 bg-gray-900/30">
              <h3 className="text-neon-pink text-sm tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} />
                QUICK INJECT
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => injectPrompt("Inject a goal to optimize monthly cashflow efficiency by next Friday.")}
                  className="w-full text-left text-xs p-2 border border-gray-800 hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-black/40"
                >
                  "Optimize cashflow by next Friday"
                </button>
                <button 
                  onClick={() => injectPrompt("Analyze my top 3 spending leaks and create audit tasks for tomorrow.")}
                  className="w-full text-left text-xs p-2 border border-gray-800 hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-black/40"
                >
                  "Audit spending leaks tomorrow"
                </button>
                <button 
                  onClick={() => injectPrompt("Set up a high priority savings goal for a Neural Link upgrade due in 30 days.")}
                  className="w-full text-left text-xs p-2 border border-gray-800 hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-black/40"
                >
                  "Save for Neural Link (30 days)"
                </button>
                <button 
                  onClick={() => injectPrompt("Clear all completed tasks and consolidate low priority items.")}
                  className="w-full text-left text-xs p-2 border border-gray-800 hover:border-neon-pink hover:text-neon-pink transition-colors bg-black/40"
                >
                  "Purge completed logs"
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-800 bg-gray-900/30">
               <h3 className="text-neon-cyan text-sm tracking-widest mb-2">MARKET DATA STREAM</h3>
               <div className="text-[10px] text-gray-500 font-mono space-y-1 overflow-hidden h-24 relative">
                  <p className="whitespace-nowrap animate-pulse">BTC/USD ... 89,420.00 ... +1.2%</p>
                  <p className="whitespace-nowrap">ETH/USD ... 4,102.50 ... -0.4%</p>
                  <p className="whitespace-nowrap">SOL/USD ... 145.20 ... +3.1%</p>
                  <p className="whitespace-nowrap text-neon-pink">CORP BOND YIELD ... 5.2% ... ALERT</p>
                  <p className="whitespace-nowrap">CREDIT DEFAULT SWAPS ... STABLE</p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Input Console Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neon-dark/95 border-t border-neon-cyan/30 backdrop-blur-lg p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-end gap-4">
          <div className="flex-1 relative">
            <div className="absolute -top-3 left-0 bg-neon-cyan text-black text-[10px] px-1 font-bold">
              AI COMMAND LINE
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter directive... (e.g., 'Add a task to review Q3 dividends by Monday')"
              className="w-full bg-black/50 border border-gray-700 focus:border-neon-cyan text-white p-3 pt-4 h-14 resize-none outline-none font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
            />
          </div>
          <CyberButton 
            onClick={handleCommand} 
            disabled={!inputValue || status === ConnectionStatus.PROCESSING}
            loading={status === ConnectionStatus.PROCESSING}
            className="h-14 w-32"
          >
            EXECUTE
          </CyberButton>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTask && (
        <TaskDetailModal 
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onToggle={toggleTask}
            onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default App;