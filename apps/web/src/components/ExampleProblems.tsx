import React from 'react';
import MathRenderer from './MathRenderer';

export interface ExampleProblem {
  id: string;
  problem: string;
  type: string;
}

interface ExampleProblemsProps {
  onSelectProblem: (problem: string) => void;
  disabled?: boolean;
}

const EXAMPLE_PROBLEMS: ExampleProblem[] = [
  {
    id: 'ex-1',
    problem: 'Solve: 3/4 + 1/2',
    type: 'Arithmetic',
  },
  {
    id: 'ex-2',
    problem: 'What is 2.5 + 3.75?',
    type: 'Arithmetic',
  },
  {
    id: 'ex-3',
    problem: 'Calculate: 15 - 8',
    type: 'Arithmetic',
  },
  {
    id: 'ex-4',
    problem: 'Solve for x: 2x + 5 = 15',
    type: 'Algebra',
  },
  {
    id: 'ex-5',
    problem: 'Find x: 5(x + 2) = 25',
    type: 'Algebra',
  },
  {
    id: 'ex-5a',
    problem: 'Solve: $\\frac{3(x-4)}{4} = \\frac{5(2x-3)}{3}$',
    type: 'Algebra',
  },
  {
    id: 'ex-5b',
    problem: 'Solve for x: $\\frac{2x+1}{3} = \\frac{x-2}{4}$',
    type: 'Algebra',
  },
  {
    id: 'ex-5c',
    problem: 'Find x: $\\frac{x+5}{2} = \\frac{3x-1}{5}$',
    type: 'Algebra',
  },
  {
    id: 'ex-6',
    problem: 'Find the area of a rectangle with length 8 and width 5',
    type: 'Geometry',
  },
  {
    id: 'ex-7',
    problem: 'What is the perimeter of a square with side length 6?',
    type: 'Geometry',
  },
  {
    id: 'ex-8',
    problem:
      'Sara has 24 apples. She gives 1/3 to her friend. How many apples does she have left?',
    type: 'Word Problem',
  },
  {
    id: 'ex-9',
    problem:
      'Tom has $50. He spends $18.75 on groceries. How much money does he have left?',
    type: 'Word Problem',
  },
  {
    id: 'ex-10',
    problem: 'A train travels 120 miles in 2 hours. What is its average speed?',
    type: 'Word Problem',
  },
];

const ExampleProblems: React.FC<ExampleProblemsProps> = ({
  onSelectProblem,
  disabled = false,
}) => {
  const handleClick = (problem: string) => {
    if (!disabled) {
      onSelectProblem(problem);
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-text-secondary mb-3">
          Or try an example:
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROBLEMS.map(example => (
          <button
            key={example.id}
            type="button"
            onClick={() => handleClick(example.problem)}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-text-primary bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Select example problem: ${example.problem}`}
          >
            <MathRenderer
              content={example.problem}
              className="inline-flex items-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleProblems;
