// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

// Middleware to check if user has organizer role
const isOrganizer = (req, res, next) => {
    if (req.user && req.user.role === 'organizer') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Organizer role required.' });
    }
};

module.exports = { isAdmin, isOrganizer }; 