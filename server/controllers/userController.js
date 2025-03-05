const User = require('../models/User');

// Search users by username (case-insensitive)
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from request
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Perform case-insensitive search
        const users = await User.find({ 
            username: { $regex: query, $options: "i" } 
        }).select("username email profilePicture"); // Only return necessary fields

        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};
