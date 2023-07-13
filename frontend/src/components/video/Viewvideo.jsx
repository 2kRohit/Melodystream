import React, { useState, useEffect, useRef } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaShare, FaBookmark, FaUserCircle, FaRegTrashAlt, FaChevronLeft, FaChevronRight, FaPlay, FaVolumeMute, FaVolumeUp, FaPause } from 'react-icons/fa';
import { RiArrowUpSLine, RiArrowDownSLine, RiReplyLine, RiEyeLine, RiCalendarLine,RiSunLine } from 'react-icons/ri';
import { MdReport} from 'react-icons/md'
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks';
import {TbSun, TbSunOff} from 'react-icons/tb'
import Showuser from './showuser';

const VideoPage = () => {
 
  const navigate=useNavigate()
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vId = searchParams.get('videoId');
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replycommentText, setReplyCommentText] = useState('');
  const [comments, setComments] = useState([]);
const [savestatus,setSavestatus]=useState(false)
  const [replyCommentId, setReplyCommentId] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reasonValue, setReasonValue] = useState('');
  const [fileValue, setFileValue] = useState(null);
  const [report,setReport]=useState(false)
const[videoId,setvideoId]=useState('')
const[allid,setallid]=useState([])
const [isPlaying,setIsPlaying]=useState(true)
const [subscriber,setsubscriber]=useState(false)
const [countsubscriber,setcountsubscriber]=useState(0)
const [showlikes,setshowlikes]=useState(false)
const [showdislikes,setshowdislikes]=useState(false)
const [showsubscribers,setshowsubscribers]=useState(false)

useEffect(()=>{
  Allid()
  },[])
//setvdo
const Allid=async()=>{
  try{
    const response = await axios.get(`http://localhost:8000/api/video/${vId}`);
    setvideoId(response.data._id)
    const relatedresponse = await axios.get(`http://localhost:8000/api/video/related/${response.data._id}`);
   
   if(relatedresponse.data.length===0){
    await setallid([response.data])
   
    
   }
   else{
   await setallid([response.data,...relatedresponse.data])
    
   }
    

    
  }
  catch (error) {
    console.error(error);
  }
}

useEffect(()=>{
Allid()
},[vId])


const nextTrackHandler = () => {
  const currentIndex = allid.findIndex((track) => track._id === videoId);
  const nextIndex = (currentIndex + 1) % allid.length;
  setvideoId(allid[nextIndex]._id);
  setIsPlaying(true);
 // Start playing the next track
};
const previousTrackHandler = () => {
  const currentIndex = allid.findIndex((track) => track._id === videoId);
  const previousIndex = (currentIndex - 1 + allid.length) % allid.length;
  setvideoId(allid[previousIndex]._id);
  setIsPlaying(true);
 // Start playing the previous track
};



  const handleReportClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('reason', reasonValue);
      if (fileValue) {
        formData.append('document', fileValue);
      }
  
      const response = await axios.post(`http://localhost:8000/api/video/report/${videoId}/${userId}`, formData);
  
      if (response.status === 200) {
        console.log('Report saved successfully');
        alert('Reported Successfully')
        setReasonValue('');
        setFileValue(null);
        fetchreportStatus()
        closeModal();
      }
      else if(response.status===201){
        alert('Already Reported')
        fetchreportStatus()
        closeModal();
      } else {
        console.log('Error saving the report');
        fetchreportStatus()
      }
    } catch (error) {
      console.log('An error occurred:', error);
      fetchreportStatus()
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/${videoId}`);
      const videoData = response.data;
      
     
      // Fetch user data for the video's userId
      const userDataResponse = await axios.get(`http://localhost:8000/api/user/${videoData.userId}`);
      const userData = userDataResponse.data;
  
      // Combine video data with user data
      const videoWithUserData = { ...videoData, user: userData };

      setVideo(videoWithUserData);
    } catch (error) {
      console.error(error);
    }
  };
  
  
 
  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/related/${videoId}`);
      
      setRelatedVideos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/video/${videoId}/comments`);
      const comments = response.data;
  
      // Fetch user data for each comment's userId
      const userIds = comments.map(comment => comment.userId);
      const userDataPromises = userIds.map(userId => axios.get(`http://localhost:8000/api/user/${userId}`));
      const userDataResponses = await Promise.all(userDataPromises);
      const userData = userDataResponses.map(response => response.data);
  
      // Combine comments with user data
      const commentsWithUserData = comments.map((comment, index) => {
        const user = userData[index];
        return { ...comment, user };
      });
  
      // Fetch user data for each reply's userId
      const commentsWithRepliesUserDataPromises = commentsWithUserData.map(async (comment) => {
        const replyUserIds = comment.replies.map(reply => reply.userId);
        const replyUserDataPromises = replyUserIds.map(userId => axios.get(`http://localhost:8000/api/user/${userId}`));
        const replyUserDataResponses = await Promise.all(replyUserDataPromises);
        const replyUserData = replyUserDataResponses.map(response => response.data);
        const repliesWithUserData = comment.replies.map((reply, index) => {
          const user = replyUserData[index];
          return { ...reply, user };
        });
        return { ...comment, replies: repliesWithUserData };
      });
  
      const commentsWithRepliesUserData = await Promise.all(commentsWithRepliesUserDataPromises);
  
      setComments(commentsWithRepliesUserData);
    } catch (error) {
      console.error(error);
      setComments([]); // Set an empty array as comments in case of failure
    }
  };

  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/api/video/${videoId}/comments`, {
        userId: userId,
        content: commentText,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/video/${videoId}/comments/${commentId}/replies`,
        {
          userId: userId,
          content: replycommentText,
          replyTo: commentId,
        }
        
      );
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          comment.replies.push(response.data);
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyCommentText('');
      setReplyCommentId('');
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };
 
  const toggleReplies = (commentId) => {
    setShowReplies((prevShowReplies) => ({
      ...prevShowReplies,
      [commentId]: !prevShowReplies[commentId],
    }));
  };

  const hideReplies = (commentId) => {
    setShowReplies((prevShowReplies) => ({
      ...prevShowReplies,
      [commentId]: false,
    }));
  };

//like dislike
const fetchVideoStatus = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/video/${videoId}/status/${userId}`);
    const { liked, disliked } = response.data;
    setLiked(liked);
    setDisliked(disliked);
    fetchVideo()
    fetchsavestatus()
  } catch (error) {
    console.error(error);
  }
};

const handleLike = async () => {
  try {
    const response = await axios.post(`http://localhost:8000/api/video/${videoId}/like/${userId}`);
    fetchVideoStatus()
  } catch (error) {
    console.error(error);
  }
};

const handleDislike = async () => {
  try {
    const response = await axios.post(`http://localhost:8000/api/video/${videoId}/dislike/${userId}`);
   fetchVideoStatus()
    
  } catch (error) {
    console.error(error);
  }
};

const handleShare = async () => {
  try {
    await navigator.share({
      title: video.title,
      url: `http://localhost:3000/viewvideo?videoId=${videoId}`,
    });
    console.log('Shared successfully');
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
const handleSave = async () => {
  try {
    const response = await axios.post(`http://localhost:8000/api/video/${videoId}/save/${userId}`);
  fetchsavestatus()
  } catch (error) {
    console.error(error);
  }
};
const fetchsavestatus= async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/video/${videoId}/savestatus/${userId}`);
  const {status}=response.data
 
  setSavestatus(status)
  } catch (error) {
    console.error(error);
  }
};

//subscriber
const handleSubscriber= async (ownerId) => {
  try {
    const response = await axios.post(`http://localhost:8000/api/video/${ownerId}/subscriber/${userId}`);
  fetchsubscriberstatus()
  } catch (error) {
    console.error(error);
  }
};
const fetchsubscriberstatus= async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/video/${video.userId}/subscriberstatus/${userId}`);
  const {status}=response.data
  setsubscriber(status)
  const count= await axios.get(`http://localhost:8000/api/video/subscribercount/${video.userId}`);
  setcountsubscriber(count.data)
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    fetchsubscriberstatus();
  }, 1000);

  return () => clearTimeout(timer);
}, [fetchsubscriberstatus]);

const fetchreportStatus= async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/video/${videoId}/reportstatus/${userId}`);
  const {status}=response.data
 
  setReport(status)
  } catch (error) {
    console.error(error);
  }
};
const handleunreport= async () => {
  const confirmunreport= window.confirm('Do you want to unreport')
  if(confirmunreport){
  try {
   
    const response = await axios.post(`http://localhost:8000/api/video/${videoId}/unreport/${userId}`);
    fetchreportStatus()
  } catch (error) {
    console.error(error);
  }}
};


//delete comment
const deletecomment=async(commentid)=>{
  const confirmdelete= window.confirm('Do you want to delete comment')
  if(confirmdelete){
  try {
   
    const response = await axios.delete(`http://localhost:8000/api/video/${videoId}/commentdelete/${commentid}`);
    fetchComments()
    
  } catch (error) {
    console.error(error);
  }}

}

const deletereply=async(commentid,replyid)=>{
  const confirmdelete= window.confirm('Do you want to delete comment')
  if(confirmdelete){
  try {
   
    const response = await axios.delete(`http://localhost:8000/api/video/${videoId}/replydelete/${commentid}/${replyid}`);
    fetchComments()
    
  } catch (error) {
    console.error(error);
  }}
  
}
useEffect(()=>{
 
  fetchVideo()
fetchComments()
fetchRelatedVideos()
fetchVideoStatus()
fetchsavestatus()
fetchreportStatus()
fetchsubscriberstatus()
},[videoId])


const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();

  // Convert the time difference to seconds
  const seconds = Math.floor(timeDifference / 1000);

  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  // Calculate the relative time based on the time difference
  if (seconds < minute) {
    return `${seconds} sec ago`;
  } else if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return `${minutes} min ago`;
  } else if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    return `${hours} hr ago`;
  } else if (seconds < month) {
    const days = Math.floor(seconds / day);
    return `${days} day ago`;
  } else if (seconds < year) {
    const months = Math.floor(seconds / month);
    return `${months} month ago`;
  } else {
    const years = Math.floor(seconds / year);
    return `${years} year ago`;
  }
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

  return (
    <Sidebar>
      <div className="container mx-auto bg-gray-900 text-white flex">
        <div className="w-3/4 pr-4">
          {video ? (
            <div>
     <div className="relative group">
  <video
    ref={videoRef}
    src={`http://localhost:8000/${video.videoPath}`}
    className="w-full cursor-pointer"
    style={{ height: '480px' }} // Adjust the height as needed
    poster={`http://localhost:8000/${video.thumbnailPath}`}
    onEnded={nextTrackHandler}
    autoPlay={isPlaying}
    controls
  />

  {/* Next button */}
  <button
    onClick={nextTrackHandler}
    className="next-button absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  >
    <FaChevronRight className="w-5 h-5" />
  </button>

  {/* Previous button */}
  <button
    onClick={previousTrackHandler}
    className="previous-button absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  >
    <FaChevronLeft className="w-5 h-5" />
  </button>
</div>

     <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
              <div className="flex items-center mb-0 mt-2">
              
              {video.user && video.user.profilePicture ? (<>
              
    <img onClick={()=>{navigate(`/user/userprofile?uId=${video.user._id}`)}} 
      className="w-14 h-14 rounded-full mr-2 cursor-pointer"
      src={`http://localhost:8000/uploads/profile/${video.user?.profilePicture}`}
      alt="Profile"
    />
    <p className='-mt-5'>{video.user?.name}</p>
  
    <button onClick={()=>{handleSubscriber(video.user?._id)}} className={`ml-12 bg-red-600 text-lg rounded-full font-semibold px-2 py-1 ${subscriber ? 'text-white' : 'text-white'}`}>
                 
                 {subscriber? 'Subscribed':'Subscribe'}
                </button>
    </>
    
  ) : (
    <>
    <FaUserCircle 
    onClick={()=>{navigate(`/user/userprofile?uId=${video.user._id}`)}} 
    className="w-14 h-14 text-gray-500 mr-2 cursor-pointer" />
   <p className='-mt-5'>{video.user?.name}</p>
  
  <button onClick={()=>{handleSubscriber(video.user?._id)}} className={`ml-12 bg-red-600 text-lg rounded-full font-semibold px-2 py-1 ${subscriber ? 'text-white' : 'text-white'}`}>
               
               {subscriber? 'Subscribed':'Subscribe'}
              </button>
    </>
  )} 
  <div className='ml-40 p-1 mb-0 rounded-full border border-gray-800 bg-black-500'>
  <button
        className={`bg-transparent  rounded-full p-2 mr-2 ${liked ? 'text-blue-400' : 'text-white'}`}
       
      >
        <FaThumbsUp className="inline-block mr-1 text-xl  "  onClick={handleLike}/>      
         <span onClick={()=>{setshowlikes(!showlikes)}}
          > {video.likes.length}</span><span className={`${showlikes?'':'hidden'}`}><Showuser prop1={'Liked by'} prop2={video._id}  />
         </span>
      </button>
      
      <button
        className={`bg-transparent  rounded-full p-2 mr-2 ${disliked ? 'text-red-700' : 'text-white'}`}
       
      >
        <FaThumbsDown   onClick={handleDislike} className="inline-block mr-1 text-xl " />
   
   
        <span onClick={()=>{setshowdislikes(!showdislikes)}}
          > {video.dislikes.length}</span><span className={`${showdislikes?'':'hidden'}`}><Showuser prop1={'Disliked by'} prop2={video._id}  />
         </span>
      </button>
                <button onClick={handleShare} className="bg-transparent text-white rounded-full p-2 mr-2">
                  <FaShare className="inline-block mr-1 text-xl" />
                  Share
                </button>
                <button onClick={handleSave} className={`bg-transparent rounded-full p-2 mr-2 ${savestatus ? 'text-green-400' : 'text-white'}`}>
                  <FaBookmark className="inline-block mr-1 text-xl" />
                 {savestatus? 'Saved':'Save'}
                </button>
                 {/*Start  */}
                
                 <button
onClick={report ? handleunreport : handleReportClick}
        className={`rounded-full p-2 mr-2 ${report ? 'text-orange-700' : 'text-white'}`}
      >
        <MdReport className="inline-block mr-1 text-xl" />
      {report ? 'Reported' : 'Report'}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96 border-4 border-gray-600">
            <h2 className="text-lg font-bold mb-4">Report</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-1">Reason:</label>
                <textarea
                  value={reasonValue}
                  onChange={(e) => setReasonValue(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full bg-gray-800 text-white h-32"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-0">Upload Document (if any):</label>
                <label className='text-sm text-gray-300 italic'>only pdf file accepted</label>
                <input
                  type="file"
                  onChange={(e) => setFileValue(e.target.files[0])}
                  accept=".pdf"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-800 text-white rounded px-4 py-2">
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 rounded px-4 py-2 ml-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                {/*end  */}
                </div>
              </div>
              
              <p onClick={()=>{setshowsubscribers(!showsubscribers)}} className={`ml-16 -mt-7 text-sm font-medium text-left text-gray-500 cursor-pointer`}>{countsubscriber}&bull;subscribers
              <span  className={`${showsubscribers?'':'hidden'}`}><Showuser prop1={'Subscribers'} prop2={video.userId}  />
         </span></p>
           <br/>   <p className="text-gray-500 mb-0 mt-0">
                <RiEyeLine className="inline-block mr-4" />
                {video.views} views
              </p>
              <p className="text-gray-500 mb-4 mt-0">
                <RiCalendarLine className="inline-block mr-4" />
                Uploaded on {new Date(video.timestamp).toLocaleDateString()}
              </p>
              
              <div>
                <h2 className="text-lg font-bold mb-2">Description:</h2>
                <p className="text-gray-500">{video.description}</p>
              </div>
              <div className='mt-1'>
              {video.tags && video.tags.split(',').map((tag, index) => (
                    <Link
                      key={index}
                      to={`/tag?q=${tag.trim()}`}
                      className="text-blue-600 text-lg bg-transparent px-0 py-1 rounded-md mr-1 mb-1"
                    >
                      #{tag.trim()}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-800"></div>
              <div>
                <h2 className="text-lg font-bold mt-4 mb-2">Add a Comment:</h2>
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <div className="flex">
                  {profile && profile.profilePicture ? (
    <img
      className="w-8 h-8 rounded-full mr-2"
      src={`http://localhost:8000/uploads/profile/${profile.profilePicture}`}
      alt="Profile"
    />
  ) : (
    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
  )}
                    <textarea
                      className="w-full p-2 mb-2 bg-gray-800 text-white rounded resize-none focus:outline-none"
                      rows="3"
                      placeholder="Write your comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    />
                  </div>
                  <button className="bg-gray-800 text-white rounded-full p-2" type="submit">
                    Submit
                  </button>
                </form>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">Comments:</h2>
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="mb-4">
                      <div className="flex items-center">
                      {comment.user && comment.user.profilePicture ? (
    <img
    onClick={()=>{navigate(`/user/userprofile?uId=${comment.user._id}`)}}
      className="w-8 h-8 rounded-full mr-2 cursor-pointer"
      src={`http://localhost:8000/uploads/profile/${comment.user.profilePicture}`}
      alt="Profile"
    />
  ) : (
    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2 cursor-pointer" onClick={()=>{navigate(`/user/userprofile?uId=${comment.user._id}`)}}/>
  )}
                        <div>
                     <p className="text-white font-bold ">{comment.user?.name}</p>
                     <div className='flex items-center'>   
                          <p className="text-gray-500">{comment.content}</p>
                          <p className="text-gray-500 ml-2">&bull; {formatDateTime(comment.timestamp)}</p></div>
                         
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <button
                          className="text-gray-500 mr-2 flex items-center"
                          onClick={() => toggleReplies(comment._id)}
                        >
                          <RiReplyLine className="mr-1" />
                          Reply
                        </button>
                        {comment.replies &&  comment.replies.length > 0 && !showReplies[comment._id] && (
                          <button
                            className="text-gray-500 mr-2 flex items-center"
                            onClick={() => toggleReplies(comment._id)}
                          >
                            <RiArrowDownSLine className="mr-1" />
                            {comment.replies.length} Replies
                          </button>
                        )}
                        {comment.replies && comment.replies.length > 0 && showReplies[comment._id] && (
                          <button
                            className="text-gray-500 mr-2 flex items-center"
                            onClick={() => hideReplies(comment._id)}
                          >
                            <RiArrowUpSLine className="mr-1" />
                            Hide Replies
                          </button>
                        )}
                        
                       <div onClick={()=>{ deletecomment(comment._id)}} className='text-gray-500 text-sm mr-1 mt-0.5
                        hover:text-red-500 cursor-pointer'> 
                       {comment.userId === userId || video.userId===userId? <FaRegTrashAlt /> : null}</div>
                      </div>
                      {showReplies[comment._id] && (
                        <div className="ml-10 mt-2">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="mb-2">
                              <div className="flex items-center">
                              {reply && reply.user?.profilePicture? (
                                <img onClick={()=>{navigate(`/user/userprofile?uId=${reply.user?._id}`)}}
                                  className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                                  src={`http://localhost:8000/uploads/profile/${reply.user?.profilePicture}`}//{reply.user.profilePicture} // Assuming the profile picture is available in the user object
                                  alt="Profile"
                                />):(<FaUserCircle className="w-8 h-8 text-gray-500 mr-2 cursor-pointer"
                                onClick={()=>{navigate(`/user/userprofile?uId=${reply.user?._id}`)}} />)}
                                <div>
                                <div className="flex items-center mt-2">      <p className="text-white font-bold">{reply.user?.name}</p>
                                  <div onClick={()=>{ deletereply(comment._id,reply._id)}} className='text-gray-500 text-sm mr-2 p-2 mt-0.5
                        hover:text-red-500 cursor-pointer'> 
                       {reply.userId === userId || video.userId===userId? <FaRegTrashAlt /> : null}</div></div>
                              <div className='flex items-center'>    <p className="text-gray-500">{reply.content}</p>
                                  <p className="text-gray-500 ml-2">&bull; {formatDateTime(reply.timestamp)}</p></div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                            <div className="flex mt-2">
                            {profile && profile.profilePicture ? (
    <img
      className="w-8 h-8 rounded-full mr-2"
      src={`http://localhost:8000/uploads/profile/${profile.profilePicture}`}
      alt="Profile"
    />
  ) : (
    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
  )}
                              <textarea
                                className="w-full p-2 bg-gray-800 text-white rounded resize-none focus:outline-none"
                                rows="3"
                                placeholder="Write your reply"
                                value={replycommentText}
                                onChange={(e) => setReplyCommentText(e.target.value)}
                                required
                              />
                            </div>
                            <button className="bg-gray-800 text-white rounded-full p-2 mt-2" type="submit">
                              Submit
                            </button>
                           
                          </form>
                          
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No comments available.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading video...</p>
          )}
        </div>
        <div className="w-px border border-gray-800"></div>
        <div className="w-1/4 pl-4">
  <h2 className="text-xl font-semibold italic text-blue-500 text-center mb-4">Related Videos</h2>
  <div className="grid gap-4">
    {relatedVideos.map((relatedVideo) => (
      <Link key={relatedVideo._id} to={`/Viewvideo?videoId=${relatedVideo._id}`}>
        <div className="relative overflow-hidden rounded border border-gray-700">
          <video
            src={`http://localhost:8000/${relatedVideo.videoPath}`}
           
            className="w-full h-40 object-cover"
          />
          <p className="absolute bottom-2 text-center bg-black bg-opacity-75 text-white p-1 rounded">
            {relatedVideo.title}
          </p>
        </div>
      </Link>
    ))}
  </div>
</div>

      </div>
    </Sidebar>
  );
};

export default VideoPage;
