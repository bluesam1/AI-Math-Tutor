import React from 'react';
import Layout from './components/Layout';
import type { Message } from './types';

const App: React.FC = () => {
  // Sample data matching the reference implementation
  const sampleProblem = 'Sarah has 24 cookies. She wants to share them equally among 6 friends. How many cookies will each friend get?\n\nBonus: If Sarah keeps 3 cookies for herself before sharing, how many cookies will each friend get then?';

  const sampleMessages: Message[] = [
    {
      id: '1',
      role: 'system',
      content: "Hi! I'm your math tutor. I'm here to help you solve this problem. Let's work through it together! What do you think is the first step?",
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'student',
      content: "I think I need to divide 24 by 6?",
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'system',
      content: "Excellent thinking! Yes, when we're sharing equally, we use division. So what is 24 ÷ 6?",
      timestamp: new Date(),
    },
    {
      id: '4',
      role: 'student',
      content: "Is it 4?",
      timestamp: new Date(),
    },
    {
      id: '5',
      role: 'system',
      content: "Perfect! Each friend gets 4 cookies. Great job! 🎉\n\nNow, let's tackle the bonus question. If Sarah keeps 3 cookies for herself first, how many cookies are left to share?",
      timestamp: new Date(),
    },
    {
      id: '6',
      role: 'student',
      content: "24 - 3 = 21 cookies left",
      timestamp: new Date(),
    },
    {
      id: '7',
      role: 'system',
      content: "Exactly right! Now you have 21 cookies to share among 6 friends. What do you do next?",
      timestamp: new Date(),
    },
    {
      id: '8',
      role: 'student',
      content: "Divide 21 by 6... but that doesn't divide evenly, does it?",
      timestamp: new Date(),
    },
    {
      id: '9',
      role: 'system',
      content: "Great observation! You're absolutely right. 21 ÷ 6 = 3 remainder 3, which means each friend gets 3 whole cookies, and there are 3 cookies left over. What do you think Sarah could do with those extra 3 cookies?",
      timestamp: new Date(),
    },
  ];

  return (
    <Layout
      problem={sampleProblem}
      problemType="word"
      messages={sampleMessages}
      emptyState={false}
    />
  );
};

export default App;
