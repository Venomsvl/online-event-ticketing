const express = require('express');
const { body } = require('express-validator');
const { sendOTP, verifyOTP, resetPassword } = require('../Controllers/AuthController'); // Fixed casing to match the actual file path
const router = express.Router();

// Request OTP
router.post(
    '/api/v1/forgetPassword/request-otp',
    [body('email').isEmail().withMessage('Invalid email')],
    sendOTP
);

// Verify OTP
router.post(
    '/api/v1/forgetPassword/verify-otp',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP')
    ],
    verifyOTP
);

// Reset Password with OTP
router.put(
    '/api/v1/forgetPassword/reset',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    resetPassword
);

module.exports = router;