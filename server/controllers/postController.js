const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { communityId, title, content } = req.body;
    const userId = req.userId;
    const post = new Post({ user: userId, community: communityId, title, content });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { communityId } = req.query;
    let posts;
    if (communityId) {
      posts = await Post.find({ community: communityId }).populate('user', 'username');
    } else {
      posts = await Post.find().populate('user', 'username');
    }
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};
