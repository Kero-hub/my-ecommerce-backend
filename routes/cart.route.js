const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.midlleware")

const { getCartProducts, addToCart, removeAll, updateQuantity } = require("../controllers/cart.controller")

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAll);
router.put("/:id", protectRoute, updateQuantity);

module.exports = router;