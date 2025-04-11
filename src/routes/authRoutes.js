const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const bcrypt = require('bcrypt');
const User = require('../model/user'); // Import the User model
const router = express.Router();

// Password reset route
router.put(
    '/api/v1/forgetPassword',
    [
        body('email').isEmail().withMessage('Invalid email'), // Validate email
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long') // Validate password length
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, newPassword } = req.body;

        try {
            // Verify user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;