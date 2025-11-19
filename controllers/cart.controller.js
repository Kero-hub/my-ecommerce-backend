const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/product.model");
const { successResponse } = require("../utils/apiResponse");

const getCartProducts = asyncWrapper(async (req, res) => {
    
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
        return { ...product.toJSON(), quantity: item.quantity };
    });

    return successResponse(cartItems)



})


const addToCart = asyncWrapper(async (req, res) => {
    
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push(productId);
    }

    await user.save();
    return successResponse(res,cartItems)

})

const removeAll = asyncWrapper(async (req, res) => {
    
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
        user.cartItems = [];
    } else {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return successResponse(res,cartItems)
})

const updateQuantity = asyncWrapper(async (req, res) => {
    
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
        if (quantity === 0) {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
            await user.save();
            return res.json(user.cartItems);
        }

        existingItem.quantity = quantity;
        await user.save();
        return successResponse(res,user.cartItems);



    }else {
        res.status(404).json({ message: "Product not found" });
    }

})

module.exports = { getCartProducts, addToCart, removeAll, updateQuantity };
