const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to block non-admins
const requireAdmin = (req, res, next) => {
    console.log("Session:", req.session);
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};

// Get admin stats
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const totalUsers = await User.countDocuments();
        const activeToday = await User.countDocuments({ lastLoggedDate: { $gte: today } });
        const newSignups = await User.countDocuments({ createdAt: { $gte: thisMonth } });

        res.json({ totalUsers, activeToday, newSignups });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Get recent users
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('name email lastLoggedDate createdAt isAdmin')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;