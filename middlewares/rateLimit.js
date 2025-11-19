const rateLimit = require("../.gitignore/node_modules/express-rate-limit/dist/index.d.cts");

// Limit requests to login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts only
    message: {
        status: 429,
        message: "Too many login attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limit signups
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // only 5 signups/hour
    message: {
        status: 429,
        message: "Too many signup attempts. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, signupLimiter };
