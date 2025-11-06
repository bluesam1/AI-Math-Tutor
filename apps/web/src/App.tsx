import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Typing state tracking
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [isAnswerTyping, setIsAnswerTyping] = useState(false);
  const isAnyTyping = isChatTyping || isAnswerTyping;

  // Track pending automatic messages to cancel them when typing starts
  const pendingFollowUpRef = useRef<AbortController | null>(null);

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
        // Always use original text - the LLM's cleanedProblemText often removes spaces
        // which breaks plain text problems like word problems
        setProblem(submittedProblem);
        setProblemType(validationResult.problemType);
        setValidationError(null);
        // Clear messages when a new problem is set
        setMessages([]);
        setSessionId(undefined);
        setChatError(null);
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
    console.log('[App] handleImageSubmit called', {
      fileName: file.name,
      fileSize: file.size,
    });
    setIsUploading(true);
    setIsProcessing(true);
    setIsValidating(true);
    setValidationError(null);

    try {
      // Parse image using Vision API
      console.log('[App] Calling parseImage API...');
      setIsUploading(false); // Upload complete, now processing
      const parseResult = await apiClient.parseImage(file);
      console.log('[App] parseImage result:', parseResult);

      // Check if parseResult has success property (it might be an error response)
      if (!parseResult || typeof parseResult !== 'object') {
        console.error('[App] Invalid parseResult:', parseResult);
        setValidationError('Invalid response from server. Please try again.');
        setProblem(undefined);
        setProblemType(undefined);
        return;
      }

      if (parseResult.success) {
        // Image parsed successfully - now validate the extracted text
        setIsProcessing(false); // Processing complete, now validating
        const extractedText = parseResult.problemText;
        console.log('[App] Extracted text:', extractedText);

        // Validate the extracted problem text
        console.log('[App] Calling validateProblem API...');
        const validationResult = await apiClient.validateProblem(extractedText);
        console.log('[App] validateProblem result:', validationResult);

        if (validationResult.success && validationResult.valid) {
          // Problem is valid - set problem and type
          // ALWAYS use the original extractedText from Vision API
          // The LLM sometimes strips backslashes from LaTeX commands
          console.log('[App] Problem validated successfully:', {
            problemType: validationResult.problemType,
            usingOriginalText: true,
            originalText: extractedText.substring(0, 100),
          });
          setProblem(extractedText);
          setProblemType(validationResult.problemType);
          setValidationError(null);
          // Clear messages when a new problem is set
          setMessages([]);
          setSessionId(undefined);
          setChatError(null);
        } else if (validationResult.success && !validationResult.valid) {
          // Problem is invalid - show error
          console.warn(
            '[App] Problem validation failed:',
            validationResult.error
          );
          setValidationError(validationResult.error);
          setProblem(undefined);
          setProblemType(undefined);
        } else {
          // Validation API error occurred
          console.error('[App] Validation API error:', validationResult);
          setValidationError(
            validationResult.message ||
              'Failed to validate problem. Please try again.'
          );
          setProblem(undefined);
          setProblemType(undefined);
        }
      } else {
        // Image parsing failed
        console.error('[App] Image parsing failed:', parseResult);
        setValidationError(
          parseResult.message || 'Failed to parse image. Please try again.'
        );
        setProblem(undefined);
        setProblemType(undefined);
      }
    } catch (error) {
      // Network or other error
      console.error('[App] Error in handleImageSubmit:', error);
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
      console.log('[App] handleImageSubmit complete');
    }
  };

  const handleLoadTestProblem = (testProblem: string) => {
    // Load test problem into the problem input
    handleProblemSubmit(testProblem);
  };

  const handleAddTutorMessage = (message: string) => {
    const tutorMessage: Message = {
      id: `tutor_${Date.now()}`,
      role: 'tutor',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tutorMessage]);
  };

  const handleAddStudentMessage = (
    message: string,
    isAnswer: boolean = false
  ) => {
    const studentMessage: Message = {
      id: `student_${Date.now()}`,
      role: 'student',
      content: message,
      timestamp: new Date(),
      isAnswer,
    };
    setMessages(prev => [...prev, studentMessage]);
  };

  // Typing change handlers - memoized to prevent unnecessary re-renders
  const handleChatTypingChange = useCallback((isTyping: boolean) => {
    setIsChatTyping(isTyping);
  }, []);

  const handleAnswerTypingChange = useCallback((isTyping: boolean) => {
    setIsAnswerTyping(isTyping);
  }, []);

  // Cancel automatic messages when typing starts
  useEffect(() => {
    if (isAnyTyping) {
      console.log(
        '[App] Student is typing - canceling any pending automatic messages'
      );
      // Cancel any pending follow-up generation
      if (pendingFollowUpRef.current) {
        pendingFollowUpRef.current.abort();
        pendingFollowUpRef.current = null;
      }
      // Clear loading state if it was set for automatic messages
      // (But don't clear it if it's for a real message being sent)
      // We'll need to be more careful about this
    }
  }, [isAnyTyping]);

  const handleAnswerChecked = async (result: {
    isCorrect: boolean;
    isPartial?: boolean;
    feedback?: string;
    studentAnswer?: string;
  }) => {
    console.log('[App] Answer checked:', result);

    if (!result.studentAnswer || !problem || !problemType) {
      return;
    }

    // Note: We don't check isAnyTyping here because this is a response to a submitted answer,
    // not an automatic greeting. The student has explicitly submitted their answer, so we should respond.
    // The typing check is only used to prevent automatic greetings/prompts.

    if (result.isCorrect) {
      // For correct answers: generate celebration message
      console.log('[App] Generating success message for correct answer', {
        studentAnswer: result.studentAnswer,
      });

      // Set loading state while tutor generates response
      setIsChatLoading(true);

      // Create abort controller for this follow-up
      const abortController = new AbortController();
      pendingFollowUpRef.current = abortController;

      try {
        // Convert messages to conversation history format
        const conversationHistory = messages.map(msg => ({
          role: (msg.role === 'student' ? 'user' : 'assistant') as
            | 'user'
            | 'assistant',
          content: msg.content,
        }));

        // Generate follow-up message for correct answer
        const followUpResult = await apiClient.generateFollowUp(
          problem,
          problemType,
          {
            result: 'correct',
            studentAnswer: result.studentAnswer,
          },
          conversationHistory
        );

        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('[App] Follow-up generation was canceled');
          return;
        }

        if (followUpResult.success && followUpResult.followUpMessage) {
          console.log('[App] Success message generated', {
            messageLength: followUpResult.followUpMessage.length,
          });

          // Note: We don't check isAnyTyping here because this is a response to a submitted answer,
          // not an automatic greeting. The student has explicitly submitted their answer and is waiting for feedback.

          // Add tutor's success response to chat
          handleAddTutorMessage(followUpResult.followUpMessage);
        } else {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            return;
          }
          // Fallback: Add a generic success message
          handleAddTutorMessage(
            "That's correct! 🎉 Great job! Can you walk me through how you got that answer?"
          );
        }
      } catch (error) {
        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('[App] Follow-up generation was canceled');
          return;
        }
        console.error('[App] Error generating tutor response', error);
        // Fallback: Add a generic success message
        handleAddTutorMessage(
          "That's correct! 🎉 Great job! Can you walk me through how you got that answer?"
        );
      } finally {
        // Clear abort controller
        if (pendingFollowUpRef.current === abortController) {
          pendingFollowUpRef.current = null;
        }
        // Clear loading state
        setIsChatLoading(false);
      }
    } else if (!result.isPartial) {
      // For incorrect answers: send enriched context to LLM, but keep chat message simple
      console.log('[App] Sending incorrect answer as message to LLM', {
        studentAnswer: result.studentAnswer,
      });

      setIsChatLoading(true);
      setChatError(null);

      // Create abort controller for this follow-up
      const abortController = new AbortController();
      pendingFollowUpRef.current = abortController;

      try {
        // Convert messages to conversation history format
        // The simple answer is already in messages state (added via onAddStudentMessage)
        const conversationHistory = messages.map(msg => ({
          role: (msg.role === 'student' ? 'user' : 'assistant') as
            | 'user'
            | 'assistant',
          content: msg.content,
        }));

        // Create enriched message for LLM context (but don't add this to chat)
        // The chat already has the simple answer (e.g., "3"), but we'll send enriched context to help LLM respond
        // Format it to sound like a student who tried their best but got it wrong and needs encouragement
        // This should prompt responses that start with "Nice try!" or "Thanks for trying!" rather than "Of course!"
        const enrichedMessageForLLM = `I worked on this problem and got ${result.studentAnswer} as my answer, but I'm pretty sure it's not right. I'm feeling a bit stuck and could use some help figuring out where I went wrong.`;

        // Send enriched message to API for better context
        // The conversationHistory has the simple answer, but we send enriched message for better LLM response
        const response = await apiClient.sendChatMessage(
          enrichedMessageForLLM,
          problem,
          problemType,
          conversationHistory,
          sessionId
        );

        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('[App] Follow-up generation was canceled');
          return;
        }

        if (response.success) {
          // Note: We don't check isAnyTyping here because this is a response to a submitted answer,
          // not an automatic greeting. The student has explicitly submitted their answer and is waiting for feedback.

          // Add tutor's Socratic response to chat
          const assistantMessage: Message = {
            id: `assistant_${Date.now()}`,
            role: 'tutor',
            content: response.response,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);

          // Update session ID if provided
          if (response.sessionId) {
            setSessionId(response.sessionId);
          }
        } else {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            return;
          }
          // API error - add fallback message
          handleAddTutorMessage(
            "Thanks for trying! Let's work through this together. What information do we have in the problem?"
          );
        }
      } catch (error) {
        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('[App] Follow-up generation was canceled');
          return;
        }
        console.error('[App] Error sending incorrect answer to LLM', error);
        // Fallback: Add a generic encouraging message
        handleAddTutorMessage(
          "Thanks for trying! Let's work through this together. What information do we have in the problem?"
        );
      } finally {
        // Clear abort controller
        if (pendingFollowUpRef.current === abortController) {
          pendingFollowUpRef.current = null;
        }
        setIsChatLoading(false);
      }
    }
    // For partial answers, do nothing - let them try again
  };

  const handleClearProblem = () => {
    setProblem(undefined);
    setProblemType(undefined);
    setMessages([]);
    setSessionId(undefined);
    setChatError(null);
    setValidationError(null);
    // Clear any pending follow-ups
    if (pendingFollowUpRef.current) {
      pendingFollowUpRef.current.abort();
      pendingFollowUpRef.current = null;
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!problem || !problemType) {
      setChatError('Please set a problem before sending messages');
      return;
    }

    setIsChatLoading(true);
    setChatError(null);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'student',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Convert messages to conversation history format
      const conversationHistory = messages.map(msg => ({
        role: (msg.role === 'student' ? 'user' : 'assistant') as
          | 'user'
          | 'assistant',
        content: msg.content,
      }));

      // Send message to API
      const response = await apiClient.sendChatMessage(
        message,
        problem,
        problemType,
        conversationHistory,
        sessionId
      );

      if (response.success) {
        console.log('[App] *** RECEIVED CHAT RESPONSE FROM API ***');
        console.log('[App] Response:', JSON.stringify(response.response));
        console.log('[App] Response length:', response.response.length);
        console.log(
          '[App] First 150 chars:',
          response.response.substring(0, 150)
        );
        console.log('[App] Contains $:', response.response.includes('$'));
        console.log('[App] Contains \\(:', response.response.includes('\\('));
        console.log('[App] Contains \\):', response.response.includes('\\)'));

        // Add assistant response to UI
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'tutor',
          content: response.response,
          timestamp: new Date(),
        };
        console.log(
          '[App] Created assistant message:',
          JSON.stringify(assistantMessage)
        );
        setMessages(prev => [...prev, assistantMessage]);

        // Update session ID if provided
        if (response.sessionId) {
          setSessionId(response.sessionId);
        }
      } else {
        // API error
        setChatError(
          response.message || 'Failed to send message. Please try again.'
        );
        // Remove user message on error
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      }
    } catch (error) {
      // Network or other error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please check your connection and try again.';
      setChatError(errorMessage);
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <Layout
        problem={problem}
        problemType={problemType}
        messages={messages}
        emptyState={messages.length === 0 && !problem}
        onProblemSubmit={handleProblemSubmit}
        onImageSubmit={handleImageSubmit}
        onClearProblem={handleClearProblem}
        onSendMessage={handleSendMessage}
        onAddTutorMessage={handleAddTutorMessage}
        sessionId={sessionId}
        chatError={chatError}
        isChatLoading={isChatLoading}
        validationError={validationError}
        isValidating={isValidating}
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        isProcessing={isProcessing}
        onAnswerChecked={handleAnswerChecked}
        onAddStudentMessage={handleAddStudentMessage}
        onChatTypingChange={handleChatTypingChange}
        onAnswerTypingChange={handleAnswerTypingChange}
        isAnswerTyping={isAnswerTyping}
      />
      <DeveloperTestingInterface onLoadProblem={handleLoadTestProblem} />
    </>
  );
};

export default App;
