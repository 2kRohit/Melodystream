import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const CategoryForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend to insert the category
      await axios.post('http://localhost:8000/api/video/categories', { name });

      // Reset the form after successful submission
      setName('');
      alert('Category inserted successfully!');
    } catch (error) {
      console.error('Error inserting category:', error);
      alert('Failed to insert category. Please try again.');
    }
  };

  return (
    <Sidebar><br /><br /><br /><br />
      <div className="flex justify-center items-center h-full bg-gray-900">
        <div className="bg-gray-800 shadow-md rounded-md px-8 py-6 w-80">
          <h1 className="text-3xl font-bold text-white text-center mb-6">Insert Category</h1>
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
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default CategoryForm;
