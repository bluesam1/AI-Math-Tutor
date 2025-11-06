import React from 'react';
import type { Message } from '../types';
import MarkdownMessageRenderer from './MarkdownMessageRenderer';
import { CheckCircle2, Bot } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isStudent = message.role === 'student';

  // Log message content for debugging
  console.log('[MessageItem] Rendering message', {
    role: message.role,
    contentLength: message.content.length,
    content: JSON.stringify(message.content),
    first150Chars: message.content.substring(0, 150),
    contains$: message.content.includes('$'),
    containsBackslashParen: message.content.includes('\\('),
    containsBackslashBracket: message.content.includes('\\['),
    isAnswer: message.isAnswer,
  });

  const formatTimestamp = (timestamp: Date | string): string => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex items-start gap-3 ${isStudent ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`${isStudent ? 'Student' : 'Tutor'} message`}
    >
      {/* Robot avatar for tutor messages */}
      {!isStudent && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/10 border-2 border-accent shadow-card flex items-center justify-center">
            <Bot
              className="w-6 h-6 sm:w-7 sm:h-7 text-accent"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] p-4 shadow-card ${
          isStudent
            ? 'bg-blue-50 text-text-primary ml-auto rounded-lg rounded-tr-sm border-l-4 border-primary'
            : 'bg-white text-text-primary mr-auto rounded-lg rounded-tl-sm border-l-4 border-accent'
        }`}
      >
        {/* Answer badge for student answer submissions */}
        {isStudent && message.isAnswer && (
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-xs font-medium text-accent">Answered</span>
          </div>
        )}
        <div className="text-base font-normal leading-relaxed">
          <MarkdownMessageRenderer content={message.content} />
        </div>
        <span className="text-xs text-text-secondary mt-2 block">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
