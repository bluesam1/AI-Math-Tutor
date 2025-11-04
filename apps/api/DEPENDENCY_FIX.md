# Fixing `serverless-http` Not Found Error

## The Problem

```
Cannot find package 'serverless-http' imported from /var/task/dist/functions/handler.js
```

### Why This Happened

1. **npm workspace hoisting** moves shared dependencies (including `serverless-http`) to the repository root.
2. **Serverless packaging** only zipped the `apps/api/dist` output and local `node_modules`.
3. **Lambda runtime** therefore could not resolve `serverless-http` because it was never bundled into the artifact.

## Updated Solution – Bundle with `serverless-esbuild`

Instead of trying to force a nested `node_modules`, we now bundle the Lambda handler with `serverless-esbuild`. This packs `serverless-http`, Express, and all referenced source files into the Lambda artifact automatically.

### Key Changes

- Added `serverless-esbuild` as a dev dependency in `apps/api/package.json`.
- Updated `serverless.yml` to:
  - point the handler to `src/functions/handler.handler` (esbuild output)
  - bundle via the new plugin
  - exclude the raw TypeScript sources from the final zip and include the esbuild bundle instead.

With these changes, the packaged artifact (`.serverless/ai-math-tutor-api.zip`) now contains a single compiled file that embeds `serverless-http`, so Lambda can load it with no additional dependencies.

## Deployment Flow (2025-11-04)

1. `npm install` (root) – ensures TypeScript, Serverless CLI, and the esbuild plugin are available.
2. `npm run build --workspace apps/api` – optional TypeScript build for local usage (`dist/`).
3. `npx serverless deploy` (inside `apps/api`) – runs esbuild bundling and uploads the artifact.

> **Note:** The previous workaround (“install production dependencies locally before deploy”) is no longer required and has been removed from the scripts.

## Verification Checklist

- [x] `npm run build --workspace apps/api`
- [x] `npx serverless package`
- [x] Inspect `.serverless/ai-math-tutor-api.zip` – contains bundled `src/functions/handler.js`
- [x] Deploy: `npm run deploy:dev --workspace apps/api`

Once deployed, the Lambda no longer throws the `serverless-http` module resolution error.

