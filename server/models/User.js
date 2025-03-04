const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  hairProfileCompleted: { type: Boolean, default: false },
  latestCurlQuiz: { type: mongoose.Schema.Types.ObjectId, ref: 'CurlQuiz' },
  community: { type: String, default: "" }  // New field for assigned community
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
