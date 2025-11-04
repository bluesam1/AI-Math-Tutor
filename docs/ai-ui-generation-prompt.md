# AI UI Generation Prompt for AI Math Tutor

## How to Use This Prompt

Copy the prompt below and paste it into:
- **v0.dev** (Vercel): https://v0.dev
- **Lovable.ai**: https://lovable.dev
- Or any similar AI UI generation tool

**Recommended Approach:** Start with the main interface prompt, then use subsequent prompts for individual components. This allows for iterative refinement.

---

## Prompt 1: Main Problem-Solving Interface

```text
Create a React + TypeScript application with Tailwind CSS v4.1.16 for an AI Math Tutor interface designed for 6th grade students (ages 11-12). This is a single-page application with a side-by-side layout.

### High-Level Goal
Build the main problem-solving interface with a split-screen layout: problem display on the left, chat conversation on the right. The interface should be age-appropriate, engaging, and accessible (WCAG AA compliant).

### Tech Stack
- React (latest stable) with TypeScript (.tsx files only, no raw JavaScript)
- Tailwind CSS v4.1.16 for all styling
- Functional components with React Hooks (useState, useContext)
- No external UI component libraries (build custom components with Tailwind)

### Visual Style & Design System

**Color Palette:**
- Primary: #4F46E5 (Indigo) - Primary buttons, links, key interactive elements
- Secondary: #10B981 (Emerald) - Success states, progress indicators, positive feedback
- Accent: #F59E0B (Amber) - Highlights, encouragement elements
- Success: #10B981 (Emerald)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red) - Error messages, validation failures
- Text Primary: #1F2937 (Gray-800) - Primary text, problem statements
- Text Secondary: #6B7280 (Gray-500) - Secondary text, helper text
- Background: #FFFFFF (White) - Primary background
- Background Secondary: #F9FAFB (Gray-50) - Secondary background, chat message backgrounds
- Border: #E5E7EB (Gray-200) - Borders, dividers

**Typography:**
- Font Family: Inter or system font stack (sans-serif)
- H1: 2rem (32px), 700 weight, 1.2 line height
- H2: 1.5rem (24px), 600 weight, 1.3 line height
- H3: 1.25rem (20px), 600 weight, 1.4 line height
- Body: 1rem (16px), 400 weight, 1.5 line height
- Small: 0.875rem (14px), 400 weight, 1.5 line height

**Design Principles:**
- Clean, educational aesthetic appropriate for 11-12 year olds
- Colorful but not overwhelming
- Friendly and encouraging visual feedback
- Minimalist core with purposeful visual elements
- Generous white space

### Step-by-Step Instructions

1. **Create the main layout component** (`App.tsx` or `MainLayout.tsx`):
   - Implement a responsive side-by-side layout using CSS Grid or Flexbox
   - Desktop (1024px+): 50/50 split - Problem panel (left) and Chat panel (right)
   - Tablet (768px-1023px): 45/55 split with adjusted spacing
   - Mobile (320px-767px): Stacked layout - Problem panel (top) and Chat panel (bottom), full width
   - Use Tailwind responsive breakpoints: `md:` for tablet, `lg:` for desktop

2. **Create the Problem Display Panel component** (`ProblemPanel.tsx`):
   - Left panel (desktop) or top panel (mobile)
   - Header section: "Math Problem" title with subtle styling
   - Main content area: Display problem text with proper typography
   - Problem type badge: Small badge showing problem type (e.g., "Arithmetic", "Algebra")
   - Empty state: Show input options when no problem is active
   - Loading state: Show loading spinner when problem is being processed
   - Error state: Show error message with retry option
   - Use background color: `bg-gray-50` for panel background
   - Use border: `border-r border-gray-200` for desktop separation

3. **Create the Chat Conversation Panel component** (`ChatPanel.tsx`):
   - Right panel (desktop) or bottom panel (mobile)
   - Header section: "Chat with Tutor" title
   - Message list area: Scrollable container for messages
   - Message input area: Fixed at bottom with input field and send button
   - Use background color: `bg-white` for panel background
   - Ensure messages auto-scroll to bottom when new messages arrive

4. **Create responsive breakpoints**:
   - Mobile-first approach: Design for mobile (320px-767px) first
   - Use Tailwind classes: `flex-col` for mobile, `md:flex-row` for tablet+
   - Ensure touch targets are at least 44x44px on mobile
   - Test at breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)

5. **Add accessibility features**:
   - Proper semantic HTML (main, section, article elements)
   - ARIA labels for interactive elements
   - Keyboard navigation support (Tab, Enter, Space)
   - Focus indicators (use primary color with 2px outline)
   - Screen reader announcements for dynamic content

6. **Implement basic state management**:
   - Use React useState for local component state
   - Create context (React Context API) for shared state (problem, messages, session)
   - Type all state with TypeScript interfaces

### Component Structure

Create these TypeScript interfaces:

```typescript
interface Problem {
  id: string;
  text: string;
  type: 'arithmetic' | 'algebra' | 'geometry' | 'word' | 'multi-step';
}

interface Message {
  id: string;
  role: 'student' | 'system';
  content: string;
  timestamp: Date;
}

interface Session {
  sessionId: string;
  problem: Problem | null;
  messages: Message[];
}
```

### Constraints & Important Notes

**DO:**
- Use only Tailwind CSS utility classes for styling (no custom CSS files)
- Use TypeScript for all files (.tsx for components, .ts for utilities)
- Make all interactive elements keyboard accessible
- Ensure color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Use semantic HTML elements
- Make components responsive with Tailwind breakpoints
- Add loading states for async operations
- Add error states with age-appropriate error messages

**DON'T:**
- Don't use external UI component libraries (Material-UI, Chakra, etc.)
- Don't use inline styles or CSS-in-JS
- Don't use raw JavaScript (only TypeScript)
- Don't create complex animations yet (keep it simple for MVP)
- Don't implement math rendering yet (we'll add KaTeX later)
- Don't add authentication or user accounts
- Don't create navigation menus (single-page app)

### File Structure

Create this file structure:
```plaintext
src/
  components/
    ProblemPanel.tsx
    ChatPanel.tsx
    MainLayout.tsx
  types/
    index.ts (interfaces)
  contexts/
    SessionContext.tsx
  App.tsx
  main.tsx
```

### Scope

**Include:**
- Main layout with side-by-side panels
- Problem display panel (empty, loading, active states)
- Chat panel structure (message list and input area)
- Responsive design for mobile, tablet, desktop
- Basic TypeScript types and interfaces
- Accessibility features (ARIA labels, keyboard navigation)

**Exclude (for now):**
- Actual message rendering (we'll add that in next prompt)
- Math rendering with KaTeX (we'll add that separately)
- Image upload functionality (we'll add that separately)
- API integration (we'll add that separately)
- Visual feedback components (we'll add those separately)

### Expected Output

A working React application with:
- Responsive side-by-side layout
- Problem panel with empty/loading/active states
- Chat panel with message list area and input field
- Proper TypeScript typing throughout
- Tailwind CSS styling with the specified color palette
- Accessibility features implemented
- Mobile-first responsive design

Start with the mobile layout first, then enhance for tablet and desktop.


---

## Prompt 2: Chat Message Components

```text
Extend the AI Math Tutor application by adding chat message components.

### High-Level Goal
Create message components that display student and system messages in the chat panel with proper styling, alignment, and formatting.

### Step-by-Step Instructions

1. **Create MessageItem component** (`MessageItem.tsx`):
   - Accept props: `message: Message` (from previous prompt)
   - Student messages: Right-aligned, use primary color background (#4F46E5 with light tint)
   - System messages: Left-aligned, use secondary background (#F9FAFB)
   - Display message content with proper typography (body text: 1rem, 400 weight)
   - Show timestamp (optional, subtle styling)
   - Add subtle rounded corners: `rounded-lg` or `rounded-xl`
   - Add padding: `p-3` or `p-4` for message content
   - Add max-width: `max-w-[80%]` for messages to prevent full-width stretching

2. **Create MessageList component** (`MessageList.tsx`):
   - Accept props: `messages: Message[]`
   - Render list of MessageItem components
   - Auto-scroll to bottom when new messages arrive
   - Use `useEffect` with `messages` dependency to scroll
   - Add smooth scrolling: `scroll-behavior: smooth`
   - Use flexbox for vertical stacking: `flex flex-col gap-3` or `gap-4`

3. **Create LoadingMessage component** (`LoadingMessage.tsx`):
   - Display when system is generating a response
   - Show loading spinner (use Tailwind's animate-spin with a simple SVG circle)
   - Display "Thinking..." text with secondary text color
   - Left-aligned like system messages
   - Use subtle animation (not distracting)

4. **Update ChatPanel component**:
   - Integrate MessageList component
   - Show LoadingMessage when `isLoading` state is true
   - Handle empty state: Show friendly message when no messages yet
   - Ensure proper spacing and padding

### Visual Styling

**Student Messages:**
- Background: `bg-indigo-100` or `bg-indigo-50` (light tint of primary color)
- Text: `text-gray-800`
- Alignment: `ml-auto` (right-aligned)
- Border radius: `rounded-lg rounded-tr-sm` (rounded except top-right corner)

**System Messages:**
- Background: `bg-gray-50` (secondary background)
- Text: `text-gray-800`
- Alignment: `mr-auto` (left-aligned)
- Border radius: `rounded-lg rounded-tl-sm` (rounded except top-left corner)

**Loading Message:**
- Background: `bg-gray-50`
- Text: `text-gray-500` (secondary text color)
- Alignment: Left-aligned like system messages
- Icon: Simple spinner animation

### Constraints

**DO:**
- Use TypeScript for all components
- Make messages accessible (proper ARIA labels)
- Ensure proper contrast for text readability
- Handle long messages gracefully (text wrapping)
- Add smooth scrolling behavior

**DON'T:**
- Don't add math rendering yet (we'll add KaTeX separately)
- Don't add complex animations (keep it simple)
- Don't add message editing or deletion (not in MVP)

### Expected Output

Chat panel that displays:
- Student messages (right-aligned, primary color tint)
- System messages (left-aligned, secondary background)
- Loading indicator when system is thinking
- Auto-scroll to latest message
- Proper spacing and typography
```

---

## Prompt 3: Problem Input Components

```text
Extend the AI Math Tutor application by adding problem input components for text and image upload.

### High-Level Goal
Create input components that allow students to submit math problems via text input or image upload, with proper validation and visual feedback.

### Step-by-Step Instructions

1. **Create TextInput component** (`TextInput.tsx`):
   - Multi-line textarea for problem input
   - Placeholder: "Type your math problem here..."
   - Label: "Enter Math Problem" (accessible label)
   - Submit button: "Start Solving" or "Submit" with primary color styling
   - Validation: Show error if empty on submit
   - Error message: "Please enter a math problem" (age-appropriate)
   - Disabled state: When processing or submitting
   - Focus state: Use primary color border (`border-indigo-500`)
   - Size: Large enough for comfortable typing (min-height: 120px)

2. **Create ImageUpload component** (`ImageUpload.tsx`):
   - Support both click-to-upload and drag-and-drop
   - Upload button: "Upload Image" with icon (upload icon from Heroicons)
   - Drop zone: Visual area that highlights when dragging file over
   - File validation: JPG, PNG, GIF only, max 10MB
   - Error messages: Age-appropriate messages for invalid files
   - Image preview: Show preview after selection (before upload)
   - Loading state: Show spinner during upload
   - Success state: Show checkmark after successful selection
   - Use secondary color for upload button

3. **Create ProblemInput component** (`ProblemInput.tsx`):
   - Container component that combines TextInput and ImageUpload
   - Layout: Stack vertically on mobile, side-by-side on desktop
   - Divider: "or" text between input methods
   - Handle submission for both input methods
   - Show loading state during processing
   - Show error state with retry option
   - Use in ProblemPanel empty state

4. **Update ProblemPanel component**:
   - Integrate ProblemInput component in empty state
   - Show input options when no problem is active
   - Handle problem submission and update state
   - Show loading indicator during problem processing
   - Show error messages with retry option

### Visual Styling

**Text Input:**
- Border: `border-2 border-gray-300`
- Focus: `focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`
- Padding: `p-3` or `p-4`
- Border radius: `rounded-lg`
- Font: Body text size (1rem)

**Upload Button:**
- Background: `bg-emerald-500` (secondary color) or `bg-indigo-600` (primary)
- Hover: `hover:bg-emerald-600` or `hover:bg-indigo-700`
- Text: White
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`
- Icon: Upload icon (Heroicons or similar)

**Drop Zone:**
- Border: `border-2 border-dashed border-gray-300`
- Hover: `hover:border-indigo-400 hover:bg-indigo-50`
- Dragging: `border-indigo-500 bg-indigo-100`
- Padding: `p-8` or `p-12`
- Border radius: `rounded-lg`
- Text: Center-aligned, secondary text color

**Error Messages:**
- Background: `bg-red-50`
- Border: `border border-red-200`
- Text: `text-red-800`
- Icon: Error icon (X or alert icon)
- Padding: `p-3` or `p-4`
- Border radius: `rounded-lg`

### Constraints

**DO:**
- Use TypeScript for all components
- Validate file types and sizes before upload
- Provide clear, age-appropriate error messages
- Make drag-and-drop accessible (keyboard alternative)
- Show visual feedback for all states (default, hover, dragging, loading, error)
- Ensure touch-friendly on mobile (large touch targets)

**DON'T:**
- Don't actually upload images yet (we'll add API integration separately)
- Don't add image editing features
- Don't add multiple file selection (one at a time for MVP)
- Don't add file compression client-side (backend handles this)

### Expected Output

Problem input components that:
- Allow text input with validation
- Support image upload with drag-and-drop
- Show proper loading and error states
- Provide age-appropriate error messages
- Work seamlessly on mobile, tablet, and desktop
```

---

## Prompt 4: Visual Feedback Components

```text
Extend the AI Math Tutor application by adding visual feedback components for encouragement and progress.

### High-Level Goal
Create components that provide positive reinforcement, progress indicators, and encouragement messages appropriate for 6th grade students.

### Step-by-Step Instructions

1. **Create EncouragementMessage component** (`EncouragementMessage.tsx`):
   - Display positive reinforcement messages
   - Variants: "Great thinking!", "You're making progress!", "I can see you're working hard!"
   - Include emoji or icon (star, lightbulb, checkmark)
   - Use accent color (Amber #F59E0B) for highlights
   - Subtle animation: Fade in with bounce effect
   - Auto-dismiss after 3-5 seconds or dismissible with X button
   - Position: Top of chat panel or floating above input area
   - Use secondary color background with accent border

2. **Create ProgressIndicator component** (`ProgressIndicator.tsx`):
   - Show student advancement through problem-solving
   - Variant: Progress bar or step indicators
   - Use secondary color (Emerald #10B981) for progress
   - Show milestones or steps (e.g., "Step 1 of 4")
   - Don't reveal actual solution steps or answers
   - Celebrate effort, not just correct answers
   - Position: Top of problem panel or integrated in chat header

3. **Create HelpEscalationIndicator component** (`HelpEscalationIndicator.tsx`):
   - Show when help is escalating (more concrete hints)
   - Subtle indicator: "Need more help?" with icon
   - Use warning color (Amber #F59E0B) for visibility
   - Not alarming - friendly and supportive
   - Position: Near chat input or in chat header

4. **Integrate visual feedback in MainLayout**:
   - Add state management for feedback messages
   - Show encouragement after student responses
   - Show progress indicators throughout session
   - Handle timing and dismissal of messages

### Visual Styling

**Encouragement Message:**
- Background: `bg-amber-50` (light accent color)
- Border: `border-l-4 border-amber-400` (accent color border)
- Text: `text-gray-800`
- Icon/Emoji: Amber color (#F59E0B)
- Padding: `p-4`
- Border radius: `rounded-lg`
- Shadow: Subtle shadow for elevation

**Progress Indicator:**
- Background: `bg-gray-200` (progress bar track)
- Fill: `bg-emerald-500` (secondary color for progress)
- Text: `text-gray-700` (step labels)
- Height: `h-2` or `h-3` for progress bar
- Border radius: `rounded-full`

**Help Escalation:**
- Background: `bg-amber-100` (light warning)
- Border: `border border-amber-300`
- Text: `text-amber-800`
- Icon: Lightbulb or question mark icon
- Padding: `p-2` or `p-3`
- Border radius: `rounded-md`

### Animation Guidelines

**Fade In with Bounce:**
- Duration: 400ms
- Easing: ease-out
- Scale: 0.95 to 1.0
- Opacity: 0 to 1

**Progress Bar Fill:**
- Duration: 500ms
- Easing: ease-out
- Smooth transition

**Respect `prefers-reduced-motion`:**
- Use `@media (prefers-reduced-motion: reduce)` to disable animations
- Fallback: Instant appearance without animation

### Constraints

**DO:**
- Use TypeScript for all components
- Make animations subtle and age-appropriate
- Ensure messages don't block main content
- Make components dismissible or auto-dismiss
- Use age-appropriate language (no technical jargon)
- Ensure proper contrast for readability

**DON'T:**
- Don't make animations too flashy or distracting
- Don't reveal answers or solution steps
- Don't use negative language or discouragement
- Don't block user interaction with feedback messages
- Don't add complex animations (keep it simple for MVP)

### Expected Output

Visual feedback components that:
- Provide positive reinforcement with encouragement messages
- Show progress indicators without revealing answers
- Display help escalation indicators subtly
- Use age-appropriate colors and language
- Work seamlessly with the main interface
```

---

## Prompt 5: Error Handling & Loading States

```text
Extend the AI Math Tutor application by adding comprehensive error handling and loading states.

### High-Level Goal
Create user-friendly error and loading components that provide clear, age-appropriate feedback when things go wrong or when the system is processing.

### Step-by-Step Instructions

1. **Create ErrorMessage component** (`ErrorMessage.tsx`):
   - Display age-appropriate error messages
   - Variants: Validation errors, API errors, network errors, Vision API errors
   - Show friendly messages (no technical jargon)
   - Include action buttons: "Try again" or "Try typing instead"
   - Use error color (Red #EF4444) for visibility
   - Include helpful icon (alert or X icon)
   - Dismissible with X button
   - Position: Contextual (near input, in chat, or in problem panel)

2. **Create LoadingIndicator component** (`LoadingIndicator.tsx`):
   - Show loading state during async operations
   - Variants: Spinner, progress bar, skeleton screen
   - Show context: "Thinking...", "Processing image...", "Validating problem..."
   - Use primary color for spinner
   - Smooth animation (not jarring)
   - Accessible: Screen reader announcements

3. **Update all components with error and loading states**:
   - ProblemPanel: Error state for problem validation failures
   - ChatPanel: Loading state for system response generation
   - ImageUpload: Error state for invalid files, loading state during upload
   - TextInput: Error state for validation failures

4. **Create global error boundary** (optional, for React error handling):
   - Catch React errors gracefully
   - Show friendly error message
   - Provide recovery options

### Visual Styling

**Error Messages:**
- Background: `bg-red-50`
- Border: `border border-red-200` or `border-l-4 border-red-400`
- Text: `text-red-800`
- Icon: Alert or X icon in red
- Padding: `p-4`
- Border radius: `rounded-lg`
- Action button: `bg-red-600 hover:bg-red-700 text-white`

**Loading Indicators:**
- Spinner: Primary color (#4F46E5) with `animate-spin`
- Text: Secondary text color (#6B7280)
- Background: Transparent or light gray
- Size: Appropriate for context (not too large)

**Skeleton Screens:**
- Background: `bg-gray-200`
- Animation: Pulse effect (`animate-pulse`)
- Border radius: `rounded`

### Error Message Examples

**Validation Error:**
- Message: "Please enter a math problem"
- Action: None (fixes automatically)

**Network Error:**
- Message: "Check your internet connection and try again"
- Action: "Try again" button

**Vision API Error:**
- Message: "Couldn't read the problem from your image. Try typing it instead or upload a clearer image."
- Action: "Try typing instead" button

**API Error:**
- Message: "Oops! Something went wrong. Please try again."
- Action: "Try again" button

### Constraints

**DO:**
- Use TypeScript for all components
- Provide clear, actionable error messages
- Show loading states for all async operations
- Make error messages dismissible
- Ensure proper contrast for readability
- Use age-appropriate language (no technical jargon)

**DON'T:**
- Don't show technical error details to users
- Don't use confusing error messages
- Don't block user interaction unnecessarily
- Don't add complex error recovery flows (keep it simple)

### Expected Output

Error and loading components that:
- Display age-appropriate error messages
- Show loading indicators for all async operations
- Provide actionable recovery options
- Work seamlessly with the main interface
- Maintain accessibility standards
```

---

## Usage Instructions

### Recommended Workflow

1. **Start with Prompt 1** (Main Interface) to create the foundation
2. **Use Prompt 2** (Chat Messages) to add message display
3. **Use Prompt 3** (Problem Input) to add input functionality
4. **Use Prompt 4** (Visual Feedback) to add encouragement and progress
5. **Use Prompt 5** (Error Handling) to add error and loading states

### After Generating UI

1. **Review the generated code** - Check for:
   - TypeScript types and interfaces
   - Tailwind CSS classes
   - Accessibility features
   - Responsive design

2. **Test the interface**:
   - Test on mobile (320px-767px)
   - Test on tablet (768px-1023px)
   - Test on desktop (1024px+)
   - Test keyboard navigation
   - Test with screen reader

3. **Integrate with backend**:
   - Add API integration for problem submission
   - Add API integration for chat messages
   - Add API integration for image upload
   - Connect to backend endpoints

4. **Add additional features**:
   - Math rendering with KaTeX (separate prompt)
   - Developer testing interface (development only)
   - Additional visual feedback components

### Important Notes

- **All AI-generated code requires human review** - Verify types, styling, and functionality
- **Test thoroughly** - Ensure responsive design, accessibility, and user experience
- **Iterate and refine** - Use feedback to improve the generated components
- **Add missing pieces** - Some features may need manual implementation or additional prompts

---

## Next Steps After UI Generation

After generating the UI components, you'll need to:

1. **Add Math Rendering** - Integrate KaTeX for LaTeX/KaTeX equation rendering
2. **Add API Integration** - Connect frontend to backend API endpoints
3. **Add State Management** - Enhance state management with React Context or similar
4. **Add Developer Testing Interface** - Build development-only testing components
5. **Test and Refine** - Test with users and iterate based on feedback

---

**Document Status:** Complete - Ready for use with v0.dev or Lovable.ai

