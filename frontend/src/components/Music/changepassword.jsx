import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`http://localhost:8000/api/admin/${userId}/changepassword`, {
        currentPassword,
        newPassword,
      });
      alert(response.data)
      console.log(response.data); // Handle the response from the server

      // Reset form fields and error state
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (error) {
      console.error(error);
      // Handle error response from the server
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sidebar>
    <div className="flex justify-center items-center h-screen bg-gray-900 -mt-10">
      <form className="bg-transparent border-4 border-gray-600 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-center text-blue-500 mb-8 font-semibold italic">Change Password</h2>
        <div className="mb-4">
          <label className="block  text-sm font-bold mb-2" htmlFor="currentPassword">
            Current Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3  bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="newPassword">
            New Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div></Sidebar>
  );
};

export default ChangePasswordForm;
