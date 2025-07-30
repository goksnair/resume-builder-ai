# 🚨 Railway 502 Error Troubleshooting Guide

## Critical Issues Found and Fixed

### 1. **Missing Dependencies (CRITICAL)**
**Problem**: `ModuleNotFoundError: No module named 'itsdangerous'`
- The SessionMiddleware requires `itsdangerous` but it wasn't in requirements.txt
- Several other dependencies were missing (numpy, markdown, markitdown)

**Solution Applied**:
✅ Updated `/apps/backend/requirements.txt` with all missing dependencies:
```txt
fastapi==0.115.12
uvicorn==0.34.0
python-multipart==0.0.20
pydantic==2.11.3
pydantic-settings==2.1.0
SQLAlchemy==2.0.40
psycopg2-binary==2.9.9
aiosqlite==0.19.0
asyncpg==0.29.0
itsdangerous==2.1.2         # ← CRITICAL FIX
numpy==1.26.0               # ← Required by semantic services
markdown==3.5.1             # ← Required by score improvement
markitdown==0.0.1a2         # ← Required by resume service
```

### 2. **Python Version Configuration**
**Problem**: Runtime version was incomplete
**Solution Applied**: 
✅ Updated `/apps/backend/runtime.txt` from `python-3.11` to `python-3.11.9`

### 3. **Railway Configuration Missing**
**Problem**: No Railway-specific deployment configuration
**Solution Applied**:
✅ Created `/apps/backend/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. **Environment Variables Structure**
**Problem**: Production environment variables not properly configured
**Solution Applied**:
✅ Created `/apps/backend/.env.railway` for Railway deployment

## Required Railway Environment Variables

Set these in your Railway service dashboard:

### Essential Variables:
```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[dbname]
SESSION_SECRET_KEY=your-super-secure-random-key-here
ALLOWED_ORIGINS=["https://[your-frontend].railway.app", "https://*.railway.app"]
ENV=production
PROJECT_NAME="Resume Builder AI"
PORT=$PORT
```

### Optional Variables:
```bash
DB_ECHO=false
PYTHONDONTWRITEBYTECODE=1
```

## Deployment Steps

### 1. **Immediate Actions**
1. Push the fixed requirements.txt to your repository
2. Redeploy the Railway service
3. Check Railway logs for any remaining import errors

### 2. **Environment Setup**
1. Go to Railway dashboard → Your service → Variables
2. Add all required environment variables listed above
3. Ensure `DATABASE_URL` points to your Supabase instance
4. Generate a secure `SESSION_SECRET_KEY`

### 3. **Testing Deployment**
Test these endpoints once deployed:
- `https://[your-service].railway.app/` (should return 404 or redirect)
- `https://[your-service].railway.app/ping` (should return `{"message":"pong"}`)
- `https://[your-service].railway.app/api/docs` (should show FastAPI docs)

## Alternative: Minimal Test Deployment

If issues persist, use the minimal test configuration:

### Option A: Use railway_main.py
Update your Railway start command to:
```bash
python -m uvicorn railway_main:app --host 0.0.0.0 --port $PORT
```

This uses the minimal FastAPI app I created for debugging.

### Option B: Procfile Override
Update `/apps/backend/Procfile`:
```
web: python railway_main.py
```

## Common Railway Error Patterns

### 502 Bad Gateway
- **Cause**: App fails to start due to import errors
- **Solution**: Check Railway logs for Python import errors
- **Fix**: Add missing dependencies to requirements.txt

### 503 Service Unavailable
- **Cause**: App starts but crashes immediately
- **Solution**: Check environment variables and database connectivity

### Port Binding Issues
- **Cause**: App not binding to Railway's `$PORT` variable
- **Solution**: Ensure start command uses `--port $PORT`

## Debugging Commands

Check Railway logs for these patterns:
```bash
# Good startup
[INFO] Application startup complete
[INFO] Uvicorn running on http://0.0.0.0:$PORT

# Bad startup - Import errors
ModuleNotFoundError: No module named 'xyz'
ImportError: cannot import name 'xyz'

# Bad startup - Environment errors
KeyError: 'DATABASE_URL'
ConnectionError: could not connect to database
```

## Verification Checklist

After implementing fixes:
- [ ] Requirements.txt includes all dependencies
- [ ] Runtime.txt specifies Python 3.11.9
- [ ] Railway.json configuration exists
- [ ] Environment variables are set in Railway dashboard
- [ ] DATABASE_URL points to valid Supabase instance
- [ ] SESSION_SECRET_KEY is set and secure
- [ ] ALLOWED_ORIGINS includes Railway frontend URL

## Expected Result

After applying all fixes:
1. Railway deployment should succeed without import errors
2. Health check endpoint `/ping` should return `{"message":"pong","database":"reachable"}`
3. FastAPI docs should be accessible at `/api/docs`
4. No more 502 errors

## Next Steps

1. **Deploy with fixes** → Push changes and redeploy
2. **Test health endpoints** → Verify `/ping` and `/api/docs`
3. **Check logs** → Monitor Railway logs for any remaining issues
4. **Test full integration** → Connect frontend to backend

---

## Critical Fix Summary

The primary cause of 502 errors was **missing Python dependencies**, specifically:
- `itsdangerous` (required by SessionMiddleware)
- `numpy` (required by AI services)
- `markdown` & `markitdown` (required by content processing)

With the updated `requirements.txt`, the deployment should succeed.