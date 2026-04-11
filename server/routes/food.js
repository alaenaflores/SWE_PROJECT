const express = require("express");
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not logged in" });
    }
    next();
};

router.get("/search", requireAuth, async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${process.env.USDA_API_KEY}&pageSize=8`
        );
        const data = await response.json();
        const foods = (data.foods || []).map(food => ({
            fdcId: String(food.fdcId),
            name: food.description,
            servingSize: food.servingSize || 100,
            servingSizeUnit: food.servingSizeUnit || "g",
            nutrients: {
                calories: food.foodNutrients.find(n => n.nutrientId === 1008)?.value || 0,
                protein:  food.foodNutrients.find(n => n.nutrientId === 1003)?.value || 0,
                carbs:    food.foodNutrients.find(n => n.nutrientId === 1005)?.value || 0,
                fat:      food.foodNutrients.find(n => n.nutrientId === 1004)?.value || 0,
                fiber:    food.foodNutrients.find(n => n.nutrientId === 1079)?.value || 0,
            }
        }));
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: "Couldn't fetch food data." });
    }
});

module.exports = router;
