const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const emailValidator = require('email-validator');  // For email format validation

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log("Password received:", password);

        // Check if email is valid
        if (!emailValidator.validate(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if a user already exists with the provided email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Validate password strength (example: at least 8 characters, one uppercase, one number)
        const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrengthRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters, contain one uppercase letter, and one number' });
        }

        // Check if role is valid
        if (role === "Admin" || role === "Moderator") {
            console.log("Invalid role for registration");
            return res.status(400).json({ message: 'Please register as user first' });
        }

        // Hash the password only once
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Server error" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const trimmedPassword = password.trim();  
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register.' });
        }
       
        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);

        ;  // Debug log for password matching

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password. Please try again.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

module.exports = router;