// server/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Community = require('../models/Community');

// GET all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    console.error('Error fetching communities:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single community by ID
router.get('/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json({ community });
  } catch (err) {
    console.error('Error fetching community:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /join using communityId
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { communityId, userId } = req.body;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    community.members.push(userId);
    await community.save();
    res.json({ message: 'Joined community successfully', community });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
