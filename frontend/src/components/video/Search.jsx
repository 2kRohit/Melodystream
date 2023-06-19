import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { GoMute, GoUnmute } from 'react-icons/go';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks';

const HomePage = () => {
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef({});

  
  

  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/search/${q}`);
      // Access the 'data' property of the response object
  
      const responseData = response.data.videos;
      // Set a default value for the 'muted' property if not provided in the response
      const videosWithDefaults = responseData.map(async (video) => {
        const userResponse = await axios.get(`http://localhost:8000/api/user/${video.userId}`);
        const user = userResponse.data;
        return {
          ...video,
          muted: video.muted || true,
          user: user,
        };
      });
      const videosWithUserDetails = await Promise.all(videosWithDefaults);
      setVideos(videosWithUserDetails);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleVideoClick = async (videoId) => {
    try {
      await axios.put(`http://localhost:8000/api/video/incrementviews/${videoId}/${userId}`);
      navigate(`/viewvideo?videoId=${videoId}`);
    } catch (error) {
      console.error(error);
    }
  };
  //category click
  

  const handleVideoMouseEnter = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video && video.readyState >= 3) {
      video.play().catch((error) => console.error(error));
    }
  };

  const handleVideoMouseLeave = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleToggleMute = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.muted = !video.muted;
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, muted: !video.muted } : video
        )
      );
    }
  };
 useEffect(()=>{
    fetchVideos()
 },[q])

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();

    // Convert the time difference to seconds
    const seconds = Math.floor(timeDifference / 1000);

    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    // Calculate the relative time based on the time difference
    if (seconds < minute) {
      return `${seconds} sec ago`;
    } else if (seconds < hour) {
      const minutes = Math.floor(seconds / minute);
      return `${minutes} min ago`;
    } else if (seconds < day) {
      const hours = Math.floor(seconds / hour);
      return `${hours} hr ago`;
    } else if (seconds < month) {
      const days = Math.floor(seconds / day);
      return `${days} day ago`;
    } else if (seconds < year) {
      const months = Math.floor(seconds / month);
      return `${months} month ago`;
    } else {
      const years = Math.floor(seconds / year);
      return `${years} year ago`;
    }
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

  return (
    <Sidebar>
      <div className="container mx-auto bg-gray-900 text-white">
        {/* Categories */}
        <h1 className='text-center text-3xl text-blue-500 italic p-0 mb-2 mt-0 font-semibold'>Search Results</h1>
        {/* Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-0">
        {videos.length === 0 ? (
    <div className="text-center text-gray-500">
      No videos found.
    </div>
  ) : ( videos.map((video) => (
            <div
              key={video._id}
              className="bg-transparent rounded-lg cursor-pointer hover:bg-gray-700 transition duration-200 shadow-lg"
              onClick={() => handleVideoClick(video._id)}
              onMouseEnter={() => handleVideoMouseEnter(video._id)}
              onMouseLeave={() => handleVideoMouseLeave(video._id)}
            >
              {video.thumbnailPath ? (
                <div className="relative">
                  <video
                    ref={(ref) => (videoRefs.current[video._id] = ref)}
                    id={`video-${video._id}`}
                    src={`http://localhost:8000/${video.videoPath}`}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                    poster={`http://localhost:8000/${video.thumbnailPath}`}
                    muted={video.muted}
                  />
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={(ref) => (videoRefs.current[video._id] = ref)}
                    id={`video-${video._id}`}
                    src={`http://localhost:8000/${video.videoPath}`}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                    muted={video.muted}
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center mb-2">
                  {video.user && video.user.profilePicture ? (
                    <img
                      className="w-8 h-8 rounded-full mr-2"
                      src={`http://localhost:8000/uploads/profile/${video.user.profilePicture}`}
                      alt="Profile"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
                  )}
                  <h3 className="text-lg font-bold ml-2">{video.title}</h3>
                </div>
                <p className="text-gray-500 ml-12">{video.user.name}</p>
                <p className="text-gray-500 ml-12">{video.views} views  &bull; <span className="text-gray-500">{formatDateTime(video.timestamp)}</span></p>
               
              </div>
            </div>
          )))}
        </div>
      </div>
    </Sidebar>
  );
};

export default HomePage;
