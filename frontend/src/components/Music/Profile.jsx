import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCamera, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../../hooks';
import Sidebar from './Sidebar';

const Profile = () => {
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;

  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        const { name, email, bio, profilePicture } = response.data;
        setFormData({ name, email, bio });
        setProfilePicture(profilePicture);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Fetch user data
    if (userId) {
      fetchUser();
     
    }
  }, [userId]);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const newFormData = new FormData();
      newFormData.append('name', formData.name);
      newFormData.append('email', formData.email);
      newFormData.append('bio', formData.bio);

      if (profilePicture) {
        newFormData.append('profilePicture', profilePicture);
      }

      const response = await axios.put(`http://localhost:8000/api/user/${userId}`, newFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { name, email, bio, profilePicture: updatedProfilePicture } = response.data;
      setFormData({ name, email, bio });
      setProfilePicture(updatedProfilePicture); // Update the profilePicture state here
      //setUpdateSuccess(true);
      alert("Profile updated");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Sidebar>
      <div className="flex items-center justify-center h-screen bg-gray-900">
   
        <div className={`max-w-lg w-full mx-auto bg-gray-800 shadow-lg rounded-lg p-8 text-white ${isEditing ? 'mb-0' : 'mb-36'}`}>

          <div className="flex flex-col items-center mb-8">
            {isEditing ? (
              <>
                {profilePicture ? (
                  <img
                    src={`http://localhost:8000/uploads/profile/${profilePicture}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-gray-300 bg-gray-700 mb-4">
                    <FaUser className="text-4xl" />
                  </div>
                )}
                <label htmlFor="profilePictureInput" className="cursor-pointer">
                  <input
                    type="file"
                    id="profilePictureInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                  <span className="text-blue-500 underline">Change Profile Picture</span>
                </label>
              </>
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-gray-300 bg-gray-700 mb-4">
                {profilePicture ? (
                  <img
                    src={`http://localhost:8000/uploads/profile/${profilePicture}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-4xl" />
                )}
              </div>
            )}
          </div>
          <div className="my-8">
            <h2 className="text-2xl font-bold mb-2 text-center">Profile Information</h2>
            <div className="mb-4">
              <label htmlFor="name" className="text-gray-400 font-semibold mb-1 block">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-lg font-semibold text-center">{formData.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 font-semibold mb-1 block">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="text-gray-400 text-center">{formData.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="bio" className="text-gray-400 font-semibold mb-1 block">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  id="bio"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              ) : (
                <p className="text-gray-400 text-center">{formData.bio}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {isEditing ? (
              <button
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                onClick={handleSaveProfile}
              >
                <FaSave className="mr-1" />
                Save
              </button>
            ) : (
              <button
                className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded mr-2"
                onClick={handleEditProfile}
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
            )}
          </div>
          {updateSuccess && (
            <p className="text-green-500 text-center mt-4">Profile updated successfully!</p>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default Profile;
