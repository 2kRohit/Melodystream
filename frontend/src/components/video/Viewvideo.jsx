import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaShare, FaBookmark, FaUserCircle } from 'react-icons/fa';
import { RiArrowUpSLine, RiArrowDownSLine, RiReplyLine, RiEyeLine, RiCalendarLine,RiSunLine } from 'react-icons/ri';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks';
import {TbSun, TbSunOff} from 'react-icons/tb'

const VideoPage = () => {
  const { authInfo } = useAuth();
  const { profile } = authInfo;
  const userId = profile?.id;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get('videoId');
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replycommentText, setReplyCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const [replyCommentId, setReplyCommentId] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  

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

  const handleVideoPlay = () => {
    videoRef.current.play().catch((error) => console.error(error));
  };

  const handleVideoPause = () => {
    videoRef.current.pause();
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
    console.log(response.data)
    setLiked(liked);
    setDisliked(disliked);
    fetchVideo()
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

useEffect(()=>{
  fetchVideo()
fetchComments()
fetchRelatedVideos()
fetchVideoStatus()
},[videoId])


  return (
    <Sidebar>
      <div className="container mx-auto bg-gray-900 text-white flex">
        <div className="w-3/4 pr-4">
          {video ? (
            <div>
              <div className="relative">
                <video
                  ref={videoRef}
                  src={`http://localhost:8000/${video.videoPath}`}
                  className="w-full"
                  style={{ height: '480px' }} // Adjust the height as needed
                  poster={`http://localhost:8000/${video.thumbnailPath}`}
                  onClick={handleVideoPlay}
                  onPause={handleVideoPause}
                  controls
                />
              </div>
              <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
              <div className="flex items-center mb-0 mt-2">
              {video.user && video.user.profilePicture ? (<>
    <img
      className="w-8 h-8 rounded-full mr-2"
      src={`http://localhost:8000/uploads/profile/${video.user?.profilePicture}`}
      alt="Profile"
    />
    <p>{video.user?.name}</p>
    </>
  ) : (
    <>
    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
    <p>{video.user?.name}</p>
    </>
  )}
  <div className='ml-72 p-1 mb-0 rounded-full border border-gray-800 bg-black-500'>
  <button
        className={`bg-transparent  rounded-full p-2 mr-2 ${liked ? 'text-blue-400' : 'text-white'}`}
        onClick={handleLike}
      >
        <TbSun className="inline-block mr-1 text-3xl font-extrabold " />
        {video.likes.length} 
      </button>
      <button
        className={`bg-transparent  rounded-full p-2 mr-2 ${disliked ? 'text-red-700' : 'text-white'}`}
        onClick={handleDislike}
      >
        <TbSunOff className="inline-block mr-1 text-3xl font-extrabold" />
        {video.dislikes.length} 
      </button>
                <button onClick={handleShare} className="bg-transparent text-white rounded-full p-2 mr-2">
                  <FaShare className="inline-block mr-1 text-xl" />
                  Share
                </button>
                <button className="bg-transparent text-white rounded-full p-2 mr-2">
                  <FaBookmark className="inline-block mr-1 text-xl" />
                  Save
                </button></div>
              </div>
              

              <p className="text-gray-500 mb-0 mt-0">
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
      className="w-8 h-8 rounded-full mr-2"
      src={`http://localhost:8000/uploads/profile/${comment.user.profilePicture}`}
      alt="Profile"
    />
  ) : (
    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
  )}
                        <div>
                          <p className="text-white font-bold">{comment.user?.name}</p>
                          <p className="text-gray-500">{comment.content}</p>
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
                      </div>
                      {showReplies[comment._id] && (
                        <div className="ml-10 mt-2">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="mb-2">
                              <div className="flex items-center">
                                <img
                                  className="w-8 h-8 rounded-full mr-2"
                                  src={`http://localhost:8000/uploads/profile/${reply.user?.profilePicture}`}//{reply.user.profilePicture} // Assuming the profile picture is available in the user object
                                  alt="Profile"
                                />
                                <div>
                                  <p className="text-white font-bold">{reply.user?.name}</p>
                                  <p className="text-gray-500">{reply.content}</p>
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
          <h2 className="text-lg font-bold mb-4">Related Videos</h2>
          <div className="grid gap-4">
            {relatedVideos.map((relatedVideo) => (
              <Link key={relatedVideo._id}
               to={`/Viewvideo?videoId=${relatedVideo._id}`}>
                <div className="relative overflow-hidden rounded ">
                  <video
                    src={`http://localhost:8000/${relatedVideo.videoPath}`}
                    className="w-full"
                    style={{ height: '120px' }} // Adjust the height as needed
                   
                  />
                  <p className="absolute bottom-2 text-center bg-transparent bg-opacity-75 text-white p-1  rounded">
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
