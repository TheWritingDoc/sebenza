import React, { useState, useCallback, useEffect } from 'react';
import CameraCapture from './CameraCapture';

function PhotoUploadFlow({ maxPhotos = 5, label = 'Take Photos', disabled = false, onChange }) {
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    // Create previews for File objects
    const newPreviews = photos.map(file =>
      typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    setPreviews(newPreviews);
    return () => {
      newPreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [photos]);

  const handleCapture = useCallback((files) => {
    if (files.length + photos.length > maxPhotos) return;
    const newPhotos = [...photos, ...files].slice(0, maxPhotos);
    setPhotos(newPhotos);
    if (onChange) onChange(newPhotos);
  }, [photos, maxPhotos, onChange]);

  const removePhoto = useCallback((idx) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    if (previews[idx]?.startsWith('blob:')) {
      URL.revokeObjectURL(previews[idx]);
    }
    setPhotos(newPhotos);
    setPreviews(prev => prev.filter((_, i) => i !== idx));
    if (onChange) onChange(newPhotos);
  }, [photos, previews, onChange]);

  return (
    <div>
      <CameraCapture
        onCapture={handleCapture}
        maxPhotos={maxPhotos}
        label={`${label} (${photos.length}/${maxPhotos})`}
        disabled={disabled || photos.length >= maxPhotos}
      />
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {previews.map((preview, idx) => (
            <div key={idx} style={{ position: 'relative', width: 72, height: 72, borderRadius: 14, overflow: 'hidden' }}>
              <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                style={{
                  position: 'absolute', top: -2, right: -2, width: 22, height: 22,
                  background: '#ef4444', color: 'white', border: '2px solid white',
                  borderRadius: '50%', fontSize: 10, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: 0
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoUploadFlow;
