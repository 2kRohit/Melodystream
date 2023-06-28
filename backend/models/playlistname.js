const mongoose = require('mongoose');


const playlistnameSchema = new mongoose.Schema({
  
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Playlistname= mongoose.model('playlistname', playlistnameSchema);

module.exports = Playlistname;
