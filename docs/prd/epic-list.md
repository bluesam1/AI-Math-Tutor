# Epic List

Epic 1: Foundation & Problem Input System

Epic 2: Socratic Dialogue System & Answer Detection

Epic 3: Visual Feedback & Math Rendering

---

**Epic 1: Foundation & Problem Input System**

Establishes project infrastructure (monorepo setup, Git, basic CI/CD, React app, Node.js/Express backend, AWS infrastructure configuration) while delivering core problem input functionality. This epic enables students to input math problems via text or image upload, with Vision API integration for parsing printed text, problem validation, and basic problem display. Students can start interacting with the system by submitting problems, even before Socratic dialogue is implemented.

**Epic 2: Socratic Dialogue System & Answer Detection**

Implements the core pedagogical functionality: LLM-based Socratic dialogue generation, two-tier answer detection guardrails (keyword-based pattern matching + LLM-based validation), context management (last 10 messages), and progressive help escalation. This epic enables students to engage in guided problem-solving through Socratic questioning, with enforced guardrails ensuring no direct answers are provided. The chat interface is fully functional, maintaining conversation context and adapting to student responses.

**Epic 3: Visual Feedback & Math Rendering**

Delivers the visual and mathematical rendering capabilities: LaTeX/KaTeX rendering for equations and formulas, prominent visual feedback elements appropriate for 6th grade students (progress indicators, encouraging messages, age-appropriate visual elements), responsive design for desktop/tablet/mobile, and final UI polish. This epic also includes comprehensive testing across all 5 problem types (arithmetic, algebra, geometry, word problems, multi-step) to validate the complete system. The system is fully functional and ready for deployment.

**Epic Sequencing Rationale:**

Epic 1 establishes the foundation and delivers immediate value (problem input and parsing), allowing early testing of core input functionality. Epic 2 builds upon Epic 1 by adding the pedagogical core (Socratic dialogue and guardrails), enabling end-to-end problem-solving workflows. Epic 3 completes the system with visual polish and mathematical rendering, ensuring the product is fully functional and ready for deployment. This sequential approach ensures each epic builds upon previous work while delivering tangible value, allowing for iterative testing and refinement.
