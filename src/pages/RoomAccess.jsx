import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const RoomAccess = () => {
  const [roomCode, setRoomCode] = useState('');
  const [girlfriendName, setGirlfriendName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!girlfriendName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, 'rooms'), where('roomCode', '==', roomCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Room not found. Please check the code.');
        setLoading(false);
        return;
      }

      const roomId = querySnapshot.docs[0].id;
      const roomRef = doc(db, 'rooms', roomId);
      
      // Store girlfriend's name in the room
      await updateDoc(roomRef, {
        girlfriendName: girlfriendName.trim(),
      });

      navigate(`/room/${roomId}`);
    } catch (err) {
      setError('Error accessing room: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        {/* Animated Bouquet */}
        <div className="text-center mb-8">
          <div className="text-8xl animate-float">💐</div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">
            💕 Valentine's Room
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter the room code to see your special memories ❤️
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Name 💖</label>
              <input
                type="text"
                value={girlfriendName}
                onChange={(e) => setGirlfriendName(e.target.value)}
                placeholder="Tell us your beautiful name..."
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                maxLength="6"
                className="w-full px-4 py-3 text-center text-2xl font-bold border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={loading || roomCode.length !== 6 || !girlfriendName.trim()}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 font-semibold text-lg"
            >
              {loading ? 'Opening Room...' : '🔑 Enter Room'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Boyfriend? Create your room instead:</p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/signup')}
                className="flex-1 border-2 border-pink-600 text-pink-600 py-2 rounded-lg hover:bg-pink-50 transition font-semibold"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex-1 border-2 border-pink-600 text-pink-600 py-2 rounded-lg hover:bg-pink-50 transition font-semibold"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
