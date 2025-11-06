/**
 * Visual Feedback Utilities
 *
 * Provides utilities for progress tracking and encouragement message generation
 */

export type ProgressLevel =
  | 'start'
  | 'early'
  | 'middle'
  | 'late'
  | 'near-completion';

export type EncouragementType =
  | 'effort'
  | 'progress'
  | 'milestone'
  | 'celebration';

export interface ProgressData {
  attempts: number;
  responses: number;
  hasProgress: boolean;
  lastProgressTimestamp?: Date;
}

/**
 * Determines progress level based on attempts and responses
 */
export function getProgressLevel(data: ProgressData): ProgressLevel {
  const totalInteractions = data.attempts + data.responses;

  if (totalInteractions === 0) {
    return 'start';
  } else if (totalInteractions <= 2) {
    return 'early';
  } else if (totalInteractions <= 5) {
    return 'middle';
  } else if (totalInteractions <= 8) {
    return 'late';
  } else {
    return 'near-completion';
  }
}

/**
 * Calculates progress percentage (0-100)
 */
export function calculateProgressPercentage(data: ProgressData): number {
  // Simple heuristic: progress based on interactions
  // This is a simplified version - could be enhanced with actual problem-solving steps
  const totalInteractions = data.attempts + data.responses;
  const maxInteractions = 10; // Assumed maximum interactions for a problem

  return Math.min(100, Math.round((totalInteractions / maxInteractions) * 100));
}

/**
 * Determines encouragement message type based on context
 */
export function getEncouragementType(data: ProgressData): EncouragementType {
  if (data.hasProgress) {
    if (data.attempts % 5 === 0) {
      return 'milestone';
    }
    return 'progress';
  }

  if (data.attempts > 0) {
    return 'effort';
  }

  return 'progress';
}

/**
 * Generates age-appropriate encouragement messages
 */
const ENCOURAGEMENT_MESSAGES: Record<EncouragementType, string[]> = {
  effort: [
    'Great job trying! 💪',
    "Keep going! You're doing great! 🌟",
    'Nice effort! Keep working at it! ✨',
    "You're making progress! Keep it up! 🎯",
  ],
  progress: [
    'Good thinking! 🎉',
    "You're on the right track! 👍",
    'Nice work! Keep going! 🚀',
    "Great job! You're learning! 📚",
  ],
  milestone: [
    'Excellent progress! 🎊',
    "Wow! You're doing amazing! 🌟",
    "Keep it up! You're learning so much! 🎓",
    "Fantastic work! You're really getting it! 🏆",
  ],
  celebration: [
    'Amazing job! 🎉🎊',
    'You did it! Congratulations! 🏆',
    'Excellent work! You solved it! 🌟',
    "Outstanding! You're a math star! ⭐",
  ],
};

export function generateEncouragementMessage(
  type: EncouragementType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _progressLevel?: ProgressLevel
): string {
  const messages = ENCOURAGEMENT_MESSAGES[type];
  if (!messages || messages.length === 0) {
    return 'Keep going!';
  }

  // Randomly select a message from the available messages
  // Note: progressLevel parameter is reserved for future use (e.g., different messages based on progress level)
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * Detects if progress has been made
 */
export function hasMadeProgress(
  currentData: ProgressData,
  previousData?: ProgressData
): boolean {
  if (!previousData) {
    return currentData.hasProgress;
  }

  // Progress is made if:
  // 1. Has progress flag is true
  // 2. More responses than before
  // 3. More attempts than before
  return (
    currentData.hasProgress ||
    currentData.responses > previousData.responses ||
    currentData.attempts > previousData.attempts
  );
}

/**
 * Detects milestones based on progress data
 */
export function detectMilestone(data: ProgressData): boolean {
  // Milestones at: 1, 3, 5, 7, 10 interactions
  const totalInteractions = data.attempts + data.responses;
  const milestones = [1, 3, 5, 7, 10];

  return milestones.includes(totalInteractions);
}
