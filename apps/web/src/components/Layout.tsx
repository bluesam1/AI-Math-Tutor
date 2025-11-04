import React from 'react';
import ProblemPanel from './ProblemPanel';
import ChatPanel from './ChatPanel';
import type { LayoutProps, ProblemPanelProps, ChatPanelProps } from '../types';

interface LayoutComponentProps extends LayoutProps {
  problem?: string;
  problemType?: string;
  messages?: ChatPanelProps['messages'];
  emptyState?: boolean;
}

const Layout: React.FC<LayoutComponentProps> = ({
  problem,
  problemType,
  messages,
  emptyState = false,
}) => {
  return (
    <main className="h-screen w-full overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Problem Display Panel - Left side on desktop, top on mobile */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
          <ProblemPanel problem={problem} problemType={problemType} />
        </div>

        {/* Chat Conversation Panel - Right side on desktop, bottom on mobile */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
          <ChatPanel messages={messages} emptyState={emptyState} />
        </div>
      </div>
    </main>
  );
};

export default Layout;
