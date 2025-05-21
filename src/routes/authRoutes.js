const express = require('express');
const { body } = require('express-validator');
const { sendOTP, verifyOTP, resetPassword } = require('../Controllers/AuthController');
const router = express.Router();

// Register route
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').isIn(['user', 'organizer', 'admin']).withMessage('Invalid role')
    ],
    register
);

// Login route
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    login
);

// Request OTP for password reset
router.post(
    '/forgetPassword/request-otp',
    [body('email').isEmail().withMessage('Invalid email')],
    sendOTP
);

// Verify OTP
router.post(
    '/forgetPassword/verify-otp',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP')
    ],
    verifyOTP
);

// Reset Password with OTP
router.put(
    '/forgetPassword',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    resetPassword
);

module.exports = router;