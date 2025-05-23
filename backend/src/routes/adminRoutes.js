const express = require('express');
const { body } = require('express-validator'); // Import express-validator
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const {
    listUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../controllers/AdminController.js'); // Changed path to be more explicit
const adminMiddleware = require('../middlewares/adminMiddleware'); // Import admin middleware

// Admin routes
router.get('/users', verifyToken, adminMiddleware, listUsers);

router.get('/users/:id', verifyToken, adminMiddleware, getUser);

router.put(
    '/users/:id',
    [
        verifyToken,
        adminMiddleware,
        body('role')
          .notEmpty().withMessage('Role is required')
          .isIn(['user', 'organizer', 'admin']).withMessage('Role must be user, organizer, or admin')
    ],
    updateUserRole
);

router.delete('/users/:id', verifyToken, adminMiddleware, deleteUser);

module.exports = router;
