import React, { useState, useEffect } from 'react';
import { RiUserLine, RiVideoLine, RiMusic2Line, RiSettings2Line } from 'react-icons/ri';
import Sidebar from './Sidebar';
import axios from 'axios';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';

const AdminDashboardContent = () => {
  const [data, setData] = useState({ user: 0, verifier: 0, video: 0, musiccount: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/count`);
      setData(res.data);
    } catch (error) {
      console.log("An error occurred while fetching data");
    }
  };

  return (
    <Sidebar>
      <div className="bg-gray-900 min-h-screen text-white p-6">
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center justify-center">
            <FaRegUserCircle className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Users</h2>
            <p className="text-xl text-gray-300">Total: {data.user}</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center justify-center">
            <MdOutlineVerifiedUser className="text-5xl text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifier</h2>
            <p className="text-xl text-gray-300">Total: {data.verifier}</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center justify-center">
            <RiVideoLine className="text-5xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Videos</h2>
            <p className="text-xl text-gray-300">Total: {data.video}</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center justify-center">
            <RiMusic2Line className="text-5xl text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Music</h2>
            <p className="text-xl text-gray-300">Total: {data.musiccount}</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminDashboardContent;
