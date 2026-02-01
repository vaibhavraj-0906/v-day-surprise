import React, { useRef, useEffect } from 'react';

export const CanvasStitcher = ({ photos, onDownload }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (photos.length < 4) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Load all images
    const images = [];
    let loadedCount = 0;

    photos.slice(0, 4).forEach((photoBlob, idx) => {
      const img = new Image();
      img.onload = () => {
        images[idx] = img;
        loadedCount++;

        // Once all images are loaded, draw the strip
        if (loadedCount === 4) {
          drawStrip(canvas, ctx, images);
        }
      };
      img.src = URL.createObjectURL(photoBlob);
    });
  }, [photos]);

  const drawStrip = (canvas, ctx, images) => {
    const photoSize = 300; // 1:1 ratio
    const gap = 10;
    const padding = 20;

    // Canvas dimensions (vertical strip with 1:1 photos)
    canvas.width = photoSize + padding * 2;
    canvas.height = photoSize * 4 + gap * 3 + padding * 2;

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💕 Valentine Cam 💕', canvas.width / 2, 25);

    // Draw photos vertically (1:1 aspect ratio)
    images.forEach((img, idx) => {
      const y = padding + 40 + (idx * (photoSize + gap));
      const scale = photoSize / Math.max(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (photoSize - scaledWidth) / 2;
      const offsetY = (photoSize - scaledHeight) / 2;

      ctx.drawImage(img, padding + offsetX, y + offsetY, scaledWidth, scaledHeight);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, y, photoSize, photoSize);
    });

    // Draw date at bottom
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${new Date().toLocaleDateString()}`, canvas.width / 2, canvas.height - 10);
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `valentines-strip-${Date.now()}.png`;
    link.click();
    
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-pink-300 rounded-lg shadow-lg"
      />
      {photos.length >= 4 && (
        <button
          onClick={handleDownload}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition font-semibold text-lg"
        >
          ⬇️ Download My Strip
        </button>
      )}
    </div>
  );
};
