const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Correct import
const adminMiddleware = require('../middlewares/adminMiddleware'); // Correct import

// List all users
router.get('/api/v1/users', verifyToken, adminMiddleware, listUsers);

// Get a single user by ID
router.get('/api/v1/users/:id', verifyToken, adminMiddleware, getUser);

// Update a user's role
router.put(
    '/api/v1/users/:id',
    [
        verifyToken,
        adminMiddleware,
        body('role').notEmpty().withMessage('Role is required')
    ],
    updateUserRole
);

// Delete a user by ID
router.delete('/api/v1/users/:id', verifyToken, adminMiddleware, deleteUser);

module.exports = router;