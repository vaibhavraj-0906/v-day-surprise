import React, { useState, useEffect } from 'react';

export const MemoriesGallery = ({ memories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isFullscreen) return;
      
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + memories.length) % memories.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % memories.length);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen, memories.length]);

  if (!memories || memories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No memories yet 💔</p>
        <p className="text-gray-400 mt-2">Create some special moments together!</p>
      </div>
    );
  }

  const currentMemory = memories[currentIndex];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-50"
        >
          ✕
        </button>

        {/* Main image */}
        <div className="w-full h-full max-h-[90vh] flex items-center justify-center mb-4">
          <img
            src={currentMemory.imageUrl}
            alt="Memory"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Note */}
        {currentMemory.note && (
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full mb-4">
            <p className="text-gray-800">{currentMemory.note}</p>
            <p className="text-gray-500 text-sm mt-2">{currentMemory.date}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 items-center text-white">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + memories.length) % memories.length)}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-lg transition"
          >
            ← Previous
          </button>
          <span className="text-lg font-semibold">
            {currentIndex + 1} / {memories.length}
          </span>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % memories.length)}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-lg transition"
          >
            Next →
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-4">Use arrow keys or buttons to navigate • Press ESC to close</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map((memory, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsFullscreen(true);
            }}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="aspect-square overflow-hidden bg-gray-200">
              <img
                src={memory.imageUrl}
                alt={`Memory ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-700 line-clamp-2">{memory.note}</p>
              <p className="text-gray-400 text-sm mt-2">{memory.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick view banner */}
      <div className="bg-pink-100 rounded-lg p-4 text-center">
        <p className="text-pink-700 font-semibold">💡 Click any memory to view in fullscreen with navigation!</p>
      </div>
    </div>
  );
};
