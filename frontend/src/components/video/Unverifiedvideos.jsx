import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import SidebarForm from './SidebarForm';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEyeLine, RiSearchLine } from 'react-icons/ri';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/unverified/${userId}`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const navigate = useNavigate();

  const handleViewVideo = (videoId) => {
    navigate(`/viewunverifiedvideo?videoId=${videoId}`);
    // Handle logic for viewing the video
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };

  const handleDeleteVideo = async (videoId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this video?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/video/deletevideo/${videoId}`);
        alert('Video deleted successfully');
        // Video deleted successfully, update the video list
        fetchVideos();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarForm>
      <div className="bg-gray-900 min-h-screen flex flex-col justify-start items-center py-0">
        
        <div className="w-full  overflow-x-auto border-4 border-gray-600 shadow-2xl">
        <h2 className="text-center text-2xl text-indigo-500 italic p-1 mb-0 mt-2 font-bold">Unverified Video List</h2>
          <div className="flex items-center justify-between mb-0">
            <div className="relative flex items-center mt-0 ">
             
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by title or category"
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
                  <th className="p-2 text-white text-left">Title</th>
                  <th className="p-2 text-white text-left">Category</th>
                  <th className="p-2 text-white text-left">Upload Date</th>
                  <th className="p-2 text-white text-left">Status</th>
                  <th className="p-2 text-white text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr
                    key={video.id}
                    className={`${
                      video.status === 'rejected' ? 'bg-red-400 text-white' : ''
                    }`}
                  >
                    <td className="p-4">{video.title}</td>
                    <td className="p-4">{video.category}</td>
                    <td className="p-4">{formatDateTime(video.timestamp)}</td>
                    <td className="p-4">{video.status}</td>
                    <td className="p-4">
                      <button
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleViewVideo(video._id)}
                      >
                        <RiEyeLine />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDeleteVideo(video._id)}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SidebarForm>
  );
};

export default VideoList;
