# API Specification

### REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: AI Math Tutor API
  version: 1.0.0
  description: REST API for AI Math Tutor application
servers:
  - url: https://api.aimathtutor.com
    description: Production server
  - url: https://api-staging.aimathtutor.com
    description: Staging server

paths:
  /api/health:
    get:
      summary: Health check endpoint
      responses:
        '200':
          description: API is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
                  timestamp:
                    type: string
                    format: date-time

  /api/problem/parse-image:
    post:
      summary: Parse math problem from uploaded image
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
      responses:
        '200':
          description: Image parsed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParsedProblem'
        '400':
          description: Invalid image or parsing failed
        '429':
          description: Rate limit exceeded

  /api/problem/validate:
    post:
      summary: Validate problem text and identify type
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - text
              properties:
                text:
                  type: string
                  description: Problem statement text
      responses:
        '200':
          description: Problem validated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidatedProblem'
        '400':
          description: Invalid problem text

  /api/chat/message:
    post:
      summary: Send message and receive Socratic dialogue response
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - sessionId
                - message
              properties:
                sessionId:
                  type: string
                  description: Session identifier
                message:
                  type: string
                  description: Student message
                problemId:
                  type: string
                  description: Current problem identifier
      responses:
        '200':
          description: Socratic dialogue response generated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatResponse'
        '400':
          description: Invalid request
        '429':
          description: Rate limit exceeded

  /api/session:
    post:
      summary: Create new session
      responses:
        '200':
          description: Session created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'
    get:
      summary: Get session context
      parameters:
        - name: sessionId
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Session context retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'

  /api/dev/test-fixtures:
    get:
      summary: Get test problem fixtures (Development only)
      parameters:
        - name: problemType
          in: query
          schema:
            type: string
            enum: [arithmetic, algebra, geometry, word, multi-step]
      responses:
        '200':
          description: Test fixtures retrieved
          content:
            application/json:
              schema:
                type: object
                properties:
                  fixtures:
                    type: array
                    items:
                      $ref: '#/components/schemas/TestFixture'
        '403':
          description: Not accessible in production

  /api/dev/run-scenario:
    post:
      summary: Run test scenario (Development only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - scenario
              properties:
                scenario:
                  type: string
                  description: Test scenario identifier
                problemType:
                  type: string
                  enum: [arithmetic, algebra, geometry, word, multi-step]
      responses:
        '200':
          description: Test scenario executed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestResult'
        '403':
          description: Not accessible in production

  /api/dev/run-batch:
    post:
      summary: Run batch of test scenarios (Development only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - scenarios
              properties:
                scenarios:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: Batch test executed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchTestResult'
        '403':
          description: Not accessible in production

components:
  schemas:
    ParsedProblem:
      type: object
      properties:
        text:
          type: string
          description: Extracted problem text
        confidence:
          type: number
          format: float
          description: Parsing confidence score
    ValidatedProblem:
      type: object
      properties:
        valid:
          type: boolean
        type:
          type: string
          enum: [arithmetic, algebra, geometry, word, multi-step]
        text:
          type: string
          description: Cleaned problem text
    ChatResponse:
      type: object
      properties:
        message:
          type: string
          description: Socratic dialogue response
        sessionId:
          type: string
        metadata:
          type: object
          properties:
            helpLevel:
              type: number
            answerDetected:
              type: boolean
    Session:
      type: object
      properties:
        sessionId:
          type: string
        problem:
          $ref: '#/components/schemas/Problem'
        messages:
          type: array
          items:
            $ref: '#/components/schemas/Message'
    Problem:
      type: object
      properties:
        id:
          type: string
        text:
          type: string
        type:
          type: string
          enum: [arithmetic, algebra, geometry, word, multi-step]
        source:
          type: string
          enum: [text, image]
    Message:
      type: object
      properties:
        id:
          type: string
        role:
          type: string
          enum: [user, system]
        content:
          type: string
        timestamp:
          type: string
          format: date-time
    TestFixture:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        problemType:
          type: string
          enum: [arithmetic, algebra, geometry, word, multi-step]
        problem:
          $ref: '#/components/schemas/Problem'
        expectedSteps:
          type: array
          items:
            type: string
    TestResult:
      type: object
      properties:
        scenario:
          type: string
        success:
          type: boolean
        socraticCompliance:
          type: number
          format: float
          description: Percentage of Socratic compliance (100 required)
        answerDetected:
          type: boolean
        testDetails:
          type: object
    BatchTestResult:
      type: object
      properties:
        total:
          type: number
        passed:
          type: number
        failed:
          type: number
        results:
          type: array
          items:
            $ref: '#/components/schemas/TestResult'
        socraticComplianceRate:
          type: number
          format: float
```
