const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { calculateNutrition } = require('../utils/gemini.js');
const router = express.Router();

// Create an account
router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body
    try {
        if (!email || !password || !name) {
            return res.status(400).json({error: "Error: All marked input fields are required. Please try again."})
        }
        
        if (password.length < 8) {
            return res.status(400).json({error: "Error: Password must be at least 8 characters long. Please try again."})
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({error: 'Error: Email already exists. Please try again.'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            currentStreak: 0,
            longestStreak: 0
        })

        req.session.userId = newUser._id
        req.session.email = newUser.email
        req.session.name = newUser.name
        req.session.save(() =>{
            res.json({id: req.session.userId, email: newUser.email, name: newUser.name, currentStreak: newUser.currentStreak, longestStreak: newUser.longestStreak})
        })
        
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({error: "Error: Not able to create an account. Please try again."})
    }
})

// Login to account
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"})
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        req.session.userId = user._id
        req.session.email = user.email
        req.session.name = user.name
        req.session.save(() =>{
            res.json({id: req.session.userId, email: user.email, name: user.name, currentStreak: user.currentStreak, longestStreak: user.longestStreak})
        })
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
        const user = await User.findById(req.session.userId).select("email name currentStreak longestStreak height weight age gender activityLevel goal")

        res.json({
            id: req.session.userId,
            email: user.email,
            name: user.name,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            height: user.height,
            weight: user.weight,
            age: user.age,
            gender: user.gender,
            activityLevel: user.activityLevel,
            goal: user.goal,
            nutritionGoals: user.nutritionGoals
        });
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

router.post('/profile', async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "User is not logged in" });
        }

        const {
            height,
            weight,
            age,
            gender,
            activityLevel,
            goal
        } = req.body;

        let nutrition;
        try {
            nutrition = await calculateNutrition({ height, weight, age, gender, activityLevel, goal });
        } catch (err) {
            console.error("Nutrition error:", err);
            return res.status(500).json({ error: "Nutrition calculation failed" });
        }

        const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            height: Number(height),
            weight: Number(weight),
            age: Number(age),
            gender,
            activityLevel,
            goal,
            nutritionGoals: nutrition
        },
        { new: true }
        );

        res.json({success: true, nutrition});

        } catch (err) {
        res.status(500).json({ error: "Failed to save profile" });
    }
});

module.exports = router;
