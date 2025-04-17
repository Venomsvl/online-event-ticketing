const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getUser, updateUser } = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

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
);

module.exports = router;
