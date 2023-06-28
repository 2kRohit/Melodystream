const mongoose = require('mongoose');


const favouriteSchema = new mongoose.Schema({
  
  
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

const Favourite= mongoose.model('favourite', favouriteSchema);

module.exports = Favourite;
