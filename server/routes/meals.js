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
            items: (items || []).map(item => ({   
                name:        item.name,
                fdcId:       item.fdcId       || "",
                quantity:    item.quantity    || 1,
                servingSize: item.servingSize || 100,
                calories:    item.calories    || 0,
                protein:     item.protein     || 0,
                carbs:       item.carbs       || 0,
                fat:         item.fat         || 0,
                fiber:       item.fiber       || 0,
            }))
        });

        updateStreak(user);
        await user.save();
        res.status(201).json({ meal, currentStreak: user.currentStreak });
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
// Edit a meal by ID
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { mealType, items } = req.body;
        const mealId = req.params.id;

        if (!mealType || !items) {
            return res.status(400).json({ error: "Meal type and items are required" });
        }

        // Find the meal by ID and update
        const meal = await Meal.findByIdAndUpdate(
            mealId,
            { mealType, items },
            { new: true }  // This will return the updated meal
        );

        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: "Could not update meal" });
    }
});
// Delete a meal by ID
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const mealId = req.params.id;

        // Find and delete the meal by ID
        const meal = await Meal.findByIdAndDelete(mealId);

        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        res.json({ message: "Meal deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete meal" });
    }
});
module.exports = router;
