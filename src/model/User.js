const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // URL to the profile picture
  role: { 
    type: String, 
    enum: ['Standard User', 'Organizer', 'System Admin'], 
    default: 'Standard User' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);