# 🚀 Quick Reference - Valentine's Forever Room

## 📋 Quick Start (5 Minutes)

### Step 1: Install
```bash
cd d:\School\ Work\VIT\ Chennai\4th\ sem\Valentines
npm install
```

### Step 2: Configure Firebase
1. Go to https://console.firebase.google.com
2. Create new project → "valentines-ever-room"
3. Enable Email/Password Auth
4. Create Firestore Database
5. Create Cloud Storage
6. Copy your config to `.env`

### Step 3: Run
```bash
npm run dev
# Opens http://localhost:3000
```

### Step 4: Deploy
```bash
npm run build
firebase deploy
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | 👈 **START HERE** - Setup instructions |
| [README.md](README.md) | Features & overview |
| [src/App.jsx](src/App.jsx) | Main app & routing |
| [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) | Room creation |
| [src/pages/RoomView.jsx](src/pages/RoomView.jsx) | Guest experience |
| [src/components/CanvasStitcher.jsx](src/components/CanvasStitcher.jsx) | Photo strip generator |

---

## 🎯 User Flows

### Boyfriend Path
```
Sign Up → Create Account → Login → Dashboard 
→ Create Room → Write Letter → Upload Photos 
→ Get Room Code → Share with Girlfriend
```

### Girlfriend Path
```
Landing Page → Enter Room Code 
→ Read Letter → View Memories → Photo Booth 
→ Take 4 Photos → Download Strip
```

---

## 🔧 Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
firebase login       # Login to Firebase
firebase deploy      # Deploy to Firebase Hosting
firebase projects:list  # See your Firebase projects
```

---

## 🔑 Firebase Setup (4 Steps)

### 1. Create Project
https://console.firebase.google.com → New Project

### 2. Enable Auth
Authentication → Email/Password → Enable

### 3. Create Firestore
Firestore Database → Create → Test Mode → Create

### 4. Get Credentials
Project Settings → Web App → Copy config

### 5. Create .env
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app
```

---

## 📱 Features at a Glance

### Authentication ✅
- Email/password signup & login
- Secure session management
- Protected dashboard

### Dashboard ✅
- Create rooms with unique codes
- Write love letters
- Upload 5-10 photos
- All data saved to Firebase

### Guest Access ✅
- Enter room code (no login)
- View letter & memories
- Photo booth with webcam
- Download photo strip as PNG

### Photo Booth ✅
- Real-time webcam
- 3-2-1 countdown timer
- Take 4 photos
- Canvas-based strip generator
- One-click PNG download

---

## 🏗️ Project Structure

```
src/
├─ App.jsx                    # Routing
├─ firebase.js                # Config
├─ index.css                  # Styles
├─ main.jsx                   # Entry
├─ context/
│  └─ AuthContext.jsx         # Auth state
├─ pages/
│  ├─ SignUp.jsx              # Register
│  ├─ Login.jsx               # Login
│  ├─ Dashboard.jsx           # Create rooms
│  ├─ RoomAccess.jsx          # Landing
│  └─ RoomView.jsx            # Guest view
└─ components/
   ├─ PhotsBooth.jsx          # Camera
   ├─ CanvasStitcher.jsx      # Strip maker
   └─ ProtectedRoute.jsx      # Auth guard
```

---

## 🔐 Security Quick Setup

### Firestore Rules (Copy-paste)
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /rooms/{document=**} {
      allow read;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

---

## 🧪 Quick Test

### Test Locally
1. `npm run dev`
2. Sign up: test@example.com / password123
3. Create room: Fill 3-step form
4. Share room code with someone
5. Go to landing page, enter code
6. Test photo booth
7. Download photo strip

### Test Photo Booth
1. Allow webcam access
2. Take 4 photos with countdown
3. Click "Create My Strip"
4. Click download button
5. Check Downloads folder

---

## ⚡ Troubleshooting

| Issue | Fix |
|-------|-----|
| Firebase not connecting | Check .env, run `npm install` |
| Webcam not working | Allow permissions in browser |
| Photos not uploading | Check Cloud Storage bucket exists |
| Build fails | `npm cache clean --force && npm install` |
| Deploy fails | `firebase logout && firebase login` |

---

## 📚 Documentation Map

```
Quick Start     → SETUP_GUIDE.md ⭐
Overview        → README.md
How it works    → ARCHITECTURE.md
Full specs      → TECHNICAL_SPECS.md
Deploy to web   → DEPLOYMENT.md
File guide      → INDEX.md & FILE_INVENTORY.md
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  pink: { ... }
}
```

### Change Photo Strip Size
Edit `src/components/CanvasStitcher.jsx`:
```javascript
const photoWidth = 300;   // Width
const photoHeight = 400;  // Height
```

### Change UI Text
Search & replace in `src/pages/*` files

---

## 📊 What's Included

```
✅ Complete React app
✅ Firebase integration
✅ Authentication system
✅ Room management
✅ Photo booth
✅ Photo strip generator
✅ 6 comprehensive guides
✅ Security configured
✅ Ready to deploy
```

---

## 🚀 Next Steps (no storage costs!)
✅ Firebase integration (Auth + Firestore only)
✅ Authentication system
✅ Room management
✅ Photo booth
✅ Photo strip generator (100% free - client-side)
✅ 6 comprehensive guides
✅ Security configured
✅ Ready to deploy
✅ Completely free tier eligible
   - [ ] Test all features
   - [ ] Customize colors/text
   - [ ] Test on mobile

3. **This Week**
   - [ ] Deploy: `npm run build && firebase deploy`
   - [ ] Share with friends
   - [ ] Collect feedback

---

## 💡 Pro Tips

1. **Room Codes** - All 6 chars, auto-generated, can regenerate
2. **Photos** - Max 10, auto-upload to Firebase Storage
3. **Download** - Photos save to your Downloads folder
4. **Mobile** - Works on phone/tablet with webcam
5. **Share** - Send anyone the room code (no login needed)

---

## 📞 When You Need Help

- **Setup issues?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deploy issues?** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Want to understand the code?** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **Need tech details?** → [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- **File locations?** → [INDEX.md](INDEX.md)

---

## 🎯 Expected Workflow

```
Login as Boyfriend
  ↓
Create Room (3 steps: info → letter → photos)
  ↓
Get Room Code (e.g., ABC123)
  ↓
Share Code with Girlfriend
  ↓
Girlfriend enters code at landing page
  ↓
Girlfriend sees: Letter → Photos → Photo Booth
  ↓
Girlfriend takes 4 photos
  ↓
Girlfriend downloads photo strip (.png)
  ↓
🎉 Memories saved!
```

---

## ✨ Final Checklist Before Going Live

```
✅ Firebase project created
✅ .env file configured
✅ npm install completed
✅ npm run dev works
✅ Can sign up & login
✅ Can create room
✅ Can upload photos
✅ Can access room via code
✅ Webcam works
✅ Can download photo strip
✅ npm run build succeeds
✅ firebase deploy works
```

---

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-02-01  

🎉 **You're all set! Happy coding and Happy Valentine's Day!** 💕

---

### Quick Links
- 📖 [Setup Guide](SETUP_GUIDE.md)
- 💻 [App Code](src/App.jsx)
- 🚀 [Deployment](DEPLOYMENT.md)
- 📚 [All Docs](README.md)
