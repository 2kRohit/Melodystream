const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/video');
const Category = require('../models/videocategory');
const { isValidObjectId } = require("mongoose");



// Set up multer storage for video and thumbnail uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const videoFilename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, videoFilename);
  },
});

const upload = multer({ storage });

// POST route to upload video and thumbnail
router.post('/upload-video', upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, tags, category,userId } = req.body;
    const { videoFile, thumbnailFile } = req.files;
    const videoPath = videoFile[0].path;
    const thumbnailPath = thumbnailFile ? thumbnailFile[0].path : null;
   
    

    const newVideo = new Video({
      title,
      description,
      tags,
      category,
      videoPath,
      thumbnailPath,
      userId,
      
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});
//get by id unverified
router.get('/unverified/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const videos = await Video.find({ userId, $or: [
        { status: "unverified" },
        { status: "rejected" }
      ] }).sort({ timestamp: -1 });
      res.status(200).json({ videos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  //get verified videos
  router.get('/verified/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const videos = await Video.find({ userId, 
        status: "verified" ,
        
       }).sort({ timestamp: -1 });
      res.status(200).json({ videos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  //delete video by id
  

  const fs = require('fs');
  
  
  router.delete('/deletevideo/:videoId', async (req, res) => {
    try {
      const videoId = req.params.videoId;
  
      // Find the video by its ID
      const video = await Video.findById(videoId);
  
      if (!video) {
        // If the video doesn't exist, return an error response
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Delete the video file from the upload folder
      const videoPath = video.videoPath;
      if (videoPath) {
        const videoFilePath = path.join(__dirname,'..', videoPath);
        fs.unlinkSync(videoFilePath);
      }
  
      // Delete the thumbnail file from the upload folder if it exists
      const thumbnailPath = video.thumbnailPath;
      if (thumbnailPath) {
        const thumbnailFilePath = path.join(__dirname,'..', thumbnailPath);
        if (fs.existsSync(thumbnailFilePath)) {
          fs.unlinkSync(thumbnailFilePath);
        }
      }
  
      // Delete the video from the database
      await Video.deleteOne({ _id: videoId });
  
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  //get vdo by id
  router.get('/viewvideo/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
  
    if (!isValidObjectId(videoId)) {
        return res.status(400).json({ message: 'Invalid videoId' });
      }
  
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(video);
    } catch (error) {
      console.error('Error fetching video',error);
      res.status(500).json({ message: 'Failed to fetch video' });
    }
  });

  // PUT route for changing the visibility of a video
router.patch('/changevisibility/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { visibility } = req.body;

    // Find the video by its ID
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the visibility of the video
    video.visibility = visibility;
    await video.save();

    return res.status(200).json({ message: 'Visibility changed successfully', video });
  } catch (error) {
    console.error('Error changing visibility:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Get all categories
router.get('/getcategories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// 
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new category
    const category = new Category({ name });

    // Save the category to the database
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error inserting category:', error);
    res.status(500).json({ error: 'Failed to insert category' });
  }
});

// Get all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Increment view count for a video
router.put('/incrementviews/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({ message: 'View count incremented successfully' });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET video by ID
router.get('/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//related videos
router.get('/related/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Fetch related videos based on the category of the current video, excluding the current video
    const relatedVideos = await Video.find({ category: video.category, _id: { $ne: videoId } });

    res.json(relatedVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});





// Add a comment to a video
router.post('/:videoId/comments', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId, content } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = {
      userId,
      content,
    };

    video.comments.push(comment);
    await video.save();

    res.json(video.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a reply to a comment
router.post('/:videoId/comments/:commentId/replies', async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { userId, content } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = video.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = {
      userId,
      content,
    };

    comment.replies.push(reply);
    await video.save();

    res.json(video.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get comments of a video
router.get('/:videoId/comments', async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// get Categorized vdo
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const videos = await Video.find({  
      category: category ,
      
     }).sort({ timestamp: -1 });
    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
//get search result
// Assuming you have an endpoint for searching videos

router.get('/search/:q', async (req, res) => {
  try {
    const searchTerm = req.params.q; 

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(searchTerm, 'i');

    const videos = await Video.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    });

    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
//tags
router.get('/tags/:q', async (req, res) => {
  try {
    const searchTerm = req.params.q; 

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(searchTerm, 'i');

    const videos = await Video.find({
      $or: [
       
        { tags: { $regex: regex } },
       
      ],
    });

    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// video likes dislikes

// Check like/dislike status for a video
router.get('/:videoId/status/:userId', async (req, res) => {
  try {
    const { videoId, userId } = req.params;
    const video = await Video.findById(videoId);

    // Check if the user has already liked the video
    const likedIndex = video.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    // Check if the user has already disliked the video
    const dislikedIndex = video.dislikes.findIndex(
      (dislike) => dislike.userId.toString() === userId
    );

    const liked = likedIndex !== -1;
    const disliked = dislikedIndex !== -1;

    res.status(200).json({ liked, disliked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Like a video
router.post('/:videoId/like/:userId', async (req, res) => {
  try {
    const { videoId, userId } = req.params;
    const video = await Video.findById(videoId);

    // Check if the user has already liked the video
    const likedIndex = video.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    if (likedIndex !== -1) {
      // User already liked the video, remove the like
      video.likes.splice(likedIndex, 1);
    } else {
      // Check if the user has already disliked the video
      const dislikedIndex = video.dislikes.findIndex(
        (dislike) => dislike.userId.toString() === userId
      );

      if (dislikedIndex !== -1) {
        // User already disliked the video, remove the dislike
        video.dislikes.splice(dislikedIndex, 1);
      }

      // Add the user's like to the video
      video.likes.push({ userId });
    }

    // Save the updated video
    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Dislike a video
router.post('/:videoId/dislike/:userId', async (req, res) => {
  try {
    const { videoId, userId } = req.params;
    const video = await Video.findById(videoId);

    // Check if the user has already disliked the video
    const dislikedIndex = video.dislikes.findIndex(
      (dislike) => dislike.userId.toString() === userId
    );

    if (dislikedIndex !== -1) {
      // User already disliked the video, remove the dislike
      video.dislikes.splice(dislikedIndex, 1);
    } else {
      // Check if the user has already liked the video
      const likedIndex = video.likes.findIndex(
        (like) => like.userId.toString() === userId
      );

      if (likedIndex !== -1) {
        // User already liked the video, remove the like
        video.likes.splice(likedIndex, 1);
      }

      // Add the user's dislike to the video
      video.dislikes.push({ userId });
    }

    // Save the updated video
    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

  module.exports = router;