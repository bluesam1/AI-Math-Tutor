# Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**

- **Platform:** Firebase Hosting
- **Build Command:** `npm run build:web`
- **Output Directory:** `apps/web/dist`
- **CDN/Edge:** Firebase Hosting global CDN distribution

**Backend Deployment:**

- **Platform:** Firebase Cloud Functions (serverless)
- **Build Command:** `npm run build:functions`
- **Deployment Method:** Firebase CLI
- **Region:** us-central1

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
      - name: Deploy to Firebase
        run: npm run deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### Environments

| Environment | Frontend URL                      | Backend URL                                          | Purpose                       |
| ----------- | --------------------------------- | ---------------------------------------------------- | ----------------------------- |
| Development | http://localhost:3000             | http://localhost:5000/api                            | Local development (emulators) |
| Staging     | https://staging-{project}.web.app | https://us-central1-{project}.cloudfunctions.net/api | Pre-production testing        |
| Production  | https://{project}.web.app         | https://us-central1-{project}.cloudfunctions.net/api | Live environment              |
