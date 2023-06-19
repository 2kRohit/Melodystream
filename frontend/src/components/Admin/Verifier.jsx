import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';


import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEyeLine, RiSearchLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchuser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/verifier`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

 

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };

  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="bg-gray-900 min-h-screen flex flex-col justify-start items-center py-0">
        
        <div className="w-full max-w-3xl overflow-x-auto border-4 border-gray-600 shadow-2xl mt-6">
        <h2 className="text-center text-2xl text-blue-500 italic p-1 mb-0 mt-2 font-semibold">Verifier List</h2>
          <div className="flex items-center justify-between mb-0">
            <div className="relative flex items-center mt-0 ">
             
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by title or category"
                className=" px-1 w-64 py-2 rounded-lg bg-gray-900  text-white focus:outline-none"
              />
            
            </div>
          </div>
          {filteredUsers.length === 0 ? (
            <p className="text-white text-center">No data available!</p>
          ) : (
            <table className="w-full bg-gray-900 rounded-lg">
              <thead>
                <tr>
                <th className="p-2 text-white text-center">Profile Picture</th>
                  <th className="p-2 text-white text-center">Name</th>
                  <th className="p-2 text-white text-center">Email</th>
                  <th className="p-2 text-white text-center">Register Date</th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                   
                  >
                    <td className="p-4 text-center">
                    {user?.profilePicture ? (
              <>
              <img
                src={`http://localhost:8000/uploads/profile/${user.profilePicture}`}
                alt="Profile"
                className="h-12 w-12 rounded-full mx-auto"
                
              /></>
            
            ) : (<>
             <FaUserCircle
              className="w-12 h-12 text-gray-500 mx-auto" />
            
              </>
            )}
                   </td>
                    <td className="p-4 text-center">{user.name}</td>
                    <td className="p-4 text-center">{user.email}</td>
                    <td className="p-4 text-center">{formatDateTime(user.timestamp)}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default User;
