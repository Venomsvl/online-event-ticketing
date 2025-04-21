const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../Controllers/AdminController'); // Import admin controllers
const authMiddleware = require('../middlewares/authMiddleware'); // Import authentication middleware
const adminMiddleware = require('../middlewares/adminMiddleware'); // Import admin middleware

// Admin routes
router.get(
    '/api/v1/users', 
    authMiddleware, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    listUsers // Controller to list all users
);

router.get(
    '/api/v1/users/:id', 
    authMiddleware, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    getUser // Controller to get a single user by ID
);

router.put(
    '/api/v1/users/:id',
    [
        authMiddleware, // Ensure the user is authenticated
        adminMiddleware, // Ensure the user has admin privileges
        body('role').notEmpty().withMessage('Role is required') // Validate role input
    ],
    updateUserRole // Controller to update a user's role
);

router.delete(
    '/api/v1/users/:id', 
    authMiddleware, // Ensure the user is authenticated
    adminMiddleware, // Ensure the user has admin privileges
    deleteUser // Controller to delete a user by ID
);

module.exports = router;