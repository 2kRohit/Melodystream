import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiTrash } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { MdOutlineDeleteForever } from 'react-icons/md';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddmood, setShowAddmood] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getmood');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend to insert the mood
    const res=  await axios.post('http://localhost:8000/api/music/addmood', { name });
    if (res.status===204){
      alert('Mood already exist')
  
    }else{
      // Reset the form after successful submission
      setName('');
      alert('Mood inserted successfully!');

      // Refresh the mood list
      fetchCategories();

      // Hide the add mood form
      setShowAddmood(false);}
    } catch (error) {
      console.error('Error inserting mood:', error);
      alert('Failed to insert mood. Please try again.');
    }
  };

  const handleDeletemood = async (moodId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this mood?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/music/mood/${moodId}`);
        alert('Mood deleted successfully');

        // Refresh the mood list
        fetchCategories();
      } catch (error) {
        console.error('Error deleting mood:', error);
        alert('Failed to delete mood. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((mood) =>
    mood.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="w-full max-w-lg border-4 border-gray-600 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-blue-500 italic font-semibold flex items-center mx-auto mt-4">
              <span className="mr-2 ml-24 mb-2 mt-4">Mood</span>
              
            </h1>
            <button
              className="text-white text-3xl font-bold hover:text-blue-300 mr-4 -mt-5"
              onClick={() => setShowAddmood(!showAddmood)}
            >
              <FiPlus />
            </button>
          </div>

          {showAddmood && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-gray-900 shadow-md rounded-md px-8 py-6 border-4 border-gray-600 ">
                <h2 className="text-2xl font-bold text-white mb-4">Add Mood</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Mood Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none"
                      placeholder="Enter mood name"
                      required
                    />
                  </div>
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
                      onClick={() => setShowAddmood(false)}
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
                placeholder="Search by mood"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <table className="w-full bg-gray-900 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="p-2 text-white text-center">Mood Name</th>
                  <th className="p-2 text-white text-center">Creation Time</th>
                  <th className="p-2 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((mood) => (
                  <tr key={mood.id}>
                    <td className="p-2">{mood.name}</td>
                    <td className="p-2">{formatDateTime(mood.createdAt)}</td>
                    <td className="p-2">
                      <div
                        className="text-red-500 hover:text-red-600 text-center font-bold text-2xl ml-7 cursor-pointer"
                        onClick={() => handleDeletemood(mood._id)}
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
