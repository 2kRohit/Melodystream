import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Sidebar from './Sidebar';

import { useAuth, useNotification } from '../../hooks';

const UploadMusic = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    
    category: '',
    language: '',
     artist:'',
    musicFile: null,
    thumbnailFile: null,
  });

  const { updateNotification } = useNotification();
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [language, setlanguage] = useState([]);
  const [artist, setartist] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchlanguage();
    fetchartist();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getcategory');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchlanguage = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getlanguage');
      setlanguage(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchartist = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/music/getartist');
      setartist(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (files) => {
    const file = files[0];
    const isValidMusicFileType = file.type.startsWith('audio/');

    setFormData((prevFormData) => ({
      ...prevFormData,
      musicFile: isValidMusicFileType ? file : null,
    }));
  };

  const handleThumbnailChange = (files) => {
    const file = files[0];
    const isValidImageFileType = file.type.startsWith('image/');

    setFormData((prevFormData) => ({
      ...prevFormData,
      thumbnailFile: isValidImageFileType ? file : null,
    }));
  };

  const validateForm = () => {
    const { title, description,  category, musicFile,language,artist ,thumbnailFile} = formData;
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!language.trim()) {
        errors.title = 'Language is required';
      }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    

    if (!category) {
      errors.category = 'Category is required';
    }
    if (!artist) {
        errors.artist = 'Artist is required';
      }

    if (!musicFile) {
      errors.musicFile = 'Please upload an audio file';
    }
    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload an image file';
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      const { title, description,category, musicFile, thumbnailFile,language ,artist} = formData;

      // Create form data object to send to the server
      const data = new FormData();
      data.append('title', title.trim());
      data.append('description', description.trim());
     
      data.append('language', language);
      data.append('category', category);
      data.append('artist', artist);

      data.append('musicFile', musicFile);
      if (thumbnailFile) {
        data.append('thumbnailFile', thumbnailFile);
      }
     

      try {
        // Make a POST request to the server
        console.log(musicFile)
        const response = await axios.post('http://localhost:8000/api/music/upload-music', data);
        updateNotification('success', response.message);
        alert('Music uploaded successfully');

        // Reset form
        setFormData({
          title: '',
          description: '',
         
          category: '',
          language: '',
          artist:'',
          musicFile: null,
          thumbnailFile: null,
        });
        setErrors({});
      } catch (error) {
        // Handle the error
        updateNotification('error', error.message);
        console.error(error);
      }
    }
  };

  const Dropzone = ({ onDrop, fileUploaded }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: 'audio/*,image/*',
    });

    return (
      <div
        {...getRootProps()}
        className={`p-4 rounded-lg border-2 ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the file here</p>
        ) : (
          <p>Drag and drop file here, or click to browse</p>
        )}
        {fileUploaded && <p className="text-green-500 mt-2">File uploaded!</p>}
      </div>
    );
  };

  return (
    <Sidebar>
      <div className="max-w-lg mx-auto bg-gray-900 p-12 shadow-2xl rounded-lg border-4 border-gray-600 mt-0">
        <h2 className="text-2xl font-semibold mb-4 -mt-5 text-blue-500 text-center italic">Upload Music</h2>
 
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-white">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.title ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
              placeholder="Enter a title"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.description ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
              placeholder="Enter a description"
            ></textarea>
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="block mb-2 font-medium text-white">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.category ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="language" className="block mb-2 font-medium text-white">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.language ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select a language</option>
              {language.map((languag) => (
                <option key={languag.id} value={languag.name}>
                  {languag.name}
                </option>
              ))}
            </select>
            {errors.language && <p className="text-red-500">{errors.language}</p>}
          </div>
          <div>
            <label htmlFor="Artist" className="block mb-2 font-medium text-white">
              Artist
            </label>
            <select
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.artist ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select an Artist</option>
              {artist.map((artist) => (
                <option key={artist.id} value={artist.name}>
                  {artist.name}
                </option>
              ))}
            </select>
            {errors.artist && <p className="text-red-500">{errors.artist}</p>}
          </div>
          <div>
            <label htmlFor="musicFile" className="block mb-2 font-medium text-white">
              Music File
            </label>
            <Dropzone onDrop={handleFileChange} fileUploaded={!!formData.musicFile} />
            {errors.musicFile && <p className="text-red-500">{errors.musicFile}</p>}
          </div>
          <div>
            <label htmlFor="thumbnailFile" className="block mb-2 font-medium text-white">
              Thumbnail File
            </label>
            <Dropzone onDrop={handleThumbnailChange} fileUploaded={!!formData.thumbnailFile} />
            {errors.thumbnailFile && <p className="text-red-500">{errors.thumbnailFile}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Upload
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default UploadMusic;
