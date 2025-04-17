const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const AuthController = require('../Controllers/AuthController'); // Ensure correct path

// Define routes
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    AuthController.register
);

router.post('/login', AuthController.login); // Ensure the method exists and is correctly referenced

router.post(
    '/forget-password',
    [body('email').isEmail().withMessage('Valid email is required')],
    AuthController.forgetPassword
);

module.exports = router;