const User = require('../model/User');

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a user's role
exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    if (!['user', 'organizer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role value' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        const result = user.toObject();
        delete result.password;
        res.status(200).json({ message: 'User role updated', user: result });
    } catch (err) {
        console.error('[AdminController.updateUserRole]', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('[AdminController.deleteUser]', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
