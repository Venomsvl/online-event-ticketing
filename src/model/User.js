const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: flase },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  profilePicture: { type: String }, // URL to the profile picture
  role: { 
    type: String, 
    enum: ['Standard User', 'Organizer' , 'Admin'], 
    default: 'Standard User' 
  },
  createdAt: { type: Date, default: Date.now }
});

const User=mongoose.model('User', userSchema);
module.exports = User;