const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLoggedDate: { type: Date },

    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    age: { type: Number, min: 0 },
    gender: String,
    activityLevel: String,
    goal: String,

    notificationSettings: {
        enabled: { type: Boolean, default: false },
        phoneNumber: { type: String, default: "" },

        breakfast: {
            enabled: { type: Boolean, default: true },
            time: { type: String, default: "08:00" }
        },

        lunch: {
            enabled: { type: Boolean, default: true },
            time: { type: String, default: "12:00" }
        },

        dinner: {
            enabled: { type: Boolean, default: true },
            time: { type: String, default: "18:30" }
        }
    },

    nutritionGoals: {
        calories: Number,
        protein_g: Number,
        carbs_g: Number,
        fats_g: Number,
        advice: String
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;