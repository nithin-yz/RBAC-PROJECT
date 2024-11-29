const jwt = require('jsonwebtoken');

const auth = (roles) => (req, res, next) => {
    try {
        console.log("worked auth");

        // Get the token from the Authorization header (with Bearer prefix)
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(403).json({ message: 'Access denied, no token provided' });
        }

        // Ensure the token format is correct (should be "Bearer <token>")
        if (!token.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Invalid token format. Should be Bearer <token>' });
        }

        const jwtToken = token.split(' ')[1]; // Extract token after 'Bearer'
        const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);

        req.user = verified;

        console.log("Token verified", verified);
        
        // Check if the user has the required role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        console.log("Moving to next");
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Invalid token or error verifying token' });
    }
};

module.exports = auth;
