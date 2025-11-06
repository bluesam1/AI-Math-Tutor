import { useState, useEffect } from 'react';

export type Orientation = 'portrait' | 'landscape';

export interface UseOrientationReturn {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
}

/**
 * Custom hook for detecting device orientation
 * Useful for responsive design adjustments
 */
export function useOrientation(): UseOrientationReturn {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === 'undefined') {
      return 'portrait';
    }
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}

