'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, IconButton } from '@/components/ui';
import { Upload, Facebook, Instagram, Folder } from 'lucide-react';

const PhotoUploadClient = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const router = useRouter(); // Initialize the router for navigation

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setPhotos([...photos, ...Array.from(files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      alert('Please upload at least one photo to continue.');
      return;
    }

    console.log('Uploaded Photos:', photos);
    // Navigate to the location page
    router.push('/registration/location');
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <label
        htmlFor="photo-upload"
        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-6 h-6 text-gray-500" />
          <p className="text-gray-500">Drag and drop photos here</p>
        </div>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </label>

      {/* Preview Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => handleRemovePhoto(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Social Media Buttons */}
      <div className="flex justify-around mt-4">
        <IconButton
          icon={<Facebook className="w-5 h-5" />}
          label="Facebook"
          onClick={() => alert('Connect to Facebook (stub)')}
        />
        <IconButton
          icon={<Instagram className="w-5 h-5" />}
          label="Instagram"
          onClick={() => alert('Connect to Instagram (stub)')}
        />
        <IconButton
          icon={<Folder className="w-5 h-5" />}
          label="Browse"
          onClick={() => document.getElementById('photo-upload')?.click()}
        />
      </div>

      {/* Continue Button */}
      <Button variant="default" className="w-full" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
};

export default PhotoUploadClient;
