const express = require("express") ;
const router = express.Router() ;


const {createProduct, getProduct , getProductById, updateProduct} = require("../controllers/productController");

router.post("/",createProduct) ;
router.get("/",getProduct) ;
router.get("/:id",getProductById);
router.put("/",updateProduct) ;


module.exports = router ;