const { validationResult } = require('express-validator');
const User = require('../model/User');
const PasswordReset = require('../model/passwordReset');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

// Register a new user
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;
        console.log('[REGISTER] Attempting to register user:', { name, email, role });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('[REGISTER] User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('[REGISTER] Creating new user...');
        console.log('[REGISTER] Saving user to database...');

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: role || 'user'
        });

        await user.save();
        console.log('[REGISTER] User saved successfully:', email);

        // Generate JWT token
        console.log('[REGISTER] Generating JWT token...');
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log('[REGISTER] Registration completed successfully for:', email);
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('[REGISTER] Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('[LOGIN] Attempting login for:', email);

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[LOGIN] No user found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.checkPassword(password);
        console.log('[LOGIN] Password check result:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log('[LOGIN] Login successful for:', email);
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hardcoded admin credentials (in production, this should be in a secure database)
        const ADMIN_USERS = [
            { username: 'Lana', password: 'lana123' },
            { username: 'Salma', password: 'salma123' },
            { username: 'Muna', password: 'muna123' },
            { username: 'Party', password: 'party123' },
            { username: 'Aya', password: 'aya123' }
        ];

        const admin = ADMIN_USERS.find(
            (u) => u.username === username && u.password === password
        );

        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Generate JWT token for admin
        const token = jwt.sign(
            { username: admin.username, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            message: 'Admin login successful',
            user: {
                username: admin.username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('[ADMIN LOGIN] Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

// Send OTP for password reset
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('[SEND OTP] Request received for email:', email);

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[SEND OTP] User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this user
        await PasswordReset.deleteMany({ email });

        // Create new OTP record
        await PasswordReset.create({ email, otp, expiresAt });

        // Prepare email content
        const emailText = `
Hello ${user.name},

You requested to reset your password.

Your OTP code is: ${otp}

This code will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,
Tixify Team
        `;

        // Send email
        await sendEmail({
            to: email,
            subject: 'Password Reset OTP',
            text: emailText
        });

        console.log('[SEND OTP] OTP sent successfully to:', email);
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('[SEND OTP] Error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log('[VERIFY OTP] Attempting to verify OTP for:', email);

        // Find valid OTP record
        const record = await PasswordReset.findOne({
            email,
            otp,
            expiresAt: { $gt: Date.now() },
            used: false
        });

        if (!record) {
            console.log('[VERIFY OTP] Invalid or expired OTP for:', email);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark OTP as used
        record.used = true;
        await record.save();

        console.log('[VERIFY OTP] OTP verified successfully for:', email);
        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('[VERIFY OTP] Error:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log('[RESET PASSWORD] Password reset requested for:', email);

        // Validate password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long' 
            });
        }

        // Find user and verify OTP
        const [user, otpRecord] = await Promise.all([
            User.findOne({ email }),
            PasswordReset.findOne({
                email,
                otp,
                expiresAt: { $gt: Date.now() },
                used: true
            })
        ]);

        if (!user) {
            console.log('[RESET PASSWORD] User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        if (!otpRecord) {
            console.log('[RESET PASSWORD] Invalid or expired OTP for:', email);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Delete used OTP
        await PasswordReset.deleteOne({ _id: otpRecord._id });

        console.log('[RESET PASSWORD] Password reset successful for:', email);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('[RESET PASSWORD] Error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('[DELETE USER] Error:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};