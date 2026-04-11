const mongoose = require("mongoose");

const MealItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        fdcId: { type: String, default: "" },        
        quantity: { type: Number, default: 1 },  
        servingSize: { type: String, default: "" },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
    },
    { _id: false }
);

const MealSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: { type: String, required: true },
        mealType: { type: String, required: true },
        items: { type: [MealItemSchema], default: [] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);