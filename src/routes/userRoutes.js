const express = require('express');
const { body } = require('express-validator');
<<<<<<< HEAD
const router = express.Router();
const { getUser, updateUser } = require('../controllers/UserController');
=======
const { getUserProfile, updateUserProfile } = require('../controllers/UserController');
>>>>>>> origin/Lana-2
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

<<<<<<< HEAD
// Define routes
router.get('/:id', authMiddleware.verifyToken, getUser); // Get user by ID

// Add validation for updating a user
router.put(
    '/:id',
    [
        authMiddleware.verifyToken,
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required')
    ],
    updateUser
=======
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
>>>>>>> origin/Lana-2
);

module.exports = router;
