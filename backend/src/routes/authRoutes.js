const express = require('express');
const { body } = require('express-validator');
const {
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword
} = require('../Controllers/AuthController');
const router = express.Router();

// Register route with validation
router.post(
    '/register',
    [
        body('name')
            .notEmpty().withMessage('Name is required')
            .trim(),
        body('email')
            .isEmail().withMessage('Invalid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/)
            .withMessage('Password must contain at least one letter and one number'),
        body('role')
            .optional()
            .isIn(['user', 'organizer']).withMessage('Role must be either user or organizer')
    ],
    register
);

// Routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;