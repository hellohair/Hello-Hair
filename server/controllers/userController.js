const User = require('../models/User');

exports.updateLocation = async (req, res) => {
  try {
    const { country, city } = req.body;
    const userId = req.userId; // from authMiddleware
    
    // Update the user's geographical info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { country, city },
      { new: true }
    );
    
    res.json({ message: 'Location updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Location Update Error:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
};
