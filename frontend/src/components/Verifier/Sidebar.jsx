import React, { useEffect, useState } from 'react';
import { FaFileVideo, FaHistory, FaSearch } from 'react-icons/fa';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { FaUserCircle } from 'react-icons/fa';
import {MdDashboard, MdLibraryAdd, MdLogout, MdOutlinePermContactCalendar, MdOutlineSettings, MdOutlineSettingsSuggest, MdVideoLibrary} from "react-icons/md"
import {RiDashboardFill, RiUserFill, RiUserFollowFill, RiUserSettingsFill, RiVideoUploadLine} from "react-icons/ri"
import {GiHamburgerMenu} from "react-icons/gi"
import {IoMdArrowDropdown, IoMdSettings} from "react-icons/io"
import {FiSave} from "react-icons/fi"
import { CgLock, CgProfile } from 'react-icons/cg';
import { GoReport } from 'react-icons/go';
import axios from 'axios';
export default function Sidebar({ children }) {
  const navigate = useNavigate();
  
  const { authInfo,handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  const [search,setSearch]=useState();
  const [showreport,setshowreport]=useState(false);
  const [showcontact,setshowcontact]=useState(false);
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const logout = () => {
    handleLogout();

   
  };
  const isuser=()=>{
    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");
    if (!token || role!=="verifier") navigate('/');
    
  }
  useEffect(()=>{
    isuser()
    
  },[logout])
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`)
    
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
               
              />
             <div className=''> {formdata.name}</div>
             <div className=''> {formdata.email}</div></>
            ) : (<>
             <FaUserCircle className="w-24 h-24 text-gray-500 mx-auto" />
              <div className=''> {formdata.name}</div>
              <div className=''> {formdata.email}</div>
              </>
            )}</div></div>
          <div className="border-t border-gray-600 mb-2"></div>
          <ul className="space-y-2">
            
            <li>
              <Link to="/verifier/dashboard" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
                <span className='flex items-center text-base ml-4'> <RiDashboardFill/><span className='ml-4'>Dashboard</span></span>
              </Link>
            </li>
            <li>
              <Link to="/verifier/user" className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600">
                <span className='flex items-center text-base ml-4'> <RiUserFill/><span className='ml-4'>User</span></span>
              </Link>
            </li>
            
           
            <li>
              <a
                className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600 flex items-center"
                onClick={toggleDropdown}
              >
             <span className='flex items-center text-base ml-4'> <FaFileVideo/><span className='ml-4'>Videos</span></span>
                <IoMdArrowDropdown className={`ml-1 mt-1 transform ${showDropdown ? 'rotate-180' : ''}`} />
              </a>
              <ul className={`mt-0 ml-12 bg-gray-800  space-y-1 ${showDropdown ? '' : 'hidden'}`}>
               
                <li>
                  <Link to="/verifier/unverifiedvideos" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                    Unverified Videos
                  </Link>
                </li>
                <li>
                  <Link to="/verifier/verifiedvideos" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                   Verified  Videos
                  </Link>
                </li>
                <li>
                  <Link to="/verifier/rejectedvideos" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                     Rejected Videos
                  </Link>
                </li>
              </ul>
            </li>
            

            <li>
              <a
                className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600 flex items-center"
                onClick={()=>{setshowreport(!showreport)}}
              >
             <span className='flex items-center text-base ml-4'> <GoReport/><span className='ml-4'>Reports</span></span>
                <IoMdArrowDropdown className={`ml-1 mt-1 transform ${showreport ? 'rotate-180' : ''}`} />
              </a>
              <ul className={`mt-0 ml-12 bg-gray-800  space-y-1 ${showreport ? '' : 'hidden'}`}>
               
                <li>
                  <Link to="/verifier/unverifiedreports" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                  Unverified Reports
                  </Link>
                </li>
                <li>
                  <Link to="/verifier/verifiedreports" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                   Verified  Reports
                  </Link>
                </li>
               
              </ul>
            </li>

            <li>
              <a
                className="block bg-transparent py-1  px-4 rounded-md hover:bg-gray-600 flex items-center"
                onClick={()=>{setshowcontact(!showcontact)}}
              >
             <span className='flex items-center text-base ml-4'> <MdOutlinePermContactCalendar/><span className='ml-4'>Contact</span></span>
                <IoMdArrowDropdown className={`ml-1 mt-1 transform ${showcontact ? 'rotate-180' : ''}`} />
              </a>
              <ul className={`mt-0 ml-12 bg-gray-800  space-y-1 ${showcontact ? '' : 'hidden'}`}>
                <li>
                  <Link
                    to="/verifier/contact"
                    className="block bg-transparent py-1 border-b-0 px-4 hover:bg-gray-600"
                  >
                   Unverified Contact
                  </Link>
                </li>
                <li>
                  <Link to="/verifier/verifiedcontact" className="block bg-transparent py-1  px-4 border-b-0 hover:bg-gray-600">
                     Verified Contact
                  </Link>
                </li>
              </ul>
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
         
          {/* User Profile Picture or User Icon */}
          <div className="flex items-center">
           
            
             
            
           <button onClick={toggleDropdownn}> 
             <MdOutlineSettings className="w-7 h-7  " />
           
             </button>
         
            
            <div className="relative inline-block ml-2">
             
              {showDropdownn && (
                <div className="absolute right-0 mt-6 py-2 w-44 border-4 border-gray-600 bg-gray-900 rounded-md shadow-lg z-10">
                 
                  <Link
                    to="/verifier/profile"
                    className="block text-white hover:bg-gray-500"
                  >
                    <span className='flex items-center '> <CgProfile/>
                    <span className='ml-2'>Profile</span></span>
                  </Link>
                  <Link
                    to="/verifier/changepassword"
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
