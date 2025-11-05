export type ProblemType =
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'word'
  | 'multi-step';

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

/**
 * Problem display component props
 * Used for displaying submitted problems with type information
 */
export interface ProblemDisplayProps {
  problemText: string;
  problemType: ProblemType | null;
  isValidated: boolean;
}

/**
 * Problem type badge props
 * Used for displaying problem type badges
 */
export interface ProblemTypeBadgeProps {
  problemType: ProblemType | string;
  className?: string;
}

export interface ChatPanelProps {
  messages?: Message[];
  emptyState?: boolean;
  onSendMessage?: (message: string) => Promise<void>;
  problemText?: string;
  problemType?: ProblemType;
  sessionId?: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface LayoutProps {
  className?: string;
}
