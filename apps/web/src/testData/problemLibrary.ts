/**
 * Test Problem Library
 *
 * A comprehensive library of test problems organized by problem type.
 * Used by the developer testing interface to test different scenarios.
 *
 * Each problem type has 10+ test problems (50+ total scenarios).
 */

import type { ProblemType } from '../services/api';

export interface TestProblem {
  id: string;
  problem: string;
  type: ProblemType;
  description?: string;
  tags?: string[];
}

/**
 * Arithmetic Test Problems (10+ problems)
 * Basic operations with fractions, decimals, integers
 */
export const arithmeticProblems: TestProblem[] = [
  {
    id: 'arith-1',
    problem: 'Solve: 3/4 + 1/2',
    type: 'arithmetic',
    description: 'Fraction addition with different denominators',
    tags: ['fractions', 'addition'],
  },
  {
    id: 'arith-2',
    problem: 'What is 2.5 + 3.75?',
    type: 'arithmetic',
    description: 'Decimal addition',
    tags: ['decimals', 'addition'],
  },
  {
    id: 'arith-3',
    problem: 'Calculate: 15 - 8',
    type: 'arithmetic',
    description: 'Simple integer subtraction',
    tags: ['integers', 'subtraction'],
  },
  {
    id: 'arith-4',
    problem: 'Find the product: 6 × 7',
    type: 'arithmetic',
    description: 'Integer multiplication',
    tags: ['integers', 'multiplication'],
  },
  {
    id: 'arith-5',
    problem: 'Divide: 48 ÷ 6',
    type: 'arithmetic',
    description: 'Integer division',
    tags: ['integers', 'division'],
  },
  {
    id: 'arith-6',
    problem: 'Solve: 1/3 + 2/3',
    type: 'arithmetic',
    description: 'Fraction addition with same denominator',
    tags: ['fractions', 'addition'],
  },
  {
    id: 'arith-7',
    problem: 'What is 0.25 × 4?',
    type: 'arithmetic',
    description: 'Decimal multiplication',
    tags: ['decimals', 'multiplication'],
  },
  {
    id: 'arith-8',
    problem: 'Calculate: 5/6 - 1/3',
    type: 'arithmetic',
    description: 'Fraction subtraction with different denominators',
    tags: ['fractions', 'subtraction'],
  },
  {
    id: 'arith-9',
    problem: 'Find: 3.2 - 1.5',
    type: 'arithmetic',
    description: 'Decimal subtraction',
    tags: ['decimals', 'subtraction'],
  },
  {
    id: 'arith-10',
    problem: 'Solve: 1/2 × 2/3',
    type: 'arithmetic',
    description: 'Fraction multiplication',
    tags: ['fractions', 'multiplication'],
  },
  {
    id: 'arith-11',
    problem: 'What is 0.8 ÷ 0.2?',
    type: 'arithmetic',
    description: 'Decimal division',
    tags: ['decimals', 'division'],
  },
  {
    id: 'arith-12',
    problem: 'Calculate: 2/5 ÷ 1/2',
    type: 'arithmetic',
    description: 'Fraction division',
    tags: ['fractions', 'division'],
  },
];

/**
 * Algebra Test Problems (10+ problems)
 * Variables, equations, expressions
 */
export const algebraProblems: TestProblem[] = [
  {
    id: 'alg-1',
    problem: 'Solve for x: 2x + 5 = 15',
    type: 'algebra',
    description: 'Simple linear equation',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-2',
    problem: 'Find the value of x if 3x - 7 = 14',
    type: 'algebra',
    description: 'Linear equation with subtraction',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-3',
    problem: 'Solve: x/4 = 3',
    type: 'algebra',
    description: 'Linear equation with division',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-4',
    problem: 'What is x if 2x + 3 = x + 8?',
    type: 'algebra',
    description: 'Linear equation with x on both sides',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-5',
    problem: 'Simplify: 3x + 2x - 5',
    type: 'algebra',
    description: 'Algebraic expression simplification',
    tags: ['expression', 'simplification'],
  },
  {
    id: 'alg-6',
    problem: 'Solve for y: 4y - 6 = 18',
    type: 'algebra',
    description: 'Linear equation with different variable',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-7',
    problem: 'Find x: 5(x + 2) = 25',
    type: 'algebra',
    description: 'Linear equation with parentheses',
    tags: ['linear-equation', 'distribution'],
  },
  {
    id: 'alg-8',
    problem: 'Simplify: 2a + 3b - a + 4b',
    type: 'algebra',
    description: 'Expression with multiple variables',
    tags: ['expression', 'multiple-variables'],
  },
  {
    id: 'alg-9',
    problem: 'Solve: 3x + 1 = 2x + 7',
    type: 'algebra',
    description: 'Linear equation with x on both sides',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-10',
    problem: 'What is the value of n if 2n + 3 = 11?',
    type: 'algebra',
    description: 'Simple linear equation',
    tags: ['linear-equation', 'one-variable'],
  },
  {
    id: 'alg-11',
    problem: 'Solve for x: x/3 + 2 = 5',
    type: 'algebra',
    description: 'Linear equation with fraction',
    tags: ['linear-equation', 'fractions'],
  },
  {
    id: 'alg-12',
    problem: 'Simplify: 4(x - 2) + 3',
    type: 'algebra',
    description: 'Expression with distribution',
    tags: ['expression', 'distribution'],
  },
];

/**
 * Geometry Test Problems (10+ problems)
 * Shapes, area, perimeter, volume
 */
export const geometryProblems: TestProblem[] = [
  {
    id: 'geom-1',
    problem: 'Find the area of a rectangle with length 8 and width 5',
    type: 'geometry',
    description: 'Rectangle area calculation',
    tags: ['area', 'rectangle'],
  },
  {
    id: 'geom-2',
    problem: 'What is the perimeter of a square with side length 6?',
    type: 'geometry',
    description: 'Square perimeter calculation',
    tags: ['perimeter', 'square'],
  },
  {
    id: 'geom-3',
    problem: 'Calculate the area of a triangle with base 10 and height 4',
    type: 'geometry',
    description: 'Triangle area calculation',
    tags: ['area', 'triangle'],
  },
  {
    id: 'geom-4',
    problem: 'Find the circumference of a circle with radius 5',
    type: 'geometry',
    description: 'Circle circumference calculation',
    tags: ['circumference', 'circle'],
  },
  {
    id: 'geom-5',
    problem: 'What is the area of a circle with radius 3?',
    type: 'geometry',
    description: 'Circle area calculation',
    tags: ['area', 'circle'],
  },
  {
    id: 'geom-6',
    problem:
      'Find the volume of a rectangular prism with length 5, width 3, and height 4',
    type: 'geometry',
    description: 'Rectangular prism volume calculation',
    tags: ['volume', 'rectangular-prism'],
  },
  {
    id: 'geom-7',
    problem:
      'Calculate the perimeter of a rectangle with length 12 and width 7',
    type: 'geometry',
    description: 'Rectangle perimeter calculation',
    tags: ['perimeter', 'rectangle'],
  },
  {
    id: 'geom-8',
    problem: 'What is the area of a square with side length 9?',
    type: 'geometry',
    description: 'Square area calculation',
    tags: ['area', 'square'],
  },
  {
    id: 'geom-9',
    problem: 'Find the volume of a cube with edge length 4',
    type: 'geometry',
    description: 'Cube volume calculation',
    tags: ['volume', 'cube'],
  },
  {
    id: 'geom-10',
    problem: 'Calculate the area of a parallelogram with base 8 and height 6',
    type: 'geometry',
    description: 'Parallelogram area calculation',
    tags: ['area', 'parallelogram'],
  },
  {
    id: 'geom-11',
    problem: 'What is the perimeter of a triangle with sides 5, 6, and 7?',
    type: 'geometry',
    description: 'Triangle perimeter calculation',
    tags: ['perimeter', 'triangle'],
  },
  {
    id: 'geom-12',
    problem: 'Find the volume of a cylinder with radius 2 and height 5',
    type: 'geometry',
    description: 'Cylinder volume calculation',
    tags: ['volume', 'cylinder'],
  },
];

/**
 * Word Problems Test Problems (10+ problems)
 * Real-world math scenarios
 */
export const wordProblems: TestProblem[] = [
  {
    id: 'word-1',
    problem:
      'Sara has 24 apples. She gives 1/3 to her friend. How many apples does she have left?',
    type: 'word',
    description: 'Fraction word problem with subtraction',
    tags: ['fractions', 'subtraction', 'real-world'],
  },
  {
    id: 'word-2',
    problem:
      'A recipe calls for 2 1/2 cups of flour. If you want to make 1.5 times the recipe, how much flour do you need?',
    type: 'word',
    description: 'Mixed number multiplication',
    tags: ['fractions', 'multiplication', 'real-world'],
  },
  {
    id: 'word-3',
    problem:
      'Tom has $50. He spends $18.75 on groceries. How much money does he have left?',
    type: 'word',
    description: 'Decimal subtraction with money',
    tags: ['decimals', 'subtraction', 'money'],
  },
  {
    id: 'word-4',
    problem: 'A train travels 120 miles in 2 hours. What is its average speed?',
    type: 'word',
    description: 'Rate calculation',
    tags: ['division', 'rate', 'distance'],
  },
  {
    id: 'word-5',
    problem:
      'Maria has 3/4 of a pizza left. She eats 1/3 of what remains. How much pizza does she have left?',
    type: 'word',
    description: 'Fraction multiplication with remaining portion',
    tags: ['fractions', 'multiplication', 'real-world'],
  },
  {
    id: 'word-6',
    problem:
      'A store sells apples for $0.75 each. If you buy 12 apples, how much will you pay?',
    type: 'word',
    description: 'Decimal multiplication with money',
    tags: ['decimals', 'multiplication', 'money'],
  },
  {
    id: 'word-7',
    problem:
      'A rectangle has a length of 8 meters and a width of 5 meters. What is its area?',
    type: 'word',
    description: 'Geometry word problem',
    tags: ['geometry', 'area', 'rectangle'],
  },
  {
    id: 'word-8',
    problem:
      'If 3 students can paint a wall in 4 hours, how long will it take 6 students to paint the same wall?',
    type: 'word',
    description: 'Proportion word problem',
    tags: ['proportions', 'rate', 'time'],
  },
  {
    id: 'word-9',
    problem:
      'A bag contains 30 marbles. 2/5 of them are blue. How many blue marbles are in the bag?',
    type: 'word',
    description: 'Fraction word problem with multiplication',
    tags: ['fractions', 'multiplication', 'real-world'],
  },
  {
    id: 'word-10',
    problem:
      'You have 2.5 liters of juice. You pour 0.75 liters into a glass. How much juice is left?',
    type: 'word',
    description: 'Decimal subtraction',
    tags: ['decimals', 'subtraction', 'real-world'],
  },
  {
    id: 'word-11',
    problem:
      'A car travels 180 miles on 6 gallons of gas. How many miles per gallon does it get?',
    type: 'word',
    description: 'Rate calculation',
    tags: ['division', 'rate', 'mileage'],
  },
  {
    id: 'word-12',
    problem:
      'There are 48 cookies. If you want to share them equally among 8 people, how many cookies does each person get?',
    type: 'word',
    description: 'Division word problem',
    tags: ['division', 'equal-sharing', 'real-world'],
  },
];

/**
 * Multi-Step Test Problems (10+ problems)
 * Problems requiring multiple steps
 */
export const multiStepProblems: TestProblem[] = [
  {
    id: 'multi-1',
    problem:
      'A recipe calls for 2 1/2 cups of flour. If you want to make 1.5 times the recipe, how much flour do you need?',
    type: 'multi-step',
    description: 'Mixed number multiplication',
    tags: ['fractions', 'multiplication', 'scaling'],
  },
  {
    id: 'multi-2',
    problem:
      'You have $100. You spend 1/4 of it on lunch and then spend $20 on a book. How much money do you have left?',
    type: 'multi-step',
    description: 'Multiple operations with fractions and subtraction',
    tags: ['fractions', 'subtraction', 'money'],
  },
  {
    id: 'multi-3',
    problem:
      'A rectangle has a length of 8 and a width of 5. What is its area? Then, if you double both the length and width, what is the new area?',
    type: 'multi-step',
    description: 'Geometry calculation followed by scaling',
    tags: ['geometry', 'area', 'scaling'],
  },
  {
    id: 'multi-4',
    problem: 'Solve for x: 2x + 5 = 15. Then use that value to find 3x - 2.',
    type: 'multi-step',
    description: 'Solve equation then use solution',
    tags: ['algebra', 'linear-equation', 'substitution'],
  },
  {
    id: 'multi-5',
    problem:
      'Maria has 3/4 of a pizza. She eats 1/3 of what she has. How much pizza does she have left?',
    type: 'multi-step',
    description: 'Fraction multiplication with remaining portion',
    tags: ['fractions', 'multiplication', 'subtraction'],
  },
  {
    id: 'multi-6',
    problem:
      'A store is having a sale: 20% off all items. If an item originally costs $50, what is the sale price?',
    type: 'multi-step',
    description: 'Percentage calculation',
    tags: ['percentages', 'multiplication', 'money'],
  },
  {
    id: 'multi-7',
    problem:
      'Find the perimeter of a rectangle with length 10 and width 6. Then find the area.',
    type: 'multi-step',
    description: 'Multiple geometry calculations',
    tags: ['geometry', 'perimeter', 'area'],
  },
  {
    id: 'multi-8',
    problem:
      'You have 2.5 liters of juice. You pour 0.75 liters into one glass and 0.5 liters into another. How much is left?',
    type: 'multi-step',
    description: 'Multiple decimal subtractions',
    tags: ['decimals', 'subtraction', 'real-world'],
  },
  {
    id: 'multi-9',
    problem:
      'A train travels 120 miles in 2 hours. How far will it travel in 5 hours at the same speed?',
    type: 'multi-step',
    description: 'Rate calculation then distance calculation',
    tags: ['rate', 'multiplication', 'distance'],
  },
  {
    id: 'multi-10',
    problem:
      'Solve: 3x - 7 = 14. Then check your answer by substituting it back into the equation.',
    type: 'multi-step',
    description: 'Solve equation then verify',
    tags: ['algebra', 'linear-equation', 'verification'],
  },
  {
    id: 'multi-11',
    problem:
      'A bag contains 30 marbles. 2/5 are blue and 1/3 are red. How many marbles are neither blue nor red?',
    type: 'multi-step',
    description: 'Multiple fraction calculations',
    tags: ['fractions', 'multiplication', 'subtraction'],
  },
  {
    id: 'multi-12',
    problem:
      'Find the area of a triangle with base 10 and height 4. Then find the perimeter if the sides are 10, 4, and 11.',
    type: 'multi-step',
    description: 'Multiple geometry calculations',
    tags: ['geometry', 'area', 'perimeter'],
  },
];

/**
 * All test problems organized by type
 */
export const testProblemsByType: Record<ProblemType, TestProblem[]> = {
  arithmetic: arithmeticProblems,
  algebra: algebraProblems,
  geometry: geometryProblems,
  word: wordProblems,
  'multi-step': multiStepProblems,
};

/**
 * All test problems in a single array
 */
export const allTestProblems: TestProblem[] = [
  ...arithmeticProblems,
  ...algebraProblems,
  ...geometryProblems,
  ...wordProblems,
  ...multiStepProblems,
];

/**
 * Get test problems by type
 */
export const getTestProblemsByType = (type: ProblemType): TestProblem[] => {
  return testProblemsByType[type] || [];
};

/**
 * Get a test problem by ID
 */
export const getTestProblemById = (id: string): TestProblem | undefined => {
  return allTestProblems.find(problem => problem.id === id);
};

/**
 * Get all test problems
 */
export const getAllTestProblems = (): TestProblem[] => {
  return allTestProblems;
};

/**
 * Get problem count by type
 */
export const getProblemCountByType = (): Record<ProblemType, number> => {
  return {
    arithmetic: arithmeticProblems.length,
    algebra: algebraProblems.length,
    geometry: geometryProblems.length,
    word: wordProblems.length,
    'multi-step': multiStepProblems.length,
  };
};
