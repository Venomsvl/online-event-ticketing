const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../Controllers/AdminController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Use named import
const adminMiddleware = require('../middlewares/adminMiddleware'); // Should be a function

// Admin routes
router.get(
    '/users', 
    verifyToken, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    listUsers // Controller to list all users
);

router.get(
    '/users/:id', 
    verifyToken, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    getUser // Controller to get a single user by ID
);

router.put(
    '/users/:id',
    [
        verifyToken, // Ensure the user is authenticated
        adminMiddleware, // Ensure the user has admin privileges
        body('role')
          .notEmpty().withMessage('Role is required')
          .isIn(['user', 'organizer', 'admin']).withMessage('Role must be user, organizer, or admin')
    ],
    updateUserRole
);

router.delete(
    '/users/:id', 
    verifyToken, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    deleteUser // Controller to delete a user by ID
);

// Remove or fix the broken event route below if not needed
// router.put('/api/v1/events/:id', 
//     verifyToken,
//     adminMiddleware
//     // a controller for ????
// );

module.exports = router;
