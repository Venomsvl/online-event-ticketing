const mongoose = require('mongoose');
<<<<<<< HEAD
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Skip hashing if the password is not modified
    }

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
=======

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
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
