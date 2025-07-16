#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Push to GitHub
git add .
git commit -m "Auto deploy: $(date)"
git push

# Deploy to Vercel
npx vercel --prod

echo "✅ Deployment complete!" 