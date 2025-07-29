# 🚀 NETLIFY GITHUB AUTO-DEPLOYMENT SETUP

*Setting up automated deployment from GitHub with approval gates*  
*Date: 2025-07-29*

---

## 🎯 **SETUP OBJECTIVES**

1. **Automated Deployment**: Deploy automatically from GitHub repository
2. **Approval Gates**: Require manual approval before deployment
3. **Branch Protection**: Deploy only approved branches
4. **Rollback Capability**: Easy rollback to previous versions

---

## 📋 **NETLIFY GITHUB INTEGRATION STEPS**

### **Step 1: Connect GitHub Repository**

1. **Access Netlify Site Settings**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Navigate to "Resume Builder AI" site
   - Click "Site Settings"

2. **Connect to GitHub**
   - Go to "Build & Deploy" → "Continuous Deployment"
   - Click "Link site to Git"
   - Choose "GitHub" as provider
   - Authorize Netlify to access your GitHub account

3. **Select Repository**
   - Choose repository: `goksnair/resume-builder-ai`
   - Set branch to deploy from: `main`
   - Set build command: `cd apps/web-app && npm run build`
   - Set publish directory: `apps/web-app/dist`

### **Step 2: Configure Build Settings**

```yaml
# Netlify build configuration
Build command: cd apps/web-app && npm install && npm run build
Publish directory: apps/web-app/dist
Base directory: (leave empty)
Build image: Ubuntu Focal 20.04 (default)
Node.js version: 18 (from .nvmrc if present)
```

### **Step 3: Setup Deployment Approval Gates**

#### **Option A: Deploy Previews (Recommended)**
1. **Enable Deploy Previews**
   - Go to "Build & Deploy" → "Deploy Contexts"
   - Enable "Deploy Previews" for pull requests
   - Set "Branch deploys" to "None" or specific branches only

2. **Approval Workflow**
   - Create pull requests for changes
   - Review changes in deploy preview
   - Merge to main only after approval
   - Main branch auto-deploys after merge

#### **Option B: Protected Branches + Manual Triggers**
1. **GitHub Branch Protection**
   - Go to GitHub repo → Settings → Branches
   - Add protection rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

2. **Netlify Manual Deploy**
   - Go to "Build & Deploy" → "Continuous Deployment"
   - Change from "Automatic" to "Manual"
   - Deploy manually after approval

### **Step 4: Environment Variables**

```bash
# Add these to Netlify environment variables
VITE_API_URL=https://resume-builder-ai-production.up.railway.app
NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
NODE_VERSION=18
```

---

## 🔧 **BUILD CONFIGURATION FILES**

### **Create netlify.toml**
```toml
[build]
  base = "apps/web-app"
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefix=/dev/null"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  command = "npm install && npm run build"

[context.deploy-preview]
  command = "npm install && npm run build"

[context.branch-deploy]
  command = "npm install && npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### **Create .nvmrc**
```
18
```

---

## 🛡️ **APPROVAL WORKFLOW SETUP**

### **Recommended Workflow: PR-Based Approvals**

1. **Development Process**
   ```bash
   # Developer workflow
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Review Process**
   - Create Pull Request from feature branch to `main`
   - Netlify automatically creates deploy preview
   - Review changes in preview environment
   - Request reviews from team members
   - Approve and merge after validation

3. **Deployment Process**
   - Merge to `main` triggers production deployment
   - Monitor deployment in Netlify dashboard
   - Validate production deployment
   - Rollback if issues detected

### **GitHub Branch Protection Rules**

```yaml
# Recommended protection rules for main branch
Protection Rules:
  - Require pull request reviews: true
  - Required number of reviewers: 1
  - Dismiss stale reviews: true
  - Require review from code owners: false
  - Require status checks: true
  - Required status checks:
    - netlify/resume-builder-ai/deploy-preview
  - Require conversation resolution: true
  - Include administrators: false
  - Allow force pushes: false
  - Allow deletions: false
```

---

## 🚨 **EMERGENCY PROCEDURES**

### **Quick Rollback Process**
1. **Via Netlify Dashboard**
   - Go to "Deploys" section
   - Find last working deployment
   - Click "Publish deploy" to rollback

2. **Via Git Revert**
   ```bash
   # Revert problematic commit
   git revert <commit-hash>
   git push origin main
   # Triggers new deployment with reverted changes
   ```

### **Deployment Freeze**
1. **Disable Auto-Deploy**
   - Go to "Build & Deploy" → "Build settings"
   - Change "Branch deploys" to "None"
   - Manually control all deployments

2. **Emergency Contact**
   - Monitor Netlify deployment logs
   - Check GitHub Actions status
   - Review error messages and alerts

---

## 📊 **MONITORING & NOTIFICATIONS**

### **Netlify Notifications**
```yaml
# Setup notifications for:
- Deploy started
- Deploy succeeded  
- Deploy failed
- Deploy canceled

# Notification channels:
- Email notifications
- Slack integration (if available)
- GitHub status checks
```

### **GitHub Integration**
```yaml
# Automatic status checks:
- Build status on PRs
- Deploy preview links
- Performance budgets
- Security scanning results
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Basic GitHub Integration**
- [ ] Connect Netlify to GitHub repository
- [ ] Configure build settings (command, directory)
- [ ] Set environment variables
- [ ] Test automatic deployment from main branch

### **Phase 2: Approval Gates**
- [ ] Enable deploy previews for PRs
- [ ] Setup GitHub branch protection rules
- [ ] Configure required status checks
- [ ] Test PR-based deployment workflow

### **Phase 3: Configuration Files**
- [ ] Create and commit netlify.toml
- [ ] Add .nvmrc for Node.js version
- [ ] Configure security headers
- [ ] Setup redirect rules for SPA

### **Phase 4: Testing & Validation**
- [ ] Test deployment from feature branch PR
- [ ] Validate deploy preview functionality
- [ ] Test production deployment after merge
- [ ] Verify rollback procedure works

---

## 🎯 **EXPECTED WORKFLOW**

### **Normal Development Cycle**
```
1. Developer creates feature branch
2. Developer makes changes and pushes
3. Developer creates PR to main branch
4. Netlify creates deploy preview automatically
5. Team reviews changes in preview environment
6. PR approved and merged to main
7. Netlify automatically deploys to production
8. Monitor deployment and validate functionality
```

### **Emergency Deployment**
```
1. Critical fix needed immediately
2. Create hotfix branch from main
3. Make minimal necessary changes
4. Create PR with "HOTFIX" label
5. Fast-track review and approval
6. Merge to main for immediate deployment
7. Monitor closely and prepare rollback if needed
```

---

## 🔧 **IMPLEMENTATION COMMANDS**

### **Create Configuration Files**
```bash
# Navigate to project root
cd "/Users/gokulnair/Resume Builder"

# Create netlify.toml
cat > netlify.toml << 'EOF'
[build]
  base = "apps/web-app"
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
EOF

# Create .nvmrc
echo "18" > .nvmrc

# Commit configuration files
git add netlify.toml .nvmrc
git commit -m "feat: add Netlify configuration for auto-deployment"
git push origin main
```

---

## 🎉 **BENEFITS OF THIS SETUP**

### **Automation Benefits**
- ✅ Automatic deployment from GitHub
- ✅ No manual file dragging required
- ✅ Consistent build environment
- ✅ Deploy previews for testing

### **Quality Benefits**
- ✅ Approval gates prevent bad deployments
- ✅ Deploy previews enable safe testing
- ✅ Easy rollback for quick recovery
- ✅ Build logs for debugging

### **Team Benefits**
- ✅ Clear approval workflow
- ✅ Visible deployment status
- ✅ Collaborative review process
- ✅ Automated notifications

---

**🚀 Ready to implement GitHub auto-deployment with approval gates!**