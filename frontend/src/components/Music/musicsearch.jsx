import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlay, FiMusic } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';

import Sidebar from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const MusicList = () => {

  const [musicList, setMusicList] = useState([]);
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');

const fetchMusic=async()=> {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/searchmusic/${q}`);
      setMusicList(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }
  useEffect(() => {
    

    fetchMusic();
  }, [q]);
  
  const handleMusicClick = async(musicId) => {
    try{ 
    await axios.put(`http://localhost:8000/api/music/incrementviews/${musicId}/${userId}`);
    navigate(`/viewmusic?musicId=${musicId}`);
  } catch (error) {
    console.log('Error :', error);
  }
  };
if(musicList.length===0){ 
    <h1 className="text-3xl font-semibold mb-8 text-center italic text-gray-500">No Results found..</h1>
}
  return (
    <Sidebar>
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-semibold mb-8 text-center italic text-blue-500">Search Result</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {musicList.map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              onClick={() => handleMusicClick(music._id)}
            >
              <div className="relative h-72">
                {music.thumbnailPath ? (
                  <img
                    src={`http://localhost:8000/${music.thumbnailPath}`}
                    alt={music.title}
                    className="w-full h-full "
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
                <div className="absolute bottom-4 left-4 w-full">
                <marquee scrollamount="3">   <p className="text-lg font-bold text-white truncate">{music.title}</p></marquee>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                
                    <span>{music.artist}</span>
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
