// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  hairProfileCompleted: { type: Boolean, default: false } // profile incomplte without hair profile
  // country, city, or other fields can stay if you want
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
