import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import SidebarForm from './SidebarForm';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEyeLine } from 'react-icons/ri';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
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

  return (
    <SidebarForm>
      <div className="bg-gray-900 min-h-screen flex flex-col justify-start items-center py-0">
        <h1 className="text-3xl font-bold text-white mb-2 text-center w-full">Unverified Video List</h1>
        <div className="w-full max-w-3xl overflow-x-auto">
          {videos.length === 0 ? (
            <p className="text-white text-center">No videos available!</p>
          ) : (
            <table className="w-full bg-gray-800 rounded-lg table-fixed">
              <thead>
                <tr>
                  <th className="border-b border-gray-700 bg-gray-900 p-2 text-white text-center">Title</th>
                  <th className="border-b border-gray-700 bg-gray-900 p-2 text-white text-center">Category</th>
                  <th className="border-b border-gray-700 bg-gray-900 p-2 text-white text-center">Upload Date</th>
                  <th className="border-b border-gray-700 bg-gray-900 p-2 text-white text-center">Status</th>
                  <th className="border-b border-gray-700 bg-gray-900 p-2 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className={`text-center ${
                      video.status === 'rejected' ? 'bg-red-400 text-white' : ''
                    }`}
                  >
                    <td className="border-b border-gray-700 p-2 capitalize">{video.title}</td>
                    <td className="border-b border-gray-700 p-2 capitalize">{video.category}</td>
                    <td className="border-b border-gray-700 p-2 capitalize">{formatDateTime(video.timestamp)}</td>
                    <td className="border-b border-gray-700 p-2 capitalize">{video.status}</td>
                    <td className="border-b border-gray-700 p-2">
                      <button
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleViewVideo(video._id)}
                      >
                       <RiEyeLine />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
