/**
 * Problem type definitions for Story 1.4: Text Input for Math Problems
 */

export interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  disabled?: boolean;
}

export interface ProblemInputState {
  problemText: string;
  error: string | null;
  isSubmitting: boolean;
}

