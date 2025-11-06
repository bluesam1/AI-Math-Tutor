/**
 * Vision API Service
 *
 * Handles integration with OpenAI Vision API for extracting text from images
 */

import OpenAI from 'openai';
import { env } from '../config/env';

/**
 * Initialize OpenAI client
 * API key is loaded from environment variables
 */
const getOpenAIClient = (): OpenAI => {
  if (!env.openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
};

/**
 * Convert image buffer to base64 string
 */
const imageBufferToBase64 = (buffer: Buffer, mimeType: string): string => {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

/**
 * Extract text from image using OpenAI Vision API
 *
 * @param imageBuffer - Image file buffer
 * @param mimeType - Image MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns Extracted problem text
 */
export const extractTextFromImage = async (
  imageBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  const client = getOpenAIClient();

  // Convert image buffer to base64
  const base64Image = imageBufferToBase64(imageBuffer, mimeType);

  try {
    // Call OpenAI Vision API with structured output
    const response = await client.chat.completions.create({
      model: 'gpt-4o', // Use gpt-4o for vision (or gpt-4-vision-preview if unavailable)
      messages: [
        {
          role: 'system',
          content:
            'You are a math problem extraction assistant. Extract math problems from images and return them in a simple, clean format.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the math problem from this image. Return ONLY the mathematical expression or equation, without any explanations, solutions, or extra text. Format the math using simple LaTeX commands (like \\frac, \\sqrt, etc.) but DO NOT include any delimiters like \\(, \\), \\[, or \\]. Just return the raw math expression.',
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Extract text from response
    const extractedText = response.choices[0]?.message?.content?.trim();

    if (!extractedText) {
      throw new Error('No text was extracted from the image');
    }

    console.log('[Vision API] Raw extracted text:', extractedText);
    console.log(
      '[Vision API] Text starts with:',
      extractedText.substring(0, 10)
    );
    console.log(
      '[Vision API] Text ends with:',
      extractedText.substring(extractedText.length - 10)
    );

    // Aggressively remove ALL types of math delimiters
    // This handles: \( \), \[ \], $, $$, and any combination
    let cleaned = extractedText;

    // Remove LaTeX display math delimiters: \[ and \]
    cleaned = cleaned.replace(/\\\[/g, '').replace(/\\\]/g, '');

    // Remove LaTeX inline math delimiters: \( and \)
    cleaned = cleaned.replace(/\\\(/g, '').replace(/\\\)/g, '');

    // Remove KaTeX block delimiters: $$
    cleaned = cleaned.replace(/\$\$/g, '');

    // Remove KaTeX inline delimiters: $
    cleaned = cleaned.replace(/\$/g, '');

    // Clean up any extra whitespace
    cleaned = cleaned.trim();

    console.log('[Vision API] After cleanup:', cleaned);

    // Wrap in KaTeX inline delimiters (single $)
    // Most image-based problems are equations that should be displayed inline
    const normalizedText = `$${cleaned}$`;

    console.log('[Vision API] Final normalized text:', normalizedText);

    return normalizedText;
  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      // Handle rate limit errors
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      // Handle authentication errors
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }

      // Handle other API errors
      throw new Error(
        `Vision API error: ${error.message || 'Unknown error occurred'}`
      );
    }

    // Handle network errors and other errors
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }

    throw new Error('An unexpected error occurred while processing the image');
  }
};

/**
 * Validate that extracted text contains mathematical content
 *
 * @param text - Extracted text to validate
 * @returns true if text contains mathematical content
 */
export const validateMathContent = (text: string): boolean => {
  // Check if text is not empty
  if (!text || text.trim().length === 0) {
    return false;
  }

  // Check for math-related keywords or notation
  const mathKeywords = [
    'solve',
    'calculate',
    'find',
    'equation',
    'expression',
    'fraction',
    'decimal',
    'percent',
    'angle',
    'area',
    'perimeter',
    'volume',
    'plus',
    'minus',
    'times',
    'divided',
    'equals',
    'sum',
    'difference',
    'product',
    'quotient',
  ];

  const mathSymbols = [
    '+',
    '-',
    '*',
    '/',
    '=',
    '×',
    '÷',
    '±',
    '√',
    '^',
    '%',
    '°',
    'π',
    'x',
    'y',
    'z',
  ];

  const lowerText = text.toLowerCase();

  // Check for keywords
  const hasKeyword = mathKeywords.some(keyword => lowerText.includes(keyword));

  // Check for symbols
  const hasSymbol = mathSymbols.some(symbol => text.includes(symbol));

  // Check for numbers (common in math problems)
  const hasNumber = /\d/.test(text);

  // Text is valid if it has at least one keyword or symbol, and contains numbers
  return (hasKeyword || hasSymbol) && hasNumber;
};
