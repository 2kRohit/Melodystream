const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
  
  
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

const History = mongoose.model('history', historySchema);

module.exports = History;
