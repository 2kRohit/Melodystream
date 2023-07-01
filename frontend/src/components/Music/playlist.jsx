import React, { useEffect } from 'react';
import { RiUserLine, RiVideoLine, RiMusic2Line, RiSettings2Line } from 'react-icons/ri';
import Sidebar from './Sidebar';
import { VscNewFolder } from 'react-icons/vsc';
import { useState } from 'react';
import { useAuth } from '../../hooks';
import axios from 'axios';

import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { CgAdd } from 'react-icons/cg';
import { FaFolderPlus } from 'react-icons/fa';

const Playlist = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState('');
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const [playlist, setplaylist] = useState([]);

  const fetchplaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/getplaylist/${userId}`);
      setplaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend to insert the category
      await axios.post(`http://localhost:8000/api/music/addplaylist/${userId}`, { name });
      setname('');
      alert('Playlist created successfully!');
      fetchplaylist();
      setshow(false);
    } catch (error) {
      console.error('Error inserting playlist:', error);
      alert('Failed to create. Please try again.');
    }
  };

  const handleDeleteplaylist = async (pId,pname) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this playlist?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/music/deleteplaylist/${pId}/${pname}/${userId}`);
        alert('Playlist deleted successfully');


        fetchplaylist();
      } catch (error) {
        console.error('Error deleting :', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };
  const navigate=useNavigate()
  const view=(name)=>{
    navigate(`/viewplaylist?name=${name}`)
  }
  useEffect(() => {
    fetchplaylist();
  }, []);
// Utility function to generate random gradient colors
const getRandomGradient = () => {
  const randomHue = Math.floor(Math.random() * 360);
  const gradient = `linear-gradient(${randomHue}deg, hsl(${randomHue}, 70%, 50%), hsl(${randomHue + 60}, 70%, 50%))`;
  return gradient;
};
  return (
    <Sidebar>
      <div className="bg-gray-900 text-white p-6">
        <h1 className="text-3xl mx-auto text-center font-semibold mb-4 italic text-blue-500">Playlist</h1>
        <div className="flex items-center justify-end mb-4">
          <button
            className="text-gray-300 text-3xl cursor-pointer bg-transparent border-none outline-none"
            onClick={() => setshow(!show)}
          >
            <FaFolderPlus />
          </button>
        </div>
        {show && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-gray-900 shadow-md rounded-md px-8 py-6 border-4 border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">Create Playlist</h2>
              <form onSubmit={handlesubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none"
                    placeholder="Enter playlist name"
                    required
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
                    onClick={() => setshow(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {playlist.map((playlistItem) => (
            <div className=" p-6 rounded-lg shadow-xl" style={{ background: getRandomGradient() }} key={playlistItem.id}>
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h2  onClick={()=>{view(playlistItem.name)}} className="text-xl font-bold">{playlistItem.name}</h2>
                <div>
                
                  <button className="text-white text-lg bg-transparent border-none outline-none hover:text-red-600"
                  onClick={()=>{handleDeleteplaylist(playlistItem._id,playlistItem.name)}}>
                    <BsTrash />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RiMusic2Line className="text-white text-4xl" />
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Playlist;
