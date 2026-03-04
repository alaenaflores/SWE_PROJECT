const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
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
app.use('/auth', authRoutes);

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => console.log(err));
