# Project Brief: AI Math Tutor

**Session Date:** November 3, 2025
**Facilitator:** Business Analyst Mary
**Participant:** Project Team

## Executive Summary

**Product Concept:** AI Math Tutor is an interactive web application that guides students through math problems using Socratic questioning, helping them discover solutions through guided dialogue rather than direct answers.

**Primary Problem:** Students often struggle with math problems and need personalized guidance, but traditional tutoring resources either give away answers too quickly (losing learning value) or lack the interactive, adaptive nature needed for effective learning.

**Target Market:** Students learning mathematics who need guided problem-solving assistance, particularly those who benefit from step-by-step questioning rather than direct instruction.

**Key Value Proposition:** Provides a patient, adaptive AI tutor that never gives direct answers but guides students through Socratic questioning to discover solutions themselves, with support for multiple input methods (text and image) and visual feedback appropriate for children.

## Problem Statement

**Current State & Pain Points:**

- Students struggle with math problems and need personalized guidance
- Traditional resources (textbooks, videos) either give away answers too quickly or lack interactivity
- Human tutors are expensive and not always available
- Existing AI tools often provide direct answers, reducing learning value
- Students need adaptive scaffolding that adjusts to their understanding level

**Impact of the Problem:**

- Students become dependent on answers rather than developing problem-solving skills
- Learning retention is poor when solutions are given directly
- Students lose confidence when they can't work through problems independently
- One-size-fits-all approaches don't adapt to individual learning needs

**Why Existing Solutions Fall Short:**

- **Answer-Key Resources:** Provide solutions without teaching the reasoning process
- **Video Tutorials:** Passive learning, no interactive adaptation to student responses
- **AI Chatbots:** Often give direct answers, violating Socratic teaching principles
- **Traditional Tutoring:** Expensive, not scalable, availability constraints

**Urgency & Importance:**
Solving this now is critical because:

- Math education is foundational for STEM learning
- Students need tools that develop thinking skills, not just answer-getting skills
- The success criteria require guiding through 5+ problem types without giving direct answers
- 3-day timeline requires a focused, effective solution

## Proposed Solution

**Core Concept & Approach:**
AI Math Tutor is a web application that accepts math problems via text input or image upload, uses Vision APIs to parse printed text, and employs an LLM-based dialogue system with answer detection guardrails to guide students through Socratic questioning. The system never gives direct answers but breaks down problems appropriately to nudge users toward correct solutions through progressive disclosure and chain-of-thought strategies.

**Key Differentiators from Existing Solutions:**

- **Socratic Enforcement:** Answer detection guardrails ensure the system never provides direct answers, maintaining genuine learning value
- **Dual Input Methods:** Text entry and image upload with Vision API parsing for accessibility
- **Visual Feedback:** Prominent, interactive visual feedback appropriate for children
- **Generic Problem Support:** Handles 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step) through a flexible, generic Socratic system
- **Progressive Help Escalation:** Escalates from questions to concrete hints when students are stuck, never abandoning them
- **Context-Aware:** Maintains conversation context (last 10 messages) to provide coherent, adaptive guidance

**Why This Solution Will Succeed Where Others Haven't:**

- **Enforced Pedagogy:** Guardrails ensure adherence to Socratic principles, not just intent
- **Adaptive Scaffolding:** LLM with chain-of-thought + progressive disclosure strategies adapts to student understanding level
- **Visual Engagement:** Side-by-side layout (problem left, chat right) with prominent visual feedback keeps children engaged
- **Technical Simplicity:** Vision APIs and LLM handle complexity, allowing focus on pedagogical quality in 3-day timeline

**High-Level Vision for the Product:**
A patient, encouraging AI tutor that feels like working with a skilled human tutor—one who asks the right questions, validates thinking, provides hints when needed, and celebrates progress. The system adapts Khan Academy techniques in an automated way, breaking down problems to help students discover solutions themselves while maintaining visual engagement and clear progress indicators.

## Target Users

### Primary User Segment: Students Learning Mathematics

**Demographic/Firmographic Profile:**

- Students in grades K-12 (elementary through high school)
- Age range: approximately 6-18 years old
- Students who need math help but are motivated to learn
- Access to devices with internet (web browser capability)

**Current Behaviors & Workflows:**

- Use textbooks, worksheets, or online resources for math practice
- May seek help from parents, teachers, or tutors when stuck
- Turn to answer keys or solution websites when frustrated
- Use calculators or photo math apps that provide direct answers
- Watch video tutorials for step-by-step explanations

**Specific Needs & Pain Points:**

- Need personalized guidance that adapts to their understanding level
- Struggle with working through problems independently
- Want immediate help when stuck on homework or practice problems
- Need encouragement and positive reinforcement during problem-solving
- Require visual feedback appropriate for their age level
- Frustrated by resources that give away answers too quickly
- Need help understanding "why" not just "how"

**Goals They're Trying to Achieve:**

- Successfully solve math problems independently
- Understand the reasoning behind solutions, not just memorize steps
- Build confidence in their problem-solving abilities
- Complete homework and practice problems accurately
- Prepare for tests and assessments
- Develop strong mathematical thinking skills

## Goals & Success Metrics

### Business Objectives

- **Pedagogical Quality (35% weight):** System successfully guides students through 5+ problem types without giving direct answers, maintaining genuine Socratic dialogue
- **Technical Implementation (30% weight):** Problem parsing works reliably (text + image), conversation context maintained across turns, system responds appropriately
- **User Experience (20% weight):** Intuitive interface, responsive interactions, visual feedback appropriate for children
- **Innovation (15% weight):** Creative stretch features that enhance the core experience (if time permits)

### User Success Metrics

- **Problem Completion Rate:** Students successfully complete problems through guided dialogue (target: 70%+ completion rate)
- **Learning Retention:** Students can explain their reasoning after solving problems (qualitative assessment)
- **Engagement:** Students use the system for multiple problems in a session (target: 3+ problems per session)
- **Satisfaction:** Students feel encouraged and supported, not frustrated by the Socratic approach (qualitative feedback)

### Key Performance Indicators (KPIs)

- **Socratic Compliance:** System never gives direct answers (target: 100% adherence, verified through testing)
- **Problem Type Coverage:** Successfully handles 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step) with generic system
- **Context Maintenance:** Conversation context preserved across turns (target: coherent dialogue for 10+ message exchanges)
- **Response Quality:** Feedback is positive, encouraging, and pedagogically appropriate (qualitative review)
- **Visual Feedback Effectiveness:** Prominent, interactive visual feedback engages students (qualitative assessment)

## MVP Scope

### Core Features (Must Have)

- **Problem Input (Text + Image):** Dual input methods—text entry and image upload with Vision API parsing for printed text (handwritten deferred)
- **Problem Understanding:** LLM-based system that identifies problem type and solution path; validates input is a math problem
- **Socratic Dialogue System:** LLM generates guiding questions with answer detection guardrails (post-processing) to ensure never giving direct answers
- **Visual Feedback:** Prominent, interactive visual feedback appropriate for children (progress indicators, encouraging responses)
- **Math Rendering:** Automatic LaTeX/KaTeX rendering for equations and formulas in problems and responses
- **Context Management:** Maintains conversation context (last 10 messages) within single browser session
- **Side-by-Side UI:** Problem displayed on left side, chat conversation on right side
- **Progressive Help Escalation:** System provides more concrete hints when students are stuck (>2 turns), never abandoning them
- **Generic Problem Support:** Handles 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step) through flexible Socratic system
- **Answer/Thinking Validation:** System validates student responses and provides positive redirection for wrong answers

### Out of Scope for MVP

- **Handwritten Text Recognition:** Starting with printed text only for image parsing
- **Voice Input/Output:** Text-based interface for MVP (voice interface is stretch feature)
- **Conversation History Persistence:** Single session per browser (no saved sessions)
- **Problem Type Suggestions:** Defer to post-MVP (focus on handling submitted problems)
- **Assessment Features:** Testing students with similar problems (defer to post-MVP)
- **Complex Gamification:** Keep simple, encouraging feedback (defer advanced gamification)
- **Animated Avatar:** 2D/3D tutor character (stretch feature)
- **Difficulty Modes:** Grade-level adjustments (stretch feature)
- **Problem Generation:** Creating similar practice problems (stretch feature)
- **Interactive Whiteboard:** Shared canvas for visual explanations (stretch feature)
- **Step Visualization:** Animated breakdown of solution steps (stretch feature)

### MVP Success Criteria

The MVP successfully guides students through 5+ problem types without giving direct answers, maintains conversation context across turns, and adapts to student understanding level. The system demonstrates:

- Reliable problem parsing (text + image with Vision APIs)
- Enforced Socratic dialogue (never gives direct answers via guardrails)
- Visual feedback appropriate for children
- Generic system handling multiple problem types
- Intuitive interface with side-by-side layout
- Responsive, encouraging interactions

## Post-MVP Vision

### Phase 2 Features

- **Handwritten Text Recognition:** Extend image parsing to support handwritten math problems
- **Voice Interface:** Text-to-speech responses and speech-to-text input for younger students
- **Conversation History Persistence:** Save sessions, allow users to return to previous conversations
- **Problem Type Suggestions:** Suggest similar problems or problem types based on student needs
- **Assessment Features:** Test students with similar problems they struggled on to measure learning
- **Enhanced Gamification:** Pragmatic gamification elements appropriate for educational context (without overcomplicating)
- **Difficulty Modes:** Adjust scaffolding by grade level (K-5, 6-8, 9-12)
- **Problem Generation:** Create similar practice problems automatically

### Long-term Vision

**One-Year Vision:**
An adaptive AI math tutor that supports students across all K-12 math topics, with personalized learning paths, progress tracking, and integration with classroom curricula. The system maintains its core Socratic approach while expanding to cover advanced topics (calculus, statistics) and supporting teachers with insights into student learning patterns.

**Two-Year Vision:**
A comprehensive math learning platform that combines Socratic tutoring with practice problem generation, assessment tools, and teacher dashboards. The system expands beyond math to other subjects (science, language learning) while maintaining the same pedagogical principles of guided discovery.

### Expansion Opportunities

- **Subject Expansion:** Extend Socratic approach to science, language learning, and other subjects
- **Teacher Tools:** Dashboard for teachers to monitor student progress, identify common struggles, and generate practice problems
- **Parent Dashboard:** Track child's progress, see areas of strength and struggle
- **API Integration:** Connect with learning management systems (LMS) and educational platforms
- **Mobile Apps:** Native mobile applications for iOS and Android
- **Offline Mode:** Support for offline usage with local model or cached responses

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web application (responsive design for desktop, tablet, mobile browsers)
- **Browser/OS Support:** Modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled
- **Performance Requirements:**
  - Fast response times (< 3 seconds for LLM responses)
  - Smooth visual feedback interactions
  - Efficient image processing (Vision API integration)

### Technology Preferences

- **Frontend:** React for component-based UI with side-by-side layout
- **Backend:** Node.js/Express for API endpoints handling LLM integration and Vision API calls
- **Database:** Lightweight solution for session management (AWS ElastiCache for Redis, or DynamoDB for session storage)
- **Hosting/Infrastructure:**
  - **AWS Infrastructure:**
    - Frontend: AWS S3 + CloudFront for static hosting, or AWS Amplify for full-stack deployment
    - Backend: AWS Lambda (serverless) or EC2/ECS for API endpoints
    - Session Storage: AWS ElastiCache (Redis) or DynamoDB for session management
    - API Gateway: AWS API Gateway for API routing and management
    - Container: AWS ECS or EKS if using containerized deployment
  - Alternative: Cloud hosting (Vercel, Netlify for frontend; Railway, Render for backend) if AWS is not preferred

### Architecture Considerations

- **Repository Structure:** Monorepo or separate frontend/backend repos depending on team preferences
- **Service Architecture:**
  - **Frontend:** UI components (problem display, chat interface, math rendering)
  - **Problem Input Handler:** Routes text/image inputs appropriately
  - **Image Parser:** Vision API integration (OpenAI Vision, Google Vision, or similar)
  - **Problem Understanding:** LLM service call (OpenAI GPT-4, Claude, or similar)
  - **Dialogue System:** LLM service with answer detection guardrails (post-processing)
  - **Context Manager:** Session storage (last 10 messages + problem understanding)
  - **Math Rendering:** LaTeX/KaTeX library integration
- **Integration Requirements:**
  - Vision API for image parsing (printed text)
  - LLM API for problem understanding and dialogue generation
  - Answer detection logic (could be rule-based or LLM-based)
- **Security/Compliance:**
  - No sensitive user data collection (anonymous sessions)
  - API key management for external services
  - Input sanitization for text inputs

## Constraints & Assumptions

### Constraints

- **Budget:** Limited budget for MVP (3-day timeline suggests minimal external costs beyond API usage)
  - Vision API costs (per image processed)
  - LLM API costs (per request/token)
  - AWS infrastructure costs (minimal for MVP scale)
- **Timeline:** 3-day development window for MVP
  - Must prioritize core features over stretch features
  - Trade-offs between polish and feature completeness
- **Resources:**
  - Single developer or small team
  - Limited time for extensive testing and refinement
- **Technical:**
  - Must use existing APIs (Vision APIs, LLM APIs) rather than building from scratch
  - Printed text only for image parsing (handwritten text deferred)
  - Single browser session for context management (no persistence)

### Key Assumptions

- **API Availability:** Vision APIs and LLM APIs are available and reliable for the MVP timeline
- **User Behavior:** Students will engage with text-based Socratic dialogue (visual feedback enhances but doesn't replace text)
- **Problem Types:** Generic Socratic system can handle 5+ problem types effectively without specialized logic per type
- **Answer Detection:** Post-processing guardrails can reliably detect and prevent direct answers from LLM responses
- **Context Window:** Last 10 messages provide sufficient context for coherent Socratic dialogue
- **Visual Feedback:** Progress indicators and encouraging responses are sufficient visual feedback for children (no avatar required)
- **Browser Capabilities:** Modern browsers support required features (Web APIs, JavaScript, responsive design)
- **LLM Reliability:** LLM can generate appropriate Socratic questions and hints without giving direct answers (with guardrails)

## Risks & Open Questions

### Key Risks

- **LLM Answer Detection Failure:** Guardrails may fail to detect direct answers in some edge cases, violating core Socratic principle
  - **Impact:** High - undermines pedagogical quality and evaluation criteria
  - **Mitigation:** Multiple detection strategies (keyword-based, LLM-based validation), extensive testing across problem types
- **Vision API Accuracy:** Vision API may misparse math problems, especially with complex notation or poor image quality
  - **Impact:** Medium - breaks user experience, but text input provides fallback
  - **Mitigation:** Image preprocessing, clear error handling, fallback to manual text entry
- **Generic System Limitations:** Generic Socratic system may not provide optimal guidance for all 5+ problem types
  - **Impact:** Medium - may need refinement post-MVP
  - **Mitigation:** Design flexible system that can be enhanced with problem-type-specific logic later
- **Context Window Limitations:** Last 10 messages may not be sufficient for complex multi-step problems
  - **Impact:** Medium - may lose coherence in long conversations
  - **Mitigation:** Monitor context quality, adjust window size if needed, implement conversation summarization post-MVP
- **API Rate Limits/Costs:** LLM and Vision API costs may exceed budget or hit rate limits during testing
  - **Impact:** Medium - blocks development or deployment
  - **Mitigation:** Monitor API usage, implement caching where possible, use cost-effective API tiers
- **3-Day Timeline Pressure:** Insufficient time for thorough testing and refinement
  - **Impact:** High - may result in bugs or incomplete features
  - **Mitigation:** Focus on core features, prioritize working MVP over polish, plan for post-MVP refinement

### Open Questions

- **Answer Detection Strategy:** What combination of rule-based and LLM-based detection provides best accuracy?
- **Visual Feedback Design:** What specific visual feedback elements are most effective for children (emojis, colors, animations)?
- **Problem Type Coverage:** Which 5 problem types should be prioritized for testing (arithmetic, algebra, geometry, word problems, multi-step)?
- **Session Management:** Should sessions expire after inactivity, or persist for full browser session?
- **Error Handling:** How should system handle cases where Vision API fails or LLM returns inappropriate responses?
- **Progressive Help Threshold:** What's the optimal number of stuck turns before escalating to more concrete hints?

### Areas Needing Further Research

- **Socratic Prompting Best Practices:** Research optimal prompting strategies for Socratic dialogue in educational contexts
- **Visual Feedback Patterns:** Study effective visual feedback patterns for children in educational applications
- **LLM Guardrail Techniques:** Research best practices for detecting and preventing direct answers in educational AI systems
- **Khan Academy Techniques:** Analyze Khan Academy's automated hint and scaffolding systems for adaptation
- **Chain-of-Thought + Progressive Disclosure:** Explore how to combine these strategies effectively in dialogue systems

## Appendices

### A. Research Summary

**Brainstorming Session Results:**

- Conducted structured brainstorming session covering features, UX, technical architecture, and implementation approach
- Key techniques used: First Principles Thinking, Constraint-Based Ideation, Morphological Analysis, SCAMPER Method
- Identified essential components: Problem input (text + image), Socratic dialogue system, visual feedback, math rendering, context management
- Architecture components: Frontend (React), Problem Input Handler, Image Parser (Vision APIs), Problem Understanding (LLM), Dialogue System (LLM + guardrails), Session/Context Manager, Math Rendering (LaTeX/KaTeX)
- Decision: Generic Socratic system handling 5+ problem types (can be refined post-MVP)
- UI Layout: Side-by-side (problem left, chat right)

**Key Insights:**

- LLM + guardrails approach (post-processing answer detection) balances control and flexibility
- Vision APIs simplify image parsing path within 3-day timeline
- Progressive disclosure + chain-of-thought strategies adapt well to Socratic dialogue
- Visual feedback should be prominent and interactive for children
- Generic system approach allows handling 5+ problem types without per-type specialization

**Adaptation Opportunities:**

- Khan Academy techniques can be automated for more adaptive assistance
- Pragmatic gamification appropriate for educational context
- Assessment features (testing with similar problems) deferred to post-MVP

### B. Stakeholder Input

**Original Project Brief:** "AI Math Tutor - Socratic Learning Assistant"

- Timeline: 3-5 days core + optional stretch features
- Success Criteria: Guides students through 5+ problem types without giving direct answers; maintains conversation context; adapts to student understanding level
- Evaluation: Pedagogical Quality (35%), Technical Implementation (30%), User Experience (20%), Innovation (15%)

**Requirements from Original Spec:**

- Problem Input: Text entry + image upload with OCR/Vision LLM parsing
- Socratic Dialogue: Multi-turn conversation that asks guiding questions, validates responses, provides hints (never direct answers)
- Math Rendering: Display equations properly (LaTeX/KaTeX)
- Web Interface: Clean chat UI with image upload and conversation history
- Test with: Simple arithmetic, algebra, geometry, word problems, multi-step problems

### C. References

- **Original Project Brief:** `_docs/AI Math Tutor.md`
- **Reference Video:** OpenAI x Khan Academy Demo - https://www.youtube.com/watch?v=IvXZCocyU_M
- **BMAD Method Documentation:** `.bmad-core/user-guide.md`
- **Brainstorming Session Results:** Documented in this Project Brief (Section A)

## Next Steps

### Immediate Actions

1. **PM Handoff:** Review this Project Brief with the Product Manager to create the PRD (Product Requirements Document)
   - Use the PM agent to create PRD from this brief
   - Break down MVP features into detailed requirements
   - Define user stories and acceptance criteria

2. **Architecture Design:** Collaborate with Architect agent to design system architecture
   - Define component interactions and data flows
   - Specify API contracts and integration points
   - Design database schema for session management (if needed)

3. **Technical Setup:** Initialize project structure
   - Set up React frontend project
   - Set up Node.js/Express backend project
   - Configure AWS infrastructure (S3, CloudFront, Lambda/EC2, ElastiCache/DynamoDB)
   - Set up API keys for Vision API and LLM API

4. **Development Planning:** Break down 3-day timeline
   - Day 1: Problem input (text + image) + Vision API integration + Problem understanding
   - Day 2: Socratic dialogue system + Answer detection guardrails + Math rendering
   - Day 3: UI/UX polish + Visual feedback + Testing + Documentation

5. **Testing Strategy:** Plan testing approach
   - Test with 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step)
   - Validate answer detection guardrails
   - Test conversation context maintenance
   - Validate visual feedback effectiveness

### PM Handoff

This Project Brief provides the full context for **AI Math Tutor**. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.
