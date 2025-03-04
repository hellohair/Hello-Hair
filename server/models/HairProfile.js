const mongoose = require('mongoose');

const HairProfileSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hairType: { type: String, enum: ['Straight', 'Wavy', 'Curly', 'Coily'], default: 'Straight' },
  porosity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
  // Additional hair fields (e.g., density, texture) can be added later.
}, { timestamps: true });

module.exports = mongoose.model('HairProfile', HairProfileSchema);
