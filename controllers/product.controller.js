const Product = require("../models/product.model");
const cloudinary = require("cloudinary")
const { successResponse, errorResponse } = require("../utils/apiResponse")
const asyncWrapper = require("../middlewares/asyncWrapper");


const getAllProducts = asyncWrapper(async (req, res) => {
    

    const product = await Product.find({});// find all products
    return successResponse(res, product);


})


const createProduct = asyncWrapper(async (req, res) => {
    

    const { name, description, price, image, category } = req.body;

    let clooudinaryResponse = null
    
    if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }


    const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        category,
    });

    return successResponse(res, product);

})

const deleteProduct = asyncWrapper(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return errorResponse("Product not found")
    }

    if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("deleted image from cloduinary");
        } catch (error) {
            console.log("error deleting image from cloduinary", error);
        }
    }

    await Product.findByIdAndDelete(req.params.id);

    return successResponse(res, "Product deleted successfully")
})


module.exports = { deleteProduct, createProduct, getAllProducts }