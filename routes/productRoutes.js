const express = require("express") ;
const router = express.Router() ;


const {createProduct, getProduct , getProductById} = require("../controllers/productController");

router.post("/",createProduct) ;
router.get("/",getProduct) ;
router.get("/:id",getProductById);


module.exports = router ;