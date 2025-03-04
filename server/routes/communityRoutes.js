const express = require('express');
const { joinCommunity } = require('../controllers/communityController');
const router = express.Router();

// POST endpoint to join a community
router.post('/join', joinCommunity);

// (Optional) GET endpoint to fetch community details by name
router.get('/:communityName', async (req, res) => {
  try {
    const { communityName } = req.params;
    const community = await require('../models/Community').findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(200).json({ community });
  } catch (error) {
    console.error("Error fetching community:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
