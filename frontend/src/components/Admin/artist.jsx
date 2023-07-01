import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiTrash } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { MdOutlineDeleteForever } from 'react-icons/md';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getartist');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching artist:', error);
    }
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('selectedImage', selectedImage);
  
      // Send a POST request to the backend to insert the artist
      await axios.post('http://localhost:8000/api/music/addartist', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Reset the form after successful submission
      setName('');
      setSelectedImage(null);
      alert('Artist inserted successfully!');
  
      // Refresh the artist list
      fetchCategories();
  
      // Hide the add artist form
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error inserting artist:', error);
      alert('Failed to insert artist. Please try again.');
    }
  };
  

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this artist?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/music/artist/${categoryId}`);
        alert('artist deleted successfully');

        // Refresh the category list
        fetchCategories();
      } catch (error) {
        console.error('Error deleting artist:', error);
        alert('Failed to delete artist. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <Sidebar>
      <div className="flex justify-center items-center h-full bg-gray-900">
        <div className="w-4/6 border-4 border-gray-600 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-blue-500 italic font-semibold flex items-center mx-auto mt-4">
              <span className="mr-2 ml-24 mb-2 mt-4">Artist</span>
              
            </h1>
            <button
              className="text-white text-3xl font-bold hover:text-blue-300 mr-4 -mt-5"
              onClick={() => setShowAddCategory(!showAddCategory)}
            >
              <FiPlus />
            </button>
          </div>

          {showAddCategory && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-gray-900 shadow-md rounded-md px-8 py-6 border-4 border-gray-600 ">
                <h2 className="text-2xl font-bold text-white mb-4">Add Artist</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none"
                      placeholder="Enter artist name"
                      required
                    />

                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Upload Image
                    </label>
                  <input
  type="file"
  id="image"
  name="image"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none"
  required
/></div>

                  <div className="flex justify-center space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
                      onClick={() => setShowAddCategory(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="">
          <div className="flex items-center bg-gray-900 rounded-md ">
              
              <input
                type="text"
                className="bg-gray-900 text-white  focus:outline-none ml-1 w-40 -mt-6"
                placeholder="Search by Artist"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <table className="w-full bg-gray-900 rounded-lg text-center justify-center">
              <thead>
                <tr>
                <th className="p-4 text-white text-center">Image</th>
                  <th className="p-4 text-white text-center">Artist</th>
                  <th className="p-4 text-white text-center">Creation Time</th>
                  <th className="p-4 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="p-4"><img 
                src={`http://localhost:8000/${category.imagePath}`}
                alt="Profile"
                className="h-12 w-12 rounded-full mx-auto cursor-pointer"
                
              /></td>
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">{formatDateTime(category.createdAt)}</td>
                    <td className="p-4">
                      <div
                        className="p-4 text-red-500 hover:text-red-600 text-center  mx-auto font-bold text-2xl ml-20 cursor-pointer"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                      <MdOutlineDeleteForever/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default CategoryForm;
