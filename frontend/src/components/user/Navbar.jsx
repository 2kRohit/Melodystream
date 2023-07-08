import React, { useState } from "react";
import { CgDarkMode } from "react-icons/cg";
import {FaBars} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import Container from "../Container";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
  <nav className="bg-gray-900 text-white
  ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
        <Link to="/" className="flex items-center text-white font-bold text-3xl font-attractive">
            <span className="text-indigo-500 font-extrabold italic">MELODY</span><span className="italic text-white font-bold">STREAM</span>
          </Link>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <Link to='/' className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to='/contact' className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            <Link to='/about' className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
{isLoggedIn ? (<>
   
   <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log out
                </button></>
              ) : (
                <Link
                  className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                  to="/auth/signin"
                >
                  Login
                </Link>
              )}
          </div>
        </div>
        <div className="md:hidden">
          <div className="relative">
            <button className="text-white hover:text-gray-300 focus:outline-none dark:text-gray-300" onClick={toggleMenu}>
            <FaBars />
            </button>
            {isOpen && (
              <div className="absolute z-10 right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md">
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
                  Option 1
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
                  Option 2
                </a>
                {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  Log out
                </button>
              ) : (
                <Link
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                  to="/auth/signin"
                >
                  Login
                </Link>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </nav>
  </div>
  );
}
