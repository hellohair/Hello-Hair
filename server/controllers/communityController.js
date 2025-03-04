const Community = require('../models/Community');
const User = require('../models/User');

const joinCommunity = async (req, res) => {
  try {
    const { communityName, userId } = req.body;
    if (!communityName || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the community by name (assuming name is unique)
    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    // Add the user to the members array
    community.members.push(userId);
    await community.save();

    // Optionally, update the user's current community field
    await User.findByIdAndUpdate(userId, { community: communityName });

    res.status(200).json({ message: "Joined community successfully", community });
  } catch (error) {
    console.error("Join community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { joinCommunity };
