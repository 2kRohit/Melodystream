import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlay, FiMusic } from 'react-icons/fi';
import { MdOutlineAutoAwesomeMotion } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

import Sidebar from './Sidebar';
import { FaLanguage } from 'react-icons/fa';

const MusicList = () => {
  const [musicList, setMusicList] = useState([]);
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;

  useEffect(() => {
    async function fetchMusic() {
      try {
        const response = await axios.get('http://localhost:8000/api/music/getcategory');
        setMusicList(response.data);
      } catch (error) {
        console.log('Error fetching music:', error);
      }
    }

    fetchMusic();
  }, []);

  const handleMusicClick = async (value) => {
    try {
      navigate(`/viewsong?type=${'category'}&&value=${value}`);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // Utility function to generate random gradient colors
  const getRandomGradient = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const gradient = `linear-gradient(${randomHue}deg, hsl(${randomHue}, 70%, 50%), hsl(${randomHue + 60}, 70%, 50%))`;
    return gradient;
  };

  return (
    <Sidebar>
      <div className="container mx-auto px-4 py-0 bg-gray-900 text-white">
        <h1 className="text-3xl text-center text-indigo-500 font-bold mb-4 italic">Category</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {musicList.map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              style={{ background: getRandomGradient() }} // Apply random gradient as the background
              onClick={() => handleMusicClick(music.name)}
            >
              <div className="relative h-72">
                
                  <div className="flex items-center justify-center w-full h-full" style={{ background: getRandomGradient() }}>
                    <MdOutlineAutoAwesomeMotion className="text-white text-6xl" />
                  </div>
            
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md flex items-center">
                    <FiPlay className="mr-2" />
                    Play
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-lg font-bold text-white truncate">{music.name}</p>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    {/* Additional content */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default MusicList;
