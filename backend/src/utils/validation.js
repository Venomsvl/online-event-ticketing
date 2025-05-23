const { body } = require('express-validator');

const validateEmail = body('email').isEmail().withMessage('Invalid email');
const validatePassword = body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long');
const validateName = body('name').notEmpty().withMessage('Name is required');

module.exports = {
    validateEmail,
    validatePassword,
    validateName
};