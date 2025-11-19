const successResponse = (res, data, statusCode = 200) => {
    
    return res.statusCode(statusCode).json({

        success: true,
        data,

    })

}
const errorResponse = (res, error, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        error,
    })
};

module.exports = { successResponse, errorResponse };