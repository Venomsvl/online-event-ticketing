const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('[authMiddleware] Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[authMiddleware] Missing or malformed Authorization header');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[authMiddleware] Token extracted:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[authMiddleware] Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[authMiddleware] JWT Verification Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};