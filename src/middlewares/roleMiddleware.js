module.exports = function(requiredRole) {
    return (req, res, next) => {
        if (!req.user || req.user.role.toLowerCase() !== requiredRole.toLowerCase()) {
            return res.status(403).json({ message: `Access denied. ${requiredRole}s only.` });
        }
        next();
    };
};
