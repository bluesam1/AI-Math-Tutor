# Fixing serverless-http Not Found Error

## The Problem

The error `Cannot find package 'serverless-http'` occurs because:

1. **npm workspaces hoisting**: Dependencies are hoisted to the root `node_modules` directory
2. **Serverless packaging**: Serverless Framework packages from `apps/api` directory
3. **Missing dependencies**: When Serverless packages, it looks for `apps/api/node_modules`, but dependencies are in root `node_modules`

## The Solution

Install dependencies **locally** in the workspace before packaging:

```bash
cd apps/api
npm install --production --no-save
```

This installs dependencies in `apps/api/node_modules` (not hoisted), so Serverless can find them when packaging.

## How It Works

1. **Root install** (`npm ci` at root): Installs all dependencies (hoisted to root)
2. **Local install** (`npm install --production` in workspace): Installs production dependencies locally in `apps/api/node_modules`
3. **Serverless packaging**: Finds dependencies in `apps/api/node_modules` ✅

## Alternative Solutions

### Option 1: Use serverless-esbuild (Bundles Everything)

```yaml
plugins:
  - serverless-esbuild
```

Bundles all dependencies into a single file - no dependency issues.

### Option 2: Use serverless-plugin-monorepo (Should Work)

The `serverless-plugin-monorepo` plugin should create symlinks automatically, but it may need proper configuration.

### Option 3: Manual Linking (Not Recommended)

Manually copy/link dependencies before packaging - too complex.

## Current Fix

The GitHub Actions workflow now:
1. Installs root dependencies (`npm ci`)
2. Installs API dependencies locally (`npm install --production` in `apps/api`)
3. Builds the API
4. Deploys with Serverless

This ensures all dependencies are available in `apps/api/node_modules` when Serverless packages.

