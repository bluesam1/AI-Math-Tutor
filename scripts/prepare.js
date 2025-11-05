#!/usr/bin/env node

// Skip husky installation in CI/CD environments
if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
  console.log('Skipping husky installation in CI/CD environment');
  process.exit(0);
}

// Try to install husky in local development
try {
  const husky = require('husky');
  husky.install();
} catch (error) {
  // Husky might not be available, which is fine
  console.log('Husky not available, skipping installation');
  process.exit(0);
}
