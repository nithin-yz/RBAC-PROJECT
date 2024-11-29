const { isTokenBlacklisted } = require('../services/blacklistservice');

const auth = (roles) => (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(403).json({ message: 'Access denied, no token provided' });
        }

        if (!token.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Invalid token format. Should be Bearer <token>' });
        }

        const jwtToken = token.split(' ')[1];

        // Check if the token is blacklisted
        if (isTokenBlacklisted(jwtToken)) {
            return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
        }

        const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = verified;

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: 'Invalid token or error verifying token' });
    }
};

module.exports = auth;
