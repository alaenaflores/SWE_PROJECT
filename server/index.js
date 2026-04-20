const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
console.log("PORT from env:", process.env.PORT);
const app = express();
const session = require('express-session');
const User = require('./models/User.js');
const notificationsRoutes = require("./routes/notifications");
const startReminderJob = require("./jobs/reminderJob");
const { calculateNutrition } = require('./utils/gemini.js'); 
app.use(express.json()); 

app.post('/api/nutrition', async (req, res) => {
  const { height, weight, age, gender, activityLevel, goal } = req.body;
  
  const result = await calculateNutrition({ height, weight, age, gender, activityLevel, goal });
  
  res.json(result);
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(session({
    secret: "nutriventure-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 60
    }
}));


const authRoutes = require('./routes/auth.js');
const mealRoutes = require('./routes/meals.js');
const foodRoutes = require('./routes/food.js');
const adminRoutes = require('./routes/admin');

app.get("/test", (req, res) => {
    res.json({ message: "test route works" });
});
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/meals', mealRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/food', foodRoutes);


mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("MongoDB Connected");
        startReminderJob();
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
    console.log("MongoDB connection error:", err);
});