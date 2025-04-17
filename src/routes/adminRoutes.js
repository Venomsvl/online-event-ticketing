const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../controllers/AdminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// List all users
router.get('/users', verifyToken, adminMiddleware, listUsers);

// Get a single user by ID
router.get('/users/:id', verifyToken, adminMiddleware, getUser);

// Update a user's role
router.put(
    '/users/:id',
    [
        verifyToken,
        adminMiddleware,
        body('role').notEmpty().withMessage('Role is required')
    ],
    updateUserRole
);

// Delete a user by ID
router.delete('/users/:id', verifyToken, adminMiddleware, deleteUser);

module.exports = router;