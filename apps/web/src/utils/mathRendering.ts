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
 * In a math tutoring context, all dollar-wrapped content is treated as math
 */
export function hasMathSyntax(text: string): boolean {
  // Check for block math: $$...$$
  const blockMathRegex = /\$\$([^$]+)\$\$/;
  if (blockMathRegex.test(text)) {
    return true;
  }

  // Check for inline math: $...$ (but not $$)
  // In a math tutoring context, all dollar-wrapped content is math
  const inlineMathRegex = /(?<!\$)\$(?!\$)([^$]+)\$(?!\$)/g;
  if (inlineMathRegex.test(text)) {
    return true;
  }

  return false;
}

/**
 * Finds all math expressions in text
 * Supports KaTeX format: $...$ (inline), $$...$$ (block)
 * In a math tutoring context, all dollar-wrapped content is treated as math
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
  // In a math tutoring context, all dollar-wrapped content should be treated as math
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

      // In a math tutoring context, any content wrapped in dollar signs
      // should be treated as a math expression, including simple numbers
      // This ensures "$4$" and "$3$" are rendered as math, not displayed with dollar signs
      if (content) {
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
