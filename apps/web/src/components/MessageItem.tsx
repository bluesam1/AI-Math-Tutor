import React from 'react';
import type { Message } from '../types';
import MarkdownMessageRenderer from './MarkdownMessageRenderer';
import { CheckCircle2 } from 'lucide-react';

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
      className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`${isStudent ? 'Student' : 'Tutor'} message`}
    >
      <div
        className={`max-w-[80%] p-4 ${
          isStudent
            ? 'bg-indigo-50 text-gray-800 ml-auto rounded-lg rounded-tr-sm'
            : 'bg-gray-50 text-gray-800 mr-auto rounded-lg rounded-tl-sm'
        }`}
      >
        {/* Answer badge for student answer submissions */}
        {isStudent && message.isAnswer && (
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />
            <span className="text-xs font-medium text-green-700">Answered</span>
          </div>
        )}
        <div className="text-base font-normal leading-relaxed">
          <MarkdownMessageRenderer content={message.content} />
        </div>
        <span className="text-xs text-gray-500 mt-2 block">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
