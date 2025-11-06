import React from 'react';
import ProblemPanel from './ProblemPanel';
import ChatPanel from './ChatPanel';
import StatusIndicator from './StatusIndicator';
import type { LayoutProps, ChatPanelProps, ProblemType } from '../types';

interface LayoutComponentProps extends LayoutProps {
  problem?: string;
  problemType?: ProblemType;
  messages?: ChatPanelProps['messages'];
  emptyState?: boolean;
  onProblemSubmit?: (problem: string) => void;
  onImageSubmit?: (file: File) => void;
  onClearProblem?: () => void;
  onSendMessage?: (message: string) => Promise<void>;
  onAddTutorMessage?: (message: string) => void;
  sessionId?: string;
  chatError?: string | null;
  isChatLoading?: boolean;
  validationError?: string | null;
  isValidating?: boolean;
  isSubmitting?: boolean;
  isUploading?: boolean;
  isProcessing?: boolean;
  onAnswerChecked?: (result: {
    isCorrect: boolean;
    isPartial?: boolean;
    feedback?: string;
    studentAnswer?: string;
  }) => void;
  onAddStudentMessage?: (message: string, isAnswer?: boolean) => void;
  onChatTypingChange?: (isTyping: boolean) => void;
  onAnswerTypingChange?: (isTyping: boolean) => void;
  isAnswerTyping?: boolean;
}

const Layout: React.FC<LayoutComponentProps> = ({
  problem,
  problemType,
  messages,
  emptyState = false,
  onProblemSubmit,
  onImageSubmit,
  onClearProblem,
  onSendMessage,
  onAddTutorMessage,
  sessionId,
  chatError,
  isChatLoading,
  validationError,
  isValidating,
  isSubmitting,
  isUploading,
  isProcessing,
  onAnswerChecked,
  onAddStudentMessage,
  onChatTypingChange,
  onAnswerTypingChange,
  isAnswerTyping = false,
}) => {
  return (
    <main className="h-screen w-full overflow-hidden relative gradient-background">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Learn Math Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            aria-hidden="true"
          />
          <h1 className="text-lg sm:text-xl font-bold text-primary">
            Learn Math
          </h1>
        </div>
        {/* Status indicator - top right */}
        <StatusIndicator />
      </header>

      {/* Responsive layout: stacked on mobile/tablet, side-by-side on desktop */}
      <div className="h-full flex flex-col md:flex-row pt-16 sm:pt-20">
        {/* Problem Display Panel - Left side on desktop, top on mobile/tablet */}
        <div
          className={`w-full ${problem ? 'md:w-1/2' : 'md:w-full'} h-auto md:h-full flex-shrink-0 border-b md:border-b-0 ${problem ? 'md:border-r' : ''} border-border overflow-hidden flex flex-col`}
        >
          <ProblemPanel
            problem={problem}
            problemType={problemType}
            onProblemSubmit={onProblemSubmit}
            onImageSubmit={onImageSubmit}
            onClearProblem={onClearProblem}
            validationError={validationError}
            isValidating={isValidating}
            isSubmitting={isSubmitting}
            isUploading={isUploading}
            isProcessing={isProcessing}
            onAnswerChecked={onAnswerChecked}
            onAddStudentMessage={onAddStudentMessage}
            onTypingChange={onAnswerTypingChange}
          />
        </div>

        {/* Chat Conversation Panel - Right side on desktop, bottom on mobile/tablet - only show when problem is set */}
        {problem && (
          <div className="w-full md:w-1/2 h-full md:h-full overflow-hidden flex flex-col flex-shrink-0">
            <ChatPanel
              messages={messages}
              emptyState={emptyState}
              onSendMessage={onSendMessage}
              onAddTutorMessage={onAddTutorMessage}
              problemText={problem}
              problemType={problemType}
              sessionId={sessionId}
              isLoading={isChatLoading}
              error={chatError}
              onTypingChange={onChatTypingChange}
              isExternalTyping={isAnswerTyping}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Layout;
