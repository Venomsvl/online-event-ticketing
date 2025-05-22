const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    register,
    login,
    adminLogin,
    logout,
    deleteUser
} = require('../Controllers/AuthController');

// Register route
router.post(
    '/register',
    [
        body('name')
            .notEmpty().withMessage('Name is required')
            .trim(),
        body('email')
            .isEmail().withMessage('Invalid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/)
            .withMessage('Password must contain at least one letter and one number'),
        body('role')
            .isIn(['user', 'organizer']).withMessage('Role must be either user or organizer')
    ],
    register
);

// Login routes
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Logout route
router.post('/logout', logout);

// User management route
router.delete('/users/:id', deleteUser);

module.exports = router;