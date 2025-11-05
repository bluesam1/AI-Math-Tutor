import React from 'react';
import { Calculator, Variable, Triangle, FileText, ArrowRightLeft } from 'lucide-react';
import type { ProblemType } from '../types';

export interface ProblemTypeBadgeProps {
  problemType: ProblemType | string;
  className?: string;
}

const problemTypeConfig: Record<
  ProblemType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  arithmetic: {
    label: 'Arithmetic',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Calculator className="w-4 h-4" aria-hidden="true" />,
  },
  algebra: {
    label: 'Algebra',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Variable className="w-4 h-4" aria-hidden="true" />,
  },
  geometry: {
    label: 'Geometry',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Triangle className="w-4 h-4" aria-hidden="true" />,
  },
  word: {
    label: 'Word Problem',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <FileText className="w-4 h-4" aria-hidden="true" />,
  },
  'multi-step': {
    label: 'Multi-Step',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />,
  },
};

const ProblemTypeBadge: React.FC<ProblemTypeBadgeProps> = ({
  problemType,
  className = '',
}) => {
  // Type guard to ensure problemType is a valid ProblemType
  const validProblemType = problemType as ProblemType;
  const config = problemTypeConfig[validProblemType];

  if (!config) {
    // Fallback for unknown problem types
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 ${className}`}
        role="status"
        aria-label={`Problem type: ${problemType}`}
      >
        {problemType}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${className}`}
      role="status"
      aria-label={`Problem type: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ProblemTypeBadge;

