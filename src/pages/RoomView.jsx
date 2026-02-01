import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { PhotoBooth } from '../components/PhotoBooth';
import { MemoriesGallery } from '../components/MemoriesGallery';
import { RsvpButtons } from '../components/RsvpButtons';

export const RoomView = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('letter');
  const [memories, setMemories] = useState([]);
  const [boyfriendEmail, setBoyfriendEmail] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        console.log('Fetching room with ID:', roomId);
        const docRef = doc(db, 'rooms', roomId);
        const docSnap = await getDoc(docRef);

        console.log('Room snapshot exists:', docSnap.exists());
        console.log('Room data:', docSnap.data());

        if (docSnap.exists()) {
          const roomData = docSnap.data();
          setRoom({ id: roomId, ...roomData });

          // Fetch boyfriend's email from users collection
          if (roomData.ownerUid) {
            const userRef = doc(db, 'users', roomData.ownerUid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setBoyfriendEmail(userSnap.data().email);
            }
          }
          
          // Fetch memories for this room
          const q = query(collection(db, 'memories'), where('roomId', '==', roomId));
          const querySnapshot = await getDocs(q);
          const memoriesData = querySnapshot.docs.map(doc => doc.data());
          setMemories(memoriesData);
        } else {
          console.log('Room document does not exist');
          setRoom(null);
        }
      } catch (err) {
        console.error('Error fetching room:', err);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
        <div className="text-2xl font-bold text-pink-600">Loading your special room... 💕</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
        <div className="text-2xl font-bold text-red-600">Room not found 💔</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Bouquet */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">💐</div>
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            {room.boyfriendName}'s Valentine Room 💕
          </h1>
          <p className="text-gray-600">Room Code: {room.roomCode}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'letter'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-pink-600 border-2 border-pink-600'
            }`}
          >
            💌 Letter
          </button>
          <button
            onClick={() => setActiveTab('photobooth')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'photobooth'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-pink-600 border-2 border-pink-600'
            }`}
          >
            📷 Photo Booth
          </button>
          {memories.length > 0 && (
            <button
              onClick={() => setActiveTab('memories')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'memories'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-pink-600 border-2 border-pink-600'
              }`}
            >
              🖼️ Memories ({memories.length})
            </button>
          )}
        </div>

        {/* Letter Tab */}
        {activeTab === 'letter' && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">💌 A Letter From {room.boyfriendName}</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
              {room.letterContent}
            </p>

            {/* Yes/No Buttons for RSVP */}
            {room.rsvp !== 'yes' && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold text-pink-600 mb-6 text-center">Will you be my Valentine on the 14th? 💕</h3>
                <RsvpButtons
                  roomId={room.id}
                  girlfriendName={room.girlfriendName}
                  boyfriendEmail={boyfriendEmail}
                  onYesClick={() => {
                    setRoom(prev => ({ ...prev, rsvp: 'yes' }));
                  }}
                />
              </div>
            )}

            {/* RSVP Confirmation */}
            {room.rsvp === 'yes' && (
              <div className="mt-8 pt-8 border-t-2 border-pink-300 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-pink-600 mb-2">✨ You Said YES! ✨</h3>
                <p className="text-lg text-gray-700">It's a date on the 14th! 💕</p>
              </div>
            )}
          </div>
        )}

        {/* Photo Booth Tab */}
        {activeTab === 'photobooth' && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">📷 Create a Photo Memory</h2>
            <p className="text-gray-600 mb-6">Take 4 individual photos and download your custom photo strip!</p>
            <PhotoBooth />
          </div>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">🖼️ Our Memories Gallery</h2>
            <MemoriesGallery memories={memories} />
          </div>
        )}
      </div>
    </div>
  );
};
