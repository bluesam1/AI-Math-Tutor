import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  ProgressData,
  ProgressLevel,
  EncouragementType,
} from '../utils/visualFeedback';
import {
  getProgressLevel,
  calculateProgressPercentage,
  getEncouragementType,
  hasMadeProgress,
  detectMilestone,
} from '../utils/visualFeedback';

export interface UseProgressTrackingReturn {
  progressData: ProgressData;
  progressLevel: ProgressLevel;
  progressPercentage: number;
  encouragementType: EncouragementType;
  hasMadeProgressSinceLastCheck: boolean;
  isMilestone: boolean;
  recordAttempt: () => void;
  recordResponse: () => void;
  markProgress: () => void;
  reset: () => void;
}

/**
 * Custom hook for tracking problem-solving progress
 */
export function useProgressTracking(): UseProgressTrackingReturn {
  const [progressData, setProgressData] = useState<ProgressData>({
    attempts: 0,
    responses: 0,
    hasProgress: false,
  });

  const [previousData, setPreviousData] = useState<ProgressData | undefined>();

  // Use ref to store current progressData for reset function to avoid dependency issues
  const progressDataRef = useRef(progressData);
  useEffect(() => {
    progressDataRef.current = progressData;
  }, [progressData]);

  const progressLevel = getProgressLevel(progressData);
  const progressPercentage = calculateProgressPercentage(progressData);
  const encouragementType = getEncouragementType(progressData);
  const hasMadeProgressSinceLastCheck = hasMadeProgress(
    progressData,
    previousData
  );
  const isMilestone = detectMilestone(progressData);

  const recordAttempt = useCallback(() => {
    setProgressData(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));
  }, []);

  const recordResponse = useCallback(() => {
    setProgressData(prev => ({
      ...prev,
      responses: prev.responses + 1,
    }));
  }, []);

  const markProgress = useCallback(() => {
    setProgressData(prev => ({
      ...prev,
      hasProgress: true,
      lastProgressTimestamp: new Date(),
    }));
  }, []);

  const reset = useCallback(() => {
    // Save current progressData to previousData before resetting
    setPreviousData(progressDataRef.current);
    setProgressData({
      attempts: 0,
      responses: 0,
      hasProgress: false,
    });
  }, []);

  // Update previous data when progress data changes significantly
  useEffect(() => {
    if (hasMadeProgressSinceLastCheck) {
      setPreviousData({ ...progressData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData.attempts, progressData.responses, progressData.hasProgress]);

  return {
    progressData,
    progressLevel,
    progressPercentage,
    encouragementType,
    hasMadeProgressSinceLastCheck,
    isMilestone,
    recordAttempt,
    recordResponse,
    markProgress,
    reset,
  };
}
