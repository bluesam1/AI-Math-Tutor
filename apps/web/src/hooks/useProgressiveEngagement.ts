/**
 * Progressive Engagement Hook
 *
 * Manages initial greeting and progressive follow-up prompts when a problem is set.
 * Shows up to 3 follow-up prompts if the student hasn't engaged.
 */

import { useState, useEffect, useRef } from 'react';

export interface ProgressiveEngagementOptions {
  /**
   * Whether a problem is set
   */
  hasProblem: boolean;
  /**
   * Whether the student has sent any messages
   */
  hasStudentMessage: boolean;
  /**
   * Whether the student is currently typing (in chat input)
   */
  isTyping: boolean;
  /**
   * Whether the student is typing in any input field (external typing state)
   * This can be used to pass typing state from other inputs (e.g., answer input)
   */
  isExternalTyping?: boolean;
  /**
   * Whether the student has attempted an answer
   */
  hasAttemptedAnswer: boolean;
  /**
   * Callback to generate and add greeting message
   */
  onGenerateGreeting: (promptType: 'initial' | 'follow-up-1' | 'follow-up-2' | 'follow-up-3') => Promise<void>;
}

/**
 * Progressive engagement state
 */
export interface ProgressiveEngagementState {
  /**
   * Current prompt count (0-4, where 0 = none, 1 = initial, 2-4 = follow-ups)
   */
  promptCount: number;
  /**
   * Whether engagement is active
   */
  isActive: boolean;
}

/**
 * Use progressive engagement hook
 *
 * Manages initial greeting and up to 3 follow-up prompts
 */
export const useProgressiveEngagement = (
  options: ProgressiveEngagementOptions
): ProgressiveEngagementState => {
  const {
    hasProblem,
    hasStudentMessage,
    isTyping,
    isExternalTyping = false,
    hasAttemptedAnswer,
    onGenerateGreeting,
  } = options;

  // Combine internal and external typing states
  const isAnyTyping = isTyping || isExternalTyping;

  const [promptCount, setPromptCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastPromptTime, setLastPromptTime] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_lastTypingTime, setLastTypingTime] = useState<number | null>(null);

  // Timers for progressive prompts
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const followUp1TimerRef = useRef<NodeJS.Timeout | null>(null);
  const followUp2TimerRef = useRef<NodeJS.Timeout | null>(null);
  const followUp3TimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingInactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all timers helper
  const clearAllTimers = () => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (followUp1TimerRef.current) clearTimeout(followUp1TimerRef.current);
    if (followUp2TimerRef.current) clearTimeout(followUp2TimerRef.current);
    if (followUp3TimerRef.current) clearTimeout(followUp3TimerRef.current);
    if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
    initialTimerRef.current = null;
    followUp1TimerRef.current = null;
    followUp2TimerRef.current = null;
    followUp3TimerRef.current = null;
    typingInactivityTimerRef.current = null;
  };

  // Reset engagement when problem changes
  useEffect(() => {
    if (!hasProblem) {
      // Reset all state when problem is cleared
      setPromptCount(0);
      setIsActive(false);
      setLastPromptTime(null);
      setLastTypingTime(null);
      clearAllTimers();
      return;
    }

    // Start engagement when problem is set
    if (hasProblem && !hasStudentMessage && !hasAttemptedAnswer && promptCount === 0) {
      setIsActive(true);
      setLastPromptTime(Date.now());

      // Show initial greeting after 2 seconds
      initialTimerRef.current = setTimeout(() => {
        if (!hasStudentMessage && !hasAttemptedAnswer && !isAnyTyping && promptCount === 0) {
          console.log('[Progressive Engagement] Showing initial greeting');
          onGenerateGreeting('initial').then(() => {
            setPromptCount(1);
            setLastPromptTime(Date.now());
          }).catch((error) => {
            console.error('[Progressive Engagement] Error generating initial greeting', error);
          });
        }
      }, 2000); // 2 seconds
    }

    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  }, [hasProblem, hasStudentMessage, hasAttemptedAnswer, isAnyTyping, promptCount, onGenerateGreeting]);

  // Track typing activity
  useEffect(() => {
    if (isTyping) {
      setLastTypingTime(Date.now());
      // Clear inactivity timer while typing
      if (typingInactivityTimerRef.current) {
        clearTimeout(typingInactivityTimerRef.current);
        typingInactivityTimerRef.current = null;
      }
    }
  }, [isTyping]);

  // Schedule follow-up prompts
  useEffect(() => {
    // Stop if student has engaged
    if (hasStudentMessage || hasAttemptedAnswer) {
      setIsActive(false);
      clearAllTimers();
      return;
    }

    // Stop if we've reached max prompts (4 total: 1 initial + 3 follow-ups)
    if (promptCount >= 4) {
      setIsActive(false);
      clearAllTimers();
      return;
    }

    // Stop if student is typing in any input
    if (isAnyTyping) {
      return;
    }

    // Calculate time since last prompt
    const timeSinceLastPrompt = lastPromptTime
      ? Date.now() - lastPromptTime
      : Infinity;

    // Schedule follow-up prompts based on timing
    if (promptCount === 1 && timeSinceLastPrompt < 15000) {
      // Follow-up 1: 15-20 seconds after initial
      const delay = 15000 - timeSinceLastPrompt;
      if (!followUp1TimerRef.current) {
        followUp1TimerRef.current = setTimeout(() => {
          if (!hasStudentMessage && !hasAttemptedAnswer && !isTyping && promptCount === 1) {
            console.log('[Progressive Engagement] Showing follow-up 1');
            onGenerateGreeting('follow-up-1').then(() => {
              setPromptCount(2);
              setLastPromptTime(Date.now());
            }).catch((error) => {
              console.error('[Progressive Engagement] Error generating follow-up 1', error);
            });
          }
          followUp1TimerRef.current = null;
        }, delay);
      }
    } else if (promptCount === 2 && timeSinceLastPrompt < 30000) {
      // Follow-up 2: 30-40 seconds after follow-up 1
      const delay = 30000 - timeSinceLastPrompt;
      if (!followUp2TimerRef.current) {
        followUp2TimerRef.current = setTimeout(() => {
          if (!hasStudentMessage && !hasAttemptedAnswer && !isAnyTyping && promptCount === 2) {
            console.log('[Progressive Engagement] Showing follow-up 2');
            onGenerateGreeting('follow-up-2').then(() => {
              setPromptCount(3);
              setLastPromptTime(Date.now());
            }).catch((error) => {
              console.error('[Progressive Engagement] Error generating follow-up 2', error);
            });
          }
          followUp2TimerRef.current = null;
        }, delay);
      }
    } else if (promptCount === 3 && timeSinceLastPrompt < 45000) {
      // Follow-up 3: 45-60 seconds after follow-up 2
      const delay = 45000 - timeSinceLastPrompt;
      if (!followUp3TimerRef.current) {
        followUp3TimerRef.current = setTimeout(() => {
          if (!hasStudentMessage && !hasAttemptedAnswer && !isAnyTyping && promptCount === 3) {
            console.log('[Progressive Engagement] Showing follow-up 3 (final)');
            onGenerateGreeting('follow-up-3').then(() => {
              setPromptCount(4);
              setLastPromptTime(Date.now());
              setIsActive(false); // Stop after max prompts
            }).catch((error) => {
              console.error('[Progressive Engagement] Error generating follow-up 3', error);
            });
          }
          followUp3TimerRef.current = null;
        }, delay);
      }
    }

    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  }, [promptCount, lastPromptTime, hasStudentMessage, hasAttemptedAnswer, isTyping, isExternalTyping, isAnyTyping, onGenerateGreeting]);

  // Stop engagement when student engages
  useEffect(() => {
    if (hasStudentMessage || hasAttemptedAnswer) {
      console.log('[Progressive Engagement] Student engaged - stopping prompts');
      setIsActive(false);
      clearAllTimers();
    }
  }, [hasStudentMessage, hasAttemptedAnswer]);

  return {
    promptCount,
    isActive,
  };
};

