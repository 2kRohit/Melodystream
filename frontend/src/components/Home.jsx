import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Container from './Container';
import Navbar from './user/Navbar';

const Home = () => {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;

  const navigate = useNavigate();

  const navigateToVerification = () => {
    navigate('/auth/verification', { state: { user: authInfo.profile } });
  };

  return (
    <>
    <Navbar />
    <div className="bg-gray-900 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <Container>
        {isLoggedIn && !isVerified ? (
          <p className="text-lg text-center bg-blue-50 p-2">
            It looks like you haven't verified your account,{' '}
            <button
              onClick={navigateToVerification}
              className="text-blue-500 font-semibold hover:underline"
            >
              click here to verify your account.
            </button>
          </p>
        ) : (
          <div>
            <h1 className="text-4xl font-bold mb-4 text-white dark:text-white">
              Welcome to MelodyStream!
            </h1>
            <p className="text-lg text-gray-300 dark:text-gray-300">
              Discover and stream your favorite audio and video content.
            </p>
            <div className="mt-8 flex space-x-4">
              {isLoggedIn && isVerified ? (
                <>
                  <Link
                    to="/auth/music"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-6 px-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore Music
                  </Link>
                  <Link
                    to="/auth/video"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore Video
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-6 px-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore Music
                  </Link>
                  <Link
                    to="/auth/signin"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore Video
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </div></>
  );
};

export default Home;
