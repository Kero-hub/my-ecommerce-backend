

const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); 


const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

const generateAndSetTokens = async (userId, res) => {   
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found during token generation");
        }

        const accessToken = generateToken(
            { id: user._id, role: user.role }, // Payload
            process.env.ACCESS_TOKEN_SECRET,
            "15m" // 15 دقيقة
        );


        const refreshToken = generateToken(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            "7d" // 7 أيام
        );


        user.refreshToken = refreshToken;
        await user.save();

        // 4. تعيين Refresh Token كـ HTTP-Only Cookie
        res.cookie("refreshToken", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV !== "development", 
            sameSite: "strict", // حماية ضد CSRF
        });

        return accessToken;
    } catch (error) {
        console.error("Error generating tokens:", error.message);
        throw new Error("Token generation failed");
    }
};

module.exports = { generateAndSetTokens, generateToken };