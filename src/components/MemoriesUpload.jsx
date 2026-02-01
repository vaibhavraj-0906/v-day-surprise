import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export const MemoriesUpload = ({ roomId, onMemoryAdded }) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadToFirestore = async () => {
    if (!selectedImage || !note) {
      alert('Please select an image and write a note');
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64 for storage in Firestore
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;

        // Create memory object
        const memory = {
          imageUrl: base64Image,
          note,
          date: new Date().toLocaleDateString(),
          createdAt: new Date(),
        };

        // Get the room document
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomData = roomSnap.data();
          const existingMemories = roomData.memories || [];
          
          // Update room with new memory
          await addDoc(collection(db, 'memories'), {
            roomId,
            ownerUid: currentUser.uid,
            ...memory,
          });

          // Reset form
          setSelectedImage(null);
          setPreviewUrl(null);
          setNote('');
          fileInputRef.current.value = '';

          alert('Memory added successfully! 💕');
          
          if (onMemoryAdded) {
            onMemoryAdded();
          }
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      alert('Error uploading memory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoStripSave = (stripBlob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
      setSelectedImage({ isStrip: true, data: event.target.result });
      setNote('Our photo strip from ' + new Date().toLocaleDateString());
    };
    reader.readAsDataURL(stripBlob);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-pink-600 mb-6">📸 Add to Memories</h3>

      <div className="space-y-4">
        {/* Image Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Select Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-pink-500"
          />
          <p className="text-gray-500 text-sm mt-1">Max 5MB • JPG, PNG, GIF</p>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-gray-700 font-semibold mb-2">Preview</p>
            <div className="bg-gray-100 rounded-lg overflow-hidden max-h-64">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Note */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Add a Cute Note 💌</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write something special about this memory..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadToFirestore}
          disabled={loading || !selectedImage || !note}
          className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Adding to Memories...' : '✨ Add to Memories'}
        </button>
      </div>
    </div>
  );
};
