import React from 'react';
import ReactMarkdown from 'react-markdown';
import MathRenderer from './MathRenderer';

interface MarkdownMessageRendererProps {
  content: string;
  className?: string;
}

/**
 * Helper to render children with math support
 * Handles different types of React nodes properly
 */
const renderWithMath = (children: React.ReactNode): React.ReactNode => {
  if (children === null || children === undefined) {
    return null;
  }
  if (typeof children === 'string') {
    return <MathRenderer content={children} />;
  }
  if (Array.isArray(children)) {
    return (
      <>
        {children.map((child, index) => {
          if (typeof child === 'string') {
            return <MathRenderer key={index} content={child} />;
          }
          return <React.Fragment key={index}>{child}</React.Fragment>;
        })}
      </>
    );
  }
  if (React.isValidElement(children)) {
    // If it's already a React element, return it as-is (it will be handled by its parent)
    return children;
  }
  return children;
};

/**
 * MarkdownMessageRenderer Component
 *
 * Renders markdown content with support for math expressions
 * Uses react-markdown for markdown rendering and MathRenderer for math
 */
const MarkdownMessageRenderer: React.FC<MarkdownMessageRendererProps> = ({
  content,
  className = '',
}) => {
  // Custom components for react-markdown to handle math expressions
  const components = {
    // Render paragraphs with math support
    // Don't wrap paragraphs inside list items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      node?: any;
      [key: string]: any;
    }) => {
      // Check if we're inside a list item by checking the parent
      const isInListItem = props.node?.parent?.type === 'listItem';

      const processedChildren = React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <MathRenderer content={child} />;
        }
        return child;
      });

      // If inside a list item, render as span to keep inline
      if (isInListItem) {
        return <span className="leading-relaxed">{processedChildren}</span>;
      }

      return (
        <p className="mb-2 last:mb-0 leading-relaxed">{processedChildren}</p>
      );
    },
    // Render text nodes with math support
    text: ({ children }: { children?: React.ReactNode }) => {
      const textContent =
        typeof children === 'string' ? children : String(children || '');
      return <MathRenderer content={textContent} />;
    },
    // Render lists properly - use list-outside for better formatting
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc mb-2 space-y-2 ml-6 pl-2 [&>li]:list-item">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal mb-2 space-y-2 ml-6 pl-2 [&>li]:list-item">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => {
      // Process children to handle text nodes with math
      // Use React.Children.toArray to handle all children properly
      const processedChildren = React.Children.toArray(children).map(
        (child, index) => {
          if (typeof child === 'string') {
            return <MathRenderer key={index} content={child} />;
          }
          // If it's a React element, clone it with a key
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index });
          }
          return <React.Fragment key={index}>{child}</React.Fragment>;
        }
      );

      return (
        <li className="mb-1 leading-relaxed [&>p]:mb-0 [&>p]:inline">
          {processedChildren}
        </li>
      );
    },
    // Render bold text
    strong: ({ children }: { children?: React.ReactNode }) => {
      const processedChildren = React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <MathRenderer content={child} />;
        }
        return child;
      });

      return <strong className="font-semibold">{processedChildren}</strong>;
    },
    // Render italic text
    em: ({ children }: { children?: React.ReactNode }) => {
      const processedChildren = React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <MathRenderer content={child} />;
        }
        return child;
      });

      return <em className="italic">{processedChildren}</em>;
    },
    // Render code blocks
    code: ({
      children,
      className: codeClassName,
    }: {
      children?: React.ReactNode;
      className?: string;
    }) => {
      if (codeClassName) {
        // Code block
        return (
          <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {renderWithMath(children)}
          </code>
        );
      }
      // Inline code
      return (
        <code className="bg-gray-100 px-1 rounded text-sm">
          {renderWithMath(children)}
        </code>
      );
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownMessageRenderer;
