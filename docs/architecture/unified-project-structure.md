# Unified Project Structure

```
ai-math-tutor/
├── .github/
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── apps/
│   ├── web/                    # React frontend application
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Page components/routes
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/       # API client services
│   │   │   ├── stores/          # State management
│   │   │   ├── styles/          # Global styles/themes
│   │   │   ├── types/           # TypeScript types
│   │   │   └── utils/           # Frontend utilities
│   │   ├── public/              # Static assets
│   │   ├── tests/               # Frontend tests
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   └── api/                     # Node.js/Express backend API
│       ├── src/
│       │   ├── functions/       # Lambda function handlers
│       │   ├── services/         # Business logic
│       │   ├── middleware/       # Express/API middleware
│       │   ├── types/            # TypeScript types
│       │   └── utils/            # Backend utilities
│       ├── tests/                # Backend tests
│       ├── package.json
│       ├── serverless.yml        # Serverless Framework config
│       └── tsconfig.json
├── packages/
│   ├── shared/                  # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/           # Shared TypeScript interfaces
│   │   │   ├── constants/       # Shared constants
│   │   │   └── utils/           # Shared utilities
│   │   └── package.json
│   └── config/                  # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── jest/
├── tests/
│   ├── fixtures/
│   │   ├── problems/
│   │   │   ├── arithmetic.fixtures.ts
│   │   │   ├── algebra.fixtures.ts
│   │   │   ├── geometry.fixtures.ts
│   │   │   ├── wordProblems.fixtures.ts
│   │   │   └── multiStep.fixtures.ts
│   │   ├── responses/
│   │   │   ├── validSocraticResponses.fixtures.ts
│   │   │   ├── invalidDirectAnswers.fixtures.ts
│   │   │   └── edgeCases.fixtures.ts
│   │   └── sessions/
│   │       └── sessionFixtures.ts
│   └── utils/
│       ├── testHelpers.ts
│       ├── mockLLM.ts
│       ├── mockVisionAPI.ts
│       ├── mockRedis.ts
│       └── scenarioRunner.ts
├── infrastructure/              # IaC definitions
│   ├── cdk/                     # AWS CDK code
│   └── serverless/              # Serverless Framework templates
├── scripts/                     # Build/deploy scripts
├── docs/                        # Documentation
│   ├── prd.md
│   └── architecture.md
├── .env.example                 # Environment template
├── package.json                 # Root package.json (workspaces)
├── tsconfig.json                # Root TypeScript config
├── .gitignore
└── README.md
```
