const { validationResult } = require('express-validator');
<<<<<<< HEAD
const User = require('../model/User');
=======
const User = require('../models/User'); // Fixed casing
>>>>>>> muna

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
<<<<<<< HEAD
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
=======
        const user = await User.findById(req.user.id).select('-password');
>>>>>>> muna
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};