#!/bin/bash

# Cloudflare Pages Build Script
echo "Starting Cloudflare Pages build..."

# Print Node.js and npm versions
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Clean install dependencies
echo "Installing dependencies..."
npm ci --verbose

# Verify vite installation
echo "Checking vite installation..."
npx vite --version

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"