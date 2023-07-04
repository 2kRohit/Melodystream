import React from 'react';
import video from './video.mp4';

const BackgroundVideo = () => {
  return (
    <div className="relative">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop>
        <source src={video} type="video/mp4" />
       
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
