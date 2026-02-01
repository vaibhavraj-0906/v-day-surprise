# 💕 Valentine's Forever Room

A modern web platform for boyfriends to create personalized Valentine's rooms with love letters, memories, and interactive photo experiences for their girlfriends.

## 🌟 Features

### 💻 Boyfriend Dashboard (Authenticated)
- Create an account with email/password
- Generate a unique 6-character room code
- Write a heartfelt love letter
- Upload 5-10 personal memory photos
- Manage multiple rooms
- View girlfriend's RSVP status

### 👩 Girlfriend Experience (Public Access)
- No login required - just enter the room code
- View the boyfriend's love letter
- Interactive photo booth with webcam
- Take 4 photos and create a downloadable strip
- Download photo strip as high-quality PNG

### 🎨 Tech Stack
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore)
- **Photo Processing:** HTML5 Canvas API
- **Camera:** react-webcam

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Configuration
1. Create a Firebase project
2. Enable Email/Password authentication
3. Create Firestore database
4. Copy credentials to `.env`

```bash
# .env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
```bash
firebase deploy
```

---

## 📚 Key Components

### Authentication (`AuthContext.jsx`)
- Sign up / Login with Firebase Auth
- Protected routes for dashboard
- Auto logout on session end

### Dashboard (`Dashboard.jsx`)
- 2-step form for room creation
- Unique room code generation and validation
- Love letter writing

### Room View (`RoomView.jsx`)
- Displays letter and photobooth
- Tabbed interface for navigation
- Real-time photo capture

### Canvas Stitcher (`CanvasStitcher.jsx`)
- Stitches 4 photos into vertical strip
- High-quality PNG export
- Beautiful styling with date

### Photo Booth (`PhotoBooth.jsx`)
- Real-time webcam access
- 4-photo capture with countdown
- Thumbnail preview of captured photos

---

## 🎯 How It Works

### For Boyfriends:
1. Sign up with email & password
2. Create a new room
3. Set custom room code (or generate)
4. Write your love letter
5. Upload 5-10 memory photos
6. Share the room code with your girlfriend

### For Girlfriends:
1. Go to the landing page
2. Enter the 6-character room code
3. Access the room without login
4. Read the letter
5. Browse memories
6. Take 4 photos in the photobooth
7. Download your custom photo strip

---

## 🗄️ Database Schema

### Firestore Collections

**users**
```
{
  uid: "firebase-uid",
  email: "email@example.com",
  createdRooms: ["room-id-1", "room-id-2"]
}
```

**rooms**
```
{
  roomCode: "ABC123",
  ownerUid: "firebase-uid",
  boyfriendName: "John",
  letterContent: "My dearest...",
  memories: [
    {
      url: "https://storage.googleapis.com/...",
      date: "2/14/2026",
      note: "Our first date"
    }
  ],
  createdAt: Timestamp,
  rsvp: "none" | "yes" | "maybe"
}
```

---

## 🔐 Security Rules

### Firestore Rules
```firestore
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}

match /rooms/{document=**} {
  allow read;
  allow create, update, delete: if request.auth != null;
}
```

### Storage Rules
```
match /memories/{userId}/{allPaths=**} {
  allow read;
  allow write: if request.auth != null;
}
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      pink: { /* custom colors */ }
    }
  }
}
```

### Photo Strip Size
Edit `CanvasStitcher.jsx`:
```javascript
const photoWidth = 300;
const photoHeight = 400;
```

---

## 📱 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

**Requirements:**
- Webcam access (for photo booth)
- Canvas API support
- Local storage

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Firebase auth not working | Check API key, enable Email/Password in console |
| Photos not uploading | Verify storage bucket exists and rules are correct |
| Canvas download fails | Check browser privacy settings, allow localStorage |
| Webcam not working | Check browser permissions, ensure HTTPS in production |

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "firebase": "^10.7.0",
  "tailwindcss": "^3.4.0",
  "react-webcam": "^7.2.0",
  "uuid": "^9.0.1"
}
```

---

## 📈 Future Enhancements

- [ ] Video message instead of letter
- [ ] Music/background music for slideshow
- [ ] Animated bouquet/rose animations
- [ ] Couple's timeline (photos by date)
- [ ] Love quiz/game section
- [ ] Email sharing of photo strips
- [ ] QR code for room access
- [ ] Instant print option (3D printing integration)
- [ ] Multiple room themes
- [ ] Guest book feature

---

## 📄 License

Created with ❤️ for Valentine's Day 2026

---

## 🎓 Learning Resources

This project demonstrates:
- React hooks and context API
- Firebase authentication and Firestore
- Cloud Storage integration
- HTML5 Canvas for image manipulation
- React Router for SPA navigation
- Tailwind CSS for styling
- Responsive web design
- File upload handling

---

## 💬 Feedback

Have suggestions? Found a bug? Feel free to report or contribute!

**Made with 💕 for your special someone** ❤️
