// server/models/HairProfile.js
const mongoose = require('mongoose');

const HairProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hairType: { type: String, default: '' },
  porosity: { type: String, default: '' },
  density: { type: String, default: '' },
  texture: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('HairProfile', HairProfileSchema);
