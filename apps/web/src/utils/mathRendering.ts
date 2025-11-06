/**
 * Math Rendering Utilities
 *
 * Provides utilities for detecting and parsing LaTeX/KaTeX syntax in text
 * Supports both inline ($...$) and block ($$...$$) math expressions
 */

export interface MathExpression {
  type: 'inline' | 'block';
  content: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Detects if text contains KaTeX syntax
 * Supports KaTeX format: $...$ (inline), $$...$$ (block)
 * Distinguishes between math expressions and currency
 */
export function hasMathSyntax(text: string): boolean {
  // Check for block math: $$...$$
  const blockMathRegex = /\$\$([^$]+)\$\$/;
  if (blockMathRegex.test(text)) {
    return true;
  }
  
  // Check for inline math: $...$ (but not $$)
  // Only count as math if it looks like math (not currency)
  const inlineMathRegex = /(?<!\$)\$(?!\$)([^$]+)\$(?!\$)/g;
  let match;
  while ((match = inlineMathRegex.exec(text)) !== null) {
    if (looksLikeMath(match[1].trim())) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if content looks like math (not just currency)
 * Currency patterns: $50, $18.75 (just a number after $)
 * Math patterns: contains operators, variables, functions, LaTeX commands, etc.
 */
function looksLikeMath(content: string): boolean {
  const trimmed = content.trim();
  
  // If it's empty or whitespace, it's not math
  if (!trimmed) {
    return false;
  }
  
  // If it's just a number (with optional decimal), it's probably currency, not math
  // Pattern: optional negative sign, digits, optional decimal point and digits
  // This catches: 4, 3, 50, 18.75, -5, etc.
  const currencyPattern = /^-?\d+\.?\d*$/;
  if (currencyPattern.test(trimmed)) {
    return false;
  }
  
  // If it's just a single digit or simple number, it's likely currency
  // This is a more strict check for very simple cases like "4" or "3"
  if (/^-?\d+$/.test(trimmed) && trimmed.length <= 3) {
    return false;
  }
  
  // Check for math indicators:
  // - Math operators: +, -, *, /, =, <, >, ≤, ≥, ≠, etc.
  // - Variables: x, y, z, a, b, c, etc. (single letters)
  // - LaTeX commands: \frac, \sqrt, \sin, etc.
  // - Functions: sin, cos, log, etc.
  // - Parentheses (often used in math expressions)
  // - Greek letters and other math symbols
  const mathIndicators = /[+\-*/=<>≤≥≠±×÷]|\\[a-zA-Z]+|\b(sin|cos|tan|log|ln|exp|sqrt|frac|sum|int|lim)\b|\(|\)|[xyzabcαβθπ]/;
  
  return mathIndicators.test(trimmed);
}

/**
 * Finds all math expressions in text
 * Supports KaTeX format: $...$ (inline), $$...$$ (block)
 * Distinguishes between math expressions and currency ($50, $18.75)
 */
export function findMathExpressions(text: string): MathExpression[] {
  const expressions: MathExpression[] = [];

  // Find KaTeX block math expressions ($$...$$) first
  const blockMathRegex = /\$\$([^$]+)\$\$/g;
  let blockMatch;
  while ((blockMatch = blockMathRegex.exec(text)) !== null) {
    expressions.push({
      type: 'block',
      content: blockMatch[1].trim(),
      startIndex: blockMatch.index,
      endIndex: blockMatch.index + blockMatch[0].length,
    });
  }

  // Find KaTeX inline math expressions ($...$ but not $$...$$)
  // We need to be careful not to match block math delimiters
  // Also exclude currency patterns like $4$, $3$, $50$, etc.
  const inlineMathRegex = /(?<!\$)\$(?!\$)([^$]+)\$(?!\$)/g;
  let inlineMatch: RegExpExecArray | null;
  while ((inlineMatch = inlineMathRegex.exec(text)) !== null) {
    // Check if this is part of a block math expression
    const isPartOfBlock = expressions.some(
      expr =>
        inlineMatch!.index >= expr.startIndex &&
        inlineMatch!.index < expr.endIndex
    );

    if (!isPartOfBlock) {
      const content = inlineMatch[1].trim();
      
      // Explicitly exclude currency patterns: simple numbers like 4, 3, 50, etc.
      // This is a more aggressive check to prevent currency from being treated as math
      const isSimpleNumber = /^-?\d+\.?\d*$/.test(content);
      if (isSimpleNumber) {
        // This is currency, not math - skip it
        continue;
      }
      
      // Only treat as math if it looks like math (not currency)
      if (looksLikeMath(content)) {
        expressions.push({
          type: 'inline',
          content: content,
          startIndex: inlineMatch.index,
          endIndex: inlineMatch.index + inlineMatch[0].length,
        });
      }
    }
  }

  // Sort by start index
  expressions.sort((a, b) => a.startIndex - b.startIndex);

  return expressions;
}

/**
 * Splits text into segments with math expressions
 */
export interface TextSegment {
  type: 'text' | 'math';
  content: string;
  mathType?: 'inline' | 'block';
}

export function splitTextWithMath(text: string): TextSegment[] {
  const expressions = findMathExpressions(text);
  const segments: TextSegment[] = [];

  if (expressions.length === 0) {
    return [{ type: 'text', content: text }];
  }

  let lastIndex = 0;

  for (const expr of expressions) {
    // Add text before math expression
    if (expr.startIndex > lastIndex) {
      const textContent = text.substring(lastIndex, expr.startIndex);
      if (textContent) {
        segments.push({ type: 'text', content: textContent });
      }
    }

    // Add math expression
    segments.push({
      type: 'math',
      content: expr.content,
      mathType: expr.type,
    });

    lastIndex = expr.endIndex;
  }

  // Add remaining text after last math expression
  if (lastIndex < text.length) {
    const textContent = text.substring(lastIndex);
    if (textContent) {
      segments.push({ type: 'text', content: textContent });
    }
  }

  return segments;
}

/**
 * Validates LaTeX syntax (basic validation)
 */
export function isValidLatex(latex: string): boolean {
  if (!latex || !latex.trim()) {
    return false;
  }

  // Basic validation: check for balanced braces and common LaTeX commands
  const openBraces = (latex.match(/\{/g) || []).length;
  const closeBraces = (latex.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    return false;
  }

  return true;
}
