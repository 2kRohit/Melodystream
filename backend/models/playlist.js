const mongoose = require('mongoose');


const playlistSchema = new mongoose.Schema({
  
  
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
  name:{
    type:String,
    required:true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Playlist= mongoose.model('playlist', playlistSchema);

module.exports = Playlist;
