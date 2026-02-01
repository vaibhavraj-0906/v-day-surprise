import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const RsvpButtons = ({ roomId, girlfriendName, boyfriendEmail, onYesClick }) => {
  const [noPosition, setNoPosition] = useState({ x: 'auto', y: 'auto' });
  const containerRef = useRef(null);

  const handleNoMove = (e) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Button size
    const buttonWidth = 110;
    const buttonHeight = 50;

    // Always generate random position on the right side (avoid center area)
    const randomX = 140 + Math.random() * (containerWidth - 140 - buttonWidth - 20);
    const randomY = Math.random() * (containerHeight - buttonHeight - 20);

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = async () => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        rsvp: 'yes',
        rsvpDate: new Date(),
        girlfriendName,
      });

      const emailSubject = `Congratulations! You have a date on the 14th with ${girlfriendName}!`;
      const emailBody = `Hello!\n\nCongratulations! ${girlfriendName} said YES!\n\nYou have a date on the 14th! 💕\n\nBest wishes,\nValentine's Forever Room`;

      const mailtoLink = `mailto:${boyfriendEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        alert(`💕 Yes! A date on the 14th with ${girlfriendName}! 💕\n\nAn email confirmation has been sent!`);
      }, 500);

      if (onYesClick) {
        onYesClick();
      }
    } catch (err) {
      alert('Error confirming RSVP: ' + err.message);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-40 border-2 border-gray-300 rounded-lg flex items-center justify-start overflow-visible bg-gradient-to-r from-pink-50 to-white"
    >
      {/* YES Button - Left of Center */}
      <button
        onClick={handleYesClick}
        className="absolute left-1/2 top-1/2 -translate-y-1/2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg cursor-pointer z-20 hover:scale-110 whitespace-nowrap"
        style={{ transform: 'translate(-130px, -50%)' }}
      >
        💚 YES
      </button>

      {/* NO Button - Right of Center Initially, Then Moves Away */}
      <button
        onMouseMove={handleNoMove}
        onMouseEnter={handleNoMove}
        onTouchMove={handleNoMove}
        onTouchStart={handleNoMove}
        style={{
          position: 'absolute',
          left: noPosition.x === 'auto' ? '50%' : `${noPosition.x}px`,
          top: noPosition.y === 'auto' ? '50%' : `${noPosition.y}px`,
          transform: noPosition.x === 'auto' ? 'translate(20px, -50%)' : 'translate(0, 0)',
          transition: 'all 0.08s ease-out',
          zIndex: 30,
        }}
        className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold text-lg cursor-pointer hover:bg-red-600 whitespace-nowrap"
      >
        ❌ NO
      </button>

      {/* Hint Text */}
      <div className="absolute bottom-2 right-4 text-xs text-gray-600">
        <p>The NO keeps running! 😄</p>
      </div>
    </div>
  );
};
