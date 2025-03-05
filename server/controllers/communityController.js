const Community = require('../models/Community');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get Community Details & Populate Members
const getCommunity = async (req, res) => {
    try {
        const { communityName } = req.params;

        const community = await Community.findOne({ name: communityName })
            .populate('members', 'username email'); // ✅ Populate members with usernames & emails

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        res.status(200).json({ community });
    } catch (error) {
        console.error("Error fetching community:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Join a Community (Prevents Duplicate Entries)
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already in the community
        if (community.members.includes(userId)) {
            return res.status(400).json({ message: "User already a member" });
        }

        // Add the user & save
        community.members.push(userId);
        await community.save();

        res.status(200).json({ message: "Joined community successfully", community });
    } catch (error) {
        console.error("Join community error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getCommunity, joinCommunity };
