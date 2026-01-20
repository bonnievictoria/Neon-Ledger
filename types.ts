export interface Task {
  id: string;
  title: string;
  insight: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'med' | 'high';
  credits: number; // Gamification currency
  deadline?: string; // YYYY-MM-DD
}

export interface AiResponse {
  tasks: Task[];
  systemMessage: string;
}

export enum ConnectionStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  PROCESSING
}