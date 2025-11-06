import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { splitTextWithMath, isValidLatex } from '../utils/mathRendering';

export interface MathRendererProps {
  /**
   * Text content that may contain KaTeX syntax
   * Inline math: $...$
   * Block math: $$...$$
   */
  content: string;

  /**
   * CSS class name for the container
   */
  className?: string;

  /**
   * Whether to render math expressions (default: true)
   */
  renderMath?: boolean;
}

/**
 * MathRenderer Component
 *
 * Renders text with KaTeX math expressions
 * Supports both inline ($...$) and block ($$...$$) math expressions
 */
const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  renderMath = true,
}) => {
  console.log('[MathRenderer] Rendering content', {
    contentLength: content?.length || 0,
    content: JSON.stringify(content),
    first150Chars: content?.substring(0, 150) || '',
    renderMath,
    hasContent: !!content,
  });

  if (!renderMath || !content) {
    console.log('[MathRenderer] Skipping math rendering', { renderMath, hasContent: !!content });
    return <span className={`${className} whitespace-pre-wrap`}>{content}</span>;
  }

  const segments = splitTextWithMath(content);
  console.log('[MathRenderer] Split into segments', {
    segmentCount: segments.length,
    segments: segments.map(s => ({
      type: s.type,
      contentLength: s.content.length,
      contentPreview: s.content.substring(0, 50),
      mathType: s.mathType,
    })),
  });

  if (segments.length === 1 && segments[0].type === 'text') {
    // No math expressions found, return plain text with whitespace preservation
    return <span className={`${className} whitespace-pre-wrap`}>{content}</span>;
  }

  return (
    <span
      className={className}
      role="text"
      aria-label="Content with mathematical expressions"
    >
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <span key={index} className="whitespace-pre-wrap">
              {segment.content}
            </span>
          );
        }

        // Math expression
        if (!isValidLatex(segment.content)) {
          // Invalid LaTeX, render as plain text with delimiters
          return (
            <span
              key={index}
              className="text-red-600"
              aria-label="Invalid math expression"
            >
              {segment.mathType === 'block' ? '$$' : '$'}
              {segment.content}
              {segment.mathType === 'block' ? '$$' : '$'}
            </span>
          );
        }

        try {
          if (segment.mathType === 'block') {
            return (
              <div
                key={index}
                className="my-4 overflow-x-auto"
                role="math"
                aria-label={`Mathematical expression: ${segment.content}`}
              >
                <BlockMath math={segment.content} />
              </div>
            );
          } else {
            return (
              <span
                key={index}
                className="mx-1"
                role="math"
                aria-label={`Mathematical expression: ${segment.content}`}
              >
                <InlineMath math={segment.content} />
              </span>
            );
          }
        } catch (error) {
          // KaTeX rendering error, render as plain text
          console.error('[MathRenderer] KaTeX rendering error:', error);
          return (
            <span
              key={index}
              className="text-red-600"
              aria-label="Math rendering error"
            >
              {segment.mathType === 'block' ? '$$' : '$'}
              {segment.content}
              {segment.mathType === 'block' ? '$$' : '$'}
            </span>
          );
        }
      })}
    </span>
  );
};

export default MathRenderer;
