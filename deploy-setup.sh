#!/bin/bash

# Resume Builder AI - Deployment Setup Script
echo "🚀 Resume Builder AI - Deployment Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you deploy Resume Builder AI to production.${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI found"
else
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI found"
else
    echo "❌ Vercel CLI not found. Install with: npm install -g vercel"
    exit 1
fi

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found"
else
    echo "❌ Supabase CLI not found. Install with: brew install supabase/tap/supabase"
    exit 1
fi

echo ""
echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# Step 1: Backend Deployment
echo -e "${BLUE}Step 1: Backend Deployment Setup${NC}"
echo "================================="
echo ""
echo "1. Go to https://railway.app and create an account"
echo "2. Create a new project"
echo "3. Choose 'Deploy from GitHub'"
echo "4. Set root directory to: apps/backend"
echo ""
echo "Required environment variables for Railway:"
echo "DATABASE_URL=<your-supabase-connection-string>"
echo "SESSION_SECRET_KEY=<generate-a-secure-random-key>"
echo "PROJECT_NAME=Resume Builder AI"
echo "ENV=production"
echo 'ALLOWED_ORIGINS=["https://your-frontend.vercel.app","http://localhost:3000"]'
echo ""

# Step 2: Database Setup
echo -e "${BLUE}Step 2: Database Setup (Supabase)${NC}"
echo "=================================="
echo ""
echo "1. Go to https://supabase.com and create an account"
echo "2. Create a new project: 'resume-builder-ai'"
echo "3. Go to Project Settings → Database"
echo "4. Copy the connection string (URI format)"
echo "5. Use this as DATABASE_URL in Railway"
echo ""

# Step 3: Frontend Deployment
echo -e "${BLUE}Step 3: Frontend Deployment (Vercel)${NC}"
echo "====================================="
echo ""
echo "To deploy the frontend:"
echo "1. cd apps/web-app"
echo "2. vercel login"
echo "3. vercel --prod"
echo "4. Set environment variable: VITE_API_URL=<your-railway-backend-url>"
echo ""

# Step 4: Manual deployment commands
echo -e "${BLUE}Step 4: Quick Deploy Commands${NC}"
echo "=============================="
echo ""
echo "Frontend deployment (run after setting up accounts):"
echo "cd apps/web-app && vercel --prod"
echo ""
echo "Test production build locally:"
echo "cd apps/web-app && npm run build && npm run preview"
echo ""

echo -e "${GREEN}Setup complete! Follow the steps above to deploy.${NC}"
echo ""
echo -e "${YELLOW}📖 See DEPLOYMENT_INSTRUCTIONS.md for detailed instructions${NC}"