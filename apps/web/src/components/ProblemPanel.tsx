import React from 'react';
import type { ProblemPanelProps, ProblemType } from '../types';

const problemTypeBadges: Record<ProblemType, { label: string; color: string }> =
  {
    arithmetic: { label: 'Arithmetic', color: 'bg-blue-100 text-blue-800' },
    algebra: { label: 'Algebra', color: 'bg-purple-100 text-purple-800' },
    geometry: { label: 'Geometry', color: 'bg-green-100 text-green-800' },
    word: { label: 'Word Problem', color: 'bg-amber-100 text-amber-800' },
    'multi-step': { label: 'Multi-Step', color: 'bg-rose-100 text-rose-800' },
  };

const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  problemType,
}) => {
  if (!problem) {
    return (
      <div className="flex h-full flex-col bg-background-secondary p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-text-primary">Math Problem</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary text-lg">
              No problem loaded yet. Start chatting to get a problem!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const badge =
    problemType && problemTypeBadges[problemType as ProblemType]
      ? problemTypeBadges[problemType as ProblemType]
      : problemTypeBadges.word;

  return (
    <div
      className="flex h-full flex-col bg-background-secondary p-6 lg:p-8"
      role="region"
      aria-label="Problem display"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary">Math Problem</h2>
          {problemType && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
            >
              {badge.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-border">
        <div className="prose prose-lg max-w-none">
          <p className="text-text-primary text-lg leading-relaxed whitespace-pre-wrap">
            {problem}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
