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
    // Call OpenAI Vision API
    const response = await client.chat.completions.create({
      model: 'gpt-4o', // Use gpt-4o for vision (or gpt-4-vision-preview if unavailable)
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the math problem text from this image. Return only the problem statement, without any explanations or solutions.',
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

    return extractedText;
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
