const { body } = require('express-validator');

const validateEmail = body('email').isEmail().withMessage('Invalid email');
const validatePassword = body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/)
    .withMessage('Password must contain at least one letter and one number');
const validateName = body('name').notEmpty().withMessage('Name is required');

module.exports = {
    validateEmail,
    validatePassword,
    validateName
};