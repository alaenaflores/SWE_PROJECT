const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => console.log(err));
