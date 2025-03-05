const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId)
            .populate('followers', 'username email') // Populate followers with usernames/emails
            .populate('following', 'username email'); // Populate following with usernames/emails

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const postCount = await Post.countDocuments({ user: userId });

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers, // Send full list of followers
            following: user.following, // Send full list of following
            followersCount: user.followers.length,
            followingCount: user.following.length,
            postCount
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update User Profile (Profile Picture, Bio)
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { profilePicture, bio } = req.body;

        // Ensure userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, 
            { profilePicture, bio }, { new: true });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Follow / Unfollow a User
exports.toggleFollow = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentUserId } = req.body; // Pass the logged-in user ID from the frontend

        // Ensure both IDs are valid
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Prevent self-following
        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }


        const currentUser = await User.findById(currentUserId);
        const userToFollow = await User.findById(userId);

        if (!currentUser || !userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow logic
            currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
            await currentUser.save();
            await userToFollow.save();
            return res.json({ message: "Unfollowed", following: currentUser.following });
        } else {
            // Follow logic
            currentUser.following.push(userId);
            userToFollow.followers.push(currentUserId);
            await currentUser.save();
            await userToFollow.save();
            return res.json({ message: "Followed", following: currentUser.following });
        }
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
