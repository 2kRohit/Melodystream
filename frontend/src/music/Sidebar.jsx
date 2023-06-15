import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';


export default function Sidebar({children}) {
    const navigate=useNavigate();
    const { authInfo } = useAuth();
    const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
    useEffect(() => {
        if (!isLoggedIn && !isVerified) navigate("/");
       
      }, [isLoggedIn,isVerified]);
    const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
      };
    
      const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };
    
  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen">
    {/* Search Bar and Sidebar Button */}
    <div className="sticky top-0 z-10 bg-gray-800 p-2 flex items-center justify-between">
      {/* Sidebar Button */}
      <button className="ml-2 bg-gray-600 text-white p-2 rounded-lg" onClick={toggleSidebar}>
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-1/2 lg:w-1/3 mx-auto">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full bg-transparent text-white focus:outline-none"
        />
        <button className="bg-gray-600 py-1 px-2 rounded-full ml-2">
          <BsSearch className="text-white" />
        </button>
      </div>
    </div>

    {/* Content Area */}
    <div className="flex flex-grow">
      {/* Sidebar */}
      <div className={`sticky top-0 h-screen bg-gray-800 w-1/6 ${showSidebar ? '' : 'hidden'}`}>
        {/* Sidebar content */}
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-700">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-700">
                Videos
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-700">
                Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700 flex items-center"
                onClick={toggleDropdown}
              >
                Dropdown
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 ${showDropdown ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {showDropdown && (
                <div className="bg-gray-700 rounded-md p-2 mt-2">
                  <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-600">
                    Option 1
                  </a>
                  <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-600">
                    Option 2
                  </a>
                  <a href="#" className="block py-2 px-4 rounded-md hover:bg-gray-600">
                    Option 3
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Video Feed */}
      <div className={`flex flex-wrap p-4 w-full ${showSidebar ? 'md:w-5/6' : 'w-full'}`}>
        {children}
        </div>
        
      </div>
    </div>
  )
}
