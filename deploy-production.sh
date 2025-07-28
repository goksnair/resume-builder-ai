#!/bin/bash

# Production Deployment Script for Security-Hardened Application
echo "🚀 Starting Production Deployment..."

# Check if required directories exist
if [ ! -d "apps/web-app/dist" ]; then
    echo "❌ Frontend build not found at apps/web-app/dist/"
    echo "Please run 'npm run build' in apps/web-app first"
    exit 1
fi

if [ ! -f "apps/backend/main_production.py" ]; then
    echo "❌ Backend production file not found"
    exit 1
fi

echo "✅ Pre-deployment checks passed"

# Frontend deployment to Netlify
echo "📦 Deploying Frontend to Netlify..."
cd apps/web-app

# Check if netlify CLI is available
if command -v netlify &> /dev/null; then
    echo "📤 Using Netlify CLI for deployment..."
    netlify deploy --prod --dir=dist
else
    echo "⚠️  Netlify CLI not found"
    echo "Manual deployment required:"
    echo "1. Go to https://app.netlify.com/drop"
    echo "2. Drag and drop the 'apps/web-app/dist/' folder"
    echo "3. Configure custom domain if needed"
fi

cd ../..

# Backend deployment to Railway
echo "🚂 Preparing Backend for Railway deployment..."
cd apps/backend

# Check if railway CLI is available
if command -v railway &> /dev/null; then
    echo "📤 Using Railway CLI for deployment..."
    echo "⚠️  Make sure you're logged in: railway login"
    echo "⚠️  Make sure you're linked to a project: railway link"
    
    # Set critical environment variables
    echo "🔐 Setting up environment variables..."
    railway variables set SESSION_SECRET_KEY=$(openssl rand -base64 32) || echo "❌ Failed to set SESSION_SECRET_KEY"
    
    # Deploy
    railway up
else
    echo "⚠️  Railway CLI not found"
    echo "Manual deployment required:"
    echo "1. Connect your repository to Railway"
    echo "2. Set the root directory to 'apps/backend'"
    echo "3. Set environment variables:"
    echo "   - SESSION_SECRET_KEY: $(openssl rand -base64 32)"
    echo "4. Deploy from Railway dashboard"
fi

cd ../..

echo "🎉 Deployment process initiated!"
echo "📋 Next steps:"
echo "1. Verify frontend is accessible"
echo "2. Test backend health endpoints"
echo "3. Check /api/v1/rocket/health specifically"
echo "4. Monitor logs for any errors"
echo "5. Configure custom domains if needed"

echo "🔍 Critical endpoints to test:"
echo "- Frontend: Your Netlify URL"
echo "- Backend Health: [YOUR-RAILWAY-URL]/health"
echo "- ROCKET Health: [YOUR-RAILWAY-URL]/api/v1/rocket/health"
echo "- API Docs: [YOUR-RAILWAY-URL]/api/docs"