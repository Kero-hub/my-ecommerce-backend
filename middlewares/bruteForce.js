const { RateLimiterMongo } = require("../.gitignore/node_modules/rate-limiter-flexible/types");
const mongoose = require("mongoose");

const mongoConn = mongoose.connection;

// create limiter
const limiter = new RateLimiterMongo({
    storeClient: mongoConn,
    points: 5, // 5 wrong tries
    duration: 15 * 60, // per 15 minutes
    blockDuration: 15 * 60, // block for 15 minutes if exceeded
});

const bruteForceProtection = async (req, res, next) => {
    const ip = req.ip;

    try {
        await limiter.consume(ip);
        next();
    } catch (error) {
        return res.status(429).json({
            message: "Too many attempts. Try again in 15 minutes."
        });
    }
};

module.exports = bruteForceProtection;
