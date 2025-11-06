import React, { useEffect, useState } from 'react';

export interface CelebrationMessageProps {
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
 * CelebrationMessage Component
 *
 * Displays age-appropriate celebration messages when students solve problems correctly.
 * Designed for 6th grade students (ages 11-12) with friendly colors, emojis, and animations.
 */
const CelebrationMessage: React.FC<CelebrationMessageProps> = ({
  message,
  animate = true,
  onAnimationComplete,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (animate) {
      // Trigger fade-in animation
      setIsVisible(true);
      // Trigger confetti animation after a short delay
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 200);
      return () => clearTimeout(confettiTimer);
    } else {
      setIsVisible(true);
    }
  }, [animate]);

  // Auto-dismiss celebration after 5 seconds
  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  // Default celebration messages (age-appropriate for 6th grade)
  const defaultMessages = [
    "🎉 That's correct! Great job!",
    '✨ You solved it! Excellent work!',
    '🌟 Perfect answer! Keep it up!',
    '🏆 Amazing! You got it right!',
    "🎊 Well done! You're learning so much!",
  ];

  const displayMessage =
    message ||
    defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  return (
    <div
      className={`relative rounded-lg p-4 border-2 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-95'
      } bg-accent text-accent-foreground border-accent shadow-accent ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Celebration: ${displayMessage}`}
    >
      {/* Confetti animation effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          {[...Array(12)].map((_, i) => {
            const colors = [
              'hsl(var(--color-primary-bright))',
              'hsl(var(--color-primary-light))',
              'hsl(var(--color-accent-light))',
              'hsl(var(--color-accent))',
            ];
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${(i * 8.33) % 100}%`,
                  top: '-10px',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s',
                  backgroundColor: colors[i % 4],
                }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      )}

      {/* Message content */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          🎉
        </span>
        <p className="text-base font-semibold leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default CelebrationMessage;
