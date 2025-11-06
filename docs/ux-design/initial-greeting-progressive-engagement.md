# UX Design: Initial Greeting & Progressive Engagement

## Overview

This document defines the user experience pattern for initial tutor engagement when a problem is set, with progressive follow-up prompts if the student hasn't engaged.

## Design Goals

1. **Reduce Blank State Confusion:** Help students know where to start
2. **Encouraging Onboarding:** Set a warm, helpful tone from the start
3. **Progressive Engagement:** Escalate help if student seems stuck
4. **Non-Intrusive:** Respect student autonomy and don't interrupt active work
5. **Age-Appropriate:** Friendly, encouraging language for 6th grade students

## Engagement Pattern

### Pattern 1: Initial Greeting (First Prompt)

**When:** 2-3 seconds after problem is set

**Trigger Conditions:**

- Problem has been set
- No messages in chat yet
- Student hasn't started typing

**Message Examples:**

- "Hi! I'm here to help you work through this problem. What would you like to start with? 🎯"
- "Great! I see you have a problem to work on. What do you notice about this problem first?"
- "Hello! Ready to dive in? What part of this problem would you like to explore together?"

**Behavior:**

- Dismiss immediately if student starts typing
- Dismiss if student clicks elsewhere
- One-time only (per problem)

### Pattern 2: Follow-Up Prompt 1 (Second Prompt)

**When:** 15-20 seconds after initial greeting (if no response)

**Trigger Conditions:**

- Initial greeting was shown
- Student hasn't sent any messages
- Student hasn't attempted an answer (via Answer field or chat)
- Student hasn't typed in chat for 10+ seconds

**Message Examples:**

- "Still thinking? That's okay! What part of the problem are you looking at first?"
- "No rush! Take your time. What would you like to explore together?"
- "I'm here when you're ready! What do you think the first step might be?"

**Behavior:**

- Dismiss if student starts typing
- Dismiss if student attempts answer
- More encouraging, less directive

### Pattern 3: Follow-Up Prompt 2 (Third Prompt)

**When:** 30-40 seconds after follow-up 1 (if still no response)

**Trigger Conditions:**

- Follow-up 1 was shown
- Student still hasn't engaged
- Student hasn't typed for 15+ seconds

**Message Examples:**

- "Let's take it step by step! Can you tell me what you see in this problem?"
- "I'm here to help! What question do you have about this problem?"
- "Let's work together! What would you like to try first?"

**Behavior:**

- More specific guidance offer
- Offers to break down the problem
- Still Socratic, encouraging

### Pattern 4: Final Follow-Up Prompt 3 (Fourth Prompt)

**When:** 45-60 seconds after follow-up 2 (if still no response)

**Trigger Conditions:**

- Follow-up 2 was shown
- Student still hasn't engaged
- Student hasn't typed for 20+ seconds

**Message Examples:**

- "Want me to help you get started? I can guide you through the first step!"
- "Let's break this down together! What information do you see in the problem?"
- "I'm here to help! Want to explore this problem step by step?"

**Behavior:**

- More direct offer of help
- Still maintains Socratic principles
- Final attempt before stopping

### Maximum Engagement

**Stop After:** 3 follow-up prompts (4 total messages including initial greeting)

**After Maximum:**

- Stop prompting
- Wait for student to initiate
- Don't become annoying or pushy

## Typing Detection

**When to Pause Prompting:**

- Student is actively typing in chat input
- Student has typed in last 10 seconds
- Student has attempted an answer (via Answer field or chat)

**When to Resume Prompting:**

- Student stopped typing 10+ seconds ago
- No answer attempt detected
- Still within maximum prompt count

## Answer Attempt Detection

**What Counts as Engagement:**

- Student sends a message in chat
- Student submits an answer via Answer field
- Student types in chat input (active engagement)

**What Stops Prompting:**

- Any message sent
- Any answer attempt
- Student starts typing

## Implementation Details

### State Management

- Track prompt count (0-3)
- Track last prompt timestamp
- Track last typing activity
- Track answer attempt status

### Timing Intervals

- Initial greeting: 2-3 seconds
- Follow-up 1: 15-20 seconds after initial
- Follow-up 2: 30-40 seconds after follow-up 1
- Follow-up 3: 45-60 seconds after follow-up 2
- Typing detection: 10 second inactivity window

### Message Generation

**Initial Greeting:**

- Use Socratic opening question
- Warm, encouraging tone
- Age-appropriate language

**Follow-Up Prompts:**

- Progressively more helpful
- Still maintain Socratic principles
- Never give direct answers
- Increase encouragement if student seems hesitant

## User Experience Flow

```
Problem Set
    ↓
[Wait 2-3 seconds]
    ↓
Show Initial Greeting
    ↓
{Student responds?}
    ↓ YES → Stop prompting, continue normal flow
    ↓ NO
    ↓
{Wait 15-20 seconds}
    ↓
Show Follow-Up 1
    ↓
{Student responds?}
    ↓ YES → Stop prompting
    ↓ NO
    ↓
{Wait 30-40 seconds}
    ↓
Show Follow-Up 2
    ↓
{Student responds?}
    ↓ YES → Stop prompting
    ↓ NO
    ↓
{Wait 45-60 seconds}
    ↓
Show Follow-Up 3 (Final)
    ↓
{Student responds?}
    ↓ YES → Stop prompting
    ↓ NO → Stop prompting (max reached)
```

## Design Principles

1. **Respect Student Autonomy:** Never force interaction
2. **Progressive Escalation:** Start gentle, become more helpful
3. **Always Socratic:** Never give direct answers, even in prompts
4. **Age-Appropriate:** Friendly, encouraging, not patronizing
5. **Non-Intrusive:** Dismiss immediately if student engages

## Accessibility Considerations

- Screen readers announce new messages
- Keyboard navigation continues to work
- Prompts don't block input
- Clear visual indication of new messages

## Success Metrics

- **Engagement Rate:** % of students who respond after initial greeting
- **Prompt Effectiveness:** % who engage after each prompt level
- **Time to First Response:** Average time before student engages
- **User Satisfaction:** Feedback on helpfulness of prompts

## Notes

- Maximum 3 follow-up prompts (4 total messages) prevents annoyance
- Typing detection prevents interrupting active work
- Answer attempt detection stops prompts immediately
- Progressive escalation helps students who are hesitant or confused
- All prompts maintain Socratic principles - no direct answers
