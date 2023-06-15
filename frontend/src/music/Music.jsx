import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import musicFile from './music.mp3';
import image from './image.jpeg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Sidebar from './Sidebar';



const Music = () => {
    
  const [music, setMusic] = useState([
    {
      id: 1,
      title: 'Song 1',
      cover: 'https://unsplash.com/s/photos/human',
      url: './music.mp3',
      duration: '4:10',
    },
    {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
      {
        id: 1,
        title: 'Song 1',
        cover: 'https://www.example.com/song1.jpg',
        url: 'https://www.example.com/song1.mp3',
        duration: '4:10',
      },
    {
      id: 2,
      title: 'Song 2',
      cover: 'https://www.example.com/song2.jpg',
      url: 'https://www.example.com/song2.mp3',
      duration: '3:20',
    },
    // Add more music objects as needed
  ]);

  

  return (
   
<Sidebar>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {music.map((song) => (
        <div key={song.id} className="bg-gray-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">{song.title}</h3>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <div className="rounded-lg overflow-hidden">
              <img src={image} alt={song.title} className="object-cover w-full h-full" />
            </div>
            <div className="absolute bottom-2 right-2 bg-gray-900 text-white py-1 px-2 rounded-md text-xs">
              {song.duration}
            </div>
          </div>
          <audio controls className="w-full">
            <source src={musicFile} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
</Sidebar>
      
  );
};

export default Music;
