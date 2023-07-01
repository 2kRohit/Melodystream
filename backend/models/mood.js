const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
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

const Mood = mongoose.model('mood', moodSchema);

module.exports = Mood;
