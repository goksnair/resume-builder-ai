# 🚀 Resume Builder AI - Deployment Instructions

## Prerequisites
1. **Railway Account**: Sign up at https://railway.app
2. **Supabase Account**: Sign up at https://supabase.com
3. **Vercel Account**: Sign up at https://vercel.com (for frontend)

## Step 1: Set Up Supabase Database

### 1.1 Create New Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization and project name: "resume-builder-ai"
4. Set database password (save this!)
5. Choose region closest to your users

### 1.2 Get Database URL
1. Go to Project Settings → Database
2. Copy the connection string (URI format)
3. Should look like: `postgresql://postgres:[password]@[host]:5432/postgres`

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Connect to your GitHub repository
5. Set root directory to: `apps/backend`

### 2.2 Set Environment Variables
In Railway project settings, add these variables:

```bash
DATABASE_URL=postgresql://postgres:[password]@[supabase-host]:5432/postgres
SESSION_SECRET_KEY=your-super-secret-key-here-change-this
PROJECT_NAME=Resume Builder AI
ENV=production
ALLOWED_ORIGINS=["https://your-frontend-url.vercel.app","http://localhost:3000"]
```

### 2.3 Configure Build Settings
Railway should auto-detect Python. If not, add:
- **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Build Command**: `pip install -r requirements.txt`

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import from GitHub
4. Set root directory to: `apps/web-app`

### 3.2 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

### 3.3 Set Environment Variables
In Vercel project settings:

```bash
VITE_API_URL=https://your-railway-backend-url.railway.app
```

## Step 4: Update CORS Configuration

### 4.1 Update Backend CORS
After frontend is deployed, update Railway environment variables:

```bash
ALLOWED_ORIGINS=["https://your-actual-frontend-url.vercel.app","http://localhost:3000"]
```

### 4.2 Redeploy Backend
Trigger a redeploy in Railway to apply the new CORS settings.

## Step 5: Initialize Database

### 5.1 Run Database Migrations
The app will auto-create tables on first startup via the lifespan handler in `app/base.py`.

### 5.2 Verify Database Connection
Check Railway logs to ensure database connection is successful:
```
[INFO] Database tables created successfully
[INFO] Application startup complete
```

## Step 6: Test Deployment

### 6.1 Test Backend Health
Visit: `https://your-railway-url.railway.app/ping`
Expected response: `{"message":"pong","database":"reachable"}`

### 6.2 Test API Documentation
Visit: `https://your-railway-url.railway.app/api/docs`
Should show FastAPI Swagger documentation.

### 6.3 Test Frontend
Visit: `https://your-vercel-url.vercel.app`
Should load the Resume Builder AI interface.

### 6.4 Test Integration
1. Navigate to AI Dashboard
2. Try uploading a resume
3. Verify backend API calls are working

## URLs and Credentials

### Production URLs
- **Frontend**: `https://[project-name].vercel.app`
- **Backend API**: `https://[project-name].railway.app`
- **API Docs**: `https://[project-name].railway.app/api/docs`
- **Database**: Supabase project URL

### Important Security Notes
1. **Never commit real environment variables to git**
2. **Use strong, unique passwords for database**
3. **Rotate SESSION_SECRET_KEY regularly**
4. **Monitor Railway and Supabase usage/billing**

## Environment Variables Summary

### Backend (Railway)
```bash
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SESSION_SECRET_KEY=your-secret-key-256-bit-random
PROJECT_NAME=Resume Builder AI
ENV=production
ALLOWED_ORIGINS=["https://your-frontend.vercel.app","http://localhost:3000"]
PORT=8000
PYTHONDONTWRITEBYTECODE=1
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend.railway.app
```

## Monitoring and Maintenance

### Health Checks
- Backend health: `/ping` endpoint
- Database connectivity included in health check
- Monitor Railway application logs
- Monitor Supabase dashboard for database performance

### Scaling
- Railway auto-scales based on traffic
- Supabase handles database scaling
- Vercel handles frontend CDN and scaling

### Backups
- Supabase provides automatic database backups
- Consider setting up additional backup procedures for critical data

---

## Quick Deploy Commands (Manual Setup)

If you prefer manual setup:

### Backend Local Testing with Production DB
```bash
cd apps/backend
export DATABASE_URL="your-supabase-url"
export SESSION_SECRET_KEY="your-secret"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Local Testing with Production API
```bash
cd apps/web-app
export VITE_API_URL="https://your-railway-url.railway.app"
npm run build
npm run preview
```

---

**🎯 After completing these steps, your Resume Builder AI will be fully deployed and accessible globally!**