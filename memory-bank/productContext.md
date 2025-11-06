# Product Context: AI Math Tutor

**Last Updated:** 2025-11-05  
**Version:** 1.1

## Why This Project Exists

AI Math Tutor addresses a critical gap in math education resources. Students often struggle with math problems and need personalized guidance, but traditional resources like textbooks and videos either give away answers too quickly (reducing learning value) or lack the interactive, adaptive nature needed for effective learning. Existing AI chatbots frequently violate Socratic teaching principles by providing direct answers, while human tutors are expensive and not always available.

## Problems It Solves

### Primary Problems

1. **Answer Dependency:** Students become dependent on answers rather than developing problem-solving skills
2. **Poor Learning Retention:** Learning retention is poor when solutions are given directly
3. **Confidence Loss:** Students lose confidence when they can't work through problems independently
4. **One-Size-Fits-All:** Traditional approaches don't adapt to individual learning needs
5. **Resource Limitations:** Human tutors are expensive and not always available

### How It Solves These Problems

1. **Enforced Socratic Principles:** Answer detection guardrails ensure the system never provides direct answers, maintaining genuine learning value
2. **Adaptive Scaffolding:** LLM with chain-of-thought + progressive disclosure strategies adapts to student understanding level
3. **Visual Engagement:** Side-by-side layout (problem left, chat right) with prominent visual feedback keeps children engaged
4. **Dual Input Methods:** Text entry and image upload with Vision API parsing for accessibility
5. **Generic Problem Support:** Handles 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step) through a flexible, generic Socratic system

## How It Should Work

### Core User Flow

1. **Problem Input:** Student submits a math problem via text input or image upload
2. **Problem Validation:** System validates the problem is a valid math problem and identifies problem type
3. **Problem Display:** Problem is displayed on the left side of the interface
4. **Socratic Dialogue:** System generates guiding questions that help students discover solutions
5. **Answer Detection:** Guardrails ensure no direct answers are provided
6. **Context Management:** System maintains conversation context (last 10 messages) for coherent dialogue
7. **Progressive Help:** System escalates help when students are stuck (>2 turns) while maintaining Socratic principles
8. **Visual Feedback:** Prominent, age-appropriate visual feedback celebrates progress and encourages continued thinking

### Key Interaction Patterns

- **Side-by-Side Learning:** Problem remains visible on left while chat unfolds on right
- **Progressive Disclosure:** Information revealed progressively through Socratic questioning
- **Visual Feedback System:** Immediate, encouraging visual feedback for every interaction
- **Responsive Input Methods:** Text entry or image upload with clear visual feedback
- **Contextual Math Rendering:** Automatic LaTeX/KaTeX rendering for equations and formulas
- **Error Recovery:** Clear, age-appropriate error messages with fallback options

## User Experience Goals

### Target User: 6th Grade Students (Ages 11-12)

The system is specifically designed for 6th grade mathematics, focusing on:

- Operations with fractions and decimals
- Ratios and proportions
- Integers and absolute value
- Introductory algebraic expressions
- Basic geometry (area, perimeter, volume)
- Statistical thinking
- Multi-step word problems

### UX Vision

The interface should feel like working with a patient, encouraging human tutor who never gives away answers but guides students through discovery. The experience should be:

- **Visually Engaging:** Prominent progress indicators, encouraging feedback, clean layout
- **Age-Appropriate:** Designed specifically for 6th grade students (ages 11-12)
- **Educational:** Focus on mathematical content with proper notation rendering
- **Supportive:** Encouraging messages, positive reinforcement, celebration of progress
- **Accessible:** WCAG AA compliance, keyboard navigation, screen reader support

### Key UX Principles

1. **Never Give Direct Answers:** Core Socratic principle enforced through guardrails
2. **Adaptive Guidance:** System adjusts to student understanding level through progressive help
3. **Visual Engagement:** Prominent, interactive visual feedback appropriate for children
4. **Contextual Support:** Problem remains visible while dialogue unfolds
5. **Responsive Design:** Works effectively on desktop, tablet, and mobile devices

## Success Criteria

### User Success Metrics

- **Problem Completion Rate:** Students successfully complete problems through guided dialogue (target: 70%+ completion rate)
- **Learning Retention:** Students can explain their reasoning after solving problems (qualitative assessment)
- **Engagement:** Students use the system for multiple problems in a session (target: 3+ problems per session)
- **Satisfaction:** Students feel encouraged and supported, not frustrated by the Socratic approach (qualitative feedback)

### System Success Metrics

- **Socratic Compliance:** System never gives direct answers (target: 100% adherence, verified through testing)
- **Problem Type Coverage:** Successfully handles 5+ problem types with generic system
- **Context Maintenance:** Conversation context preserved across turns (target: coherent dialogue for 10+ message exchanges)
- **Response Quality:** Feedback is positive, encouraging, and pedagogically appropriate
- **Visual Feedback Effectiveness:** Prominent, interactive visual feedback engages students
