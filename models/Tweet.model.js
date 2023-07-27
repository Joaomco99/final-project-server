// models/Tweet.js
const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  user: {
    name: String,
    handle: String,
  },
 publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  timestamp: String,
  message: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;

