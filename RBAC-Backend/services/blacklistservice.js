const jwt = require('jsonwebtoken');
const blacklist = new Set();

const addToBlacklist = (token) => {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
        const expiry = decoded.exp * 1000; // Convert to milliseconds
        blacklist.add(token);

        // Auto-remove the token after it expires
        setTimeout(() => {
            blacklist.delete(token);
        }, expiry - Date.now());
    }
};

const isTokenBlacklisted = (token) => blacklist.has(token);

module.exports = { addToBlacklist, isTokenBlacklisted };
