const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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

const Musiccategory = mongoose.model('Musiccategory', categorySchema);

module.exports = Musiccategory;
