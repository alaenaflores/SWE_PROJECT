const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
console.log("PORT from env:", process.env.PORT);
const app = express();
const session = require('express-session');

app.use(express.json());

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

app.get("/test", (req, res) => {
    res.json({ message: "test route works" });
});
app.use('/auth', authRoutes);
app.use('/meals', mealRoutes);


mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("MongoDB Connected");
        const PORT = process.env.PORT || 5050;

        mongoose.connect(process.env.DB_URI)
            .then(() => {
                console.log("MongoDB Connected");
                app.listen(PORT, () => {
                    console.log(`Server running on port ${PORT}`);
                });
            })
            .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
