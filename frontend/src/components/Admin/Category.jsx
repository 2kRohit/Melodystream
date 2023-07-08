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
      const response = await axios.get('http://localhost:8000/api/admin/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend to insert the category
      const res=await axios.post('http://localhost:8000/api/video/categories', { name });
      if (res.status===204){
        alert('Category already exist')
    
      }else{
      // Reset the form after successful submission
      setName('');
      alert('Category inserted successfully!');

      // Refresh the category list
      fetchCategories();

      // Hide the add category form
      setShowAddCategory(false);}
    } catch (error) {
      console.error('Error inserting category:', error);
      alert('Failed to insert category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/category/${categoryId}`);
        alert('Category deleted successfully');

        // Refresh the category list
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
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
        <div className="w-full max-w-lg border-4 border-gray-600 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-blue-500 italic font-semibold flex items-center mx-auto mt-4">
              <span className="mr-2 ml-24 mb-2 mt-4">Categories</span>
              
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
                <h2 className="text-2xl font-bold text-white mb-4">Add Category</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none"
                      placeholder="Enter category name"
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
                placeholder="Search by category"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <table className="w-full bg-gray-900 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="p-2 text-white text-center">Category Name</th>
                  <th className="p-2 text-white text-center">Creation Time</th>
                  <th className="p-2 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="p-2">{category.name}</td>
                    <td className="p-2">{formatDateTime(category.createdAt)}</td>
                    <td className="p-2">
                      <div
                        className="text-red-500 hover:text-red-600 text-center font-bold text-2xl ml-7 cursor-pointer"
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
