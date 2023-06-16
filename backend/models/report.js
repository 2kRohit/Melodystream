const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
      },
    filePath: {
        type: String,
        required: false,
      },
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

const Report = mongoose.model('reports', reportSchema);

module.exports = Report;
