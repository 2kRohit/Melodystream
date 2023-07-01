import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { RiEyeLine } from 'react-icons/ri';

import { BsFillFileEarmarkSpreadsheetFill, BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';




const ViewVerifiedVideos = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get('videoId');
  const [video, setVideo] = useState(null);
 
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const videoRef = useRef(null);
  const [reports, setreports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyform,setverifyform]=useState(false)
  
  const fetchReports = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/verifier/reports/${videoId}`);
      setreports(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/viewvideo/${videoId}`);
      console.log('Response:', response.data);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

 const navigate=useNavigate()

  useEffect(() => {
    fetchVideo();
    fetchReports();
  }, []);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideo((prevVideo) => ({ ...prevVideo, duration }));
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDuration = (duration) => {
    if (duration >= 3600) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours} hr ${minutes} min`;
    } else if (duration >= 60) {
      const minutes = Math.floor(duration / 60);
      return `${minutes} min`;
    } else {
      return `${duration} sec`;
    }
  };

  
  const handleReject = () => {
    setShowRejectionForm(true);
  };

  const handleSubmitRejection = async (event) => {
    event.preventDefault();
    // Implement logic to submit rejection reason and handle form submission
    try {
        const confirm=window.confirm("Do you want to submit the reason")
        if(confirm){
        const response = await axios.patch(`http://localhost:8000/api/verifier/reject/${videoId}`, {
            reason: rejectionReason,
          });
      console.log('Rejection Reason:', rejectionReason);
      // Reset the form and hide it
      fetchVideo();
      setRejectionReason('');
      setShowRejectionForm(false);}
    } catch (error) {
      console.error('Error submitting rejection:', error);
    }
  };
const verifyreport=async(userId)=>{
  try {
    const confirm=window.confirm("Do you want to verify")
    if(confirm){
    const response = await axios.patch(`http://localhost:8000/api/verifier/verifyreports/${videoId}/${userId}`);
alert('verified')
  fetchVideo();
  fetchReports();
 }
} catch (error) {
  console.error('Error :', error);
  alert('error')
}
};


  const handleverify = async (event) => {
    event.preventDefault();
    // Implement logic to submit rejection reason and handle form submission
    try {
        const confirm=window.confirm("Do you want to verify")
        if(confirm){
        const response = await axios.patch(`http://localhost:8000/api/verifier/verify/${videoId}`);
   
      // Reset the form and hide it
      fetchVideo();
     }
    } catch (error) {
      console.error('Error :', error);
      alert('error')
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredreports = reports.filter(
    (report) =>
      report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase())
 
  );

  if (!video) {
    return (
      <Sidebar>
        <h1 className="text-center text-3xl text-blue-600 italic p-2 mb-1 mt-1">Video Details</h1>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-xl">Loading...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <h1 className="text-center text-3xl text-blue-500 italic p-2 mb-1 mt-1 font-semibold">Video Details</h1>
      <div className="flex justify-center items-center text-justify">
        <div className="max-w-6xl w-full bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex">
            <div className="w-2/3">
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  muted
                  onLoadedMetadata={handleVideoLoaded}
                  ref={videoRef}
                >
                  <source src={`http://localhost:8000/${video.videoPath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <h1 className="text-4xl  text-white mb-4 mt-4">{video.title}</h1>
              <p className="text-gray-300 ">{video.description}</p>
              <div className='flex mx-auto float-right mr-4'>
              <div className="mt-4">
                
                  
                <button
                  onClick={() => setShowRejectionForm(true)}
                  className={`bg-red-500 hover:bg-red-600 text-white mr-4 mx-auto font-medium py-2 
                  px-4 rounded-md mt-4 ${showRejectionForm || video.reason ? 'hidden':''}`}
                >
                  Reject
                </button>
              </div>
              <div className="mt-4">
                
                  
                <button
                  onClick={handleverify}
                  className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2 mx-auto
                  px-4 rounded-md mt-4 ${video.status==="verified" || showRejectionForm ? 'hidden':''}`}
                >
                  Verify
                </button>
              </div>
              {showRejectionForm && (
                <form onSubmit={handleSubmitRejection}>
                  <div className="mt-4 border-4 border-gray-600 mx-auto">
                    
                    <textarea
                      value={rejectionReason}
                      onChange={(event) => setRejectionReason(event.target.value)}
                      className="outline-none bg-gray-900 rounded-md p-2 w-full"
                      placeholder="Enter the reason for rejection"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="mt-4 flex item-center ">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 mr-5 ml-12"
                    >
                      Submit Rejection
                    </button>
                    <button
                      
                      onClick={()=>{setShowRejectionForm(false)}}
                      className="bg-gray-500 hover:bg-gray-600 text-white  font-medium py-2 px-4 "
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              </div><br/>
              <div className={`w-full max-w-3xl overflow-x-auto border-4 border-gray-600 shadow-2xl mt-20 ${reports.length>0?'':'hidden'}`}>
        <h2 className="text-center text-2xl text-blue-500 italic p-1 mb-0 mt-2 font-semibold"> Reports</h2>
          <div className="flex items-center justify-between mb-0">
            <div className="relative flex items-center mt-0 ">
             
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
                className=" px-1 w-64 py-2 rounded-lg bg-gray-900  text-white focus:outline-none"
              />
            
            </div>
          </div>
          {filteredreports.length === 0 ? (
            <p className="text-white text-center">No data available!</p>
          ) : (
            <table className="w-full bg-gray-900 rounded-lg">
              <thead>
                <tr>
                <th className="p-2 text-white text-center">Profile</th>
                  <th className="p-2 text-white text-center">Reported by</th>
                  <th className="p-2 text-white text-center">Reason</th>
                  <th className="p-2 text-white text-center">file</th>
    
                  <th className="p-2 text-white text-center">Reported Date</th>
                  <th className="p-2 text-white text-center">Actions</th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredreports.map((report) => (
                  <tr
                    key={report.id}
                   
                  >
                     <td className="p-4 text-center">
                    {report.user?.profilePicture ? (
              <>
              <img
               onClick={()=>{navigate(`/verifier/userprofile?uId=${report.user._id}`)}}
                src={`http://localhost:8000/uploads/profile/${report.user.profilePicture}`}
                alt="Profile"
                className="h-12 w-12 rounded-full mx-auto cursor-pointer"
                
              /></>
            
            ) : (<>
             <FaUserCircle
              onClick={()=>{navigate(`/verifier/userprofile?uId=${report.user._id}`)}}
              className="w-12 h-12 text-gray-500 mx-auto cursor-pointer" />
            
              </>
            )}
                   </td>
                    
                    <td className="p-4 text-center">{report.user.name}</td>
                    <td className="p-4 text-center">{report.reason}</td>
                    <td className="p-4 text-center" >
                    {report.filePath ? (     <button
     onClick={()=>{window.open(`http://localhost:8000/${report.filePath}`, '_blank',`width=${900},height=${700}`);}}> <BsFillFileEarmarkTextFill/></button>
                    ):(<p>No file</p>)}</td>
                    


                    <td className="p-4 text-center">{formatDateTime(report.timestamp)}</td>
                    <td className="p-4 text-center ">
                      <button onClick={()=>{verifyreport(report.user._id)}}
                        className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white 
                        font-bold py-2 px-4 rounded ${report.status==="unverified"?'':'hidden'}`}>
                        verify
                      </button>
                 
              
                     <p className={`${report.status==="verified"?'':'hidden'}`}> Already verified</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
            </div>
            <div className="w-1/3 bg-gray-900 px-6 py-4">
              {video.thumbnailPath && (
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={`http://localhost:8000/${video.thumbnailPath}`}
                    alt="Thumbnail"
                    className="h-40 w-40 rounded-md shadow-lg"
                  />
                </div>
              )}
              
              <div className="flex items-center mt-8">
                <span className="text-gray-500 text-sm">Category:</span>
                <span className="text-gray-300 text-sm ml-2">{video.category}</span>
              </div>
              {video.duration && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-500 text-sm">Duration:</span>
                  <span className="text-gray-300 text-sm ml-2">{formatDuration(video.duration)}</span>
                </div>
              )}
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Upload Date:</span>
                <span className="text-gray-300 text-sm ml-2">{formatDateTime(video.timestamp)}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 text-sm">Tags:</span>
                <div className="flex flex-wrap ml-2">
                  {video.tags &&
                    video.tags.split(',').map((tag, index) => (
                      <Link
                        key={index}
                        to={`/tag?q=${tag.trim()}`}
                        className="text-blue-600 text-lg bg-transparent px-0 py-0 rounded-md mr-1 mb-0"
                      >
                        #{tag.trim()}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Views:</span>
                <span className="text-gray-300 text-sm ml-2">{video.views}</span>
              </div>
              <div className="flex items-center mt-2">
                <Link to={`/viewvideo?videoId=${video._id}`}>
                  <span className="text-gray-500 text-sm">Comments:</span>
                  <span className="text-gray-300 text-sm ml-2">{video.comments.length}</span>
                </Link>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Likes:</span>
                <span className="text-gray-300 text-sm ml-2">{video.likes.length}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Dislikes:</span>
                <span className="text-gray-300 text-sm ml-2">{video.dislikes.length}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Reports:</span>
                <span className="text-gray-300 text-sm ml-2">{reports ? reports.length : 'Loading...'}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Status:</span>
                <span className="text-gray-300 text-sm ml-2">{video.status}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">Visibility:</span>
                <span className="text-gray-300 text-sm ml-2">{video.visibility}</span>
              </div>
              <div className={`flex items-center mt-2 ${!video.reason ? 'hidden':''}`}>
                <span className="text-gray-500 text-sm">Reason:</span>
                <span className="text-gray-300 text-sm ml-2">{video.reason}</span>
              </div>
             
            </div>
          </div>
        </div>
       
      </div>
    </Sidebar>
  );
};

export default ViewVerifiedVideos;
