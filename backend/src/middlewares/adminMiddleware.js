module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') { // Ensure req.user exists and has the admin role
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};