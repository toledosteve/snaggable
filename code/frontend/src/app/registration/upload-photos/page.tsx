import React from 'react';
import { Progress } from '@/components/ui';
import PhotoUploadClient from './photo-upload';

const UploadPhotosPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        {/* Progress Bar */}
        <Progress value={77} className="mb-6" />

        {/* Photo Upload Form */}
        <h1 className="text-2xl font-bold mb-4">Now it’s time to upload some photos</h1>
        <p className="text-gray-500 mb-4">
          Adding photos is a great way to show off more about yourself! You can drag your photos right from your desktop.
        </p>

        {/* Client Component */}
        <PhotoUploadClient />
      </div>
    </div>
  );
};

export default UploadPhotosPage;
