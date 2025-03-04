const User = require('../models/User');
const HairProfile = require('../models/HairProfile');

exports.updateHairProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { hairType, porosity, density } = req.body;

    let profile = await HairProfile.findOne({ user: userId });

    if (!profile) {
      profile = new HairProfile({ user: userId, hairType, porosity, density });
    } else {
      profile.hairType = hairType;
      profile.porosity = porosity;
      profile.density = density;
    }

    await profile.save();

    // Mark hair profile as completed
    await User.findByIdAndUpdate(userId, { hairProfileCompleted: true });

    return res.status(200).json({ message: 'Hair profile completed!', profile });
  } catch (error) {
    console.error('Hair Profile Update Error:', error);
    return res.status(500).json({ message: 'Failed to complete hair profile' });
  }
};
