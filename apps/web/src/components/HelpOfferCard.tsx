import React, { useEffect, useRef, useState } from 'react';

export interface HelpOfferCardProps {
  /**
   * Message to display in the help offer card
   */
  message?: string;
  /**
   * Callback when user clicks "Yes, please!"
   */
  onAccept?: () => void;
  /**
   * Callback when user clicks "Not now" or dismisses
   */
  onDismiss?: () => void;
  /**
   * Whether the card is visible
   */
  visible?: boolean;
  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * Help Offer Card Component
 *
 * Displays a subtle, dismissible help offer card with age-appropriate design.
 * Appears after follow-up messages to offer additional step-by-step guidance.
 */
const HelpOfferCard: React.FC<HelpOfferCardProps> = ({
  message = 'Need help breaking this down? I can guide you step-by-step!',
  onAccept,
  onDismiss,
  visible = true,
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      // Trigger fade-in animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300); // Animation duration
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2 transition-all duration-300 ${
        isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } ${className}`}
      role="region"
      aria-label="Help offer"
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        aria-label="Dismiss help offer"
      >
        <svg
          className="w-5 h-5 text-blue-600"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Help offer content */}
      <div className="pr-8">
        {/* Icon and message */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-6 h-6 text-blue-600"
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p className="text-sm text-blue-900 font-medium flex-1">{message}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors text-sm"
            aria-label="Accept help offer"
          >
            Yes, please!
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors text-sm"
            aria-label="Dismiss help offer"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpOfferCard;
