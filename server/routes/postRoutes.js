// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');

/**
 * CREATE POST (multi-step fields + optional community)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      communityId, // might be null or undefined if it's a home post
      title,
      description,
      mediaUrl,
      hairType,
      porosity,
      density,
      thickness,
      curlShape,
      styleOccasion,
      audience,
      visibility,
    } = req.body;

    const newPost = new Post({
      user: userId,
      // If communityId is provided, use it; else remain null
      community: communityId || null,
      title,
      description,
      mediaUrl,
      hairType,
      porosity,
      density,
      thickness,
      curlShape,
      styleOccasion,
      audience,
      visibility,
    });
    await newPost.save();

    // Optionally populate user field for immediate display
    await newPost.populate('user', 'username');

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// GET posts, optionally filter by communityId
router.get('/', async (req, res) => {
    try {
      const { communityId } = req.query;
      let query = {};
  
      // If you want "home" posts to have community=null
      if (communityId === 'none') {
        query.community = null;
      } else if (communityId) {
        query.community = communityId;
      }
  
      const posts = await Post.find(query)
        .populate('user', 'username')
        .populate('comments.user', 'username');
  
      // Always return an array (like []) or [ { post }, ... ]
      res.json(posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Return an error object (NOT an array)
      // so handle it on the frontend
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

/**
 * ADD COMMENT (Reply) to a Post
 */
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      content,
      createdAt: new Date(),
    });
    await post.save();

    // Re-fetch with user + comments
    const updatedPost = await Post.findById(postId)
      .populate('user', 'username')
      .populate('comments.user', 'username');

    res.status(201).json({ message: 'Comment added', post: updatedPost });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
