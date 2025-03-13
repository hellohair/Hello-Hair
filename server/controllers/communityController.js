// server/controllers/communityController.js
const Community = require('../models/Community');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get Community Details & Populate Members by community name
const getCommunity = async (req, res) => {
  try {
    const { communityName } = req.params;
    const community = await Community.findOne({ name: communityName })
      .populate('members', 'username email'); // populate member details

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(200).json({ community });
  } catch (error) {
    console.error("Error fetching community:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Join a Community using communityName
const joinCommunity = async (req, res) => {
  try {
    const { communityName, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Optional: if community is locked, you might want to require approval.
    // For now, we let the user join directly even if locked.
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    community.members.push(userId);
    await community.save();
    res.status(200).json({ message: "Joined community successfully", community });
  } catch (error) {
    console.error("Join community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCommunity, joinCommunity };
