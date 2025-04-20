const { validationResult } = require('express-validator');
<<<<<<< HEAD
const User = require('../model/user');

// Get User Profile
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
=======
const User = require('../model/User');

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
>>>>>>> origin/Lana-2
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Profile
<<<<<<< HEAD
exports.updateUser = async (req, res) => {
=======
exports.updateUserProfile = async (req, res) => {
>>>>>>> origin/Lana-2
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

<<<<<<< HEAD
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== req.params.id) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
        }

=======
>>>>>>> origin/Lana-2
        if (name) user.name = name;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};