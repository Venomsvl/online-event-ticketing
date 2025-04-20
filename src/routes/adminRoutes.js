const express = require('express');
<<<<<<< HEAD
const { body } = require('express-validator');
=======
const { body } = require('express-validator'); // Import express-validator
>>>>>>> origin/Lana-2
const router = express.Router();
const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
<<<<<<< HEAD
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
=======
} = require('../controllers/adminController'); // Import admin controllers
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
>>>>>>> origin/Lana-2

module.exports = router;