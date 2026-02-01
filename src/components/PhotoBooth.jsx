import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { CanvasStitcher } from './CanvasStitcher';

export const PhotoBooth = ({ onStripCreated = null }) => {
  const webcamRef = useRef();
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [showStrip, setShowStrip] = useState(false);
  const [currentPhotoNumber, setCurrentPhotoNumber] = useState(1);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          setPhotos(prev => [...prev, blob]);
          setCurrentPhotoNumber(prev => prev + 1);
        });
    }
  }, [webcamRef]);

  const startCountdown = () => {
    setCountdown(3);
    
    // Countdown: 3 -> 2
    setTimeout(() => setCountdown(2), 1000);
    
    // Countdown: 2 -> 1
    setTimeout(() => setCountdown(1), 2000);
    
    // Countdown: 1 -> CAPTURE -> null (at 3000ms)
    setTimeout(() => {
      capturePhoto();
      setCountdown(null);
    }, 3000);
  };

  const resetPhotos = () => {
    setPhotos([]);
    setShowStrip(false);
    setCurrentPhotoNumber(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!showStrip ? (
        <>
          <div className="bg-black rounded-lg overflow-hidden mb-6 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ aspectRatio: 1 / 1 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition ${
                    photos.length >= num
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            {countdown !== null && (
              <div className="text-center text-6xl font-bold text-pink-600 animate-bounce">
                {countdown}
              </div>
            )}

            {photos.length < 4 ? (
              <button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="w-full bg-pink-600 text-white py-4 rounded-lg hover:bg-pink-700 transition font-semibold text-xl disabled:opacity-50"
              >
                📸 Take Photo {photos.length + 1}/4
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setShowStrip(true)}
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold text-xl"
                >
                  ✨ Create My Strip
                </button>
                <button
                  onClick={resetPhotos}
                  className="w-full bg-gray-500 text-white py-4 rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  🔄 Retake Photos
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <CanvasStitcher photos={photos} onDownload={onStripCreated} />
          <button
            onClick={resetPhotos}
            className="w-full mt-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            🔄 Take More Photos
          </button>
        </>
      )}
    </div>
  );
};
