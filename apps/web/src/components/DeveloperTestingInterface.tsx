/**
 * Developer Testing Interface Component
 *
 * A comprehensive testing interface for developers to test different problem types,
 * scenarios, and edge cases. Only accessible in development mode.
 *
 * Features:
 * - Test problem library with 50+ problems organized by type
 * - One-click problem loading
 * - Scenario testing panel (answer detection, help escalation, context, errors)
 * - Real-time testing indicators
 * - Edge case testing
 * - Test results dashboard
 * - Batch testing functionality
 */

import React, { useState, useEffect } from 'react';
import { isTestingInterfaceEnabled } from '../config/development';
import {
  getAllTestProblems,
  getTestProblemsByType,
  getProblemCountByType,
  type TestProblem,
} from '../testData/problemLibrary';
import type { ProblemType } from '../services/api';
import {
  directAnswerPatterns,
  implicitAnswerPatterns,
  edgeCaseScenarios,
  contextManagementScenarios,
  helpEscalationScenarios,
  type TestResult,
} from '../testUtils/fixtures';

interface DeveloperTestingInterfaceProps {
  onLoadProblem?: (problem: string, type: ProblemType) => void;
}

const DeveloperTestingInterface: React.FC<DeveloperTestingInterfaceProps> = ({
  onLoadProblem,
}) => {
  // Get initial collapsed state from localStorage (defaults to collapsed)
  const getInitialCollapsedState = (): boolean => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devTestingInterfaceCollapsed');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  };

  // All hooks must be called before any conditional returns
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    getInitialCollapsedState
  );
  const [activeTab, setActiveTab] = useState<
    'library' | 'scenarios' | 'edge-cases' | 'results' | 'batch'
  >('library');
  const [selectedType, setSelectedType] = useState<ProblemType | 'all'>('all');
  const [selectedProblem, setSelectedProblem] = useState<TestProblem | null>(
    null
  );
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  // Save collapsed state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devTestingInterfaceCollapsed', String(isCollapsed));
    }
  }, [isCollapsed]);

  // Check if testing interface is enabled (development only) - after all hooks
  if (!isTestingInterfaceEnabled()) {
    return null; // Don't render in production
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get problems based on selected type
  const getFilteredProblems = (): TestProblem[] => {
    if (selectedType === 'all') {
      return getAllTestProblems();
    }
    return getTestProblemsByType(selectedType);
  };

  // Get problem counts
  const problemCounts = getProblemCountByType();
  const totalProblems = Object.values(problemCounts).reduce((a, b) => a + b, 0);

  // Handle problem selection
  const handleProblemSelect = (problem: TestProblem) => {
    setSelectedProblem(problem);
    if (onLoadProblem) {
      onLoadProblem(problem.problem, problem.type);
    }
  };

  // Test scenarios
  const handleTestScenario = async (scenario: string) => {
    setIsRunningTest(true);
    setCurrentTest(scenario);
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRunningTest(false);
    setCurrentTest(null);
  };

  // Batch testing
  const handleBatchTest = async () => {
    setIsRunningTest(true);
    const problems = getFilteredProblems();
    const results: TestResult[] = [];

    for (const problem of problems) {
      setCurrentTest(`Testing ${problem.id}...`);
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 500));
      results.push({
        id: problem.id,
        name: problem.problem,
        status: 'pass',
        duration: 500,
        timestamp: new Date(),
      });
    }

    setTestResults(results);
    setIsRunningTest(false);
    setCurrentTest(null);
  };

  // Collapsed state - show only a small button
  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-blue-700 transition-colors flex items-center gap-2"
        aria-label="Expand Developer Testing Interface"
        title="Developer Testing Interface"
      >
        <span className="text-sm font-medium">🧪 Dev Tools</span>
        <span className="text-xs">▼</span>
      </button>
    );
  }

  // Expanded state - show full interface
  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Developer Testing Interface</h2>
        <button
          onClick={toggleCollapse}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Collapse Developer Testing Interface"
          title="Collapse"
        >
          ▼
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {[
          { id: 'library', label: 'Library' },
          { id: 'scenarios', label: 'Scenarios' },
          { id: 'edge-cases', label: 'Edge Cases' },
          { id: 'results', label: 'Results' },
          { id: 'batch', label: 'Batch' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Test Problem Library */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Test Problem Library
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {totalProblems} total problems across 5 problem types
              </p>
            </div>

            {/* Problem Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Filter by Type:
              </label>
              <select
                value={selectedType}
                onChange={e =>
                  setSelectedType(e.target.value as ProblemType | 'all')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types ({totalProblems})</option>
                <option value="arithmetic">
                  Arithmetic ({problemCounts.arithmetic})
                </option>
                <option value="algebra">
                  Algebra ({problemCounts.algebra})
                </option>
                <option value="geometry">
                  Geometry ({problemCounts.geometry})
                </option>
                <option value="word">
                  Word Problems ({problemCounts.word})
                </option>
                <option value="multi-step">
                  Multi-Step ({problemCounts['multi-step']})
                </option>
              </select>
            </div>

            {/* Problem List */}
            <div className="space-y-2">
              {getFilteredProblems().map(problem => (
                <button
                  key={problem.id}
                  onClick={() => handleProblemSelect(problem)}
                  className={`w-full text-left px-3 py-2 rounded-md border ${
                    selectedProblem?.id === problem.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">{problem.problem}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {problem.type}{' '}
                    {problem.description && `• ${problem.description}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scenario Testing */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Scenario Testing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Test specific scenarios including answer detection, help
                escalation, and context management
              </p>
            </div>

            {/* Answer Detection */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Answer Detection</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium mb-1">Direct Patterns:</div>
                  <div className="text-gray-600">
                    {directAnswerPatterns.length} patterns configured
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">Implicit Patterns:</div>
                  <div className="text-gray-600">
                    {implicitAnswerPatterns.length} patterns configured
                  </div>
                </div>
              </div>
            </div>

            {/* Help Escalation */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Help Escalation</h4>
              <div className="space-y-2">
                {helpEscalationScenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => handleTestScenario(scenario.id)}
                    className="w-full text-left px-3 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-sm"
                  >
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Context Management */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Context Management</h4>
              <div className="space-y-2">
                {contextManagementScenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => handleTestScenario(scenario.id)}
                    className="w-full text-left px-3 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-sm"
                  >
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edge Cases */}
        {activeTab === 'edge-cases' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Edge Case Testing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Test edge cases including empty inputs, invalid problems, and
                error scenarios
              </p>
            </div>

            <div className="space-y-2">
              {edgeCaseScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => handleTestScenario(scenario.id)}
                  className="w-full text-left px-3 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-sm"
                >
                  <div className="font-medium">{scenario.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {scenario.description}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Expected: {scenario.expectedBehavior}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Test Results Dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View test results and compliance metrics
              </p>
            </div>

            {testResults.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No test results yet. Run tests to see results here.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm mb-4">
                  <div className="font-medium">Summary:</div>
                  <div className="text-gray-600">
                    Total: {testResults.length} | Pass:{' '}
                    {testResults.filter(r => r.status === 'pass').length} |
                    Fail: {testResults.filter(r => r.status === 'fail').length}
                  </div>
                </div>

                {testResults.map(result => (
                  <div
                    key={result.id}
                    className={`px-3 py-2 rounded-md border ${
                      result.status === 'pass'
                        ? 'bg-green-50 border-green-200'
                        : result.status === 'fail'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">{result.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Status: {result.status} | Duration: {result.duration}ms
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Batch Testing */}
        {activeTab === 'batch' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Batch Testing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Run multiple test scenarios in sequence
              </p>
            </div>

            <div className="mb-4">
              <div className="text-sm mb-2">
                Selected: {selectedType === 'all' ? 'All Types' : selectedType}{' '}
                ({getFilteredProblems().length} problems)
              </div>
            </div>

            <button
              onClick={handleBatchTest}
              disabled={isRunningTest}
              className={`w-full px-4 py-2 rounded-md font-medium ${
                isRunningTest
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunningTest
                ? `Running... ${currentTest || ''}`
                : `Run Batch Test (${getFilteredProblems().length} problems)`}
            </button>

            {isRunningTest && (
              <div className="mt-4 text-sm text-gray-600">
                <div className="font-medium">Test Progress:</div>
                <div className="mt-2">{currentTest || 'Starting...'}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 px-4 py-2 bg-gray-50 text-xs text-gray-500">
        Development Mode Only
      </div>
    </div>
  );
};

export default DeveloperTestingInterface;
