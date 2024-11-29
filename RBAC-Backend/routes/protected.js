const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();

// Dashboard route with role-based content
router.get('/dashboard', auth(['Admin', 'Moderator', 'User']), async (req, res) => {
    try {
        console.log("worked")
        console.log(req.user)
        const { role, id } = req.user;
        const user = await User.findById(id);  // Get the logged-in user

        // Admin Dashboard
        if (role === 'Admin') {
            const users = await User.find();  // Admin can see all users
            return res.status(200).json({ 
                message: `you are ${user.role} of this site`, 
                username:user.name,
                users: users  // Send all users data
            });
        }

        // Moderator Dashboard
        if (role === 'Moderator') {
            const users = await User.find({ role: 'User' });  // Moderator sees only Users
            return res.status(200).json({
                message: `Welcome Moderator ${user.name}`, 
                users: users  // Send users who are not moderators
            });
        }

        // User Dashboard
        if (role === 'User') {
            return res.status(200).json({
                message: `Welcome ${user.name}, You are a Member!`, 
                users: []  // No user list for regular users
            });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Promote a user (Admin can promote to Moderator or Admin)
router.put('/promote', auth(['Admin']), async (req, res) => {
    const { userId, newRole } = req.body;  // userId of the user to promote

    if (!['Admin', 'Moderator'].includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role for promotion' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = newRole;  // Assign new role
        await user.save();

        return res.status(200).json({ message: `${user.name} has been promoted to ${newRole}` });
    } catch (err) {
        return res.status(500).json({ message: 'Error promoting user' });
    }
});

// Logout route (for front-end to clear token)
router.post('/logout', auth(['Admin', 'Moderator', 'User']), (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
