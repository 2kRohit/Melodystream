const mongoose = require('mongoose');



const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
  category: {
    type: String,
    required: true,
  },
  musicPath: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: false,
  },
  artist: {
    type: String,
    required: true,
  },
  language:{
    type:String,
    required:true
  },
  
 
  
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
