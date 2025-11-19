const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

app.use(express.json({ limit: "10mb" })); // 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());


const authRoutes= require("./routes/auth.route")


app.use("/api/auth", authRoutes)

dotenv.config()


app.get('/', (req, res) => {
    res.send('E-commerce Backend Server Running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });


