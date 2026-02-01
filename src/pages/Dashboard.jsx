import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MemoriesGallery } from '../components/MemoriesGallery';
import { MemoriesUpload } from '../components/MemoriesUpload';

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMemories, setRoomMemories] = useState([]);
  const fileInputRef = useRef(null);
  
  // Form data
  const [boyfriendName, setBoyfriendName] = useState('');
  const [roomCode, setRoomCode] = useState(generateRoomCode());
  const [letterContent, setLetterContent] = useState('');
  
  // Memory upload data
  const [memories, setMemories] = useState([]);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [tempPhotoComment, setTempPhotoComment] = useState('');

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const regenerateCode = () => {
    setRoomCode(generateRoomCode());
  };

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setTempPhoto({
          file,
          preview: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoToMemories = async () => {
    if (!tempPhoto || !tempPhotoComment.trim()) {
      alert('Please add a comment for the photo');
      return;
    }

    setMemories(prev => [...prev, {
      file: tempPhoto.file,
      preview: tempPhoto.preview,
      comment: tempPhotoComment.trim(),
    }]);

    setTempPhoto(null);
    setTempPhotoComment('');
    fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (idx) => {
    setMemories(prev => prev.filter((_, i) => i !== idx));
  };

  const fetchRoomMemories = async (roomId) => {
    try {
      const q = query(collection(db, 'memories'), where('roomId', '==', roomId));
      const querySnapshot = await getDocs(q);
      const memories = querySnapshot.docs.map(doc => doc.data());
      setRoomMemories(memories);
    } catch (err) {
      console.error('Error fetching memories:', err);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if room code already exists
      const q = query(collection(db, 'rooms'), where('roomCode', '==', roomCode));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        alert('Room code already exists. Please choose another.');
        setLoading(false);
        return;
      }

      // Create room document
      const roomRef = await addDoc(collection(db, 'rooms'), {
        roomCode,
        ownerUid: currentUser.uid,
        boyfriendName,
        letterContent,
        memories: [], // Empty - can be added in future
        createdAt: new Date(),
        rsvp: 'none'
      });

      // Save all photos with comments to memories collection
      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onload = async (event) => {
            const base64Image = event.target.result;
            
            await addDoc(collection(db, 'memories'), {
              roomId: roomRef.id,
              ownerUid: currentUser.uid,
              imageUrl: base64Image,
              note: memory.comment,
              date: new Date().toLocaleDateString(),
              createdAt: new Date(),
            });
            
            resolve();
          };
          reader.readAsDataURL(memory.file);
        });
      }

      alert('Room created successfully! Share this code: ' + roomCode);
      setStep(1);
      setBoyfriendName('');
      setLetterContent('');
      setMemories([]);
      setRoomCode(generateRoomCode());
    } catch (err) {
      alert('Error creating room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      alert('Error logging out: ' + err.message);
    }
  };

  const handleSelectRoomForMemories = async (room) => {
    setSelectedRoom(room);
    setActiveTab('memories');
    await fetchRoomMemories(room.id);
  };

  const handleMemoryAdded = async () => {
    if (selectedRoom) {
      await fetchRoomMemories(selectedRoom.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600">💕 My Valentine Rooms</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 mb-8">Welcome, {currentUser?.email}</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('create');
              setSelectedRoom(null);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'create'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-pink-600 border-2 border-pink-600'
            }`}
          >
            ➕ Create Room
          </button>
          {selectedRoom && (
            <button
              onClick={() => setActiveTab('memories')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'memories'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-pink-600 border-2 border-pink-600'
              }`}
            >
              📸 Memories
            </button>
          )}
        </div>

        {/* Create Room Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">Create a New Room</h2>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    value={boyfriendName}
                    onChange={(e) => setBoyfriendName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Room Code (Share this!)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomCode}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={regenerateCode}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      🔄 Generate New
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
                >
                  Next: Write Letter
                </button>
              </div>
            )}

            {/* Step 2: Letter + Memories */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Love Letter 💌</label>
                  <textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    placeholder="Write your heartfelt message here..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">Share your feelings, memories, and love 💕</p>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-pink-600 mb-4">📸 Add Photos with Comments (Optional)</h3>
                  
                  {/* Photo upload input */}
                  <div className="mb-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAddPhoto}
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-500"
                    />
                    <p className="text-gray-500 text-sm mt-1">Max 5MB per photo</p>
                  </div>

                  {/* Add photo button when file selected */}
                  {tempPhoto && (
                    <div className="space-y-2 mb-4 p-4 bg-gray-100 rounded-lg">
                      <div className="aspect-square w-full bg-gray-200 rounded overflow-hidden">
                        <img src={tempPhoto.preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <textarea
                        value={tempPhotoComment}
                        onChange={(e) => setTempPhotoComment(e.target.value)}
                        placeholder="Add a cute comment for this photo..."
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddPhotoToMemories}
                          className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition font-semibold text-sm"
                        >
                          ✅ Add to Memories
                        </button>
                        <button
                          onClick={() => {
                            setTempPhoto(null);
                            setTempPhotoComment('');
                            fileInputRef.current.value = '';
                          }}
                          className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold text-sm"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display added photos */}
                  {memories.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-2">✨ Added Memories ({memories.length}):</p>
                      <div className="grid grid-cols-2 gap-3">
                        {memories.map((mem, idx) => (
                          <div key={idx} className="relative">
                            <img src={mem.preview} alt={`Memory ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border-2 border-pink-300" />
                            <button
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{mem.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setMemories([]);
                      setTempPhoto(null);
                    }}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateRoom}
                    disabled={loading || !boyfriendName || !letterContent}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Creating Room...' : '✨ Create My Room'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && selectedRoom && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-pink-600 mb-2">Our Memories 💕</h2>
              <p className="text-gray-600">Room Code: {selectedRoom.roomCode}</p>
            </div>

            {/* Upload Section */}
            <MemoriesUpload roomId={selectedRoom.id} onMemoryAdded={handleMemoryAdded} />

            {/* Gallery Section */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-pink-600 mb-6">Memory Gallery 🖼️</h3>
              <MemoriesGallery memories={roomMemories} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
