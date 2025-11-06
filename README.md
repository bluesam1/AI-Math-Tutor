# AI Math Tutor

An interactive web application that guides students through math problems using Socratic questioning, helping them discover solutions through guided dialogue rather than direct answers. Designed specifically for 6th grade mathematics (ages 11-12).

## 🎯 Overview

AI Math Tutor is a patient, adaptive AI tutor that never gives direct answers but guides students through Socratic questioning to discover solutions themselves. The system supports multiple input methods (text and image upload) and provides visual feedback appropriate for children.

### Key Features

- **Socratic Dialogue System**: Guides students through problems with questions, never providing direct answers
- **Dual Input Methods**: Text entry and image upload with Vision API parsing
- **Problem Type Support**: Handles arithmetic, algebra, geometry, word problems, and multi-step problems
- **Math Rendering**: Automatic LaTeX/KaTeX rendering for equations and formulas
- **Visual Feedback**: Progress indicators, encouraging messages, and age-appropriate visual elements
- **Context Management**: Maintains conversation context within browser sessions
- **Progressive Help Escalation**: Provides more concrete hints when students are stuck
- **Answer Validation**: Validates student responses and provides positive redirection

## 🛠️ Technology Stack

### Frontend

- **React** 18.2.0
- **TypeScript** 5.3.0+
- **Vite** 5.0.0
- **Tailwind CSS** 4.1.16
- **KaTeX** 0.16.25 (math rendering)
- **React Markdown** 10.1.0

### Backend

- **Node.js** 20
- **Express** 4.18.0
- **TypeScript** 5.3.0+
- **Firebase Cloud Functions** 5.0.0
- **OpenAI API** 6.0.0 (GPT-4 for LLM, Vision API for image parsing)

### Infrastructure

- **Firebase Hosting** (frontend)
- **Firebase Cloud Functions** (backend API)
- **Firestore** (session storage)

### Development Tools

- **ESLint** 8.57.1
- **Prettier** 3.6.2
- **TypeScript** 5.9.3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher (20.x LTS recommended)
- **npm** 9.0.0 or higher
- **Firebase CLI** (for deployment and emulators)
  ```bash
  npm install -g firebase-tools
  ```
- **OpenAI API Key** (for LLM and Vision API)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-Math-Tutor
```

### 2. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

This will install dependencies for:

- Root workspace (dev tools)
- `apps/web` (React frontend)
- `functions` (Firebase Cloud Functions)
- `packages/*` (shared packages)

### 3. Set Up Environment Variables

#### Backend (Firebase Functions)

Create a `.env` file in the `functions/` directory:

```bash
cd functions
cp .env.example .env  # If .env.example exists
# Or create .env manually
```

Edit `functions/.env` with your configuration:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend (Optional)

The frontend can be configured via environment variables in `apps/web/.env`:

```env
VITE_API_URL=http://localhost:5000/api  # For local development with emulators
```

### 4. Set Up Firebase

#### Login to Firebase

```bash
firebase login
```

#### Initialize Firebase (if not already done)

```bash
firebase init
```

Select:

- Functions
- Hosting
- Use an existing project (or create a new one)

#### Set Firebase Project

```bash
firebase use --add
# Select your Firebase project
```

### 5. Build the Project

Build all workspaces:

```bash
npm run build
```

Or build individually:

```bash
npm run build:web        # Build frontend
npm run build:functions  # Build backend
```

## 🏃 Running the Application

### Development Mode

#### Option 1: Full Stack with Firebase Emulators (Recommended)

This runs both frontend and backend together:

```bash
# Terminal 1: Start Firebase emulators (functions + hosting)
npm run dev:emulators

# Terminal 2: Start frontend dev server (if needed)
npm run dev:web
```

**Access Points:**

- Frontend: `http://localhost:5000` (Firebase Hosting emulator)
- Backend API: `http://localhost:5000/api` (via Hosting rewrite)
- Functions Emulator: `http://localhost:5001`
- Emulator UI: `http://localhost:4000`

#### Option 2: Frontend Only (with separate backend)

```bash
# Terminal 1: Start frontend dev server
npm run dev:web

# Terminal 2: Start Firebase emulators (functions only)
cd functions
npm run serve
```

**Access Points:**

- Frontend: `http://localhost:3000` (Vite dev server)
- Backend API: `http://localhost:5001/{project-id}/us-central1/api`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
cd apps/web
npm run preview
```

## 📁 Project Structure

```
ai-math-tutor/
├── apps/
│   └── web/                    # React frontend application
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── services/       # API client
│       │   ├── types/          # TypeScript types
│       │   ├── utils/          # Utility functions
│       │   └── styles/         # CSS/Tailwind styles
│       ├── public/             # Static assets
│       ├── dist/               # Production build output
│       └── package.json
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   ├── server.ts          # Express app entry point
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic (LLM, Vision, etc.)
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   └── types/             # TypeScript types
│   ├── lib/                   # Compiled JavaScript (generated)
│   ├── .env                   # Environment variables (local)
│   └── package.json
├── packages/
│   ├── shared/                # Shared types and utilities
│   └── config/                # Shared configs (ESLint, TypeScript, etc.)
├── docs/                      # Project documentation
│   ├── architecture/          # Architecture documentation
│   ├── prd/                   # Product requirements
│   └── stories/               # User stories
├── memory-bank/               # Project memory bank
├── scripts/                   # Build scripts
├── firebase.json              # Firebase configuration
├── package.json               # Root package.json (workspaces)
└── tsconfig.json              # Root TypeScript config
```

## 🔧 Development Workflow

### Available Scripts

#### Root Level

```bash
# Code Quality
npm run lint              # Lint all TypeScript files
npm run lint:fix          # Fix linting issues automatically
npm run format            # Format all code with Prettier
npm run format:check      # Check code formatting

# Building
npm run build             # Build all workspaces
npm run build:web         # Build frontend only
npm run build:functions   # Build backend only

# Type Checking
npm run type-check        # Type check all workspaces
npm run type-check:web    # Type check frontend
npm run type-check:functions  # Type check backend

# Development
npm run dev:web           # Start frontend dev server
npm run dev:emulators     # Start Firebase emulators

# Testing
npm test                  # Run tests (when implemented)

# Deployment
npm run deploy            # Build and deploy everything
npm run deploy:functions  # Deploy functions only
npm run deploy:hosting    # Deploy hosting only
```

#### Frontend (`apps/web`)

```bash
cd apps/web

npm run dev               # Start Vite dev server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Lint frontend code
npm run type-check        # Type check frontend
```

#### Backend (`functions`)

```bash
cd functions

npm run build             # Compile TypeScript
npm run build:watch       # Watch mode for development
npm run serve             # Start Firebase emulators (functions only)
npm run deploy            # Deploy to Firebase
npm run logs              # View function logs
npm run lint              # Lint backend code
npm run type-check        # Type check backend
```

### Code Quality

The project uses:

- **ESLint**: Configured for TypeScript and React
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict type checking enabled

All code must pass linting checks before merging.

## 🌐 API Documentation

### Base URLs

- **Local Development (Emulators)**: `http://localhost:5000/api`
- **Local Development (Functions Only)**: `http://localhost:5001/{project-id}/us-central1/api`
- **Production**: `https://us-central1-{project-id}.cloudfunctions.net/api`
- **Via Hosting Rewrite**: `https://{project-id}.web.app/api`

### Endpoints

#### Health Check

```http
GET /api/health
```

Returns API status and version information.

#### Problem Validation

```http
POST /api/problem/validate
Content-Type: application/json

{
  "problemText": "Solve for x: 2x + 5 = 15"
}
```

Validates a math problem and returns the problem type.

**Response:**

```json
{
  "success": true,
  "valid": true,
  "problemType": "algebra"
}
```

#### Image Parsing

```http
POST /api/problem/parse-image
Content-Type: multipart/form-data

image: <file>
```

Parses an uploaded image and extracts problem text.

**Response:**

```json
{
  "success": true,
  "problemText": "Solve for x: 2x + 5 = 15"
}
```

#### Chat Message

```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "I'm not sure where to start",
  "problemText": "Solve for x: 2x + 5 = 15",
  "problemType": "algebra",
  "conversationHistory": [],
  "sessionId": "optional-session-id"
}
```

Sends a message to the tutor and receives a Socratic response.

**Response:**

```json
{
  "success": true,
  "response": "That's okay! Let's start by understanding what we're looking for...",
  "metadata": {
    "type": "question",
    "helpLevel": "normal"
  },
  "sessionId": "session-id"
}
```

#### Answer Checking

```http
POST /api/answer/check
Content-Type: application/json

{
  "studentAnswer": "5",
  "problemText": "Solve for x: 2x + 5 = 15",
  "problemType": "algebra"
}
```

Checks if a student's answer is correct.

**Response:**

```json
{
  "success": true,
  "isCorrect": true,
  "confidence": 0.95,
  "feedback": "Great job!"
}
```

For more detailed API documentation, see `docs/architecture/api-specification.md`.

## 🚢 Deployment

### Prerequisites

1. Firebase CLI installed and logged in
2. Firebase project configured
3. Environment variables set in Firebase

### Set Environment Variables

Set environment variables for Firebase Functions:

```bash
# Using Firebase CLI (for Firebase Functions v2)
firebase functions:secrets:set OPENAI_API_KEY

# Or set via Firebase Console
# Go to Firebase Console > Functions > Configuration > Secrets
```

### Deploy Everything

```bash
# Build and deploy all
npm run deploy
```

### Deploy Individually

```bash
# Deploy functions only
npm run deploy:functions

# Deploy hosting only
npm run deploy:hosting
```

### View Deployment

After deployment:

- **Functions**: `https://us-central1-{project-id}.cloudfunctions.net/api`
- **Hosting**: `https://{project-id}.web.app` or `https://{project-id}.firebaseapp.com`
- **API via Hosting**: `https://{project-id}.web.app/api`

## 🧪 Testing

Testing infrastructure is being set up. For now, the CI/CD pipeline verifies that builds complete successfully.

To run type checking:

```bash
npm run type-check
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Architecture**: `docs/architecture/`
- **Product Requirements**: `docs/prd/`
- **User Stories**: `docs/stories/`
- **UX Design**: `docs/ux-design/`

## 🤝 Contributing

1. Create a feature branch

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Ensure code quality

   ```bash
   npm run lint
   npm run format
   npm run type-check
   ```

4. Commit your changes

   ```bash
   git commit -m "Add your feature"
   ```

5. Push to the branch

   ```bash
   git push origin feature/your-feature-name
   ```

6. Submit a pull request

## 📝 License

MIT

## 🆘 Troubleshooting

### Common Issues

#### Port Already in Use

If port 3000, 5000, or 5001 is already in use:

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different ports in firebase.json
```

#### Firebase Emulators Not Starting

Ensure Firebase CLI is installed and logged in:

```bash
firebase login
firebase init
```

#### Environment Variables Not Loading

- Ensure `.env` file exists in `functions/` directory
- Check that `dotenv` is configured in `functions/src/server.ts`
- For production, set variables via Firebase Console or CLI

#### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules apps/web/node_modules functions/node_modules
npm install
```

#### Type Errors

Run type checking to see detailed errors:

```bash
npm run type-check
```

### Getting Help

- Check the documentation in `docs/`
- Review the architecture documentation
- Check Firebase logs: `firebase functions:log`

## 🔗 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [KaTeX Documentation](https://katex.org/docs/api.html)

---

**Built with ❤️ for students learning mathematics**
