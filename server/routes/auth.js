const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Create an account
router.post('/signup', async (req, res) => {
    const {name, username, password} = req.body
    try {
        if (!username || !password || !name) {
            return res.status(400).json({error: "Error: All marked input fields are required. Please try again."})
        }
        
        if (password.length < 8) {
            return res.status(400).json({error: "Error: Password must be at least 8 characters long. Please try again."})
        }

        const existingUser = await User.findOne({ username })

        if (existingUser) {
            return res.status(400).json({error: 'Error: Username already exists. Please try again.'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword
        })

        req.session.userId = newUser._id
        req.session.username = newUser.username
        req.session.name = newUser.name

        res.json({id: req.session.userId, username: newUser.username, name: newUser.name})
    } catch (error) {
        res.status(500).json({error: "Error: Not able to create an account. Please try again."})
    }
})

// Login to account
router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({error: "Username and password are required"})
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({error: "Invalid username or password"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({error: "Invalid username or password"})
        }

        req.session.userId = user._id
        req.session.username = user.username
        req.session.name = user.name

        res.json({id: req.session.userId, username: user.username, name: user.name})
    } catch (error) {
        res.status(500).json({error: "Not able to login."})
    }
})

// Verifies if user is logged in 
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({message: "Not logged in"})
    }

    try {
        const user = await User.findById(req.session.userId).select("username name")

        res.json({id: req.session.userId, username: user.username, name: user.name})
    } catch (error) {
        res.status(500).json({error: "Error fetching user session data"})
    }
})

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({error: 'Failed to log out'});
        }
        res.clearCookie('connect.sid'); 
        res.json({message: 'Logged out successfully'});
    });
});

module.exports = router
