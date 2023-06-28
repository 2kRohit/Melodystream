import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';


import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEyeLine, RiSearchLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';

const User = () => {
   const navigate=useNavigate()
  const [reports, setreports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchuser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/verifier/verifiedreports`);
      setreports(response.data);
    } catch (error) {
      console.error(error);
    }
  };
const handlereport=(videoId)=>{
    navigate(`/verifier/viewverifiedvideos?videoId=${videoId}`);

}
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

  const filteredreports = reports.filter(
    (report) =>
      report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.video.name.toLowerCase().includes(searchQuery.toLowerCase())
 
  );

  return (
    <Sidebar>
      <div className="bg-gray-900 min-h-screen flex flex-col justify-start items-center py-0">
        
        <div className="w-full max-w-3xl overflow-x-auto border-4 border-gray-600 shadow-2xl mt-6">
        <h2 className="text-center text-2xl text-blue-500 italic p-1 mb-0 mt-2 font-semibold">Verified Reports</h2>
          <div className="flex items-center justify-between mb-0">
            <div className="relative flex items-center mt-0 ">
             
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by name or video"
                className=" px-1 w-64 py-2 rounded-lg bg-gray-900  text-white focus:outline-none"
              />
            
            </div>
          </div>
          {filteredreports.length === 0 ? (
            <p className="text-white text-center">No data available!</p>
          ) : (
            <table className="w-full bg-gray-900 rounded-lg">
              <thead>
                <tr>
               
                  <th className="p-2 text-white text-center">Reported by</th>
                  <th className="p-2 text-white text-center">Reported Video</th>
    
                  <th className="p-2 text-white text-center">Reported Date</th>
                  <th className="p-2 text-white text-center">Actions</th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredreports.map((report) => (
                  <tr
                    key={report.id}
                   
                  >
                    
                    <td className="p-4 text-center">{report.user.name}</td>
                    <td className="p-4 text-center">{report.video.title}</td>
                    <td className="p-4 text-center">{formatDateTime(report.timestamp)}</td>
                    <td className="p-4 text-center ">
                      <button
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handlereport(report.video._id)}
                      >
                        <RiEyeLine />
                      </button></td>
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
