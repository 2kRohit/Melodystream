const mongoose = require('mongoose');


const subscriberSchema = new mongoose.Schema({
  
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model('subscriber', subscriberSchema);

module.exports = Subscriber;
