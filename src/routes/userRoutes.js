const express = require('express');
const { getUserProfile, updateUser } = require('../Controllers/UserController'); // Ensure correct import
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get user profile
router.get('/api/v1/users/profile', verifyToken, getUserProfile);

// Update user profile
router.put('/api/v1/users/profile', verifyToken, updateUser); // Use verifyToken middleware for consistency

module.exports = router;