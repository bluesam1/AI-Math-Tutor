# Project Brief: AI Math Tutor

**Last Updated:** 2025-11-05  
**Version:** 1.1

## Executive Summary

AI Math Tutor is an interactive web application that guides students through math problems using Socratic questioning, helping them discover solutions through guided dialogue rather than direct answers. The system is specifically designed for 6th grade mathematics (ages 11-12), focusing on core 6th grade math topics including operations with fractions and decimals, ratios and proportions, integers and absolute value, introductory algebraic expressions, basic geometry (area, perimeter, volume), statistical thinking, and multi-step word problems.

**Primary Problem:** Students often struggle with math problems and need personalized guidance, but traditional tutoring resources either give away answers too quickly (losing learning value) or lack the interactive, adaptive nature needed for effective learning.

**Target Market:** Students learning mathematics who need guided problem-solving assistance, particularly those who benefit from step-by-step questioning rather than direct instruction.

**Key Value Proposition:** Provides a patient, adaptive AI tutor that never gives direct answers but guides students through Socratic questioning to discover solutions themselves, with support for multiple input methods (text and image) and visual feedback appropriate for children.

## Core Requirements

### Functional Requirements

1. **Problem Input:** Dual input methods—text entry and image upload with Vision API parsing for printed text (handwritten deferred)
2. **Problem Understanding:** LLM-based system that identifies problem type and solution path; validates input is a math problem
3. **Socratic Dialogue System:** LLM generates guiding questions with answer detection guardrails (post-processing) to ensure never giving direct answers
4. **Visual Feedback:** Prominent, interactive visual feedback appropriate for 6th grade students (progress indicators, encouraging responses)
5. **Math Rendering:** Automatic LaTeX/KaTeX rendering for equations and formulas in problems and responses
6. **Context Management:** Maintains conversation context (last 10 messages) within single browser session
7. **Side-by-Side UI:** Problem displayed on left side, chat conversation on right side
8. **Progressive Help Escalation:** System provides more concrete hints when students are stuck (>2 turns), never abandoning them
9. **Generic Problem Support:** Handles 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step) through flexible Socratic system
10. **Answer/Thinking Validation:** System validates student responses and provides positive redirection for wrong answers

### Success Metrics

- **Socratic Compliance:** System never gives direct answers (target: 100% adherence, verified through testing)
- **Problem Type Coverage:** Successfully handles 5+ problem types with generic system
- **Context Maintenance:** Conversation context preserved across turns (target: coherent dialogue for 10+ message exchanges)
- **Response Quality:** Feedback is positive, encouraging, and pedagogically appropriate
- **Visual Feedback Effectiveness:** Prominent, interactive visual feedback engages students

## Technical Foundation

### Technology Stack

- **Frontend:** React 18.2.0 + TypeScript 5.3.0+ + Vite 5.0.0 + Tailwind CSS v4.1.16
- **Backend:** Node.js/Express 4.18.0 + TypeScript 5.3.0+
- **Infrastructure:** Firebase (Hosting, Cloud Functions, Firestore)
- **External APIs:** OpenAI Vision API, LLM API (OpenAI GPT-4 or Claude)
- **Math Rendering:** LaTeX/KaTeX
- **Architecture:** Serverless monorepo with npm workspaces

### Repository Structure

Monorepo structure with:

- `apps/web/` - React frontend application
- `functions/` - Firebase Cloud Functions (Express API)
- `packages/shared/` - Shared TypeScript types and utilities
- `packages/config/` - Shared ESLint, TypeScript, Jest configurations

### Key Constraints

- **Timeline:** 3-day development window for MVP
- **Budget:** Limited budget for MVP (API costs: Vision API, LLM API, AWS infrastructure)
- **Scope:** 6th grade mathematics focus
- **TypeScript Only:** All code must be written in TypeScript (no raw JavaScript)
- **No Direct Answers:** Core requirement—system must never give direct answers

## Project Goals

1. **Pedagogical Quality (35% weight):** System successfully guides students through 5+ problem types without giving direct answers, maintaining genuine Socratic dialogue
2. **Technical Implementation (30% weight):** Problem parsing works reliably (text + image), conversation context maintained across turns, system responds appropriately
3. **User Experience (20% weight):** Intuitive interface, responsive interactions, visual feedback appropriate for children
4. **Innovation (15% weight):** Creative stretch features that enhance the core experience (if time permits)

## Out of Scope for MVP

- Handwritten text recognition (printed text only)
- Voice input/output
- Conversation history persistence beyond browser session
- Problem type suggestions
- Assessment features
- Complex gamification
- Animated avatar
- Difficulty modes
- Problem generation
- Interactive whiteboard
- Step visualization

## References

- **Project Brief:** `docs/brief.md`
- **PRD:** `docs/prd.md`
- **Architecture:** `docs/architecture/`
- **Stories:** `docs/stories/`
