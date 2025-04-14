const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const bcrypt = require('bcrypt');
const User = require('../model/user'); // Import the User model
const { sendOTP, verifyOTP, resetPassword } = require('../Controllers/AuthController'); // Import new controllers
const router = express.Router();

// Password reset route 
router.put(
    '/api/v1/forgetPassword',
    [
        body('email').isEmail().withMessage('Invalid email'), // b yValidate el email
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long') // b yValidate el password length
    ],
    async (req, res) => {
        // Check for ay validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, newPassword } = req.body;

        try {
            // Verify el user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // hena b nHash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update el user's password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// Request OTP 
router.post(
    '/api/v1/forgetPassword/request-otp',
    [body('email').isEmail().withMessage('Invalid email')], // b yValidate el email
    sendOTP
);

// Verify OTP 
router.post(
    '/api/v1/forgetPassword/verify-otp',
    [
        body('email').isEmail().withMessage('Invalid email'), // b yValidate el email
        body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP') // b yValidate el OTP length
    ],
    verifyOTP
);

// Reset Password with OTP 
router.put(
    '/api/v1/forgetPassword/reset',
    [
        body('email').isEmail().withMessage('Invalid email'), // b yValidate el email
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long') // b yValidate el password length
    ],
    resetPassword
);

module.exports = router;