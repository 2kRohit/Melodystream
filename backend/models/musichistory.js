const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
  
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  musicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Musichistory= mongoose.model('musichistory', historySchema);

module.exports = Musichistory;
