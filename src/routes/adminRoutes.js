const express = require('express');
const router = express.Router();
const { listUsers, getUser, updateUserRole, deleteUser } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Admin routes
router.get('/api/v1/users', authMiddleware, adminMiddleware, listUsers);
router.get('/api/v1/users/:id', authMiddleware, adminMiddleware, getUser);
router.put('/api/v1/users/:id', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/api/v1/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;