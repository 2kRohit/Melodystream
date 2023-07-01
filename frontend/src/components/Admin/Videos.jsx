import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEyeLine, RiSearchLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const navigate = useNavigate();

  const handleViewVideo = (videoId) => {
    navigate(`/admin/viewvideos?videoId=${videoId}`);
    // Handle logic for viewing the video
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };

  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())||
      video.user.name.toLowerCase().includes(searchQuery.toLowerCase())||
      video.visibility.toLowerCase().includes(searchQuery.toLowerCase())||
      video.status.toLowerCase().includes(searchQuery.toLowerCase())

  );

  return (
    <Sidebar>
      <div className="bg-gray-900  flex flex-col justify-start items-center py-0">
        
        <div className="overflow-x-auto border-4 border-gray-600 shadow-2xl">
        <h2 className="text-center text-2xl text-blue-500 italic p-1 mb-0 mt-2 font-semibold"> Video List</h2>
          <div className="flex items-center justify-between mb-0">
            <div className="relative flex items-center mt-0 ">
             
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
                className=" px-1 w-64 py-2 rounded-lg bg-gray-900  text-white focus:outline-none"
              />
            
            </div>
          </div>
          {filteredVideos.length === 0 ? (
            <p className="text-white text-center">No videos available!</p>
          ) : (
            <table className="w-full bg-gray-900 rounded-lg">
              <thead>
                <tr>
                <th className="p-2 text-white text-center">Profile</th>
                  <th className="p-2 text-white text-center">Name</th>
                  <th className="p-2 text-white text-center">Title</th>
                  <th className="p-2 text-white text-center">Category</th>
                  <th className="p-2 text-white text-center">Upload Date</th>
                  <th className="p-2 text-white text-center">Visibility</th>
                  <th className="p-2 text-white text-center">Status</th>
                  <th className="p-2 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr
                   
                  >
                     <td className="p-4 text-center">
                    {video.user?.profilePicture ? (
              <>
              <img
              onClick={()=>{navigate(`/admin/userprofile?uId=${video.user._id}`)}}
                src={`http://localhost:8000/uploads/profile/${video.user.profilePicture}`}
                alt="Profile"
                className="h-12 w-12 rounded-full mx-auto cursor-pointer"
                
              /></>
            
            ) : (<>
             <FaUserCircle
              onClick={()=>{navigate(`/admin/userprofile?uId=${video.user._id}`)}}
              className="w-12 h-12 text-gray-500 mx-auto cursor-pointer" />
            
              </>
            )}
                   </td>
                   <td className="p-4 text-center mx-auto">{video.user.name}</td>
                    <td className="p-4 text-center">{video.title}</td>
                    <td className="p-4 text-center">{video.category}</td>
                    <td className="p-4 text-center">{formatDateTime(video.timestamp)}</td>
                    <td className="p-4 text-center">{video.visibility}</td>
                    <td className="p-4 text-center">{video.status}</td>
                    <td className="p-4 text-center">
                      <button
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleViewVideo(video._id)}
                      >
                        <RiEyeLine />
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default VideoList;
