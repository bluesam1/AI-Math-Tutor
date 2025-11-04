import React from 'react';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isStudent = message.role === 'student';

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
        <p className="text-base font-normal leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <span className="text-xs text-gray-500 mt-2 block">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
