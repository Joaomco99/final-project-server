// backend/routes/tweets.js

const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet.model');

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");



// Create a new tweet
router.post('/', isAuthenticated, async (req, res) => {
  try {

    // get current date
    let date = new Date();
    let formattedDate= date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    let authParameters = req.payload;
    let serverParameters = {
      user: {
        name: authParameters.name,
        handle: authParameters.name
      },
      publisher: authParameters._id,
      timestamp: formattedDate
    }

    const constructedTweet = {...req.body, ...serverParameters};
    console.log(constructedTweet);
    const newTweet = await Tweet.create(constructedTweet);

    res.status(201).json(newTweet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get all tweets
router.get('/', isAuthenticated, async (req, res) => {
  try {
    let tweets = await Tweet.find().sort({timestamp:-1});
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Get tweets by user
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const authParameters = req.payload;
    const userId = authParameters._id;
    console.log("User id: " + userId);

    let tweets = await Tweet.find({publisher: userId}).sort({timestamp:-1});
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tweets by user', detailedError: JSON.stringify(error)});
  }
});

// Delete tweet
router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const tweetId = req.body.id;
    const authParameters = req.payload;

    const tweet = await Tweet.findById(tweetId)
    if(tweet.publisher.toString() != authParameters._id) {
      res.status(401).json({ error: 'You dont have permission to delete this tweet!' });
      return;
    }

    tweet.deleteOne();

    const deleted = await Tweet.findByIdAndDelete(tweetId);
    res.status(204).json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tweet!' });
  }
});

// Edit tweet
router.patch('/', isAuthenticated, async (req, res) => {
  try {
    const editedTweet = req.body;
    const authParameters = req.payload;

    console.log(editedTweet);
    console.log(editedTweet._id);

    const tweet = await Tweet.findById(editedTweet._id);
    
    if(tweet.publisher.toString() != authParameters._id) {
      res.status(401).json({ error: 'You dont have permission to edit this tweet!' });
      return;
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(editedTweet._id, {message: editedTweet.message});


    res.status(204).json(tweet);

  } catch (error) {
    res.status(500).json({ error: 'Failed to edit tweet!', errorMessage: JSON.stringify(error)});
  }
});

module.exports = router;


