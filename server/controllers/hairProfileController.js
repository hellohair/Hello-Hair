// server/controllers/hairProfileController.js
const HairProfile = require('../models/HairProfile');
const User = require('../models/User');

const updateHairProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { hairType, porosity, density, texture } = req.body;

    let hairProfile = await HairProfile.findOne({ user: userId });
    if (!hairProfile) {
      // Create new hair profile
      hairProfile = new HairProfile({
        user: userId,
        hairType,
        porosity,
        density,
        texture
      });
    } else {
      // Update existing hair profile
      hairProfile.hairType = hairType;
      hairProfile.porosity = porosity;
      hairProfile.density = density;
      hairProfile.texture = texture;
    }

    await hairProfile.save();

    // Optionally mark user as having completed their hair profile
    await User.findByIdAndUpdate(userId, { hairProfileCompleted: true });

    res.status(200).json({
      message: "Hair profile updated successfully!",
      profile: hairProfile,
    });
  } catch (error) {
    console.error("Hair profile update error:", error.message);
    res.status(500).json({ message: "Failed to update hair profile" });
  }
};

module.exports = { updateHairProfile };
