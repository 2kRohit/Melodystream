import React from 'react';
import Navbar from './user/Navbar';

const AboutUsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="container w-5/6 bg-gray-800 border-4 border-gray-600 mx-auto p-8 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-100">About Us</h1>
          <p className="text-lg leading-relaxed text-gray-300">
            MelodyStream is a premier web application that provides an exceptional platform for audio and video streaming and content uploading. Our mission is to offer a reliable and enjoyable streaming experience to all our users. We have curated a vast collection of high-quality audio and video content, making it effortless for you to discover and enjoy your favorite media. Additionally, MelodyStream serves as a platform for content creators to share their work, providing a diverse range of entertainment options to our community.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mt-6">
            At MelodyStream, we prioritize user satisfaction and security. Our user-friendly interface, backed by robust security measures, ensures a safe environment for content streaming and uploading. Our dedicated team of content verifiers ensures that every piece of content meets our quality standards, allowing you to trust the authenticity and reliability of the media you consume.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mt-6">
            With our platform, you can customize your streaming experience and create personalized playlists to suit your preferences. Whether you are an artist, music enthusiast, or simply someone looking for high-quality entertainment, MelodyStream caters to your needs. Join our thriving community today and be a part of the future of audio and video streaming.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
