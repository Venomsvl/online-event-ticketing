const express = require('express');
const { body } = require('express-validator');
const {
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword,
    deleteUser
} = require('../Controllers/AuthController');
const { verifyToken } = require('../middlewares/authMiddleware');

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

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], login);

// Protected routes
router.post('/logout', verifyToken, logout);

// Password reset routes
router.post('/send-otp', [
    body('email').isEmail().withMessage('Invalid email')
], sendOTP);

router.post('/verify-otp', [
    body('email').isEmail().withMessage('Invalid email'),
    body('otp').notEmpty().withMessage('OTP is required')
], verifyOTP);

router.post('/reset-password', [
    body('email').isEmail().withMessage('Invalid email'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/)
        .withMessage('Password must contain at least one letter and one number')
], resetPassword);

// Admin routes
router.delete('/users/:id', verifyToken, deleteUser);

module.exports = router;