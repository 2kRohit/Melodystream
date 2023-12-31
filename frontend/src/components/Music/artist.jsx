import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlay, FiMusic } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';

import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const MusicList = () => {

  const [musicList, setMusicList] = useState([]);
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;

  useEffect(() => {
    async function fetchMusic() {
      try {
        const response = await axios.get('http://localhost:8000/api/music/getartist');
        setMusicList(response.data);
      } catch (error) {
        console.log('Error fetching music:', error);
      }
    }

    fetchMusic();
  }, []);

  const handleMusicClick = async(value) => {
    try{ 
    
    navigate(`/viewsong?type=${'artist'}&&value=${value}`);
  } catch (error) {
    console.log('Error :', error);
  }
  };

  return (
    <Sidebar>
      <div className="container mx-auto px-4 py-0 bg-gray-900 text-white">
        <h1 className="text-3xl text-center text-gray-300 font-bold mb-4 italic">Artist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {musicList.map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              onClick={() => handleMusicClick(music.name)}
            >
              <div className="relative h-72">
                {music.imagePath ? (
                  <img
                    src={`http://localhost:8000/${music.imagePath}`}
                    alt={music.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-700">
                    <FiMusic className="text-gray-500 text-5xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md flex items-center">
                    <FiPlay className="mr-2" />
                    Play
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-75 w-full">
                  <p className="text-base font-bold text-white truncate">{music.name}</p>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                
               
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
