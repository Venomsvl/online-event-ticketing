const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get el user profile
router.get('/api/v1/users/profile', authMiddleware, getUserProfile);

// Update user profile
router.put(
    '/api/v1/users/profile',
    [
        authMiddleware,
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email')
    ],
    updateUserProfile
);

module.exports = router;