# 🏗️ Valentine's Forever Room - Architecture Document

## System Overview

Valentine's Forever Room is a two-sided platform:
1. **Boyfriend Dashboard** - Authenticated account system for room creation
2. **Girlfriend Experience** - Public access via room code for viewing memories

---

## 🔄 Data Flow

### Authentication Flow
```
SignUp/Login
    ↓
Firebase Auth (Email/Password)
    ↓
AuthContext (React Context API)
    ↓
Protected Routes (ProtectedRoute component)
    ↓
Dashboard (Authenticated User Only)
```

### Room Creation Flow
```
Boyfriend Login
    ↓
Dashboard (2-step form)
    ├─ Step 1: Basic Info (Name, Room Code)
    └─ Step 2: Write Letter
    ↓
Firestore Database (Create rooms collection)
    ↓
Room Code Generated & Shareable
```

### Room Access Flow
```
Landing Page (Room Code Input)
    ↓
Verify Room Code in Firestore
    ↓
Room Found?
    ├─ YES → Redirect to RoomView
    └─ NO → Show Error
    ↓
RoomView (Public Access)
    ├─ Display Letter
    └─ Photo Booth
```

### Photo Strip Creation Flow
```
PhotoBooth Component
    ↓
Take 4 Photos (Webcam)
    ↓
CanvasStitcher Component
    ↓
HTML5 Canvas (Stitch photos vertically)
    ↓
Generate PNG Image
    ↓
Download to Device
```

---

## 📦 Component Architecture

### Context Layer
```
AuthContext.jsx
├─ currentUser (Firebase user object)
├─ signup() - Create new account
├─ login() - Sign in with email/password
└─ logout() - Sign out user
```

### Page Components
```
pages/
├─ RoomAccess.jsx (Public Landing)
├─ SignUp.jsx (Public Auth)
├─ Login.jsx (Public Auth)
├─ Dashboard.jsx (Protected)
└─ RoomView.jsx (Public Room Viewer)
```

### Functional Components
```
components/
├─ ProtectedRoute.jsx (Route Guard)
├─ PhotoBooth.jsx (Camera Interface)
└─ CanvasStitcher.jsx (Image Processing)
```

---

## 🗄️ Firebase Integration

### Authentication (Firebase Auth)
```javascript
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }

Auth Operations:
├─ signup(email, password)
├─ login(email, password)
└─ logout()
```

### Database (Firestore)
```javascript
import { getFirestore, collection, addDoc, getDocs, query, where }

Collections:
├─ users/{uid}
│  └─ Document structure: { uid, email, createdRooms[] }
└─ rooms/{roomId}
   └─ Document structure: { roomCode, ownerUid, boyfriendName, letterContent, createdAt, rsvp }

Operations:
├─ Create room (POST)
├─ Read room by code (GET)
├─ Read user's rooms (GET)
└─ Update RSVP (PATCH)
```

---

## 🎨 UI/UX Structure

### Navigation Flow

```
/                    (RoomAccess - Landing)
├─ /signup          (SignUp - Create Account)
├─ /login           (Login - Sign In)
├─ /dashboard       (Dashboard - Protected, Create Rooms)
└─ /room/:roomId    (RoomView - Public Room Viewer)
```

### State Management

#### Global State (AuthContext)
- `currentUser` - Firebase user object or null
- `loading` - Auth loading state

#### Local State (Components)
- `Dashboard`: Form steps, memories array, room code
- `PhotoBooth`: Photos captured, countdown timer
- `RoomAccess`: Room code input, loading, error

---

## 🔐 Security Architecture

### Authentication
```
Email/Password Auth
    ↓
Firebase Auth Service
    ↓
JWT Token (Automatic)
    ↓
Verified Requests to Firestore/Storage
```

### Authorization (Firestore Rules)
```
users/{uid}
├─ Read: request.auth.uid == uid ✅
└─ Write: request.auth.uid == uid ✅

rooms/{roomId}
├─ Read: true (Public) ✅
├─ Create: request.auth != null ✅
├─ Update: owner only (future rule)
└─ Delete: owner only (future rule)
```

### Authorization (Storage Rules)
```
memories/{userId}/*
├─ Read: true (Public) ✅
└─ Write: request.auth != null ✅
```

---

## 📡 API Endpoints (Firestore Operations)

### Create Room
```javascript
POST /rooms
Body: {
  roomCode: "ABC123",
  ownerUid: "user-123",
  boyfriendName: "John",
  letterContent: "...",
  memories: [...],
  createdAt: timestamp,
  rsvp: "none"
}
```

### Get Room by Code
```javascript
GET /rooms?roomCode=ABC123
Response: { roomId, ...roomData }
```

### Get Room by ID
```javascript
GET /rooms/{roomId}
Response: { ...roomData }
```

### Upload Image
```
PUT /storage/memories/{userId}/{imageId}
Body: Image Blob
Response: Download URL
```

---

## 🎭 User Roles & Permissions

### Boyfriend (Authenticated)
- ✅ Sign up & login
- ✅ Create rooms
- ✅ Upload memories
- ✅ Write letters
- ✅ Generate room codes
- ✅ View own rooms
- ❌ Access other's rooms (no delete/edit yet)

### Girlfriend (Public User)
- ✅ Access room via code
- ✅ View letter
- ✅ View memories
- ✅ Take photos
- ✅ Download photo strip
- ❌ Edit/delete room
- ❌ No account required

### Admin (Future)
- ✅ Moderate rooms
- ✅ Delete inappropriate content
- ✅ Analytics & reporting

---

## 🛠️ Technical Stack Details

### Frontend Framework
```
React 18
├─ Functional Components
├─ Hooks (useState, useContext, useRef, useEffect)
├─ Context API (Auth)
└─ React Router (Navigation)
```

### Styling
```
Tailwind CSS 3.4
├─ Utility-first CSS
├─ Responsive design (mobile-first)
├─ Custom animations (float, fade-in)
└─ Dark mode support (optional)
```

### Build Tools
```
Vite 5.0
├─ Fast development server (HMR)
├─ Optimized production build
├─ Environment variable support
└─ CSS preprocessing (PostCSS)
```

### Image Processing
```
HTML5 Canvas API
├─ Load images from blob URLs
├─ Draw images on canvas
├─ Combine 4 photos vertically
├─ Export as PNG
└─ Handle image scaling
```

### Camera Access
```
react-webcam
├─ Real-time video stream
├─ Screenshot capture
├─ JPEG compression
└─ Browser permission handling
```

---

## 📊 Performance Considerations

### Image Optimization
- Images uploaded to Firebase Storage (cloud)
- Automatic compression by Firebase
- CDN distribution for fast downloads
- Cached by browser

### Canvas Operations
- Client-side image stitching (no server load)
- Blob-based image handling
- Efficient memory usage for 4 photos
- Async image loading

### Firestore Optimization
- Query by room code (indexed)
- Minimal document reads
- No complex joins (denormalized)
- Pagination (future feature)

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
    ↓
npm run dev
    ↓
Vite Dev Server (http://localhost:3000)
```

### Production
```
GitHub/GitLab (Source Code)
    ↓
Firebase Deploy
    ↓
Firebase Hosting CDN
    ↓
Global Distribution
    ↓
Custom Domain (optional)
```

---

## 📈 Scalability Plan

### Current Scale (MVP)
- Small user base
- Limited concurrent users
- Test mode Firestore

### Scale to 1000 Users
```
✅ Enable Firestore backups
✅ Set up read/write quotas
✅ Implement caching (future)
✅ Add analytics (Firebase Analytics)
```

### Scale to 10,000+ Users
```
✅ Firestore indexes
✅ Cloud Functions for processing
✅ Memcache for room lookups
✅ CDN for static assets
✅ Load balancing
```

---

## 🔧 Monitoring & Analytics

### Firebase Console
- Authentication dashboard
- Firestore metrics
- Storage usage
- Performance insights

### Custom Metrics (Future)
- Room creation rate
- Photo booth usage
- Download statistics
- User engagement

---

## 📝 API Documentation (Sample)

### Create Room (Firestore Operation)
```javascript
const createRoom = async (userId, roomData) => {
  const docRef = await addDoc(collection(db, 'rooms'), {
    roomCode: roomData.roomCode,
    ownerUid: userId,
    boyfriendName: roomData.boyfriendName,
    letterContent: roomData.letterContent,
    memories: roomData.memories,
    createdAt: serverTimestamp(),
    rsvp: 'none'
  });
  return docRef.id;
};
```

### Get Room by Code
```javascript
const getRoomByCode = async (roomCode) => {
  const q = query(
    collection(db, 'rooms'),
    where('roomCode', '==', roomCode.toUpperCase())
  );
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data();
};
```

### Upload Image to Storage
```javascript
const uploadMemory = async (userId, file) => {
  const storageRef = ref(storage, `memories/${userId}/${Date.now()}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
```

---

## 🎓 Technology Learning Path

1. **React Basics** - Components, Hooks, State
2. **Firebase Setup** - Authentication, Firestore
3. **React Router** - Navigation, Protected Routes
4. **Context API** - Global Auth State
5. **Canvas API** - Image Processing
6. **Tailwind CSS** - Styling & Responsive Design
7. **Cloud Storage** - File Upload/Download

---

## 🔄 Future Enhancements

### Phase 2
- [ ] Update/Delete rooms
- [ ] Multiple photos per strip
- [ ] Photo editing tools
- [ ] Email sharing
- [ ] QR code generation

### Phase 3
- [ ] Video messages
- [ ] Couple's timeline
- [ ] Collaborative playlists
- [ ] Chat/messaging
- [ ] Guest book feature

### Phase 4
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Printing service
- [ ] AR filters
- [ ] AI-generated cards

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-01  
**Framework:** React + Firebase  
**Status:** Production Ready 🚀
