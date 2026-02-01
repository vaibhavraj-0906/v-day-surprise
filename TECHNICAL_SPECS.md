# 📋 Technical Specifications - Valentine's Forever Room

## System Overview

**Project Name:** Valentine's Forever Room  
**Type:** Full-Stack Web Application (React + Firebase)  
**Status:** Production Ready  
**Version:** 1.0  
**Date:** February 2026  

---

## 🎯 Core Requirements

### Functional Requirements

#### Boyfriend (Account Owner)
```
FR1: Authentication
  FR1.1: Sign up with email and password
  FR1.2: Login with email and password
  FR1.3: Logout and session termination
  FR1.4: Password reset (future)
  FR1.5: Profile management (future)

FR2: Room Management
  FR2.1: Create new room with unique code
  FR2.2: View own rooms
  FR2.3: Edit room details
  FR2.4: Delete rooms (future)
  FR2.5: Share room code

FR3: Content Creation
  FR3.1: Write love letter (text)
  FR3.2: Upload photos (5-10 images)
  FR3.3: Add captions/notes to photos (future)
  FR3.4: Edit letter and photos
  FR3.5: Set expiration date (future)

FR4: Analytics (Future)
  FR4.1: View room visitor count
  FR4.2: See photo booth usage stats
  FR4.3: Track RSVP responses
```

#### Girlfriend (Guest User)
```
FR5: Room Access
  FR5.1: Enter room code
  FR5.2: Access room without login
  FR5.3: View room expired message (future)
  FR5.4: Copy room link

FR6: Content Viewing
  FR6.1: Read love letter
  FR6.2: Browse memory photos
  FR6.3: Download individual photo (future)
  FR6.4: Share to social media (future)

FR7: Photo Booth
  FR7.1: Access webcam
  FR7.2: Take 4 photos with countdown
  FR7.3: Preview photos before strip
  FR7.4: Generate photo strip (canvas)
  FR7.5: Download photo strip as PNG
  FR7.6: Retake photos
  FR7.7: Share strip (future)

FR8: Interaction
  FR8.1: RSVP to room (future)
  FR8.2: Leave message/comment (future)
  FR8.3: Add rating/emoji reaction (future)
```

---

## 🔧 Non-Functional Requirements

### Performance
```
NFR1: Load Time
  - Initial page load: < 3 seconds
  - Photo booth startup: < 2 seconds
  - Room access: < 1.5 seconds
  - Image upload: < 30 seconds per 5MB

NFR2: Scalability
  - Support 1000+ concurrent users
  - 10,000+ rooms without degradation
  - Unlimited image storage (Firebase)

NFR3: Optimization
  - Lazy load routes
  - Image compression
  - Canvas async operations
  - Firestore query optimization
```

### Security
```
NFR4: Authentication
  - Email/password hashing (Firebase)
  - HTTPS required
  - JWT tokens (Firebase)
  - Session timeout (15 min idle)

NFR5: Authorization
  - Only boyfriends create rooms
  - Only owner can modify room
  - Guests read-only access
  - Firestore rules enforce access control

NFR6: Data Protection
  - No sensitive data in URLs
  - Secure storage paths
  - Rate limiting (future)
  - Input validation
  - XSS prevention

NFR7: Privacy
  - Room codes as private access
  - No public user lists
  - No email exposure
  - Optional analytics only
```

### Reliability
```
NFR8: Availability
  - 99.9% uptime (Firebase SLA)
  - Graceful error handling
  - Automatic retry logic
  - Error logging

NFR9: Data Integrity
  - Atomic Firestore transactions
  - Data backup (30 days)
  - No data loss scenarios
  - ACID properties

NFR10: Compatibility
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
  - Mobile browsers (iOS 12+, Android 8+)
```

---

## 📦 Architecture Specifications

### Technology Stack

```
├─ Frontend
│  ├─ React 18.2.0 (UI Framework)
│  ├─ Vite 5.0.0 (Build Tool)
│  ├─ React Router 6.20.0 (Routing)
│  ├─ Tailwind CSS 3.4.0 (Styling)
│  ├─ react-webcam 7.2.0 (Camera)
│  └─ uuid 9.0.1 (ID Generation)
│
├─ Backend/Services
│  ├─ Firebase Authentication
│  ├─ Firestore Database
│  ├─ Cloud Storage
│  └─ Firebase Hosting
│
├─ Libraries
│  ├─ HTML5 Canvas API (Image Processing)
│  ├─ Web APIs (File, Blob, Fetch)
│  └─ MediaDevices API (Camera)
│
└─ DevOps
   ├─ Firebase CLI
   ├─ GitHub Actions (CI/CD)
   └─ Node.js 16+
```

### Component Architecture

```
App.jsx (Main)
├─ AuthProvider
│  ├─ AuthContext
│  └─ useAuth Hook
├─ Router
│  ├─ RoomAccess (Public)
│  ├─ SignUp (Public)
│  ├─ Login (Public)
│  ├─ Dashboard (Protected)
│  └─ RoomView (Public)
└─ Components
   ├─ ProtectedRoute (Guard)
   ├─ PhotoBooth (Camera UI)
   └─ CanvasStitcher (Image Processing)
```

---

## 🗄️ Database Schema

### Firestore Collections

#### users Collection
```javascript
{
  uid: string (primary key),
  email: string,
  createdRooms: string[],
  createdAt: timestamp,
  lastLogin: timestamp,
  displayName: string (future),
  avatar: string (future)
}
```

**Indexes:**
- Composite: uid, createdRooms

#### rooms Collection
```javascript
{
  id: string (auto-generated, primary key),
  roomCode: string (unique, indexed),
  ownerUid: string (indexed),
  boyfriendName: string,
  letterContent: string,
  memories: array of {
    url: string,
    date: string,
    note: string
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  expiresAt: timestamp (future),
  rsvp: enum (none | yes | maybe),
  visitorCount: number (future)
}
```

**Indexes:**
- Simple: roomCode
- Simple: ownerUid
- Composite: ownerUid, createdAt

#### guestSessions Collection (Future)
```javascript
{
  id: string,
  roomId: string,
  sessionStart: timestamp,
  sessionEnd: timestamp,
  photosTaken: number,
  stripDownloaded: boolean
}
```

### Cloud Storage

```
Storage Bucket Structure:
memories/
├── {userId}/
│   ├── {imageId}.jpg
│   ├── {imageId}.jpg
│   └── {imageId}.jpg
└── ...
```

**Retention Policy:**
- Permanent storage (no auto-delete)
- CDN distribution for fast access

---

## 🔐 Security Specifications

### Authentication Rules

```firestore
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - Only self-access
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Rooms - Public read, authenticated create/update
    match /rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerUid;
    }
  }
}
```

### Storage Rules

```
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### CORS Configuration

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 📊 API Specifications

### Room Endpoints (Firestore Operations)

#### Create Room
```
POST /firestore/collections/rooms
Headers:
  Authorization: Bearer {idToken}
  Content-Type: application/json

Request Body:
{
  roomCode: string (6 chars, uppercase),
  boyfriendName: string (1-100 chars),
  letterContent: string (0-5000 chars),
  memories: array of {
    url: string (Firebase Storage URL),
    date: string (MM/DD/YYYY),
    note: string (optional)
  }
}

Response: 201 Created
{
  id: string,
  roomCode: string,
  createdAt: timestamp
}
```

#### Get Room by Code
```
GET /firestore/collections/rooms?roomCode={code}
Query Parameters:
  roomCode: string

Response: 200 OK
{
  id: string,
  roomCode: string,
  boyfriendName: string,
  letterContent: string,
  memories: array,
  createdAt: timestamp
}
```

#### Get Room by ID
```
GET /firestore/collections/rooms/{roomId}
Parameters:
  roomId: string

Response: 200 OK
{ room object }
```

#### Update RSVP
```
PATCH /firestore/collections/rooms/{roomId}
Headers:
  Content-Type: application/json

Request Body:
{
  rsvp: enum (yes | no | maybe)
}

Response: 200 OK
{ updated room object }
```

### Storage Endpoints (Firebase Storage)

#### Upload Image
```
PUT /storage/bucket/memories/{userId}/{imageId}
Headers:
  Authorization: Bearer {idToken}
  Content-Type: image/jpeg (or png)

Body: Binary image data

Response: 200 OK
{
  downloadUrl: string,
  path: string
}
```

#### Download Image
```
GET /storage/bucket/memories/{userId}/{imageId}
Query Parameters:
  alt: media (to download) or json

Response: 200 OK
Binary image data or metadata
```

---

## 🎨 UI/UX Specifications

### Color Scheme
```
Primary: Pink
  - Light: #fce7f3 (50)
  - Medium: #f472b6 (400)
  - Dark: #db2777 (600)
  - Darkest: #831843 (900)

Secondary: Red
  - Light: #fee2e2 (50)
  - Medium: #fca5a5 (300)
  - Dark: #dc2626 (600)

Neutral: Gray
  - Light: #f3f4f6 (100)
  - Medium: #6b7280 (500)
  - Dark: #111827 (900)

Accents:
  - Success: Green (#22c55e)
  - Error: Red (#ef4444)
  - Warning: Yellow (#eab308)
```

### Responsive Breakpoints
```
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px
```

### Typography
```
Font Family: System UI (sans-serif)
Sizes:
  - H1: 36px (bold)
  - H2: 24px (bold)
  - H3: 18px (semibold)
  - Body: 16px (regular)
  - Small: 14px (regular)
```

---

## 📱 Device Specifications

### Supported Devices
```
Desktop:
  - Windows 10/11 (latest browsers)
  - macOS 11+ (latest browsers)
  - Linux (latest browsers)

Mobile:
  - iPhone 12+ (iOS 15+)
  - iPad (iPadOS 15+)
  - Android 8+ (Chrome, Firefox)

Webcam:
  - USB webcam (recommended 1080p+)
  - Built-in webcam (2MP+)
  - Mobile front-facing camera
```

### Browser Requirements
```
Minimum Requirements:
  - HTML5 Canvas support
  - Fetch API
  - LocalStorage
  - WebGL (optional)

Feature Detection:
  - Webcam access (MediaDevices)
  - Blob API
  - File API
  - Promise/async support
```

---

## 📈 Performance Targets

### Load Times
```
Metric                    Target      Browser
First Contentful Paint    < 1.5s      75th percentile
Largest Contentful Paint  < 2.5s      75th percentile
Cumulative Layout Shift   < 0.1       N/A
Time to Interactive       < 3.0s      75th percentile
```

### Bundle Size
```
Initial JS:   < 150KB (gzipped)
Initial CSS:  < 30KB (gzipped)
Total Assets: < 500KB (excluding images)
Images:       Optimized, lazy-loaded
```

### Network
```
Image Upload:   < 30s per 5MB
Room Access:    < 1.5s (no images)
Photo Booth:    < 2s startup time
Canvas Export:  < 5s per strip
```

---

## 🚀 Deployment Specifications

### Hosting
```
Platform: Firebase Hosting
Region: Global CDN
Protocol: HTTPS only
Uptime SLA: 99.9%
```

### Build Output
```
Framework: Vite
Output Directory: dist/
Optimization: Minified, tree-shaken
Source Maps: Enabled (dev), disabled (prod)
```

### CI/CD Pipeline
```
Trigger: Push to main branch
Build: npm run build
Test: (optional)
Deploy: firebase deploy
Time: < 5 minutes
```

---

## 📊 Metrics & Monitoring

### Key Metrics
```
User Engagement:
  - Active Users
  - Room Creation Rate
  - Photo Booth Usage
  - Download Rate

Performance:
  - Page Load Time
  - Error Rate
  - API Latency
  - Storage Used

Business:
  - Conversion Rate
  - User Retention
  - Feature Adoption
```

### Logging
```
Level: Info, Warn, Error
Destination: Firebase Console
Retention: 30 days
Sample Rate: 100% errors, 10% info
```

---

## 🧪 Testing Specifications

### Unit Tests (Future)
```
Coverage Target: 80%+
Framework: Jest
Files to Test:
  - Context/hooks
  - Utility functions
  - Component logic
```

### Integration Tests (Future)
```
Framework: Testing Library
Scenarios:
  - Auth flow
  - Room creation
  - Image upload
  - Room access
```

### E2E Tests (Future)
```
Framework: Cypress/Playwright
Paths:
  - Complete signup → room creation → share
  - Room access → view → photobooth → download
  - Error scenarios
```

### Manual Testing
```
Browsers: Chrome, Firefox, Safari, Edge
Devices: Desktop, tablet, mobile
Scenarios: See TESTING_CHECKLIST
```

---

## 📋 Compliance & Standards

### Web Standards
```
HTML5: W3C compliant
CSS3: Modern standards
JavaScript: ES2020+
Accessibility: WCAG 2.1 Level AA (target)
```

### Privacy & GDPR (Future)
```
Data Collection: Minimal
Tracking: Optional (analytics)
GDPR Rights: Access, delete, export
Terms: To be created
Privacy Policy: To be created
```

### Security Standards
```
HTTPS: Required
CORS: Configured
CSP: Strong policy
XSS: Input sanitization
CSRF: SameSite cookies
```

---

## 🔄 Versioning & Release

### Version Format
```
MAJOR.MINOR.PATCH
1.0.0 = First release
```

### Release Schedule
```
Initial: 1.0.0 (MVP)
Phase 2: 1.1.0 (Enhanced features)
Phase 3: 1.2.0 (Premium features)
```

### Deprecation Policy
```
Features: 2 releases notice
APIs: 1 release notice
SDKs: 6 month support
```

---

## 📚 Documentation Standards

### Code Documentation
```
Languages: JSDoc comments
Format: Markdown
Coverage: Public APIs only
Examples: Included
```

### User Documentation
```
Formats: Markdown, HTML
Languages: English (initial)
Audience: Non-technical users
Support: FAQ, guides
```

---

**Document Version:** 1.0  
**Status:** Complete ✅  
**Last Updated:** 2026-02-01  
**Approved:** Ready for Production 🚀
