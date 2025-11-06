import React, { useState, useRef, useEffect } from 'react';
import type { ChatPanelProps } from '../types';
import MessageList from './MessageList';
import LoadingMessage from './LoadingMessage';
import ProgressIndicator from './ProgressIndicator';
import CelebrationMessage from './CelebrationMessage';
import ErrorMessage from './ErrorMessage';
import HelpOfferCard from './HelpOfferCard';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useProgressiveEngagement } from '../hooks/useProgressiveEngagement';
import { detectAnswer } from '../utils/answerDetection';
import { apiClient } from '../services/api';

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages = [],
  onSendMessage,
  onAddTutorMessage,
  problemText,
  problemType,
  isLoading: externalIsLoading,
  error,
  onTypingChange,
  isExternalTyping = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [answerCheckResult, setAnswerCheckResult] = useState<{
    isCorrect: boolean;
    isPartial?: boolean;
    confidence: number;
    feedback?: string;
  } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<
    string | undefined
  >(undefined);
  const [showHelpOffer, setShowHelpOffer] = useState(false);
  const [lastFollowUpMessageId, setLastFollowUpMessageId] = useState<
    string | null
  >(null);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const helpOfferTimerRef = useRef<NodeJS.Timeout | null>(null);
  const helpOfferAutoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Progress tracking
  const {
    progressLevel,
    progressPercentage,
    recordAttempt,
    recordResponse,
    markProgress,
    reset,
  } = useProgressTracking();

  const isLoading = externalIsLoading || internalLoading;

  // Progressive engagement tracking
  const hasStudentMessage = messages.some(msg => msg.role === 'student');
  const isTyping = inputValue.trim().length > 0;
  const hasAttemptedAnswer = answerCheckResult !== null;

  // Track typing state and notify parent
  useEffect(() => {
    if (onTypingChange) {
      onTypingChange(isTyping);
    }
  }, [isTyping, onTypingChange]);

  /**
   * Generate initial greeting or follow-up prompt
   * This runs asynchronously and doesn't block the chat flow
   */
  const generateGreetingMessage = async (
    promptType: 'initial' | 'follow-up-1' | 'follow-up-2' | 'follow-up-3'
  ) => {
    if (!problemText || !problemType || !onAddTutorMessage) {
      console.log(
        '[ChatPanel] Greeting generation skipped - missing requirements',
        {
          hasProblemText: !!problemText,
          hasProblemType: !!problemType,
          hasOnAddTutorMessage: !!onAddTutorMessage,
        }
      );
      return;
    }

    try {
      console.log('[ChatPanel] Generating greeting message', {
        promptType,
      });

      // Convert messages to conversation history format
      const conversationHistory = messages.map(msg => ({
        role: (msg.role === 'student' ? 'user' : 'assistant') as
          | 'user'
          | 'assistant',
        content: msg.content,
      }));

      // Generate greeting message
      const greetingResult = await apiClient.generateInitialGreeting(
        problemText,
        problemType,
        promptType,
        conversationHistory
      );

      if (greetingResult.success) {
        console.log('[ChatPanel] Greeting message generated', {
          promptType,
          messageLength: greetingResult.greetingMessage.length,
          message: greetingResult.greetingMessage.substring(0, 100),
        });

        // Add greeting message as a tutor message
        if (onAddTutorMessage) {
          onAddTutorMessage(greetingResult.greetingMessage);
          console.log('[ChatPanel] Greeting message added to chat');
        } else {
          console.error('[ChatPanel] onAddTutorMessage is not available');
        }
      } else {
        console.error('[ChatPanel] Greeting generation failed', {
          error: greetingResult.error,
          message: greetingResult.message,
        });
        // Greeting generation failure doesn't block chat flow
      }
    } catch (error) {
      console.error('[ChatPanel] Error generating greeting', error);
      // Greeting generation failure doesn't block chat flow
    }
  };

  // Progressive engagement hook
  useProgressiveEngagement({
    hasProblem: !!problemText && !!problemType,
    hasStudentMessage,
    isTyping,
    isExternalTyping,
    hasAttemptedAnswer,
    onGenerateGreeting: generateGreetingMessage,
  });

  // Reset progress when problem changes
  useEffect(() => {
    if (problemText && problemType) {
      reset();
    }
  }, [problemText, problemType, reset]);

  // Track progress when messages change
  // Only student messages count as progress - tutor messages are just responses
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'student') {
      recordAttempt();
      // Student messages indicate engagement and progress
      markProgress();
    } else if (lastMessage.role === 'tutor') {
      recordResponse();
      // Tutor messages are responses, not progress indicators
    }
  }, [messages, recordAttempt, recordResponse, markProgress]);

  // Auto-scroll to bottom when new messages arrive
  // Only scroll within the messages container, not the entire page
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;

          // Scroll to the bottom of the container
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        }
      });
    }
  }, [messages]);

  // Track when follow-up messages are displayed
  useEffect(() => {
    if (messages.length === 0) {
      setShowHelpOffer(false);
      setLastFollowUpMessageId(null);
      return;
    }

    // Find the last tutor message
    const lastTutorMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'tutor');

    if (lastTutorMessage && lastTutorMessage.id !== lastFollowUpMessageId) {
      // Check if this is a follow-up message (heuristic: check if it asks for explanation or offers to work together)
      // We'll be more lenient - any message that appears after an answer check could be a follow-up
      const lowerContent = lastTutorMessage.content.toLowerCase();
      const isFollowUpMessage =
        lowerContent.includes('walk me through') ||
        lowerContent.includes('work through') ||
        lowerContent.includes("let's work") ||
        lowerContent.includes("let's think") ||
        lowerContent.includes('can you explain') ||
        lowerContent.includes('how you got') ||
        lowerContent.includes("that's correct") ||
        lowerContent.includes('thanks for trying') ||
        lowerContent.includes('right track') ||
        lowerContent.includes('step') ||
        lowerContent.includes('together');

      console.log('[ChatPanel] Checking if tutor message is follow-up', {
        messageId: lastTutorMessage.id,
        contentPreview: lastTutorMessage.content.substring(0, 100),
        isFollowUpMessage,
        lowerContent: lowerContent.substring(0, 100),
      });

      // If we just checked an answer and got a tutor message, it's likely a follow-up
      // We'll show the help offer for any tutor message that appears after answer checking
      const hasRecentAnswerCheck = !!answerCheckResult;

      if (isFollowUpMessage || hasRecentAnswerCheck) {
        console.log('[ChatPanel] Triggering help offer timer', {
          isFollowUpMessage,
          hasRecentAnswerCheck,
          messageId: lastTutorMessage.id,
        });
        setLastFollowUpMessageId(lastTutorMessage.id);
        // Clear any existing timers
        if (helpOfferTimerRef.current) {
          clearTimeout(helpOfferTimerRef.current);
        }
        if (helpOfferAutoDismissTimerRef.current) {
          clearTimeout(helpOfferAutoDismissTimerRef.current);
        }
        // Show help offer after 7.5 seconds (middle of 5-10 second range)
        helpOfferTimerRef.current = setTimeout(() => {
          console.log('[ChatPanel] Showing help offer card after delay');
          setShowHelpOffer(true);
          // Auto-dismiss after 15 seconds
          helpOfferAutoDismissTimerRef.current = setTimeout(() => {
            console.log(
              '[ChatPanel] Auto-dismissing help offer card after 15 seconds'
            );
            setShowHelpOffer(false);
          }, 15000);
        }, 7500);
      } else {
        console.log(
          '[ChatPanel] Not showing help offer - not a follow-up message',
          {
            isFollowUpMessage,
            hasRecentAnswerCheck,
          }
        );
      }
    }

    // Cleanup timers on unmount
    return () => {
      if (helpOfferTimerRef.current) {
        clearTimeout(helpOfferTimerRef.current);
      }
      if (helpOfferAutoDismissTimerRef.current) {
        clearTimeout(helpOfferAutoDismissTimerRef.current);
      }
    };
  }, [messages, lastFollowUpMessageId, answerCheckResult]);

  // Dismiss help offer when student types or sends a message
  useEffect(() => {
    if (inputValue.trim().length > 0 && showHelpOffer) {
      // Student is typing - dismiss help offer
      setShowHelpOffer(false);
      if (helpOfferTimerRef.current) {
        clearTimeout(helpOfferTimerRef.current);
      }
      if (helpOfferAutoDismissTimerRef.current) {
        clearTimeout(helpOfferAutoDismissTimerRef.current);
      }
    }
  }, [inputValue, showHelpOffer]);

  // Focus input after sending a message
  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      // Use setTimeout to ensure focus happens after DOM updates
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setShouldFocusInput(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [shouldFocusInput]);

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
      // Send message normally (non-blocking)
      await onSendMessage(messageToSend);

      // Dismiss help offer when message is sent
      if (showHelpOffer) {
        setShowHelpOffer(false);
        if (helpOfferTimerRef.current) {
          clearTimeout(helpOfferTimerRef.current);
        }
        if (helpOfferAutoDismissTimerRef.current) {
          clearTimeout(helpOfferAutoDismissTimerRef.current);
        }
      }

      // After message is sent, check if it looks like an answer (asynchronously)
      // This doesn't block the chat flow
      checkAnswerIfNeeded(messageToSend);
    } catch (error) {
      console.error('[ChatPanel] Error sending message', error);
      // Restore input value on error
      setInputValue(messageToSend);
    } finally {
      setInternalLoading(false);
      // Set flag to focus input after state updates complete
      setShouldFocusInput(true);
    }
  };

  /**
   * Handle help offer accept (generate step-by-step guidance)
   */
  const handleHelpOfferAccept = async () => {
    if (!problemText || !problemType || !onAddTutorMessage) {
      return;
    }

    // Dismiss help offer
    setShowHelpOffer(false);
    if (helpOfferTimerRef.current) {
      clearTimeout(helpOfferTimerRef.current);
    }
    if (helpOfferAutoDismissTimerRef.current) {
      clearTimeout(helpOfferAutoDismissTimerRef.current);
    }

    try {
      console.log('[ChatPanel] Generating step-by-step guidance');

      // Convert messages to conversation history format
      const conversationHistory = messages.map(msg => ({
        role: (msg.role === 'student' ? 'user' : 'assistant') as
          | 'user'
          | 'assistant',
        content: msg.content,
      }));

      // Generate step-by-step guidance
      const guidanceResult = await apiClient.generateStepByStepGuidance(
        problemText,
        problemType,
        conversationHistory
      );

      if (guidanceResult.success) {
        console.log('[ChatPanel] Step-by-step guidance generated', {
          messageLength: guidanceResult.guidanceMessage.length,
        });

        // Add guidance message as a tutor message
        if (onAddTutorMessage) {
          onAddTutorMessage(guidanceResult.guidanceMessage);
        }
      } else {
        console.error('[ChatPanel] Step-by-step guidance generation failed', {
          error: guidanceResult.error,
          message: guidanceResult.message,
        });
        // Guidance generation failure doesn't block chat flow
      }
    } catch (error) {
      console.error(
        '[ChatPanel] Error generating step-by-step guidance',
        error
      );
      // Guidance generation failure doesn't block chat flow
    }
  };

  /**
   * Handle help offer dismiss
   */
  const handleHelpOfferDismiss = () => {
    setShowHelpOffer(false);
    if (helpOfferTimerRef.current) {
      clearTimeout(helpOfferTimerRef.current);
    }
    if (helpOfferAutoDismissTimerRef.current) {
      clearTimeout(helpOfferAutoDismissTimerRef.current);
    }
  };

  /**
   * Generate follow-up message after answer validation
   * This runs asynchronously and doesn't block the chat flow
   */
  const generateFollowUpMessage = async (
    answerValidationContext: {
      result: 'correct' | 'incorrect' | 'partial';
      studentAnswer: string;
    },
    isPartial?: boolean
  ) => {
    if (!problemText || !problemType || !onAddTutorMessage) {
      console.log(
        '[ChatPanel] Follow-up generation skipped - missing requirements',
        {
          hasProblemText: !!problemText,
          hasProblemType: !!problemType,
          hasOnAddTutorMessage: !!onAddTutorMessage,
        }
      );
      return;
    }

    try {
      console.log('[ChatPanel] Generating follow-up message', {
        validationResult: answerValidationContext.result,
        isPartial,
      });

      // Convert messages to conversation history format
      const conversationHistory = messages.map(msg => ({
        role: (msg.role === 'student' ? 'user' : 'assistant') as
          | 'user'
          | 'assistant',
        content: msg.content,
      }));

      // Generate follow-up message
      const followUpResult = await apiClient.generateFollowUp(
        problemText,
        problemType,
        answerValidationContext,
        conversationHistory
      );

      if (followUpResult.success) {
        console.log('[ChatPanel] Follow-up message generated', {
          messageLength: followUpResult.followUpMessage.length,
          message: followUpResult.followUpMessage.substring(0, 100),
        });

        // Add follow-up message as a tutor message
        if (onAddTutorMessage) {
          onAddTutorMessage(followUpResult.followUpMessage);
          console.log('[ChatPanel] Follow-up message added to chat');
          // Help offer will be shown automatically via the useEffect that tracks follow-up messages
        } else {
          console.error('[ChatPanel] onAddTutorMessage is not available');
        }
      } else {
        console.error('[ChatPanel] Follow-up generation failed', {
          error: followUpResult.error,
          message: followUpResult.message,
        });
        // Follow-up generation failure doesn't block chat flow
      }
    } catch (error) {
      console.error('[ChatPanel] Error generating follow-up', error);
      // Follow-up generation failure doesn't block chat flow
    }
  };

  /**
   * Check if message looks like an answer and validate it asynchronously
   * This runs in the background and doesn't block the chat flow
   */
  const checkAnswerIfNeeded = async (message: string) => {
    if (!problemText || !problemType) {
      return;
    }

    // Detect if message looks like an answer
    console.log('[ChatPanel] Starting answer detection', {
      message,
      problemText,
      problemType,
    });

    const detectionResult = detectAnswer(message);

    console.log('[ChatPanel] Answer detection result', {
      isAnswer: detectionResult.isAnswer,
      confidence: detectionResult.confidence,
      reasoning: detectionResult.reasoning,
      patterns: detectionResult.patterns,
      message,
    });

    // Only check answer if detection confidence is high enough
    if (!detectionResult.isAnswer || detectionResult.confidence < 0.5) {
      console.log(
        '[ChatPanel] Message does not look like an answer, skipping check',
        {
          isAnswer: detectionResult.isAnswer,
          confidence: detectionResult.confidence,
          threshold: 0.5,
          message,
          reasoning: detectionResult.reasoning,
        }
      );
      console.log(
        '[ChatPanel] 💡 TIP: Try sending a simple answer like "5" or "x = 5" to test auto-prompting'
      );
      return;
    }

    console.log('[ChatPanel] Detected potential answer, checking with API...', {
      message,
      problemText,
      problemType,
      confidence: detectionResult.confidence,
      patterns: detectionResult.patterns,
    });

    // Show gentle nudge to use Answer field (non-blocking, subtle)
    // This is a secondary method - Answer field is primary
    // We'll still check the answer but show a helpful tip
    if (onAddTutorMessage) {
      // Add a subtle tip message (one-time, dismissible)
      // Only show if this is the first answer detection in this session
      const tipMessage =
        '💡 Tip: You can also use the "Your Answer" field below the problem for clearer answer submission!';
      // Add tip as a subtle tutor message (non-intrusive)
      // We'll add it once, and it will appear naturally in the chat flow
      setTimeout(() => {
        onAddTutorMessage(tipMessage);
      }, 1000); // Show tip after a short delay, non-blocking
    }

    // Check answer asynchronously (non-blocking)
    setIsCheckingAnswer(true);
    setAnswerCheckResult(null);

    try {
      const checkResult = await apiClient.checkAnswer(
        message,
        problemText,
        problemType
      );

      if (checkResult.success) {
        console.log('[ChatPanel] Answer check API call successful', {
          message,
          problemText,
          problemType,
          isCorrect: checkResult.isCorrect,
          isPartial: checkResult.isPartial,
          confidence: checkResult.confidence,
          feedback: checkResult.feedback,
          reasoning: checkResult.reasoning,
          fullResponse: checkResult,
        });

        setAnswerCheckResult({
          isCorrect: checkResult.isCorrect,
          isPartial: checkResult.isPartial,
          confidence: checkResult.confidence,
          feedback: checkResult.feedback,
        });

        console.log('[ChatPanel] Answer check result set in state', {
          isCorrect: checkResult.isCorrect,
          isPartial: checkResult.isPartial,
          confidence: checkResult.confidence,
          willShowCelebration: checkResult.isCorrect,
        });

        // Show celebration if answer is correct
        if (checkResult.isCorrect) {
          setCelebrationMessage(checkResult.feedback);
          setShowCelebration(true);
        }

        // Generate follow-up message if flag is set
        if (
          checkResult.shouldGenerateFollowUp &&
          checkResult.answerValidationContext &&
          problemText &&
          problemType &&
          onAddTutorMessage
        ) {
          console.log('[ChatPanel] Triggering follow-up generation', {
            shouldGenerateFollowUp: checkResult.shouldGenerateFollowUp,
            answerValidationContext: checkResult.answerValidationContext,
          });
          generateFollowUpMessage(
            checkResult.answerValidationContext,
            checkResult.isPartial
          );
        } else {
          console.log('[ChatPanel] Follow-up generation skipped', {
            shouldGenerateFollowUp: checkResult.shouldGenerateFollowUp,
            hasAnswerValidationContext: !!checkResult.answerValidationContext,
            hasProblemText: !!problemText,
            hasProblemType: !!problemType,
            hasOnAddTutorMessage: !!onAddTutorMessage,
          });
        }
      } else {
        console.error('[ChatPanel] Answer check failed', {
          error: checkResult.error,
          message: checkResult.message,
        });
        // Answer checking failure doesn't block chat flow
        // Just log the error and continue
      }
    } catch (error) {
      console.error('[ChatPanel] Error checking answer', error);
      // Answer checking failure doesn't block chat flow
      // Just log the error and continue
    } finally {
      setIsCheckingAnswer(false);
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
      className="flex h-full flex-col gradient-background border-l border-primary/30"
      role="region"
      aria-label="Chat conversation"
    >
      {/* Header */}
      <div className="border-b border-border p-4 lg:p-6 space-y-3">
        <div>
          <h2 className="text-text-primary">Chat with Tutor</h2>
          <p className="text-sm text-text-secondary mt-1">
            Ask questions and work through the problem together
          </p>
        </div>

        {/* Progress Indicator */}
        {problemText && problemType && (
          <ProgressIndicator
            progressLevel={progressLevel}
            progressPercentage={progressPercentage}
            attempts={messages.filter(m => m.role === 'student').length}
            showMilestones={true}
            className="mt-3"
          />
        )}

        {/* Celebration Message */}
        {showCelebration && (
          <CelebrationMessage
            message={celebrationMessage}
            animate={true}
            className="mt-2"
            onAnimationComplete={() => {
              setShowCelebration(false);
              setCelebrationMessage(undefined);
            }}
          />
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <MessageList messages={messages} />
        {isLoading && <LoadingMessage />}
        {showHelpOffer && (
          <div className="mt-4">
            <HelpOfferCard
              onAccept={handleHelpOfferAccept}
              onDismiss={handleHelpOfferDismiss}
              visible={showHelpOffer}
              className=""
            />
          </div>
        )}
        {error && (
          <ErrorMessage
            error={error}
            dismissible={false}
            className="mt-4"
            onRetry={() => {
              // Retry last message if possible
              if (messages.length > 0 && onSendMessage) {
                const lastStudentMessage = [...messages]
                  .reverse()
                  .find(m => m.role === 'student');
                if (lastStudentMessage) {
                  onSendMessage(lastStudentMessage.content);
                }
              }
            }}
          />
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
            className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 shadow-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[44px] flex items-center justify-center"
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
