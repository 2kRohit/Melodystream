import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Sidebar from './Sidebar';
import SidebarForm from './SidebarForm';
import { useAuth, useNotification } from '../../hooks';
import { ImSpinner3 } from 'react-icons/im';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: '',
    videoFile: null,
    thumbnailFile: null,
  });
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const { updateNotification } = useNotification();
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
const [busy,setbusy]=useState(false)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/video/getcategories');
      setCategories(response.data);
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
    const isValidVideoFileType = file.type.startsWith('video/');

    setFormData((prevFormData) => ({
      ...prevFormData,
      videoFile: isValidVideoFileType ? file : null,
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
    const { title, description, tags, category, videoFile } = formData;
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (!tags.trim()) {
      errors.tags = 'Tags are required';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!videoFile) {
      errors.videoFile = 'Please upload a video file';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setbusy(!busy)
    const isValid = validateForm();

    if (isValid) {
      const { title, description, tags, category, videoFile, thumbnailFile } = formData;

      // Create form data object to send to the server
      const data = new FormData();
      data.append('title', title.trim());
      data.append('description', description.trim());
      data.append('tags', tags.trim());
      data.append('category', category);

      data.append('videoFile', videoFile);
      if (thumbnailFile) {
        data.append('thumbnailFile', thumbnailFile);
      }
      data.append('userId', userId);

      try {
        // Make a POST request to the server
        const response = await axios.post('http://localhost:8000/api/video/upload-video', data);
        updateNotification('success', response.message);
        alert('Video uploaded successfully');
        setbusy(false)
        // Reset form
        setFormData({
          title: '',
          description: '',
          tags: '',
          category: '',
          videoFile: null,
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
      accept: 'video/*,image/*',
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
    <SidebarForm>
      <div className="max-w-lg mx-auto bg-gray-900 p-12 shadow-2xl rounded-lg border-4 border-gray-600 mt-0">
        <h2 className="text-2xl font-bold mb-4 -mt-5 text-indigo-500 text-center italic">Upload Video</h2>
 
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
            <label htmlFor="tags" className="block mb-2 font-medium text-white">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.tags ? 'border-red-500' : 'focus:ring-blue-500'
              }`}
              required
              placeholder="Enter tags separated by commas"
            />
            {errors.tags && <p className="text-red-500">{errors.tags}</p>}
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
            <label htmlFor="videoFile" className="block mb-2 font-medium text-white">
              Video File
            </label>
            <Dropzone onDrop={handleFileChange} fileUploaded={!!formData.videoFile} />
            {errors.videoFile && <p className="text-red-500">{errors.videoFile}</p>}
          </div>
          <div>
            <label htmlFor="thumbnailFile" className="block mb-2 font-medium text-white">
              Thumbnail File (optional)
            </label>
            <Dropzone onDrop={handleThumbnailChange} fileUploaded={!!formData.thumbnailFile} />
          </div>{!busy? (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Upload
          </button>
          ):<button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"><ImSpinner3 className="animate-spin" /></button> }
        </form>
      </div>
    </SidebarForm>
  );
};

export default UploadVideo;
