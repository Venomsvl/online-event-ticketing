const { validationResult } = require('express-validator');
const User = require('../model/User'); // Ensure the file name matches exactly
const PasswordReset = require('../model/passwordReset'); // Ensure the file name matches exactly
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService'); // Ensure the file name matches exactly

// Register a new user
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("=== Incoming login ===");
        console.log("req.body:", req.body);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('[LOGIN] No user found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('[LOGIN] bcrypt.compare result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, // Use the secret key from .env
            { expiresIn: '1h' }
        );

        console.log('Generated token:', token); // Log the generated token
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
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

// Reset Password (after OTP verification)
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

