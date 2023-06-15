import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { FaUserCircle } from 'react-icons/fa';

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  const [search,setSearch]=useState();
  const handleChange = (e) => {
    
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`)
    
  };
  const [showSidebar, setShowSidebar] = useState(false);
  
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
  // useEffect(() => {
  //   if (!isLoggedIn && !isVerified) navigate('/');
  // }, [isLoggedIn, isVerified, navigate]);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Sidebar */}
      <div className={`sticky top-0 h-screen bg-gray-800 w-1/6 ${showSidebar ? '' : 'hidden'}`}>
        {/* Sidebar content */}
        <div className="p-4 overflow-y-auto">
          <ul className="space-y-2">
            
            <li>
              <Link to="/auth/video" className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/auth/upload-video" className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600">
                Upload Videos
              </Link>
            </li>
            <li>
              <Link to="/addcategory" className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600">
                Add Category
              </Link>
            </li>
            <li>
              <a
                className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600 flex items-center"
                onClick={toggleDropdown}
              >
                My Videos
                <FiMenu className={`ml-1 transform ${showDropdown ? 'rotate-180' : ''}`} />
              </a>
              <ul className={`mt-2 space-y-2 ${showDropdown ? '' : 'hidden'}`}>
                <li>
                  <Link
                    to="/auth/unverified-videos"
                    className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600"
                  >
                    Unverified Videos
                  </Link>
                </li>
                <li>
                  <Link to="/auth/verified-videos" className="block bg-gray-700 py-2 px-4 rounded-md hover:bg-gray-600">
                    Verified Videos
                  </Link>
                </li>
              </ul>
            </li>
            
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4 mt-n5">
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-gray-800 p-2 flex items-center justify-between mt-0">
          {/* Sidebar Button */}
          <button className="ml-2 bg-gray-600 text-white p-2 rounded-lg" onClick={toggleSidebar}>
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-1/2 lg:w-1/3 mx-auto border border-gray-600">
            <input
              type="text"
              name="search"
              placeholder="Search videos..."
              className="w-full bg-transparent text-white focus:outline-none"
onChange={handleChange}
            />
            <button type="submit" className="bg-gray-800 text-white py-1 px-2 rounded-full ml-2 ">
              <FaSearch className="text-white" />
            </button>
          </form>

          {/* User Profile Picture or User Icon */}
          <div className="flex items-center">
            {authInfo.profile?.profilePicture ? (
              <img
                src={`http://localhost:8000/uploads/profile/${authInfo.profile.profilePicture}`}
                alt="Profile"
                className="h-8 w-8 rounded-full"
                onClick={toggleDropdownn}
              />
            ) : (<button onClick={toggleDropdownn}> 
             <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" /></button>
            )}
            
            <div className="relative inline-block ml-2">
             
              {showDropdownn && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                  <span className="ml-2 text-white text-sm">
              Welcome, {authInfo.profile?.name}
            </span>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-800"
                  >
                    Profile
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
