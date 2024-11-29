const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { addToBlacklist } = require('../services/blacklistservice');
const router = express.Router();

// Dashboard route with role-based content
router.get('/dashboard', auth(['Admin', 'Moderator', 'User']), async (req, res) => {
    try {
        const { role, id } = req.user;

        // Fetch current user's information
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Role-specific logic
        let users = [];
        if (role === 'Admin') {
            // Admin sees all users except other Admins (so we filter out Admins)
            users = await User.find({ role: { $in: ['User', 'Moderator'] } });
        } else if (role === 'Moderator') {
            // Moderator sees only Users
            users = await User.find({ role: 'User' });
        } else if (role === 'User') {
            // Users only see their own details
            return res.status(200).json({
                message: `Welcome ${role} ${user.name}`,
                username: user.name,
                users: [] // No other users for normal users
            });
        }

        // Return data based on the user's role
        return res.status(200).json({
            message: `Welcome ${role} ${user.name}`,
            username: user.name,
            role,  // Send the role in the response so frontend can check it
            users, // Send the appropriate user list based on role
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Promote a user (Admin can promote to Moderator or Admin)
router.put('/promote', auth(['Admin', 'Moderator']), async (req, res) => {
    const { userId, newRole } = req.body;
    const { role } = req.user;

    // Validate new role
    if (!['Admin', 'Moderator', 'User'].includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role for promotion/demotion' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self-demotion for Admin
        if (user._id.toString() === req.user.id && newRole !== 'Admin') {
            return res.status(403).json({ message: 'You cannot change your own role' });
        }

        // Only Admin can promote to Admin
        if (role === 'Moderator' && newRole === 'Admin') {
            return res.status(403).json({ message: 'Moderators cannot promote to Admin' });
        }

        // Moderator can promote to Moderator only
        if (role === 'Moderator' && newRole !== 'Moderator') {
            return res.status(403).json({ message: 'Moderators can only promote to Moderator' });
        }

        // Admin can promote to Admin, but only to Users or Moderators
        if (role === 'Admin' && newRole === 'Admin' && user.role !== 'User' && user.role !== 'Moderator') {
            return res.status(403).json({ message: 'Admin can only promote Users or Moderators to Admin' });
        }

        // Update role
        user.role = newRole;
        await user.save();

        return res.status(200).json({ message: `${user.name} has been updated to ${newRole}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating user role' });
    }
});

// Logout route (for front-end to clear token)
router.post('/logout', auth(['Admin', 'Moderator', 'User']), (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        addToBlacklist(token); // Blacklist the token
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error logging out' });
    }
});

module.exports = router;
