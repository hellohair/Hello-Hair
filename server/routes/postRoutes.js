// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware
    const newPost = new Post({
      ...req.body,
      user: userId, // associate post with the logged-in user
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    // e.g. populate the user’s username
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
