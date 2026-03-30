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
    goal: String
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
