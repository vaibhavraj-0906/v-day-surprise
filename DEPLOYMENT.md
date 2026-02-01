# 🚀 Deployment Guide - Valentine's Forever Room

## Firebase Hosting Deployment

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This opens a browser window to authenticate with your Google account.

### Step 3: Initialize Firebase Project

```bash
cd "d:\School Work\VIT Chennai\4th sem\Valentines"
firebase init
```

When prompted:
- Select **Hosting** only
- Choose your Firebase project
- Set public directory to: **dist**
- Configure as single-page app: **Yes**
- Don't overwrite index.html: **No**

### Step 4: Build the Project

```bash
npm run build
```

This generates optimized production files in the `dist/` folder.

### Step 5: Deploy

```bash
firebase deploy
```

### Step 6: View Your App

After deployment, you'll see:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project-id.web.app
```

Visit the Hosting URL to see your live app!

---

## 🔐 Pre-Deployment Checklist

### Firebase Console Setup
- [ ] Email/Password authentication enabled
- [ ] Firestore database created (Production mode)
- [ ] Cloud Storage bucket created
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] CORS configured for storage (if needed)

### Code Quality
- [ ] `.env` file with all Firebase credentials
- [ ] No hardcoded API keys in code
- [ ] `package.json` has all dependencies
- [ ] `node_modules/` in `.gitignore`
- [ ] Build completes without errors: `npm run build`

### Testing
- [ ] Test signup/login flow
- [ ] Test room creation with images
- [ ] Test room access with code
- [ ] Test photo booth
- [ ] Test photo strip download
- [ ] Test on mobile browser
- [ ] Test on different browsers

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `valentines.example.com`)
4. Follow DNS verification steps
5. Update DNS records with provided values
6. Firebase automatically provisions SSL certificate

### DNS Configuration Example

```
CNAME Record:
Host: valentines
Points to: your-project-id.web.app
```

---

## 📊 Environment Management

### Development `.env`
```
VITE_FIREBASE_API_KEY=dev_key
VITE_FIREBASE_AUTH_DOMAIN=dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dev_project
```

### Production `.env.production`
```
VITE_FIREBASE_API_KEY=prod_key
VITE_FIREBASE_AUTH_DOMAIN=prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prod_project
```

### Using Different Configs

```bash
# Development
npm run dev

# Production build
npm run build
```

---

## 🔧 Firebase Hosting Configuration

### `firebase.json` (Already Configured)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Key Settings Explained

- **public**: Folder to deploy (build output)
- **ignore**: Files/folders to exclude
- **rewrites**: Route all requests to index.html (SPA routing)

---

## 🚨 Deployment Troubleshooting

### Build Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Firebase Authentication Error
```bash
# Clear firebase login
firebase logout

# Login again
firebase login

# Check project association
firebase projects:list
firebase use project-id
```

### Deployment Hangs
```bash
# Check file sizes
firebase hosting:disable  # Temporarily disable
firebase deploy --only hosting:valentines-prod  # Specify hosting

# For stuck uploads
firebase deploy --debug
```

### App Shows 404 After Deploy
- Check `dist/` folder exists and has files
- Verify `firebase.json` routing configuration
- Check `package.json` build command

### Environment Variables Not Loaded
```javascript
// Check if variables are accessible
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

// Should print your actual API key (not undefined)
```

If undefined:
1. Verify `.env` file exists
2. Variables must start with `VITE_`
3. Restart dev server after changing `.env`

---

## 📈 Monitoring After Deployment

### Firebase Console Dashboards

#### Authentication
- Active users
- Sign-up trends
- Authentication errors
- User metrics

#### Firestore
- Read/write operations
- Storage usage
- Query performance
- Latency metrics

#### Storage
- Uploaded bytes
- Downloaded bytes
- Operations count
- Bandwidth usage

#### Hosting
- Page views
- Response times
- Errors
- Geographic distribution

### Set Up Alerts (Optional)

1. Go to Firebase Console → Project Settings
2. Click "Integrations" tab
3. Enable Cloud Monitoring alerts
4. Set thresholds for quota usage

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}'
          channelId: live
          projectId: your-project-id
```

### Setup Service Account Key

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save JSON file
4. GitHub → Settings → Secrets → Add `FIREBASE_SERVICE_ACCOUNT_KEY`
5. Paste JSON content

---

## 🆘 Emergency Rollback

### Rollback to Previous Version

```bash
# View deployment history
firebase hosting:list-releases

# Rollback to specific version
firebase hosting:clone production staging

# Or manually deploy previous build
git revert <commit-hash>
npm run build
firebase deploy
```

---

## 💾 Backup & Recovery

### Firestore Backup

1. Firebase Console → Firestore → Backups
2. Create on-demand backup
3. Schedule automatic daily backups
4. Backups stored for 30 days

### Storage Backup

1. Use Firebase Console export
2. Or use `gsutil` command-line tool

```bash
# Backup storage
gsutil -m cp -r gs://bucket-name ./backup/

# Restore from backup
gsutil -m cp -r ./backup/* gs://bucket-name/
```

---

## 📝 Post-Deployment Tasks

- [ ] Test all features on production
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Share app URL with team
- [ ] Add to portfolio
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic)
- [ ] Configure email forwarding for support

---

## 🎯 Performance Optimization

### Optimize Build
```bash
# Check bundle size
npm run build -- --analyze

# Lazy load routes
React.lazy() for components
```

### Firebase Optimization
- Enable Cloud Functions for image resizing
- Implement Firestore indexes
- Use regional endpoints
- Enable CDN caching

### Client-Side Optimization
- Image compression before upload
- Service worker for offline support
- Code splitting
- Minification (automatic with Vite)

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Firebase Issues | https://firebase.google.com/support |
| Firebase Docs | https://firebase.google.com/docs |
| React Help | https://react.dev |
| Tailwind CSS | https://tailwindcss.com/docs |
| Vite | https://vitejs.dev |
| GitHub Actions | https://docs.github.com/actions |

---

## ✨ Success Checklist

- [ ] App is live and accessible
- [ ] All routes working
- [ ] Authentication functional
- [ ] Image uploads working
- [ ] Photo booth operational
- [ ] Photo strips downloadable
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance is good (<3s load)
- [ ] Security rules verified

---

**Deployment Version:** 1.0  
**Status:** Production Ready 🚀  
**Last Updated:** 2026-02-01

---

### 💕 Congratulations!

Your Valentine's Forever Room is now live! Share the link with your special someone and enjoy creating beautiful memories together.

**Happy Valentine's Day!** ❤️
