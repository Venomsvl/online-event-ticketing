const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, 
  role: { 
    type: String, 
    enum: ['Standard User', 'Organizer' , 'Admin'], 
    default: 'Standard User' 
  },
  createdAt: { type: Date, default: Date.now }
});

const User=mongoose.model('User', userSchema);
module.exports = User;