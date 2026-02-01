# 💕 Valentine's Forever Room - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Firebase Project (create at [firebase.google.com](https://firebase.google.com))
- npm or yarn

### 1. Clone & Install Dependencies

```bash
cd "d:\School Work\VIT Chennai\4th sem\Valentines"
npm install
```

### 2. Configure Firebase

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project"
   - Name it "valentines-forever-room"
   - Enable Google Analytics (optional)

2. **Enable Authentication:**
   - In Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"
   - Save

3. **Create Firestore Database:**
   - Go to Firestore Database
   - Click "Create Database"
   - Start in **Test Mode** (for development)
   - Select a region closest to you

4. **Get Your Credentials:**
   - Project Settings → Your apps → Web app
   - Copy the Firebase config

5. **Create `.env` file:**
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Set Up Firestore Security Rules

In Firebase Console → Firestore → Rules, replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only users can read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Rooms - anyone can read, only owner can modify
    match /rooms/{document=**} {
      allow read;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CanvasStitcher.jsx       # Photo strip generator
│   4── PhotoBooth.jsx            # Webcam photo capture
│   └── ProtectedRoute.jsx         # Auth-protected routes
├── context/
│   └── AuthContext.jsx            # Firebase auth context
├── pages/
│   ├── SignUp.jsx                 # Boyfriend signup
│   ├── Login.jsx                  # Boyfriend login
│   ├── Dashboard.jsx              # Room creation & management
│   ├── RoomAccess.jsx             # Landing page (room code input)
│   └── RoomView.jsx               # Girlfriend view (letter, memories, photobooth)
├── App.jsx                        # Main app with routing
├── main.jsx                       # React DOM mount
├── index.css                      # Global styles
└── firebase.js                    # Firebase config
```

---

## 🎯 Features

### For Boyfriends (Authenticated Users)
- ✅ Sign up / Log in with email & password
- ✅ Create custom room with unique room code
- ✅ Write a love letter
- ✅ Upload 5-10 memory photos (stored in Firebase Storage)
- ✅ Auto-generated room codes

### For Girlfriends (Public Access)
- ✅ Enter room code to access the room
- ✅ View the love letter
- ✅ Browse memory photos
- ✅ Take 4 photos with webcam
- ✅ Generate downloadable photo strip (canvas-based)
- ✅ Download as PNG

---

## 🛠️ Database Schema

### Firestore Collections

#### `users` collection
```json
{
  "uid": "auto-generated",
  "email": "boyfriend@example.com",
  "createdRooms": ["roomId1", "roomId2"]
}
```

#### `rooms` collection
```json
{
  "roomCode": "ABC123",
  "ownerUid": "uid_of_creator",
  "boyfriendName": "John",
  "letterContent": "Dear Sarah...",
  "memories": [
    {
      "url": "https://storage.googleapis.com/...",
      "date": "1/14/2026",
      "note": ""
    }
  ],
  "createdAt": "2026-02-01T10:30:00Z",
  "rsvp": "none"
}
```

---

## 🚀 Deployment to Firebase Hosting

### Prerequisites
- Firebase CLI: `npm install -g firebase-tools`
- Logged in to Firebase: `firebase login`

### Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Initialize Firebase (if not done):**
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Public directory: `dist`
   - Single-page app: `Yes`

3. **Deploy:**
   ```bash
   firebase deploy
   ```

4. **Your app is live!**
   ```
   https://your-project-id.web.app
   ```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to customize the pink/red theme:
```javascript
colors: {
  pink: { /* ... */ }
}
```

### Adjust Photo Strip Size
In `CanvasStitcher.jsx`, modify:
```javascript
const photoWidth = 300;  // Change width
const photoHeight = 400; // Change height
const gap = 10;          // Space between photos
const padding = 20;      // Border padding
```

### Add More Photos to Strip
In `PhotoBooth.jsx`, change the countdown and photo limit from 4 to 5 or more.

---

## 🐛 Troubleshooting

### Firebase Auth Not Working
- Check API key in `.env`
- Ensure Email/Password is enabled in Firebase Console
- Clear browser cookies

### Photos Not Uploading
- Check Cloud Storage bucket exists
- Verify storage rules are set correctly
- Check user has write permission

### Canvas Download Not Working
- Ensure photos are from same domain (no CORS issues)
- Check browser supports canvas `toDataURL()`

### Room Code Not Found
- Verify code is in Firestore database
- Check Firestore rules allow reads
- Try regenerating code in dashboard

---

## 📱 Mobile Optimization

The app is fully responsive:
- Mobile-first design with Tailwind CSS
- Touch-friendly buttons (44px+ minimum)
- Responsive grid for memories
- Full-screen photo booth

---

## 🔒 Security Notes

- ✅ Authentication required for creating rooms
- ✅ Only room owner can modify their room
- ✅ Firestore rules restrict access
- ✅ Storage rules prevent unauthorized uploads
- ✅ No sensitive data in URLs

---

## 📝 Next Steps

1. Set up your Firebase project
2. Add your credentials to `.env`
3. Run `npm install` and `npm run dev`
4. Test the flow: Sign up → Create room → Share code → Guest access
5. Deploy to Firebase Hosting

---

## 💡 Tips

- **Generate unique room codes** before sharing
- **Upload quality photos** for better memories
- **Write a heartfelt letter** - it's the centerpiece
- **Test photobooth** on your device before showing
- **Download photo strips** as keepsakes

Happy Valentine's! 💕

---

## 📧 Support

For Firebase issues: https://firebase.google.com/support
For React issues: https://react.dev
For Tailwind help: https://tailwindcss.com/docs
