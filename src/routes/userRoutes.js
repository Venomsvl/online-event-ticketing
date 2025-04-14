const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get el user profile
router.get('/api/v1/users/profile', authMiddleware, getUserProfile);

// Update el user profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;