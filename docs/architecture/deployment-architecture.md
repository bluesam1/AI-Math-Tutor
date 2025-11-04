# Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**

- **Platform:** AWS S3 + CloudFront
- **Build Command:** `npm run build:web`
- **Output Directory:** `apps/web/dist`
- **CDN/Edge:** CloudFront distribution for global content delivery

**Backend Deployment:**

- **Platform:** AWS Lambda (serverless)
- **Build Command:** `npm run build:api`
- **Deployment Method:** Serverless Framework or AWS CDK

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to AWS
        run: npm run deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Environments

| Environment | Frontend URL                    | Backend URL                         | Purpose                |
| ----------- | ------------------------------- | ----------------------------------- | ---------------------- |
| Development | http://localhost:5173           | http://localhost:3000               | Local development      |
| Staging     | https://staging.aimathtutor.com | https://api-staging.aimathtutor.com | Pre-production testing |
| Production  | https://aimathtutor.com         | https://api.aimathtutor.com         | Live environment       |
