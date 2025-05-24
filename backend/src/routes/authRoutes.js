const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Register route
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
            .isIn(['user', 'organizer']).withMessage('Role must be either user or organizer')
    ],
    authController.register
);

// Other auth routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;