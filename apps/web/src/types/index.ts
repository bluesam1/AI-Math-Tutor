export type ProblemType = 'arithmetic' | 'algebra' | 'geometry' | 'word' | 'multi-step';

export interface Problem {
  id: string;
  text: string;
  type: ProblemType;
}

export interface Message {
  id: string;
  role: 'student' | 'system' | 'tutor';
  content: string;
  timestamp: Date | string;
}

export interface Session {
  sessionId: string;
  problem: Problem | null;
  messages: Message[];
}

export interface ProblemPanelProps {
  problem?: string;
  problemType?: string;
}

export interface ChatPanelProps {
  messages?: Message[];
  emptyState?: boolean;
}

export interface LayoutProps {
  className?: string;
}
