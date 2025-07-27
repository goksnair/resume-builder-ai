# 🚀 Railway Unified Deployment Guide

## Railway-Only Deployment Strategy

Deploy both frontend and backend to Railway for simplified management and unified hosting.

### Why Railway for Both?
- ✅ **Single Platform**: Manage everything in one place
- ✅ **No Authentication Issues**: Unlike Vercel's auth requirements
- ✅ **Simpler CORS**: Same-origin deployment possible
- ✅ **Cost Effective**: Single billing platform
- ✅ **Environment Variables**: Shared across services

## Step 1: Backend Deployment to Railway

### 1.1 Create Backend Service
1. Go to https://railway.app
2. Create new project: "resume-builder-backend"
3. Connect GitHub repository
4. Set root directory: `apps/backend`

### 1.2 Backend Environment Variables
```bash
DATABASE_URL=postgresql://postgres:[password]@[supabase-host]:5432/postgres
SESSION_SECRET_KEY=your-super-secret-key-here
PROJECT_NAME=Resume Builder AI
ENV=production
ALLOWED_ORIGINS=["https://resume-builder-frontend.railway.app"]
```

### 1.3 Backend Configuration
Railway will auto-detect Python and use:
- **Build**: `pip install -r requirements.txt`
- **Start**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Step 2: Frontend Deployment to Railway

### 2.1 Create Frontend Service
1. In the same Railway project, add new service
2. Name: "resume-builder-frontend"
3. Connect same GitHub repository
4. Set root directory: `apps/web-app`

### 2.2 Frontend Environment Variables
```bash
VITE_API_URL=https://resume-builder-backend.railway.app
```

### 2.3 Frontend Configuration Files

**railway.json** (already created):
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve dist -s -l $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Procfile** (already created):
```
web: npx serve dist -s -l $PORT
```

## Step 3: Database Setup (Supabase)

### 3.1 Create Supabase Project
1. Go to https://supabase.com
2. Create project: "resume-builder-ai"
3. Get connection string from Settings → Database

### 3.2 Add to Railway Backend
Copy the DATABASE_URL to Railway backend environment variables.

## Step 4: Deployment Process

### 4.1 Deploy Backend First
1. Push code to GitHub
2. Railway auto-deploys backend
3. Note the backend URL: `https://[service-name].railway.app`

### 4.2 Deploy Frontend
1. Update VITE_API_URL with actual backend URL
2. Railway auto-deploys frontend
3. Note the frontend URL: `https://[service-name].railway.app`

### 4.3 Update CORS
Update backend ALLOWED_ORIGINS with actual frontend URL.

## Step 5: Testing Deployment

### 5.1 Test Backend
```bash
curl https://your-backend.railway.app/ping
# Expected: {"message":"pong","database":"reachable"}
```

### 5.2 Test Frontend
Visit: `https://your-frontend.railway.app`
Should load the Resume Builder AI interface.

### 5.3 Test Integration
1. Navigate to AI Dashboard
2. Test file upload
3. Verify API calls work

## Railway Configuration Summary

### Frontend Service
- **Root Directory**: `apps/web-app`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npx serve dist -s -l $PORT`
- **Environment**: `VITE_API_URL=https://backend-url.railway.app`

### Backend Service
- **Root Directory**: `apps/backend`  
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment**: `DATABASE_URL`, `SESSION_SECRET_KEY`, `ALLOWED_ORIGINS`

## Advantages of Railway Deployment

### Technical Benefits
- ✅ **Automatic HTTPS**: Both services get SSL certificates
- ✅ **Auto-scaling**: Railway handles traffic scaling
- ✅ **Health Monitoring**: Built-in uptime monitoring
- ✅ **Logs**: Centralized logging for both services
- ✅ **Rollbacks**: Easy rollback if issues occur

### Operational Benefits
- ✅ **Single Dashboard**: Manage both services in one place
- ✅ **Unified Billing**: One platform for costs
- ✅ **Team Management**: Shared access controls
- ✅ **Environment Sync**: Easy variable management

## Production URLs Structure

After deployment:
- **Frontend**: `https://resume-builder-frontend-[hash].railway.app`
- **Backend**: `https://resume-builder-backend-[hash].railway.app`
- **API Docs**: `https://resume-builder-backend-[hash].railway.app/api/docs`

## Monitoring and Maintenance

### Health Endpoints
- Backend: `/ping` - Basic health check
- Frontend: Automatic health via Railway
- Database: Included in backend health check

### Scaling
- Railway auto-scales based on demand
- No configuration needed for basic scaling
- Monitor usage in Railway dashboard

---

## Quick Deploy Commands

```bash
# 1. Prepare frontend for Railway
cd apps/web-app
npm install serve

# 2. Test build locally
npm run build
npx serve dist -s -l 3001

# 3. Deploy via Railway CLI (optional)
railway login
railway link
railway up
```

## Environment Variables Checklist

### Backend (.env or Railway settings)
- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `SESSION_SECRET_KEY` - Secure random key
- [ ] `ALLOWED_ORIGINS` - Frontend URL in array
- [ ] `PROJECT_NAME` - "Resume Builder AI"
- [ ] `ENV` - "production"

### Frontend (.env or Railway settings)  
- [ ] `VITE_API_URL` - Backend Railway URL

---

**🎯 Result: Both frontend and backend deployed to Railway with unified management, no authentication issues, and simplified CORS configuration.**