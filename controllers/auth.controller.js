const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/apiResponse")
const bcrypt = require("../.gitignore/node_modules/bcryptjs/umd");
const crypto = require("crypto");
const validator = require("validator");
const { generateAndSetTokens, generateToken } = require("../utils/generateToken");

const signup = asyncWrapper(async (req, res) => {

    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return errorResponse(res, "Invalid email format", 400);

    }

    if (!name || !email || !password) {
        return errorResponse(res, "all fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return errorResponse(res, "User is already existing")
    }

    const user = await User.create({ name, email, password });
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");


    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, rawToken);

    return successResponse(res, "Signup successful. Please check your email to verify your account.");


})


const verifyEmail = asyncWrapper(async (req, res) => {
    const { token } = req.query;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashed,
        emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send("Invalid or expired token");

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, "Email verified successfully");
})


const login = asyncWrapper(async (req, res) => {


    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return errorResponse(res, "Invalid email or password", 401);
    }


    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
        return errorResponse(res, "Incorrect password", 401);
    }

    if (!user.isEmailVerified) {
        return errorResponse(res, "Please verify your email before signing in", 403);
    }

    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );


    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response = {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    }

    return successResponse(res, response, 200);




})


const logout = asyncWrapper(async (req, res) => {


    const token = req.cookies.jwt;
    if (!token) {
        return res.status(200).json({ message: "Logged out successfully" });
    }


    const user = await User.findOne({ refreshToken: token });

    if (user) {
        user.refreshToken = null;   // clear token
        await user.save();
    }

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
    });

    return successResponse(res, "Logged out successfully");
})


module.exports = { verifyEmail, signup, login, logout }