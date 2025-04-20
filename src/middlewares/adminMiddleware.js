module.exports = (req, res, next) => {
<<<<<<< HEAD
    if (!req.user || req.user.role !== 'admin') {
=======
    if (!req.user || req.user.role !== 'admin') { // Ensure req.user exists and has the admin role
>>>>>>> origin/Lana-2
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};