'use client';

import { useState } from 'react';

export default function HomePage() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const capturePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file); // Store the actual file object
      setPhotoPreview(URL.createObjectURL(file)); // Create a preview URL for display
    }
  };

  const fetchDescription = async () => {
    if (!photo) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', photo); // Append the actual file to the form data

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Error fetching description:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex-light"></div>
      <h1>Pokédex Photo Describer</h1>
      <div className="pokedex-speaker"></div>
      <div className="camera-box">
        <input type="file" accept="image/*" capture="environment" onChange={capturePhoto} />
        {photoPreview && <img src={photoPreview} alt="Captured" className="photo-preview" />}
      </div>
      <button onClick={fetchDescription} disabled={!photo || loading}>
        {loading ? 'Processing...' : 'Describe as Pokédex'}
      </button>
      {description && (
        <div className="description-box">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
