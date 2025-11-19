const express = require("express");
const router = express.Router();
const { protectRoute, adminRoute } = require("../middlewares/auth.midlleware")
const { deleteProduct, createProduct, getAllProducts } = require("../controllers/product.controller");


router.get("/", protectRoute, adminRoute, getAllProducts);
router.post("/", protectRoute, adminRoute, createProduct);

router.delete("/:id", protectRoute, adminRoute, deleteProduct);


module.exports = router