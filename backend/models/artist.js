const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
