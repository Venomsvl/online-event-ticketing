const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../Controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put(
    '/profile',
    [
        authMiddleware,
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email')
    ],
    updateUserProfile
);

module.exports = router;
