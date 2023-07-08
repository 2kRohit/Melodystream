import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { AiFillFolder } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function (props) {
  
const navigate=useNavigate()
    const {prop1,prop2}=props

    const [userdetails,setuserdetails]=useState([])
const showlist=async()=>{
try{
    if(prop1==='Liked by'){
  const response = await axios.get(`http://localhost:8000/api/video/${prop2}/liked-users`);
  setuserdetails(response.data.likedUsers)
 
    }
    else if(prop1==='Subscribers'){
        const response = await axios.get(`http://localhost:8000/api/video/${prop2}/subscribers`);
        setuserdetails(response.data.subscribers)
       
          }
          else if(prop1==='Disliked by'){
            const response = await axios.get(`http://localhost:8000/api/video/${prop2}/disliked-users`);
            setuserdetails(response.data.likedUsers)
           
              }
          
          
}
catch (error) {
  console.error(error);
}
}


useEffect(()=>{
showlist()

},[userdetails])
if(userdetails.length===0){
    return(
        <div >
        
        <div className=" border-4 w-1/6 border-gray-600 fixed top-1/2 left-2/2 ml-40 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 rounded-lg shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-800 rounded-t-lg">
          <h4 className="text-white text-lg font-bold text-center">{prop1}</h4>
          
        </div>
        <p className='p-4'>No user found</p>
        
        
      </div>

</div>   
    )
}
  return (
    <div >
        
                  <div className=" border-4 w-1/6 border-gray-600 fixed top-1/2 left-2/2 ml-40 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-800 rounded-t-lg">
                    <h4 className="text-white text-lg font-bold text-center">{prop1}</h4>
                    
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                  <ul className="text-white px-6 py-4">
                    {userdetails?.map((p) => (
                      <li
                        key={p._id}
                        onClick={()=>{navigate(`/verifier/userprofile?uId=${p.userId}`)}} 
                        className="cursor-pointer hover:border-b border-green-500 py-2 transition duration-300 flex items-center"
                      >
                  { p.profilePicture?(<img 
      className="w-8 h-8 rounded-full mr-2 cursor-pointer"
      src={`http://localhost:8000/uploads/profile/${p?.profilePicture}`}
      alt="Profile"
    />):(
        <FaUserCircle
    
    className="w-8 h-8 text-gray-500 mr-2 cursor-pointer" />

    )}
                        <span className="truncate">{p.name}</span>
                      </li>
                    ))}
                  </ul></div>
                  
                </div>
          
    </div>
  )
}
