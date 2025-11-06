/**
 * Type declarations for react-katex
 * react-katex doesn't have TypeScript definitions, so we provide them here
 */

declare module 'react-katex' {
  import { Component } from 'react';

  export interface KaTeXProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    throwOnError?: boolean;
    displayMode?: boolean;
    leqno?: boolean;
    fleqn?: boolean;
    output?: 'html' | 'mathml' | 'htmlAndMathml';
    strict?: boolean | 'warn' | 'ignore' | 'error';
    trust?: boolean | ((context: string) => boolean);
    macros?: Record<string, string>;
    minRuleThickness?: number;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    globalGroup?: boolean;
  }

  export class InlineMath extends Component<KaTeXProps> {}
  export class BlockMath extends Component<KaTeXProps> {}
}

