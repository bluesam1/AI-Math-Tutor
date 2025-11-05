import React, { useState, useRef, useEffect } from 'react';
import type { ChatPanelProps } from '../types';
import MessageList from './MessageList';
import LoadingMessage from './LoadingMessage';

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages = [],
  onSendMessage,
  problemText,
  problemType,
  isLoading: externalIsLoading,
  error,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = externalIsLoading || internalLoading;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!onSendMessage) return;
    if (!problemText || !problemType) {
      // Show error if problem is not set
      return;
    }

    const messageToSend = inputValue.trim();
    setInputValue('');
    setInternalLoading(true);

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error('[ChatPanel] Error sending message', error);
      // Restore input value on error
      setInputValue(messageToSend);
    } finally {
      setInternalLoading(false);
      // Focus input after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-white border-l border-border"
      role="region"
      aria-label="Chat conversation"
    >
      {/* Header */}
      <div className="border-b border-border p-4 lg:p-6">
        <h2 className="text-text-primary">Chat with Tutor</h2>
        <p className="text-sm text-text-secondary mt-1">
          Ask questions and work through the problem together
        </p>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 lg:p-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <MessageList messages={messages} />
        {isLoading && <LoadingMessage />}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 lg:p-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !problemText || !problemType
                ? 'Please set a problem first...'
                : 'Type your question here...'
            }
            disabled={!problemText || !problemType || isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-input bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Message input"
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() || isLoading || !problemText || !problemType
            }
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[44px] flex items-center justify-center"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
