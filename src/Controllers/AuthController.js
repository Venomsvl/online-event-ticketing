const express = require('express');
const { validationResult } = require('express-validator'); // Import validationResult
const User = require('../model/user'); // Assuming you have a User model
const bcrypt = require('bcrypt');

class AuthController {
	// Login method
	login(req, res) {
		const { username, password } = req.body;

		// Example validation logic
		if (username === 'admin' && password === 'password') {
			res.status(200).json({ message: 'Login successful' });
		} else {
			res.status(401).json({ message: 'Invalid credentials' });
		}
	}

	// Register method
	register(req, res) {
		// Implement the register logic
		res.send('Register endpoint hit');
	}

	// Forget password method
	async forgetPassword(req, res) {
		// Check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, newPassword } = req.body;

		try {
			// Verify user by email
			const user = await User.findOne({ email });
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Hash the new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);

			// Update the user's password
			user.password = hashedPassword;
			await user.save();

			res.status(200).json({ message: 'Password reset successful' });
		} catch (error) {
			res.status(500).json({ message: 'Server error', error: error.message });
		}
	}
}

module.exports = new AuthController();
