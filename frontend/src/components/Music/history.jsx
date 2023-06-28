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
const fetchMusic=async()=> {
    try {
      const response = await axios.get(`http://localhost:8000/api/music/history/${userId}`);
      setMusicList(response.data);
    } catch (error) {
      console.log('Error fetching music:', error);
    }
  }
  useEffect(() => {

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
//
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();

    // Convert the time difference to seconds
    const seconds = Math.floor(timeDifference / 1000);

    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    // Calculate the relative time based on the time difference
    if (seconds < minute) {
      return `${seconds} sec ago`;
    } else if (seconds < hour) {
      const minutes = Math.floor(seconds / minute);
      return `${minutes} min ago`;
    } else if (seconds < day) {
      const hours = Math.floor(seconds / hour);
      return `${hours} hr ago`;
    } else if (seconds < month) {
      const days = Math.floor(seconds / day);
      return `${days} day ago`;
    } else if (seconds < year) {
      const months = Math.floor(seconds / month);
      return `${months} month ago`;
    } else {
      const years = Math.floor(seconds / year);
      return `${years} year ago`;
    }
  };

 
  const deletehistory = async (musicId) => {
    const done=window.confirm("do you want to clear the history")
    if(done){
    try {
      await axios.delete(`http://localhost:8000/api/music/historydelete/${musicId}/${userId}`);
      fetchMusic()
    } catch (error) {
      console.error(error);
    }}
  };

  const clearhistory = async () => {
    const done=window.confirm("do you want to clear all the history")
    if(done){
    try {
      await axios.delete(`http://localhost:8000/api/music/clearhistory/${userId}`);
      fetchMusic()
 
    } catch (error) {
      console.error(error);
    }}
  };




if(musicList.length===0) return (<Sidebar><h1 className='text-3xl text-gray-600 text-center mx-auto align-middle'>Your history is empty...</h1></Sidebar>)
  return (
    <Sidebar>
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-500 italic">Your History</h1>
        <div onClick={clearhistory} className='text-red-500 -mt-9 mb-4 hover:text-red-700 cursor-pointer'> {musicList.length !== 0 ?'clear all':''}</div> 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {musicList.map((music) => (
            <div>
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
                <div className="absolute bottom-4 left-4">
                  <p className="text-lg font-bold text-white truncate">{music.title}</p>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                
                    <span>{music.artist}</span><br/>
                
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
<span>Watched &bull; {formatDateTime(music.timestamp)}</span>
                  </div>
              <div className=' text-right -mt-5'>
   <span onClick={() => {deletehistory(music._id);}}  className=' bg-tranparent cursor-pointer text-blue-500  hover:text-red-500'>clear</span>
                 </div> </div>
          
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default MusicList;
