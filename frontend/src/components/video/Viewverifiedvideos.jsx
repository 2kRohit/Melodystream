import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarForm from './SidebarForm';

const ViewverifiedVideos = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get('videoId');
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/viewvideo/${videoId}`);
      console.log('Response:', response.data);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideo((prevVideo) => ({ ...prevVideo, duration }));
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDuration = (duration) => {
    if (duration >= 3600) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours} hr ${minutes} min`;
    } else if (duration >= 60) {
      const minutes = Math.floor(duration / 60);
      return `${minutes} min`;
    } else {
      return `${duration} sec`;
    }
  };

  const handleVisibilityChange = async () => {
    // Implement logic to change the visibility of the video (public or private)
    try {
      const newVisibility = video.visibility === 'public' ? 'private' : 'public';
      const confirmed = window.confirm(
        `Are you sure you want to ${newVisibility === 'public' ? 'make the video public?' : 'make the video private?'}`
      );
      if (!confirmed) {
        return;
      }
      
      const response = await axios.patch(`http://localhost:8000/api/video/changevisibility/${videoId}`, {
        visibility: newVisibility,
      });
      setVideo((prevVideo) => ({ ...prevVideo, visibility: newVisibility }));
      console.log('Visibility changed successfully:', response.data);
    } catch (error) {
      console.error('Error changing visibility:', error);
    }
  };

  if (!video) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-xl">Loading...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <SidebarForm>
      <div className="flex justify-center items-center h-full">
        <div className="max-w-5xl w-full bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex">
            <div className="w-2/3">
              <div className="relative" style={{ maxWidth: '100%', height: '0', paddingBottom: '70%' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  muted
                  onLoadedMetadata={handleVideoLoaded}
                  ref={videoRef}
                >
                  <source src={`http://localhost:8000/${video.videoPath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className="w-1/3 bg-gray-900 px-6 py-4">
              {video.thumbnailPath && (
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={`http://localhost:8000/${video.thumbnailPath}`}
                    alt="Thumbnail"
                    className="h-32 w-32 rounded-md shadow-lg"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
              <p className="text-gray-300 text-lg">{video.description}</p>
              <div className="flex items-center mt-4">
                <span className="text-gray-500 text-sm">Category:</span>
                <span className="text-gray-300 text-sm ml-2">{video.category}</span>
              </div>
              {video.duration && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-500 text-sm">Duration:</span>
                  <span className="text-gray-300 text-sm ml-2">{formatDuration(video.duration)}</span>
                </div>
              )}
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Upload Date:</span>
                <span className="text-gray-300 text-sm ml-2">{formatDateTime(video.timestamp)}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Tags:</span>
                <div className="flex flex-wrap ml-2">
                {video.tags && video.tags.split(',').map((tag, index) => (
                    <Link
                      key={index}
                      to={`/tag?q=${tag.trim()}`}
                      className="text-blue-600 text-lg bg-transparent px-0 py-1 rounded-md mr-1 mb-1"
                    >
                      #{tag.trim()}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Views:</span>
                <span className="text-gray-300 text-sm ml-2">{video.views}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Comments:</span>
                <span className="text-gray-300 text-sm ml-2">{video.comments.length}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Likes:</span>
                <span className="text-gray-300 text-sm ml-2">{video.likes}</span>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleVisibilityChange}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  {video.visibility === 'public' ? 'Make Private' : 'Make Public'}
                </button>
              </div>
            </div>
          </div>
          {/* Add necessary components based on your logic */}
        </div>
      </div>
    </SidebarForm>
  );
};

export default ViewverifiedVideos;
