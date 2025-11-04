import React from 'react';
import ProblemInput from './ProblemInput';
import ImageUpload from './ImageUpload';
import type { ProblemPanelProps, ProblemType } from '../types';

interface ExtendedProblemPanelProps extends ProblemPanelProps {
  onProblemSubmit?: (problem: string) => void;
}

const problemTypeBadges: Record<ProblemType, { label: string; color: string }> =
  {
    arithmetic: { label: 'Arithmetic', color: 'bg-blue-100 text-blue-800' },
    algebra: { label: 'Algebra', color: 'bg-purple-100 text-purple-800' },
    geometry: { label: 'Geometry', color: 'bg-green-100 text-green-800' },
    word: { label: 'Word Problem', color: 'bg-amber-100 text-amber-800' },
    'multi-step': { label: 'Multi-Step', color: 'bg-rose-100 text-rose-800' },
  };

const ProblemPanel: React.FC<ExtendedProblemPanelProps> = ({
  problem,
  problemType,
  onProblemSubmit,
}) => {
  const badge =
    problemType && problemTypeBadges[problemType as ProblemType]
      ? problemTypeBadges[problemType as ProblemType]
      : problemTypeBadges.word;

  return (
    <div
      className="flex h-full flex-col bg-background-secondary p-6 lg:p-8 overflow-y-auto"
      role="region"
      aria-label="Problem input and display"
    >
      <div className="mb-6">
        <h2 className="text-text-primary text-2xl font-semibold mb-2">
          Math Problem
        </h2>
        {problem && problemType && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Problem Input Section */}
      {onProblemSubmit && (
        <div className="mb-6 space-y-6">
          <div>
            <ProblemInput onSubmit={onProblemSubmit} />
          </div>
          <div>
            <label className="block text-text-primary text-lg font-medium mb-2">
              Or Upload Image
            </label>
            <ImageUpload
              onFileSelect={(file) => {
                // File is ready for processing (Story 1.6 will handle Vision API)
                console.log('Image selected:', file.name);
              }}
            />
          </div>
        </div>
      )}

      {/* Problem Display Section */}
      {problem ? (
        <div className="flex-1 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-border min-h-0">
          <div className="prose prose-lg max-w-none">
            <p className="text-text-primary text-lg leading-relaxed whitespace-pre-wrap break-words">
              {problem}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-border">
          <div className="text-center">
            <p className="text-text-secondary text-lg">
              {onProblemSubmit
                ? 'Enter a math problem above to get started!'
                : 'No problem loaded yet. Start chatting to get a problem!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPanel;
