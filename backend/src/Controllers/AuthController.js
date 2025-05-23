const { validationResult } = require('express-validator');
const User = require('../model/User'); // Adjust if your folder is 'model'
const PasswordReset = require('../model/passwordReset'); // Adjust if your folder is 'model'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

// Register a new user
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[REGISTER] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    console.log('[REGISTER] Attempting to register user:', { name, email, role });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('[REGISTER] User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user (password will be hashed by the User model's pre-save middleware)
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        console.log('[REGISTER] User registered successfully:', email);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('[REGISTER] Error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempting login for:', email);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[LOGIN] No user found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // If you have a checkPassword method on your User model, use it. Otherwise, use bcrypt.compare
        const isMatch = user.checkPassword
            ? await user.checkPassword(password)
            : await bcrypt.compare(password, user.password);

        console.log('[LOGIN] Password check result:', isMatch);

        if (!isMatch) {
            console.log('[LOGIN] Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Set JWT as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        console.log('[LOGIN] Login successful for:', email);
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('[LOGIN] Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Logout user (clear cookie)
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
};

// Request OTP for password reset
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await PasswordReset.create({ email, otp, expiresAt });

        const emailText = `
Hello,

You requested to reset your password.

Your OTP code is: ${otp}

This code will expire in 10 minutes.

If you did not request this, please ignore this email.
        `;

        await sendEmail(email, 'Your Password Reset OTP', emailText);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error during OTP generation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const record = await PasswordReset.findOne({
            email,
            otp,
            expiresAt: { $gt: Date.now() }
        });
        if (!record) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await PasswordReset.deleteOne({ _id: record._id });
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the password (it will be hashed by the User model's pre-save middleware)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a user by ID (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error during user deletion:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};