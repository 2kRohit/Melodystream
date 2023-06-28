const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  videoPath: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
  dislikes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['verified', 'unverified', 'rejected'],
    default: 'unverified',
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
