import React, { useState } from 'react';
import Layout from './components/Layout';
import type { Message } from './types';

const App: React.FC = () => {
  const [problem, setProblem] = useState<string | undefined>(undefined);
  const [problemType, setProblemType] = useState<string | undefined>(undefined);

  // Sample messages for demonstration (will be replaced in future stories)
  const sampleMessages: Message[] = [];

  const handleProblemSubmit = (submittedProblem: string) => {
    setProblem(submittedProblem);
    // For now, we don't determine problem type from input
    // This will be implemented in Story 1.8
    setProblemType(undefined);
  };

  return (
    <Layout
      problem={problem}
      problemType={problemType}
      messages={sampleMessages}
      emptyState={true}
      onProblemSubmit={handleProblemSubmit}
    />
  );
};

export default App;
