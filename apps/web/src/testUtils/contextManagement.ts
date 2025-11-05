/**
 * Context Management Test Utilities
 * 
 * Utilities for testing context management functionality.
 * Used by the developer testing interface to validate conversation context.
 */

/**
 * Message in conversation context
 */
export interface ContextMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Context management test result
 */
export interface ContextManagementTestResult {
  messagesCount: number;
  contextRetained: boolean;
  coherence: number; // 0-1, where 1 is fully coherent
  details: {
    lastMessages: ContextMessage[];
    contextWindow: number;
    messageRetention: 'full' | 'partial' | 'none';
  };
}

/**
 * Test context management
 */
export const testContextManagement = (
  messages: ContextMessage[],
  maxContextSize: number = 10
): ContextManagementTestResult => {
  const messagesCount = messages.length;
  const contextWindow = Math.min(messagesCount, maxContextSize);
  const lastMessages = messages.slice(-contextWindow);
  
  // Check if context is retained (last messages should be present)
  const contextRetained = lastMessages.length > 0;
  
  // Simple coherence check: check if messages reference previous context
  let coherence = 0.5; // Start with neutral
  if (messages.length >= 2) {
    const lastMessage = messages[messages.length - 1];
    const previousMessage = messages[messages.length - 2];
    
    // Check if last message references previous context
    const referencesPrevious = lastMessage.content
      .toLowerCase()
      .includes(previousMessage.content.toLowerCase().substring(0, 10));
    
    if (referencesPrevious) {
      coherence += 0.3;
    }
  }
  
  // Check message retention
  let messageRetention: 'full' | 'partial' | 'none' = 'full';
  if (messagesCount > maxContextSize) {
    messageRetention = 'partial';
  } else if (messagesCount === 0) {
    messageRetention = 'none';
  }
  
  coherence = Math.max(0, Math.min(1, coherence));
  
  return {
    messagesCount,
    contextRetained,
    coherence,
    details: {
      lastMessages,
      contextWindow,
      messageRetention,
    },
  };
};

/**
 * Validate context management (pass/fail)
 */
export const validateContextManagement = (
  messages: ContextMessage[],
  maxContextSize: number = 10
): boolean => {
  const result = testContextManagement(messages, maxContextSize);
  return result.contextRetained && result.coherence >= 0.5;
};

/**
 * Context management utilities
 */
export const contextManagementUtils = {
  test: testContextManagement,
  validate: validateContextManagement,
};

export default contextManagementUtils;

