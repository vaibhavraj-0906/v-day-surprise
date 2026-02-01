# 💕 Valentine's Forever Room - Project Index

## 📖 Quick Navigation

### For Getting Started
1. **[README.md](README.md)** - Project overview & features
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
3. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Firebase Hosting

### For Developers
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design & technical details
2. **[package.json](package.json)** - Dependencies & scripts
3. **Source Code** - See folder structure below

---

## 📁 Project Structure

```
Valentines/
├── 📁 src/                          # React application source
│   ├── 📁 components/               # Reusable components
│   │   ├── CanvasStitcher.jsx      # Photo strip generator (Canvas API)
│   │   ├── PhotoBooth.jsx           # Webcam photo capture
│   │   └── ProtectedRoute.jsx       # Route authentication guard
│   │
│   ├── 📁 context/                  # React Context (State Management)
│   │   └── AuthContext.jsx          # Firebase Auth context & hooks
│   │
│   ├── 📁 pages/                    # Page components (Routes)
│   │   ├── SignUp.jsx               # Create account (public)
│   │   ├── Login.jsx                # Sign in (public)
│   │   ├── Dashboard.jsx            # Create rooms (protected)
│   │   ├── RoomAccess.jsx           # Landing page with code input
│   │   └── RoomView.jsx             # Room viewer (letter, memories, photobooth)
│   │
│   ├── App.jsx                      # Main app + routing
│   ├── main.jsx                     # React entry point
│   ├── firebase.js                  # Firebase configuration
│   └── index.css                    # Global styles + Tailwind
│
├── 📁 public/                       # Static assets (future)
├── 📁 dist/                         # Build output (generated)
│
├── 📄 index.html                    # HTML entry point
├── 📄 package.json                  # Dependencies & npm scripts
├── 📄 vite.config.js                # Vite build config
├── 📄 tailwind.config.js            # Tailwind CSS config
├── 📄 postcss.config.js             # PostCSS config
├── 📄 firebase.json                 # Firebase Hosting config
├── 📄 .firebaserc                   # Firebase project ID
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env.example                  # Environment variables template
│
├── 📄 README.md                     # Project overview
├── 📄 SETUP_GUIDE.md                # Setup instructions
├── 📄 DEPLOYMENT.md                 # Deployment guide
└── 📄 ARCHITECTURE.md               # Technical architecture
```

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase credentials in .env
cp .env.example .env
# Edit .env with your Firebase config

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to Firebase
firebase deploy
```

---

## 📊 Key Files Explained

### Authentication & State
- **[src/context/AuthContext.jsx](src/context/AuthContext.jsx)** - Firebase auth context, handles login/signup/logout
- **[src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)** - Guards dashboard from unauthorized access

### Core Features
- **[src/components/CanvasStitcher.jsx](src/components/CanvasStitcher.jsx)** - Stitches 4 photos into vertical strip with HTML5 Canvas
- **[src/components/PhotoBooth.jsx](src/components/PhotoBooth.jsx)** - Webcam interface with 3-2-1 countdown
- **[src/pages/Dashboard.jsx](src/pages/Dashboard.jsx)** - 3-step room creation form

### User Flows
- **[src/pages/SignUp.jsx](src/pages/SignUp.jsx)** - Boyfriend account creation
- **[src/pages/Login.jsx](src/pages/Login.jsx)** - Boyfriend login
- **[src/pages/RoomAccess.jsx](src/pages/RoomAccess.jsx)** - Girlfriend room entry via code
- **[src/pages/RoomView.jsx](src/pages/RoomView.jsx)** - Girlfriend experience (letter, memories, photobooth)

### Configuration
- **[src/firebase.js](src/firebase.js)** - Firebase initialization
- **[vite.config.js](vite.config.js)** - Vite build configuration
- **[tailwind.config.js](tailwind.config.js)** - Tailwind CSS customization
- **[firebase.json](firebase.json)** - Firebase Hosting settings

---

## 🎯 Features by User Type

### Boyfriends 👨
```
Sign Up → Create Room → Write Letter → Upload Photos → Share Code
  ✅ Email/Password Auth
  ✅ Unique room code generation
  ✅ Love letter editor
  ✅ Image upload (5-10 photos)
  ✅ Automatic Firebase Storage handling
```

### Girlfriends 👩
```
Enter Code → View Room → Read Letter → Browse Photos → Take Pictures
  ✅ No login required
  ✅ Room code validation
  ✅ Letter display
  ✅ Memory gallery
  ✅ Webcam photo booth
  ✅ Photo strip download
```

---

## 🔧 Technology Stack

| Layer | Technology | File |
|-------|-----------|------|
| Frontend | React 18 + Vite | [src/App.jsx](src/App.jsx) |
| Styling | Tailwind CSS | [tailwind.config.js](tailwind.config.js) |
| Routing | React Router | [src/App.jsx](src/App.jsx) |
| State | Context API | [src/context/AuthContext.jsx](src/context/AuthContext.jsx) |
| Auth | Firebase Auth | [src/firebase.js](src/firebase.js) |
| Database | Firestore | [src/firebase.js](src/firebase.js) |
| Image Processing | Canvas API | [src/components/CanvasStitcher.jsx](src/components/CanvasStitcher.jsx) |
| Camera | react-webcam | [src/components/PhotoBooth.jsx](src/components/PhotoBooth.jsx) |
| Deployment | Firebase Hosting | [firebase.json](firebase.json) |

---

## 📈 Data Model

### Firestore Collections

**users/{uid}**
```javascript
{
  uid: "firebase-uid",
  email: "boyfriend@example.com",
  createdRooms: ["room-id-1", "room-id-2"]
}
```

**rooms/{roomId}**
```javascript
{
  roomCode: "ABC123",
  ownerUid: "firebase-uid",
  boyfriendName: "John",
  letterContent: "My dearest...",
  memories: [
    {
      url: "https://storage.googleapis.com/...",
      date: "2/14/2026",
      note: "First date"
    }
  ],
  createdAt: Timestamp,
  rsvp: "none" | "yes" | "maybe"
}
```

**Cloud Storage**
```
memories/
├── {userId}/
│   ├── {imageId}.jpg
│   ├── {imageId}.jpg
│   └── ...
```

---

## 🔐 Security Checklist

- ✅ Firebase Auth (Email/Password)
- ✅ Firestore security rules (read public, write authenticated)
- ✅ Storage security rules (read public, write authenticated)
- ✅ Protected routes (Dashboard only for logged-in)
- ✅ No hardcoded API keys
- ✅ Environment variables for secrets
- ✅ CORS configured for storage

---

## 🧪 Testing Checklist

### Functionality
- [ ] Sign up creates account
- [ ] Login authenticates user
- [ ] Logout clears session
- [ ] Room code uniqueness enforced
- [ ] Images upload to Firebase
- [ ] Photos capture from webcam
- [ ] Canvas generates strip
- [ ] Download saves PNG
- [ ] Room access via code works
- [ ] Mobile responsive

### Edge Cases
- [ ] Duplicate room codes rejected
- [ ] Missing required fields blocked
- [ ] Network errors handled
- [ ] Large image uploads handled
- [ ] Expired/invalid codes show error

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full Support |
| Firefox | Latest | ✅ Full Support |
| Safari | Latest | ✅ Full Support |
| Edge | Latest | ✅ Full Support |
| Chrome Android | Latest | ✅ Full Support |
| Safari iOS | Latest | ✅ Full Support |

---

## 📚 Documentation Files

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Project overview | Everyone |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Installation & config | Developers |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Firebase deployment | DevOps/Deployment |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | Developers/Architects |
| [.env.example](.env.example) | Environment template | Developers |

---

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [React Context API](https://react.dev/reference/react/useContext)

### Firebase
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Cloud Storage](https://firebase.google.com/docs/storage)

### Web APIs
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Webcam API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)

### Styling
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Tailwind Components](https://tailwindui.com)

---

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution | Docs |
|-------|----------|------|
| Firebase not connecting | Check .env variables | [SETUP_GUIDE.md](SETUP_GUIDE.md#2-configure-firebase) |
| Images not uploading | Check storage bucket & rules | [SETUP_GUIDE.md](SETUP_GUIDE.md#4-enable-cloud-storage) |
| Webcam not working | Check browser permissions | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| Build fails | Clear cache, reinstall deps | [DEPLOYMENT.md](DEPLOYMENT.md#build-fails) |
| 404 after deploy | Check dist folder | [DEPLOYMENT.md](DEPLOYMENT.md#app-shows-404-after-deploy) |

---

## 💡 Tips & Tricks

1. **Room Code** - Generate multiple codes and keep backups
2. **Photos** - Compress large images before uploading
3. **Letter** - Write drafts in notes app first, paste final
4. **Photo Booth** - Good lighting makes better strips
5. **Download** - Photos are cached locally, can share easily

---

## 🔄 Development Workflow

```
1. Edit code (src/)
   ↓
2. Hot reload (Vite dev server)
   ↓
3. Test locally
   ↓
4. Build (npm run build)
   ↓
5. Deploy (firebase deploy)
```

---

## 📞 Getting Help

- **Firebase Issues** → [Firebase Console](https://console.firebase.google.com)
- **React Issues** → [React Docs](https://react.dev)
- **Tailwind Issues** → [Tailwind Docs](https://tailwindcss.com)
- **Deployment Issues** → [DEPLOYMENT.md](DEPLOYMENT.md#-emergency-rollback)

---

## ✨ Next Steps

1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Configure Firebase project
3. Create `.env` file
4. Run `npm install`
5. Start with `npm run dev`
6. Build with `npm run build`
7. Deploy with `firebase deploy`

---

## 🎉 Final Notes

This is a complete, production-ready Valentine's app built with modern web technologies. Follow the setup guide, configure Firebase, and you'll have a beautiful platform running in minutes!

**Made with ❤️ for your special someone**

---

**Project Version:** 1.0  
**Status:** Production Ready 🚀  
**Last Updated:** 2026-02-01  
**Tech Stack:** React + Firebase + Tailwind + Canvas API
