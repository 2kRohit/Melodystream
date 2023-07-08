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
      const response = await axios.get('http://localhost:8000/api/verifier/verifiedcontact');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching :', error);
    }
  };

  
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())||
    category.email.toLowerCase().includes(searchTerm.toLowerCase())||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())||
    formatDateTime(category.createdAt).toLowerCase().includes(searchTerm.toLowerCase())


  );
  return (
    <Sidebar>
      <div className="flex justify-center items-center h-full bg-gray-900">
        <div className="w-full  border-4 border-gray-600 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-blue-500 italic font-semibold flex items-center mx-auto mt-4">
              <span className="mr-2 ml-24 mb-2 mt-4">Verified Contact</span>
              
            </h1>
           
          </div>

         

          <div className="">
          <div className="flex items-center bg-gray-900 rounded-md ">
              
              <input
                type="text"
                className="bg-gray-900 text-white  focus:outline-none ml-1 w-40 -mt-6"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <table className="w-full bg-gray-900 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="p-2 text-white text-center">Name</th>
                  <th className="p-2 text-white text-center">Email</th>
                  <th className="p-2 text-white text-center">Description</th>
                  <th className="p-2 text-white text-center">Reply</th>
                  <th className="p-2 text-white text-center">Creation Time</th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="p-2">{category.name}</td>
                    <td className="p-2">{category.email}</td>
                    <td className="p-2">{category.description}</td>
                    <td className="p-2">{category.reply}</td>
                    <td className="p-2">{formatDateTime(category.createdAt)}</td>
                    
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
