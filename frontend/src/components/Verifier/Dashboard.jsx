import React from 'react';
import { RiUserLine, RiVideoLine, RiMusic2Line, RiSettings2Line } from 'react-icons/ri';
import Sidebar from './Sidebar';

const VerifierDashboardContent = () => {
  return (
    <Sidebar>
    <div className="bg-gray-900 text-white p-6">
      <h1 className="text-2xl mx-auto text-center font-semibold mb-4 italic text-blue-500">Welcome Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <div className="flex items-center text-gray-400">
            <RiUserLine className="mr-2" />
            <p>Total: 1000</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2">Videos</h2>
          <div className="flex items-center text-gray-400">
            <RiVideoLine className="mr-2" />
            <p>Total: 500</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2">Music</h2>
          <div className="flex items-center text-gray-400">
            <RiMusic2Line className="mr-2" />
            <p>Total: 250</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2">Settings</h2>
          <div className="flex items-center text-gray-400">
            <RiSettings2Line className="mr-2" />
            <p>Total: 10</p>
          </div>
        </div>
      </div>
    </div></Sidebar>
  );
};

export default VerifierDashboardContent;
