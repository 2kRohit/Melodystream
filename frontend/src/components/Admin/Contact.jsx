import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiTrash } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { BsPencilSquare} from 'react-icons/bs';
import { ImSpinner3 } from 'react-icons/im';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [busy,setbusy]=useState(false)
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactid,setcontactid]=useState()
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/verifier/unverifiedcontact');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching :', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setbusy(!busy)
    try {

     const res= await axios.post(`http://localhost:8000/api/verifier/verifycontact/${contactid}/${name}` );
     setbusy(false)

      setName('');
      alert(' inserted successfully!');
      setShowAddCategory(false)
      fetchCategories()

   
   
    } catch (error) {
      console.error('Error inserting :', error);
      alert('Failed to insert . Please try again.');
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
              <span className="mr-2 ml-24 mb-2 mt-4">Unverified Contact</span>
              
            </h1>
           
          </div>

          {showAddCategory && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-gray-900 shadow-md w-2/6  rounded-md px-8 py-6 border-4 border-gray-600 ">
                <h2 className="text-2xl font-bold text-white mb-4">Reply</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                    </label>
                    <textarea
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      rows={10}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-4/4 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none"
                      placeholder="Enter Reply"
                      required
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                {!busy?(    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Submit
                    </button>
                    ):<button className="bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"><ImSpinner3 className="animate-spin" /></button> }
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
                  <th className="p-2 text-white text-center">Creation Time</th>
                  <th className="p-2 text-white text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="p-2">{category.name}</td>
                    <td className="p-2">{category.email}</td>
                    <td className="p-2">{category.description}</td>
                    <td className="p-2">{formatDateTime(category.createdAt)}</td>
                    <td className="p-2 " onClick={()=>{ setShowAddCategory(!showAddCategory); setcontactid(category._id)}}>
                      <p
                        className="text-blue-500 hover:text-blue-600  font-bold  text-center  cursor-pointer"
                        
                      >
                   Reply  
                      </p>
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
