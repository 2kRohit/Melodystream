import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlay, FiMusic } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';

import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { MdOutlineAutoAwesomeMotion } from 'react-icons/md';
import { FaLanguage } from 'react-icons/fa';
import { TbMoodSearch } from 'react-icons/tb';

const MusicList = () => {

  const [musicList, setMusicList] = useState([]);
  const [artist, setartist] = useState([]);
  const [language, setlanguage] = useState([]);
  const [mood, setmood] = useState([]);
  const [category, setcategory] = useState([]);
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const [recommendation,setrecommendation]=useState([])
//category
useEffect(() => {
  async function fetchcategory() {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getcategory');
      setcategory(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }

  fetchcategory();
}, []);

const handleCategoryClick = async (value) => {
  try {
    navigate(`/viewsong?type=${'category'}&&value=${value}`);
  } catch (error) {
    console.log('Error:', error);
  }
};
//artist
useEffect(() => {
  async function fetchartist() {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getartist');
      setartist(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }

  fetchartist();
}, []);

const handleArtistClick = async (value) => {
  try {
    navigate(`/viewsong?type=${'artist'}&&value=${value}`);
  } catch (error) {
    console.log('Error:', error);
  }
};
//language
useEffect(() => {
  async function fetchlanguage() {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getlanguage');
      setlanguage(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }

  fetchlanguage();
}, []);

const handleLanguageClick = async (value) => {
  try {
    navigate(`/viewsong?type=${'language'}&&value=${value}`);
  } catch (error) {
    console.log('Error:', error);
  }
};
//mood
useEffect(() => {
  async function fetchmood() {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getmood');
      setmood(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }

  fetchmood();
}, []);

const handlemoodClick = async (value) => {
  try {
    navigate(`/viewsong?type=${'mood'}&&value=${value}`);
  } catch (error) {
    console.log('Error:', error);
  }
};


useEffect(() => {
  async function fetchRecommendation() {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/recommendations/${userId}`);
      console.log(response.data)
      setrecommendation(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }

  fetchRecommendation();
}, []);

  useEffect(() => {
    async function fetchMusic() {
      try {
        const response = await axios.get('http://localhost:8000/api/music/getmusic');
        setMusicList(response.data);
      } catch (error) {
        console.log('Error fetching music:', error);
      }
    }

    fetchMusic();
  }, []);

  const handleMusicClick = async(musicId) => {
    try{ 
    await axios.put(`http://localhost:8000/api/music/incrementviews/${musicId}/${userId}`);
    navigate(`/viewmusic?musicId=${musicId}`);
  } catch (error) {
    console.log('Error :', error);
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
      <h1 className="text-xl text-gray-300 font-bold mb-4 italic">Suggestions for you</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {recommendation.slice(0, 5).map((music) => (
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
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75">
              <marquee scrollamount="3">  <p  className="text-lg text-green-500 font-bold truncate">{music.title}</p></marquee>  
                  <div className="flex items-center text-sm text-gray-300 ">
                
                    <span className='ml-2 text-white'> {music.artist}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h1 className="text-xl text-gray-300 font-bold mb-4 mt-4 italic">Discover Music</h1>
        <Link to="/all" className='-mt-10 float-right text-gray-500 font-bold'>show all</Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {musicList.slice(0, 10).map((music) => (
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
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-75 w-full">
                <marquee scrollamount="3" className=''>   <p className="text-lg font-bold text-green-500 truncate">{music.title}</p></marquee>
                  <div className="flex items-center text-sm text-gray-300 ">
                
                    <span className='ml-2 text-white'>{music.artist}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

{/* profile */}
<h1 className="text-xl text-gray-300 font-bold mb-4 mt-4 italic">Artist</h1>
<Link to="/artist" className='-mt-10 float-right text-gray-500 font-bold'>show all</Link>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {artist.slice(0, 10).map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              onClick={() => handleArtistClick(music.name)}
            >
              <div className="relative h-72">
                {music.imagePath ? (
                  <img
                    src={`http://localhost:8000/${music.imagePath}`}
                    alt={music.name}
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
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-75 w-full">
                  <p className="text-base font-bold text-white truncate">{music.name}</p>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                
               
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


{/* Category */}
<h1 className="text-xl text-gray-300 font-bold mb-4 mt-4 italic">Category</h1>
<Link to="/categorymusic" className='-mt-10 float-right text-gray-500 font-bold'>show all</Link>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {category.slice(0,5).map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              style={{ background: getRandomGradient() }} // Apply random gradient as the background
              onClick={() => handleCategoryClick(music.name)}
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

   {/* Mood */}
<h1 className="text-xl text-gray-300 font-bold mb-4 mt-4 italic">Mood</h1>
<Link to="/mood" className='-mt-10 float-right text-gray-500 font-bold'>show all</Link>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {mood.slice(0, 5).map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              style={{ background: getRandomGradient() }} // Apply random gradient as the background
              onClick={() => handlemoodClick(music.name)}
            >
              <div className="relative h-72">
                
                  <div className="flex items-center justify-center w-full h-full" style={{ background: getRandomGradient() }}>
                    <TbMoodSearch className="text-white text-6xl" />
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


{/* Language */}
<h1 className="text-xl text-gray-300 font-bold mb-4 mt-4 italic">Language</h1>
<Link to="/language" className='-mt-10 float-right text-gray-500 font-bold'>show all</Link>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {language.slice(0, 5).map((music) => (
            <div
              key={music._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform hover:shadow-2xl"
              style={{ background: getRandomGradient() }} // Apply random gradient as the background
              onClick={() => handleLanguageClick(music.name)}
            >
              <div className="relative h-72">
                
                  <div className="flex items-center justify-center w-full h-full" style={{ background: getRandomGradient() }}>
                    <FaLanguage className="text-white text-6xl" />
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
