import React from 'react';
import type { ProgressLevel } from '../utils/visualFeedback';

export interface ProgressIndicatorProps {
  /**
   * Current progress level
   */
  progressLevel: ProgressLevel;

  /**
   * Progress percentage (0-100)
   */
  progressPercentage: number;

  /**
   * Number of attempts made
   */
  attempts?: number;

  /**
   * Whether to show milestone indicators
   */
  showMilestones?: boolean;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * ProgressIndicator Component
 *
 * Displays visual progress indicator for problem-solving process
 * Age-appropriate for 6th grade students (ages 11-12)
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progressLevel,
  progressPercentage,
  attempts = 0,
  showMilestones = true,
  className = '',
}) => {
  const getProgressColor = (): string => {
    if (progressPercentage >= 80) {
      return 'bg-accent';
    } else if (progressPercentage >= 50) {
      return 'bg-primary-light';
    } else if (progressPercentage >= 25) {
      return 'bg-primary-bright';
    } else {
      return 'bg-gray-300';
    }
  };

  const getProgressLabel = (): string => {
    switch (progressLevel) {
      case 'start':
        return 'Getting started';
      case 'early':
        return 'Early progress';
      case 'middle':
        return 'Making progress';
      case 'late':
        return 'Almost there';
      case 'near-completion':
        return 'Great work!';
      default:
        return 'Working on it';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 border border-border shadow-sm ${className}`}
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${progressPercentage}% - ${getProgressLabel()}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">
          {getProgressLabel()}
        </span>
        <span className="text-sm text-text-secondary">
          {progressPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${getProgressColor()}`}
          style={{
            width: `${progressPercentage}%`,
            background:
              progressPercentage >= 50
                ? `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-accent)))`
                : undefined,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Milestone Indicators */}
      {showMilestones && attempts > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-text-secondary">
            {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
