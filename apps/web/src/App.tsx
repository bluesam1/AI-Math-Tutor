import React, { useState } from 'react';
import Layout from './components/Layout';
import DeveloperTestingInterface from './components/DeveloperTestingInterface';
import type { Message } from './types';
import { apiClient } from './services/api';
import type { ProblemType } from './services/api';

const App: React.FC = () => {
  const [problem, setProblem] = useState<string | undefined>(undefined);
  const [problemType, setProblemType] = useState<ProblemType | undefined>(
    undefined
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample messages for demonstration (will be replaced in future stories)
  const sampleMessages: Message[] = [];

  const handleProblemSubmit = async (submittedProblem: string) => {
    setIsSubmitting(true);
    setIsValidating(true);
    setValidationError(null);

    try {
      // Validate problem using backend API
      const validationResult =
        await apiClient.validateProblem(submittedProblem);

      if (validationResult.success && validationResult.valid) {
        // Problem is valid - set problem and type
        const cleanedText =
          validationResult.cleanedProblemText || submittedProblem;
        setProblem(cleanedText);
        setProblemType(validationResult.problemType);
        setValidationError(null);
      } else if (validationResult.success && !validationResult.valid) {
        // Problem is invalid - show error
        setValidationError(validationResult.error);
        setProblem(undefined);
        setProblemType(undefined);
      } else {
        // API error occurred
        setValidationError(
          validationResult.message ||
            'Failed to validate problem. Please try again.'
        );
        setProblem(undefined);
        setProblemType(undefined);
      }
    } catch (error) {
      // Network or other error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to validate problem. Please check your connection and try again.';
      setValidationError(errorMessage);
      setProblem(undefined);
      setProblemType(undefined);
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  };

  const handleImageSubmit = async (file: File) => {
    setIsUploading(true);
    setIsProcessing(true);
    setIsValidating(true);
    setValidationError(null);

    try {
      // Parse image using Vision API
      setIsUploading(false); // Upload complete, now processing
      const parseResult = await apiClient.parseImage(file);

      if (parseResult.success) {
        // Image parsed successfully - now validate the extracted text
        setIsProcessing(false); // Processing complete, now validating
        const extractedText = parseResult.problemText;

        // Validate the extracted problem text
        const validationResult = await apiClient.validateProblem(extractedText);

        if (validationResult.success && validationResult.valid) {
          // Problem is valid - set problem and type
          const cleanedText =
            validationResult.cleanedProblemText || extractedText;
          setProblem(cleanedText);
          setProblemType(validationResult.problemType);
          setValidationError(null);
        } else if (validationResult.success && !validationResult.valid) {
          // Problem is invalid - show error
          setValidationError(validationResult.error);
          setProblem(undefined);
          setProblemType(undefined);
        } else {
          // Validation API error occurred
          setValidationError(
            validationResult.message ||
              'Failed to validate problem. Please try again.'
          );
          setProblem(undefined);
          setProblemType(undefined);
        }
      } else {
        // Image parsing failed
        setValidationError(
          parseResult.message || 'Failed to parse image. Please try again.'
        );
        setProblem(undefined);
        setProblemType(undefined);
      }
    } catch (error) {
      // Network or other error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to process image. Please check your connection and try again.';
      setValidationError(errorMessage);
      setProblem(undefined);
      setProblemType(undefined);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setIsValidating(false);
    }
  };

  const handleLoadTestProblem = (testProblem: string) => {
    // Load test problem into the problem input
    handleProblemSubmit(testProblem);
  };

  return (
    <>
      <Layout
        problem={problem}
        problemType={problemType}
        messages={sampleMessages}
        emptyState={true}
        onProblemSubmit={handleProblemSubmit}
        onImageSubmit={handleImageSubmit}
        validationError={validationError}
        isValidating={isValidating}
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        isProcessing={isProcessing}
      />
      <DeveloperTestingInterface onLoadProblem={handleLoadTestProblem} />
    </>
  );
};

export default App;
