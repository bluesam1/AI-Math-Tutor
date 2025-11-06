import React, { useEffect, useState } from 'react';
import type { EncouragementType } from '../utils/visualFeedback';

export interface EncouragementMessageProps {
  /**
   * Type of encouragement message
   */
  type: EncouragementType;

  /**
   * Custom message to display
   */
  message?: string;

  /**
   * Whether to show animation
   */
  animate?: boolean;

  /**
   * Callback when animation completes
   */
  onAnimationComplete?: () => void;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * EncouragementMessage Component
 *
 * Displays age-appropriate encouragement messages for students
 * Designed for 6th grade students (ages 11-12)
 */
const EncouragementMessage: React.FC<EncouragementMessageProps> = ({
  type,
  message,
  animate = true,
  onAnimationComplete,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animate) {
      // Trigger fade-in animation
      setIsVisible(true);

      // Call completion callback after animation
      if (onAnimationComplete) {
        const timer = setTimeout(() => {
          onAnimationComplete?.();
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(true);
    }
  }, [animate, onAnimationComplete]);

  const getMessageColor = (): string => {
    switch (type) {
      case 'celebration':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'milestone':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'progress':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'effort':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const displayMessage = message || 'Keep going!';

  return (
    <div
      className={`rounded-lg p-3 border transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${getMessageColor()} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Encouragement: ${displayMessage}`}
    >
      <p className="text-sm font-medium leading-relaxed">{displayMessage}</p>
    </div>
  );
};

export default EncouragementMessage;

