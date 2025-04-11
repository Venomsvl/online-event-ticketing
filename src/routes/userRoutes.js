const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user profile
router.get('/api/v1/users/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/api/v1/users/profile', authMiddleware, updateUserProfile);

module.exports = router;