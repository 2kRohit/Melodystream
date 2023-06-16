const mongoose = require('mongoose');


const savedSchema = new mongoose.Schema({
  
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Saved = mongoose.model('savedvideo', savedSchema);

module.exports = Saved;
