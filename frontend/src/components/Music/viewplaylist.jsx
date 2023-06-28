import React, { useState, useRef, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdShuffle, MdSkipPrevious, MdSkipNext, MdRepeat, MdOutlineFavoriteBorder } from 'react-icons/md';
import { ImMusic } from "react-icons/im";
import axios from 'axios';
import Sidebar from './Sidebar';
import { RiMusic2Fill } from 'react-icons/ri';
import { TbFolderPlus, TbRepeatOnce } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

import { FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { AiFillFolder } from 'react-icons/ai';
import { IoMdTrash } from 'react-icons/io';

const MusicPlayer = () => {
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackList, setTrackList] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tableduration, settableduration] = useState({});
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [playlist, setplaylist] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const fetchplaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/getplaylist/${userId}`);
      setplaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };
  const handlePlaylistClick = async(mid,name) => {
    try {
      // Send a POST request to the backend to insert the category
      const stat=await axios.post(`http://localhost:8000/api/music/musictoplaylist/${userId}`, { name,mid});
      
      if(stat.status===204){
        alert('This song already in the playlist');

      }else{
      alert('Added to playlist');
      
      setShowPlaylist(!showPlaylist);}
    } catch (error) {
      console.error('Error inserting playlist:', error);
      alert('Failed to create. Please try again.');
    }
    
    
  };
 
  const handleShare = async (mId) => {
    try {
      await navigator.share({
        title: trackList[0].title,
        url: `http://localhost:3000/viewmusic?musicId=${mId}`,
      });
      console.log('Shared successfully');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDeleteplaylist = async (mId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this song?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/music/deleteplaylistsong/${mId}/${name}/${userId}`);
        alert('Song deleted successfully');


        fetchMusic()
      } catch (error) {
        console.error('Error deleting :', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };



  //handle fav
  const handlefavourite = async (mId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/music/${mId}/favourite/${userId}`);
      if(mId===currentTrack._id){ nextTrackHandler ()}
      fetchMusic()
   // fetchfavouritestatus()
    } catch (error) {
      console.error(error);
    }
  };
  const [favoriteStatus, setFavoriteStatus] = useState({});

const fetchFavoriteStatus = async (mId) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/music/${mId}/favouritestatus/${userId}`);
    const { status } = response.data;
    setFavoriteStatus((prevStatus) => ({ ...prevStatus, [mId]: status }));
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  
  trackList.forEach((mId) => {
    fetchFavoriteStatus(mId._id);
  });
}, [trackList]);
  //end fav
  const fetchduration=()=>{ trackList.forEach(async(audio) => {
    const audioElement =await new Audio(`http://localhost:8000/${audio.musicPath}`);
    audioElement.addEventListener('loadedmetadata', () => {
      settableduration((prevDurations) => ({
        ...prevDurations,
        [audio._id]: audioElement.duration,
      })); console.log(tableduration)
    });
  });}
  const fetchMusic = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/getplaylistsong/${userId}/${name}`);
   console.log(response.data)
      setTrackList(response.data);
      fetchplaylist()
     
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  };

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const shuffleHandler = () => {
    const randomIndex = Math.floor(Math.random() * trackList.length);
    setCurrentTrack(trackList[randomIndex]);
    setIsPlaying(true); // Start playing the shuffled track
  };

  const nextTrackHandler = () => {
    const currentIndex = trackList.findIndex((track) => track._id === currentTrack._id);
    const nextIndex = (currentIndex + 1) % trackList.length;
    setCurrentTrack(trackList[nextIndex]);
    setIsPlaying(true); // Start playing the next track
  };

  const previousTrackHandler = () => {
    const currentIndex = trackList.findIndex((track) => track._id === currentTrack._id);
    const previousIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrack(trackList[previousIndex]);
    setIsPlaying(true); // Start playing the previous track
  };

  const repeatHandler = () => {
    setIsRepeat(!isRepeat);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  useEffect(() => {
    fetchduration()
     }, [trackList]);
  useEffect(() => {
    fetchMusic();
    fetchduration();
  }, []);

  useEffect(() => {
    if (currentTrack) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  const handleTrackEnded = () => {
    if (isRepeat) {
      audioRef.current.play();
    } else {
      nextTrackHandler();
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTracks = trackList?.filter((track) => {
    const trackTitle = track.title?.toLowerCase();
    return trackTitle?.includes(searchTerm.toLowerCase());
  });
if(trackList.length===0) return(<Sidebar><h1 className='text-3xl text-gray-600 text-center mx-auto align-middle'>Your playlist is empty...</h1></Sidebar>)
  return (
    <Sidebar>
        <h1 className='text-3xl text-blue-500 text-center italic font-semibold'>{name}</h1>
      <div className="container mx-auto py-6  ">
        {currentTrack && (
         <div className="flex flex-col pl-6 text-justify items-center">
         <div className="bg-gray-800 flex items-center justify-center relative rounded-lg p-6 shadow-lg">
           {currentTrack.thumbnailPath ? (
             <img
               src={`http://localhost:8000/${currentTrack.thumbnailPath}`}
               alt="Thumbnail"
               className="w-64 h-64 object-cover rounded-lg border-4 border-gray-800 shadow-2xl"
             />
           ) : (
             <ImMusic className="w-56 h-56 text-indigo-300" />
           )}
           <div className="pl-6">
             <h1 className="text-3xl font-bold mb-2 text-white">{currentTrack.title}</h1>
             <p className="text-lg text-gray-300">Artist :{currentTrack.artist}</p>
             <p className="text-gray-400 mt-2">Description :{currentTrack.description}</p>
             <p className="text-gray-400 mt-2">Category :{currentTrack.category}</p>
             <p className="text-gray-400 mt-2">Language :{currentTrack.language}</p>
           </div>
         </div>
       
         <audio
           ref={audioRef}
           src={`http://localhost:8000/${currentTrack.musicPath}`}
           onEnded={handleTrackEnded}
           onTimeUpdate={handleTimeUpdate}
           onDurationChange={handleDurationChange}
         />
       
         <div className="flex space-x-4 items-center mt-6">
           <button
             className="bg-purple-700 hover:bg-purple-800 text-white text-2xl rounded-full p-2 transition-colors duration-300 focus:outline-none"
             onClick={shuffleHandler}
           >
             <MdShuffle />
           </button>
           <button
             className="bg-purple-700 hover:bg-purple-800 text-white text-2xl rounded-full p-2 transition-colors duration-300 focus:outline-none"
             onClick={previousTrackHandler}
           >
             <MdSkipPrevious />
           </button>
           <button
             className="bg-purple-700 hover:bg-purple-800 text-white text-4xl rounded-full p-3 transition-colors duration-300 focus:outline-none"
             onClick={playPauseHandler}
           >
             {isPlaying ? <MdPause /> : <MdPlayArrow />}
           </button>
           <button
             className="bg-purple-700 hover:bg-purple-800 text-white text-2xl rounded-full p-2 transition-colors duration-300 focus:outline-none"
             onClick={nextTrackHandler}
           >
             <MdSkipNext />
           </button>
           <button
             className={`bg-purple-700 hover:bg-purple-800 text-white text-2xl rounded-full p-2 transition-colors duration-300 focus:outline-none ${
               isRepeat ? 'hidden' : ''
             }`}
             onClick={repeatHandler}
           >
             <MdRepeat />
           </button>
           <button
             className={`bg-purple-700 hover:bg-purple-800 text-white text-2xl rounded-full p-2 transition-colors duration-300 focus:outline-none ${
               isRepeat ? '' : 'hidden'
             }`}
             onClick={repeatHandler}
           >
             <TbRepeatOnce />
           </button>
         </div>
       
         <div className="mt-8 w-full">
           <div className="relative w-full h-2 bg-gray-800 rounded-full">
             <div
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-indigo-600"
               style={{ width: `${(currentTime / duration) * 100}%` }}
             ></div>
             <input
               type="range"
               min={0}
               max={duration}
               value={currentTime}
               step={1}
               onChange={handleSeek}
               className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
             />
           </div>
           <div className="flex justify-between mt-2">
             <span className="text-gray-500 text-sm">{formatTime(currentTime)}</span>
             <span className="text-gray-500 text-sm">{formatTime(duration)}</span>
           </div>
         </div>
       </div>
       
        )}

<div className="mx-auto mt-2">
  <div className="float-right">
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search..."
      className="w-48 sm:w-64 bg-gray-900 text-white px-4 py-2 rounded-l outline-none focus:ring-2 focus:ring-purple-500"
    />
   
  </div>
  <table className="w-full bg-gray-900 rounded-lg mt-5 text-left overflow-hidden">
    <thead>
      <tr className="bg-gray-900 text-white">
        <th className="py-4 px-6"></th>
        <th className="py-4 px-6">Title</th>
        <th className="py-4 px-6">Artist</th>
        <th className="py-4 px-6">Duration</th>
       
      </tr>
    </thead>
    <tbody>
      {filteredTracks.map((track, index) => (
        <tr
          key={track._id}
          className={`transition-colors ease-in-out border-b border-gray-800 duration-300 hover:bg-gray-800 ${
            currentTrack?._id ===track._id ? 'border-b border-green-600' : 'bg-gray-900'
          }`}
        >
          <td
            onClick={() => setCurrentTrack(track)}
            className="py-4 px-6 cursor-pointer transform hover:scale-105 hover:rotate-3 hover:shadow-lg"
          >
            {track.thumbnailPath ? (
              <img
                src={`http://localhost:8000/${track.thumbnailPath}`}
                alt="Thumbnail"
                className="w-12 h-12 object-cover rounded-full "
              />
            ) : (
              <RiMusic2Fill className="w-12 h-12 text-purple-500 " />
            )}
          </td>
          <td
            onClick={() => setCurrentTrack(track)}
            className="py-4 px-6 cursor-pointer text-white hover:text-purple-400 font-medium"
          >
            {track.title}
          </td>
          <td className="py-4 px-6 text-white">{track.artist}</td>
          <td className="py-4 px-6 text-white">
            {tableduration[track._id] ? formatTime(tableduration[track._id]) : 'Loading...'}
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center space-x-2">{favoriteStatus[track._id] === undefined ? (
            <span></span>
          ) : (
              <MdOutlineFavoriteBorder className={` text-xl cursor-pointer ${favoriteStatus[track._id]? 'text-green-500 ':''}`} 
              onClick={()=>{handlefavourite(track._id)}}
              />)}
             
           
<FiShare2 className="text-white text-xl cursor-pointer hover:text-blue-500" onClick={()=>{handleShare(track._id)}} />

<button
                  className="text-white text-xl bg-transparent border-none outline-none"
                  onClick={() => {
                    setShowPlaylist(!showPlaylist);
                    setSelectedTrackId(track._id);
                  }}
                >
                 <TbFolderPlus/>
                </button>
                <IoMdTrash className="text-white text-xl cursor-pointer hover:text-red-500" onClick={()=>{handleDeleteplaylist(track._id)}} />
              </div>
              {showPlaylist && selectedTrackId === track._id && (
                  <div className=" border-4 w-1/5 border-gray-600 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-800 rounded-t-lg">
                    <h4 className="text-white text-lg font-bold">Select a Playlist</h4>
                    
                  </div>
                  <ul className="text-white px-6 py-4">
                    {playlist.map((p) => (
                      <li
                        key={p.id}
                        className={`cursor-pointer hover:border-b py-2 transition duration-300 flex items-center ${p.name===name ? 'hidden':''}`}
                        onClick={() => handlePlaylistClick(track._id, p.name)}
                      >
                        <AiFillFolder className="text-yellow-400 mr-2" />
                        <span className="truncate">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-6 py-4 bg-gray-800 rounded-b-lg flex justify-end">
                    <button
                      onClick={() => setShowPlaylist(false)}
                      className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      </div>
    </Sidebar>
  );
};

export default MusicPlayer;
