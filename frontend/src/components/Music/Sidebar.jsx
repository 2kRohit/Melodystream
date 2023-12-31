import React, { useEffect, useState } from 'react';
import { FaBell, FaFileVideo, FaHistory, FaLanguage, FaSearch } from 'react-icons/fa';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { FaUserCircle } from 'react-icons/fa';
import {MdDashboard, MdFavorite, MdFavoriteBorder, MdLibraryAdd, MdLibraryMusic, MdLogout, MdOutlineFavorite, MdOutlineSettings, MdOutlineSettingsSuggest, MdRecentActors, MdVideoLibrary} from "react-icons/md"
import {TbBellFilled, TbFileMusic, TbMoodSearch, TbPlaylist} from "react-icons/tb"
import {BiHistory} from "react-icons/bi"
import {IoMdArrowDropdown, IoMdSettings} from "react-icons/io"
import {FiSave} from "react-icons/fi"
import { CgLock, CgProfile } from 'react-icons/cg';
import axios from 'axios';
export default function Sidebar({ children }) {
  const navigate = useNavigate();

  const { authInfo,handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  const [search,setSearch]=useState();
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const logout = () => {
    handleLogout();

   
  };
  const isuser=()=>{
    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");
    if (!token || role !=="user") navigate('/');
    
  }
  useEffect(()=>{
    isuser()
    
  },[logout])
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/musicsearch?q=${search}`)
    
  };
  const [showSidebar, setShowSidebar] = useState(true);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownn, setShowDropdownn] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const toggleDropdownn = () => {
    setShowDropdownn(!showDropdownn);
  };
  const userId=authInfo.profile?.id;
  const [formdata,setFormData]=useState([])
  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        const { name, email, bio, profilePicture } = response.data;
        setFormData({ name, email, bio ,profilePicture});
        
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (userId) {
      fetchUser();
     
    }
    const timer = setTimeout(() => {
      // Your action here
    }, 5000);

    // Clean up the timer
    return () => clearTimeout(timer);

  }, [userId]);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Sidebar */}
      <div className={` sticky top-0 h-screen bg-transparent shadow-2xl mr-2
       w-1/6 ${showSidebar ? '' : 'hidden'}`}>
        {/* Sidebar content */}
        <div className="p-4 ">
        <Link to="/" className="flex items-center  text-white text-center font-bold text-2xl font-attractive mb-5 mt-3">
            <span className="text-indigo-500 font-extrabold ml-5 italic">MELODY</span><span className="text-white font-bold italic">STREAM</span>
          </Link><div className='mt-0'>
            
          <div className='text-center  '>
          {formdata.profilePicture ? (
              <>
              <img
                src={`http://localhost:8000/uploads/profile/${formdata.profilePicture}`}
                alt="Profile"
                className="h-24 w-24 rounded-full mx-auto"
                onClick={toggleDropdownn}
              />
             <div className=''> {formdata.name}</div>
             <div className=''> {formdata.email}</div></>
            ) : (<><button onClick={toggleDropdownn}> 
             <FaUserCircle className="w-24 h-24 text-gray-500 mx-auto" /></button>
              <div className=''> {formdata.name}</div>
              <div className=''> {formdata.email}</div>
              </>
            )}</div></div>
          <div className="border-t border-gray-600 mb-2"></div>
          <ul className="space-y-2">
            
            <li>
              <Link to="/music" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
                <span className='flex items-center text-base ml-4'> <MdLibraryMusic/><span className='ml-4'>Dashboard</span></span>
              </Link>
            </li>
            <li>
              <Link to="/artist" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <MdRecentActors/><span className='ml-4'>Artist</span></span>
              </Link>
            </li>
 
            <li>
              <Link to="/language" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <FaLanguage/><span className='ml-4'>Language</span></span>
              </Link>
            </li>
            <li>
              <Link to="/mood" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <TbMoodSearch/><span className='ml-4'>Mood</span></span>
              </Link>
            </li>
            <li>
              <Link to="/categorymusic" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <TbFileMusic/><span className='ml-4'>Category</span></span>
              </Link>
            </li>
       
            <li>
              <Link to="/favourite" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <MdFavoriteBorder/><span className='ml-4'>Favourite</span></span>
              </Link>
            </li>

            <li>
              <Link to="/playlist" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <TbPlaylist/><span className='ml-4'>Playlist</span></span>
              </Link>
            </li>
            
            



            <li>
              <Link to="/musichistory" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
              <span className='flex items-center text-base ml-4'> <BiHistory/><span className='ml-4'>View History</span></span>
              </Link>
            </li>
            
            
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4 -mt-5 ">
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-gray-900 p-2 flex items-center justify-between mt-0">
          {/* Sidebar Button */}
          <button className="ml-2 text-white p-2 rounded-lg" onClick={toggleSidebar}>
            <FiMenu className="h-6 w-6" />
          </button>
          <Link to="/" className={`flex items-center text-white text-center font-bold text-2xl font-attractive mt-0w-1/6 ${showSidebar ? 'hidden' : ''}`}>
            <span className="text-indigo-500 font-extrabold ml-5 italic">MELODY</span>
            <span className="text-white font-bold italic">STREAM</span>
          </Link>
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-1/2 lg:w-1/3 mx-auto border-2 border-gray-800 hover:border-white">
            <input
              type="text"
              name="search"
              placeholder="Search Music..."
              className="w-full bg-transparent text-white focus:outline-none"
onChange={handleChange}
            />
            <button type="submit" className="bg-gray-800 text-white py-1 px-2 rounded-full ml-2 ">
              <FaSearch className="text-white" />
            </button>
          </form>

          {/* User Profile Picture or User Icon */}
          <div className="flex items-center ">
           
           
             
            
           <button onClick={toggleDropdownn}> 
             <MdOutlineSettings className="w-7 h-7 text-gray-400 mr-2 ml-5 " />
           
             </button>
         
            
            <div className="relative inline-block ml-2">
             
              {showDropdownn && (
                <div className="absolute right-0 mt-6 py-2 w-44 bg-gray-900 border-4 border-gray-600 rounded-md shadow-lg z-10">
                 
                  <Link
                    to="/music/profile"
                    className="block text-white hover:bg-gray-500"
                  >
                    <span className='flex items-center '> <CgProfile/>
                    <span className='ml-2'>Profile</span></span>
                  </Link>
                  <Link
                    to="/music/changepassword"
                    className="block text-white hover:bg-gray-500"
                  >
                    <span className='flex items-center '> <CgLock/>
                    <span className='ml-2'>Change Password</span></span>
                  </Link>
                  <Link onClick={logout}  className="block text-white hover:bg-gray-500">
                  <span className='flex items-center '> <MdLogout/>
                    <span className='ml-2'>Logout</span></span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <br />
        <div>{children}</div>
      </div>
    </div>
  );
}
