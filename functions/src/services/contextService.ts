/**
 * Context Management Service
 *
 * Manages conversation context using Firestore for session storage.
 * Stores and retrieves the last 10 messages for each session.
 */

import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import type { ConversationMessage } from './llmService';

/**
 * Session context structure
 */
export interface SessionContext {
  sessionId: string;
  problem?: {
    text: string;
    type: string;
  };
  messages: ConversationMessage[];
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt?: Date;
}

/**
 * Initialize Firebase Admin if not already initialized
 */
const initializeFirebaseAdmin = (): void => {
  if (getApps().length === 0) {
    // Initialize Firebase Admin
    // In Firebase Functions, the app is automatically initialized
    // In local development, we might need to initialize manually
    try {
      // Check if we're in a Firebase Functions environment
      if (process.env.FUNCTIONS_EMULATOR || process.env.GCLOUD_PROJECT) {
        // Firebase Admin is automatically initialized in Firebase Functions
        // Just get the Firestore instance
        return;
      }

      // For local development, try to initialize with default credentials
      // This will use Application Default Credentials (ADC) or service account
      initializeApp({
        credential: cert({
          projectId:
            process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.warn('[Context Service] Firebase Admin initialization skipped', {
        error: error instanceof Error ? error.message : String(error),
        reason: 'May already be initialized or using default credentials',
      });
    }
  }
};

/**
 * Initialize Firestore client
 */
const getDb = (): FirebaseFirestore.Firestore => {
  initializeFirebaseAdmin();
  return getFirestore();
};

/**
 * Get session context from Firestore
 *
 * @param sessionId - Session identifier
 * @returns Session context or null if not found
 */
export const getContext = async (
  sessionId: string
): Promise<SessionContext | null> => {
  try {
    const db = getDb();
    const docRef = db.collection('sessions').doc(sessionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('[Context Service] Session not found', { sessionId });
      return null;
    }

    const data = doc.data();
    if (!data) {
      console.log('[Context Service] Session data is empty', { sessionId });
      return null;
    }

    // Convert Firestore timestamps to Date objects
    const context: SessionContext = {
      sessionId: data.sessionId || sessionId,
      problem: data.problem || undefined,
      messages: (data.messages || []).map(
        (msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })
      ),
      createdAt: data.createdAt?.toDate() || new Date(),
      lastActivityAt: data.lastActivityAt?.toDate() || new Date(),
      expiresAt: data.expiresAt?.toDate(),
    };

    // Check if session has expired
    if (context.expiresAt && context.expiresAt < new Date()) {
      console.log('[Context Service] Session expired', {
        sessionId,
        expiresAt: context.expiresAt,
      });
      // Delete expired session
      await docRef.delete();
      return null;
    }

    console.log('[Context Service] Session context retrieved', {
      sessionId,
      messageCount: context.messages.length,
      lastActivityAt: context.lastActivityAt,
    });

    return context;
  } catch (error) {
    console.error('[Context Service] Error retrieving context', {
      sessionId,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Return null on error (graceful degradation)
    return null;
  }
};

/**
 * Add a message to session context
 *
 * @param sessionId - Session identifier
 * @param message - Message to add
 * @returns Updated session context
 */
export const addMessage = async (
  sessionId: string,
  message: ConversationMessage
): Promise<SessionContext> => {
  try {
    const db = getDb();
    const docRef = db.collection('sessions').doc(sessionId);

    // Get existing context or create new
    const existingContext = await getContext(sessionId);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes TTL

    let messages: ConversationMessage[] = [];
    let createdAt = now;
    let problem = undefined;

    if (existingContext) {
      messages = existingContext.messages;
      createdAt = existingContext.createdAt;
      problem = existingContext.problem;
    }

    // Add new message
    messages.push(message);

    // Keep only last 10 messages
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    // Update or create session document
    await docRef.set(
      {
        sessionId,
        problem: problem || null,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        createdAt: Timestamp.fromDate(createdAt),
        lastActivityAt: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
      },
      { merge: true }
    );

    console.log('[Context Service] Message added to context', {
      sessionId,
      messageRole: message.role,
      messageLength: message.content.length,
      totalMessages: messages.length,
    });

    return {
      sessionId,
      problem,
      messages,
      createdAt,
      lastActivityAt: now,
      expiresAt,
    };
  } catch (error) {
    console.error('[Context Service] Error adding message', {
      sessionId,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Return minimal context on error (graceful degradation)
    return {
      sessionId,
      messages: [message],
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };
  }
};

/**
 * Set problem for session
 *
 * @param sessionId - Session identifier
 * @param problemText - Problem text
 * @param problemType - Problem type
 */
export const setProblem = async (
  sessionId: string,
  problemText: string,
  problemType: string
): Promise<void> => {
  try {
    const db = getDb();
    const docRef = db.collection('sessions').doc(sessionId);

    await docRef.set(
      {
        sessionId,
        problem: {
          text: problemText,
          type: problemType,
        },
        lastActivityAt: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );

    console.log('[Context Service] Problem set for session', {
      sessionId,
      problemType,
      problemLength: problemText.length,
    });
  } catch (error) {
    console.error('[Context Service] Error setting problem', {
      sessionId,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Graceful degradation - continue without setting problem
  }
};

/**
 * Clear session context
 *
 * @param sessionId - Session identifier
 */
export const clearContext = async (sessionId: string): Promise<void> => {
  try {
    const db = getDb();
    const docRef = db.collection('sessions').doc(sessionId);
    await docRef.delete();

    console.log('[Context Service] Context cleared', { sessionId });
  } catch (error) {
    console.error('[Context Service] Error clearing context', {
      sessionId,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    // Graceful degradation - continue even if clearing fails
  }
};

/**
 * Get conversation history for LLM prompt
 *
 * @param sessionId - Session identifier
 * @returns Conversation messages formatted for LLM
 */
export const getConversationHistory = async (
  sessionId: string
): Promise<ConversationMessage[]> => {
  const context = await getContext(sessionId);
  return context?.messages || [];
};
