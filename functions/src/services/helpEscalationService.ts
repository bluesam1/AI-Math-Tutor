/**
 * Help Escalation Service
 *
 * Tracks student progress and escalates help when students are stuck.
 * Provides more concrete hints after 2+ turns without progress while maintaining Socratic principles.
 */

import { getContext } from './contextService';

/**
 * Progress tracking configuration
 */
export interface ProgressConfig {
  stuckThreshold: number; // Number of turns without progress before escalation (default: 2)
  escalationLevels: string[]; // Help levels: 'normal', 'escalated', 'further'
}

/**
 * Progress tracking result
 */
export interface ProgressResult {
  stuckTurns: number;
  helpLevel: 'normal' | 'escalated';
  shouldEscalate: boolean;
  progressMade: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ProgressConfig = {
  stuckThreshold: 2,
  escalationLevels: ['normal', 'escalated'],
};

/**
 * Track student progress and determine help level
 *
 * @param sessionId - Session identifier
 * @param config - Progress tracking configuration
 * @returns Progress result with help level and escalation status
 */
export const trackProgress = async (
  sessionId: string,
  config: ProgressConfig = DEFAULT_CONFIG
): Promise<ProgressResult> => {
  try {
    const context = await getContext(sessionId);

    if (!context || !context.messages || context.messages.length === 0) {
      // New session - no progress to track
      return {
        stuckTurns: 0,
        helpLevel: 'normal',
        shouldEscalate: false,
        progressMade: true,
      };
    }

    const messages = context.messages;
    const lastMessages = messages.slice(-config.stuckThreshold * 2); // Check last N*2 messages

    // Simple heuristics to detect progress:
    // 1. Student provides more detailed responses
    // 2. Student asks follow-up questions
    // 3. Student shows understanding (mentions concepts, steps)
    // 4. Assistant provides more concrete hints (escalated already)

    let stuckTurns = 0;
    let progressMade = false;

    // Check last few turns for progress indicators
    for (let i = lastMessages.length - 1; i >= 0; i--) {
      const msg = lastMessages[i];
      if (msg.role === 'user') {
        // Check if student response shows progress
        const lowerContent = msg.content.toLowerCase();
        const hasProgressIndicators =
          lowerContent.length > 20 || // Longer responses suggest thinking
          lowerContent.includes('think') ||
          lowerContent.includes('understand') ||
          lowerContent.includes('try') ||
          lowerContent.includes('step') ||
          lowerContent.includes('?') || // Questions show engagement
          lowerContent.includes('how') ||
          lowerContent.includes('why');

        if (hasProgressIndicators) {
          progressMade = true;
          break;
        } else {
          // No progress indicators - increment stuck turns
          stuckTurns++;
        }
      } else if (msg.role === 'assistant') {
        // Check if assistant already escalated help
        const lowerContent = msg.content.toLowerCase();
        const isEscalated =
          lowerContent.includes('hint') ||
          lowerContent.includes('concrete') ||
          lowerContent.includes('specific') ||
          lowerContent.includes('consider') ||
          lowerContent.includes('remember');

        if (isEscalated) {
          // Already escalated - check if we need further escalation
          // For now, we only have two levels: normal and escalated
          // Can be extended in the future
        }
      }
    }

    // Determine help level
    const shouldEscalate = stuckTurns >= config.stuckThreshold && !progressMade;
    const helpLevel: 'normal' | 'escalated' = shouldEscalate
      ? 'escalated'
      : 'normal';

    console.log('[Help Escalation Service] Progress tracked', {
      sessionId,
      stuckTurns,
      helpLevel,
      shouldEscalate,
      progressMade,
      messageCount: messages.length,
    });

    return {
      stuckTurns,
      helpLevel,
      shouldEscalate,
      progressMade,
    };
  } catch (error) {
    console.error('[Help Escalation Service] Error tracking progress', {
      sessionId,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Default to normal help level on error
    return {
      stuckTurns: 0,
      helpLevel: 'normal',
      shouldEscalate: false,
      progressMade: false,
    };
  }
};

/**
 * Reset progress tracking for a session
 *
 * @param sessionId - Session identifier
 */
export const resetProgress = async (sessionId: string): Promise<void> => {
  // Progress is tracked in real-time from context
  // Resetting is handled by clearing context when a new problem is set
  console.log('[Help Escalation Service] Progress reset', { sessionId });
};

/**
 * Get escalation prompt adjustment
 *
 * @param helpLevel - Current help level
 * @returns Prompt adjustment text for LLM
 */
export const getEscalationPrompt = (
  helpLevel: 'normal' | 'escalated'
): string => {
  if (helpLevel === 'escalated') {
    return `The student has been stuck for multiple turns. Provide more concrete hints and specific guidance, but STILL ask questions - never give direct answers. Break down the problem into smaller, more manageable steps.`;
  }
  return '';
};
