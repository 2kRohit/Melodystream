import React, { useState, useRef, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdShuffle, MdSkipPrevious, MdSkipNext, MdRepeat, MdOutlineFavoriteBorder } from 'react-icons/md';
import { ImMusic } from "react-icons/im";
import axios from 'axios';
import Sidebar from './Sidebar';
import { RiDeleteBinLine, RiEditCircleFill, RiMusic2Fill } from 'react-icons/ri';
import { TbFolderPlus, TbRepeatOnce } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

import { FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { AiFillFolder } from 'react-icons/ai';

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
 
  
  
  const handleDeletemusic = async (musicId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this music?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/music/deletemusic/${musicId}`);
        if(musicId===currentTrack._id){ nextTrackHandler ()}
        alert('music deleted successfully');
        // music deleted successfully, update the music list
        fetchMusic();
       
      } catch (error) {
        console.error(error);
      }
    }
  };
const navigate=useNavigate()
const handleeditmusic=(id)=>{
navigate(`/editmusic?id=${id}`)
}

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
      const response = await axios.get(`http://localhost:8000/api/music/getmusic`);
   
      setTrackList(response.data);

     
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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
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

  const filteredTracks = trackList.filter(
    (music) =>
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.category.toLowerCase().includes(searchTerm.toLowerCase())||
      music.language.toLowerCase().includes(searchTerm.toLowerCase())||
      music.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );
if(trackList.length===0) return(<Sidebar><h1 className='text-3xl text-gray-600 text-center mx-auto align-middle'>No songs available...</h1></Sidebar>)
  return (
    <Sidebar>
        <h1 className='text-3xl text-blue-500 text-center italic font-semibold'>View Songs</h1>
      <div className="container mx-auto py-6  ">
        {currentTrack && (
         <div className="flex flex-col pl-6 text-justify items-center">
         <div className="bg-gray-800 flex items-center justify-center relative rounded-lg p-6 shadow-lg">
           {currentTrack.thumbnailPath ? (
             <img
               src={`http://localhost:8000/${currentTrack.thumbnailPath}`}
               alt="Thumbnail"
               className="w-64 h-64 rounded-lg border-4 border-gray-800 shadow-2xl"
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
             <p className="text-gray-400 mt-2">Uploaded on :{formatDateTime(currentTrack.timestamp)}</p>
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
            currentTrack?._id ===track._id ? 'border-b border-green-600 ' : 'bg-gray-900'
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
          <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                        onClick={() => handleeditmusic(track._id)}
                      >
                        <RiEditCircleFill />
                      </button>
            
          <button
                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                        onClick={() => handleDeletemusic(track._id)}
                      >
                        <RiDeleteBinLine />
                      </button>
              
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
