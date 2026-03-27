const express = require("express");
const Meal = require("../models/Meal");
const User = require("../models/User");

const router = express.Router();
const  updateStreak = require("../utils/updateStreak");

const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not logged in" });
    }
    next();
};

router.post("/", requireAuth, async (req, res) => {
    try {
        const { date, mealType, items } = req.body;
        const user = await User.findById(req.session.userId);

        if (!date || !mealType) {
            return res.status(400).json({ error: "Date and meal type are required" });
        }

        const meal = await Meal.create({
            userId: req.session.userId,
            date,
            mealType,
            items: items || []
        });

        updateStreak(user);
        await user.save();

        res.status(201).json({meal, currentStreak: user.currentStreak});
    } catch (error) {
        res.status(500).json({ error: "Could not create meal" });
    }
});

router.get("/", requireAuth, async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch meals" });
    }
});

module.exports = router;