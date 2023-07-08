import React, { useState } from 'react';
import Navbar from './user/Navbar';
import axios from 'axios';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        console.log(formData)
        // Send a POST request to the backend to insert the category
        const res=await axios.post('http://localhost:8000/api/verifier/contact',formData);
        
        if (res){
          alert('Successfully submitted Our team  will contact you soon')
          setFormData({
            name: '',
            email: '',
            description: ''
          });
      
        }
      } catch (error) {
        console.error('Error inserting details:', error.message);
        alert('Failed to insert ');
      }
   
  };

  return (
    <div>
        <Navbar/>
    <div className="bg-gray-900  text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 rounded-md p-8 w-2/5 border-4 border-gray-600">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded focus:outline-none focus:ring-blue-500 bg-gray-700"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded focus:outline-none focus:ring-blue-500 bg-gray-700"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block font-medium mb-1">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full h-32 px-3 py-2 rounded focus:outline-none focus:ring-blue-500 bg-gray-700"
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div></div>
  );
};

export default ContactUsPage;
