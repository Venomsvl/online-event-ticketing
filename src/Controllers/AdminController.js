const User = require('../model/user');

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const User = require('../model/User');

// GET /api/v1/admin/users
// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('[AdminController.listUsers]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/v1/admin/users/:id
// Get details of a single user (admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('[AdminController.getUser]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/v1/admin/users/:id
// Update a user's role (admin only)
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

// DELETE /api/v1/admin/users/:id
// Delete a user (admin only)
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
