const { errorResponse } = require("../utils/apiResponse");

const asyncWrapper = (fn) => { // fn is the functions like on controller
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(`Error in ${fn.name || "async function"}: `, error.message);
            return errorResponse(res, "Internal server error", 500);
        }
    };
};

module.exports = asyncWrapper;