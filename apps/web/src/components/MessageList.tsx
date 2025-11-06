import React from 'react';
import type { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-center">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
