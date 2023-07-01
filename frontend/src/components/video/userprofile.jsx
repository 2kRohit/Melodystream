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
  const uid = searchParams.get('uId');

  const [videos, setVideos] = useState([]);
  const [user,setuser]=useState([])
  const videoRefs = useRef({});
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
 
  
 

  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/verifier/userprofilevideo/${uid}`);
      // Access the 'data' property of the response object
  const user=await axios.get(`http://localhost:8000/api/verifier/userprofile/${uid}`);
      const responseData = response.data;
     setuser(user.data)
      setVideos(responseData);
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

  
  useEffect(() => {
   
    fetchVideos();
  }, []);
  const totalLikes = videos.reduce((accumulator, video) => accumulator + video.likes.length, 0)
  const totaldislikes = videos.reduce((accumulator, video) => accumulator + video.dislikes.length, 0)
  const views= videos.reduce((accumulator, video) => accumulator + video.views, 0)
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
        {/* user */}
<div className='mx-auto'>
        {user && user.profilePicture ? (
                    <img
                      className="w-32 h-32 rounded-full mx-auto"
                      src={`http://localhost:8000/uploads/profile/${user.profilePicture}`}
                      alt="Profile"
                    />
                  ) : (
                    <FaUserCircle className="w-32 h-32 text-gray-500 mr-2" />
                  )}
                  <p className='text-2xl mx-auto text-center italic'>{user.name}</p>
                  <p className='text-xl mx-auto text-center text-gray-400 italic'>{user.bio}</p>
                  <p className=' mx-auto text-center text-gray-400  '>{videos.length} videos</p>
                  <p className=' mx-auto text-center text-gray-400  '>{totalLikes} Likes &bull; {totaldislikes} Dislikes</p>
                  <p className=' mx-auto text-center text-gray-400 '>{views} Views</p>
                  <div className='border-b border-0 border-gray-800 mt-4'></div>
                  </div>
        {/* Videos */}
        <h1 className='text-blue-500 text-2xl italic text-center mt-2 mb-4'>Uploaded Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
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
                    muted={true}
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
                    muted={true}
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center mb-2">
                  
                  <h3 className="text-lg font-bold ml-12">{video.title}</h3>
                </div>
               
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
